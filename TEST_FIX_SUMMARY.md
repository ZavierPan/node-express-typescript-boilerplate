# 測試問題修復總結

## 問題描述
當 unit、integration、e2e 測試分開執行時都正確，但合在一起執行時出現錯誤：
```
TypeError: Cannot read properties of undefined (reading 'id')
```

## 根本原因
1. **資料庫連接競爭條件**：多個測試文件同時在 `beforeAll` 中初始化資料庫連接，在 `afterAll` 中關閉連接
2. **並行執行衝突**：Jest 預設會並行執行測試文件，導致一個測試文件可能在另一個測試文件使用資料庫時關閉了共享的 `AppDataSource` 連接
3. **狀態污染**：測試之間的資料庫狀態沒有正確隔離

## 解決方案

### 1. 新增 Global Setup/Teardown
創建了兩個新文件來管理全局資料庫連接：

#### `src/__tests__/globalSetup.ts`
- 在所有測試開始前初始化資料庫連接一次
- 確保所有測試共享同一個連接

#### `src/__tests__/globalTeardown.ts`
- 在所有測試結束後關閉資料庫連接一次
- 避免測試文件各自關閉連接造成衝突

### 2. 修改測試輔助函數
更新 `src/__tests__/helpers/testDatabase.ts`：

```typescript
// closeTestDatabase() 現在不做任何事
// 連接會在 globalTeardown 中統一關閉
export async function closeTestDatabase(): Promise<void> {
  // Do nothing - connection will be closed in globalTeardown
  // This prevents tests from closing the shared connection
}
```

### 3. 配置 Jest 順序執行
在 `jest.config.js` 中新增：

```javascript
// Run tests serially to avoid database conflicts
maxWorkers: 1,
```

這確保測試文件按順序執行，而不是並行執行，避免資料庫競爭條件。

### 4. 啟用 Global Setup/Teardown
在 `jest.config.js` 中取消註解：

```javascript
globalSetup: '<rootDir>/src/__tests__/globalSetup.ts',
globalTeardown: '<rootDir>/src/__tests__/globalTeardown.ts',
```

## 修改的文件清單
1. ✅ `src/__tests__/globalSetup.ts` - 新建
2. ✅ `src/__tests__/globalTeardown.ts` - 新建
3. ✅ `src/__tests__/helpers/testDatabase.ts` - 修改
4. ✅ `jest.config.js` - 修改

## 測試執行方式
```bash
# 執行所有測試
npm test

# 執行特定類型測試
npm run test:unit
npm run test:integration
npm run test:e2e

# 監聽模式
npm run test:watch

# 覆蓋率報告
npm run test:coverage
```

## 技術細節

### 為什麼需要 maxWorkers: 1？
- Jest 預設會使用多個 worker 並行執行測試文件
- 當多個測試文件共享同一個資料庫連接時，並行執行會導致：
  - 資料庫狀態衝突
  - 連接被意外關閉
  - 事務隔離問題

### 為什麼需要 Global Setup/Teardown？
- 確保資料庫連接只初始化和關閉一次
- 避免每個測試文件重複初始化/關閉連接
- 提供更好的測試隔離和可預測性

### beforeEach 中的 clearDatabase() 仍然重要
- 每個測試前清理資料庫確保測試獨立性
- 避免測試之間的資料污染
- 保證測試結果的可重複性

## 預期結果
修復後，所有測試（unit + integration + e2e）應該能夠一起執行而不會出現錯誤。

## 注意事項
1. 測試執行速度可能會稍慢（因為順序執行），但更穩定可靠
2. 如果需要更快的測試執行，可以考慮使用獨立的測試資料庫實例
3. 確保 `.env.test` 配置正確的測試資料庫連接
