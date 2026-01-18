# 測試文件說明 (Testing Documentation)

## 📋 概述 (Overview)

本專案使用 **Jest** 作為測試框架，搭配 **TypeScript** 進行測試開發。測試架構涵蓋單元測試、整合測試和端對端測試，確保應用程式的品質和穩定性。

### 使用的測試工具

- **[Jest](https://jestjs.io/)** - JavaScript 測試框架
- **[ts-jest](https://kulshekhar.github.io/ts-jest/)** - Jest 的 TypeScript 預處理器
- **[supertest](https://github.com/visionmedia/supertest)** - HTTP 斷言庫，用於測試 API 端點
- **[TypeORM](https://typeorm.io/)** - 資料庫 ORM，用於測試資料庫操作

### 測試環境

- **Node 環境**: 使用 `node` 作為測試環境
- **資料庫**: 使用獨立的測試資料庫（配置於 `.env.test`）
- **TypeScript**: 完整的 TypeScript 支援，包含型別檢查
- **並行執行**: 設定為序列執行（`maxWorkers: 1`）以避免資料庫衝突

### 測試覆蓋率目標

本專案設定了最低測試覆蓋率要求：
- **分支覆蓋率 (Branches)**: 50%
- **函式覆蓋率 (Functions)**: 50%
- **程式碼行覆蓋率 (Lines)**: 50%
- **語句覆蓋率 (Statements)**: 50%

## 🧪 測試類型 (Test Types)

本專案包含三種主要的測試類型，每種測試都有其特定的目的和範圍。

### 1. 單元測試 (Unit Tests)

**目錄**: [`unit/`](./unit/)

**目的**: 測試獨立的函式、類別或模組，確保每個單元的邏輯正確性。

**特點**:
- 測試範圍小，專注於單一功能
- 執行速度快
- 不依賴外部服務（如資料庫、API）
- 使用 mock 或 stub 來隔離依賴

**範例**:
- [`unit/services/UserService.test.ts`](./unit/services/UserService.test.ts) - 測試 UserService 的業務邏輯

**適用場景**:
- 測試服務層 (Services) 的業務邏輯
- 測試工具函式 (Utilities)
- 測試資料驗證邏輯

---

### 2. 整合測試 (Integration Tests)

**目錄**: [`integration/`](./integration/)

**目的**: 測試多個模組之間的互動，確保它們能正確協同工作。

**特點**:
- 測試 API 端點的完整流程
- 包含資料庫操作
- 測試中介層 (Middleware) 的運作
- 驗證請求和回應的格式

**範例**:
- [`integration/api/auth.test.ts`](./integration/api/auth.test.ts) - 測試認證 API 端點

**適用場景**:
- 測試 RESTful API 端點
- 測試資料庫查詢和更新
- 測試認證和授權流程
- 測試錯誤處理機制

---

### 3. 端對端測試 (E2E Tests)

**目錄**: [`e2e/`](./e2e/)

**目的**: 模擬真實使用者的完整操作流程，從開始到結束測試整個應用程式。

**特點**:
- 測試完整的使用者旅程
- 涵蓋多個 API 端點的串接
- 驗證業務流程的正確性
- 最接近真實使用情境

**範例**:
- [`e2e/userFlow.test.ts`](./e2e/userFlow.test.ts) - 測試使用者從登入到存取受保護資源的完整流程

**適用場景**:
- 測試使用者註冊、登入、操作的完整流程
- 測試權限控制（一般使用者 vs 管理員）
- 測試分頁和資料過濾功能
- 測試複雜的業務流程

---

## 📁 目錄結構 (Directory Structure)

```
__tests__/
├── setup.ts                          # Jest 全域設定檔
├── helpers/                          # 測試輔助工具
│   ├── testDatabase.ts              # 資料庫測試工具函式
│   └── testApi.ts                   # API 測試工具函式
├── unit/                            # 單元測試
│   └── services/                    # 服務層測試
│       └── UserService.test.ts      # UserService 單元測試
├── integration/                     # 整合測試
│   └── api/                         # API 整合測試
│       └── auth.test.ts             # 認證 API 測試
└── e2e/                             # 端對端測試
    └── userFlow.test.ts             # 使用者流程測試
```

### 檔案說明

#### 核心設定檔

- **[`setup.ts`](./setup.ts)** - Jest 設定檔，在每個測試檔案執行前運行
  - 初始化資料庫連線
  - 設定測試環境變數
  - 配置測試超時時間
  - 清理資源（在所有測試完成後）

#### 輔助工具目錄 (`helpers/`)

- **[`testDatabase.ts`](./helpers/testDatabase.ts)** - 資料庫相關工具
  - `initTestDatabase()` - 初始化測試資料庫
  - `closeTestDatabase()` - 關閉資料庫連線
  - `clearDatabase()` - 清空所有資料表
  - `createTestUser()` - 建立測試使用者
  - `createTestAdmin()` - 建立測試管理員
  - `findUserByEmail()` - 透過 email 查詢使用者
  - `getUserCount()` - 取得使用者數量

- **[`testApi.ts`](./helpers/testApi.ts)** - API 測試相關工具
  - `getApiClient()` - 取得 supertest 實例
  - `generateTestToken()` - 產生測試用 JWT token
  - `loginAndGetToken()` - 登入並取得 token
  - `authenticatedGet/Post/Put/Delete()` - 帶認證的 HTTP 請求
  - `assertSuccessResponse()` - 驗證成功回應格式
  - `assertErrorResponse()` - 驗證錯誤回應格式

#### 測試目錄
- **`unit/`** - 單元測試，按照 `src/` 的結構組織
- **`integration/`** - 整合測試，通常按功能模組組織
- **`e2e/`** - 端對端測試，按使用者流程組織

---

## 🚀 執行測試 (Running Tests)

### 基本指令

```bash
# 執行所有測試
npm test

# 執行測試並顯示覆蓋率報告
npm run test:coverage

# 監聽模式 - 檔案變更時自動重新執行測試
npm run test:watch
```

### 執行特定類型的測試

```bash
# 只執行單元測試
npm test -- unit

# 只執行整合測試
npm test -- integration

# 只執行 E2E 測試
npm test -- e2e
```

### 執行特定測試檔案

```bash
# 執行特定測試檔案
npm test -- __tests__/unit/services/UserService.test.ts

# 使用檔案名稱模式
npm test -- UserService

# 執行特定測試套件
npm test -- --testNamePattern="UserService"
```

### 進階選項

```bash
# 只執行失敗的測試
npm test -- --onlyFailures

# 更新快照 (snapshot)
npm test -- --updateSnapshot

# 顯示詳細輸出
npm test -- --verbose

# 不使用快取
npm test -- --no-cache

# 產生 HTML 覆蓋率報告
npm run test:coverage
# 報告會產生在 coverage/ 目錄，可用瀏覽器開啟 coverage/index.html
```

### 測試覆蓋率

執行測試覆蓋率分析：

```bash
npm run test:coverage
```

覆蓋率報告會顯示：
- **Statements** - 語句覆蓋率
- **Branches** - 分支覆蓋率
- **Functions** - 函式覆蓋率
- **Lines** - 程式碼行覆蓋率

報告檔案位置：
- 終端機輸出：即時顯示摘要
- HTML 報告：`coverage/index.html`
- JSON 報告：`coverage/coverage-final.json`

---

## 🛠️ 測試工具說明 (Test Utilities)

### testDatabase.ts - 資料庫測試工具

提供資料庫相關的輔助函式，簡化測試資料的建立和管理。

#### 主要函式

**資料庫管理**

```typescript
// 初始化測試資料庫連線
await initTestDatabase();

// 關閉資料庫連線（通常在 afterAll 中使用）
await closeTestDatabase();

// 清空所有資料表（通常在 beforeEach 中使用）
await clearDatabase();
```

**測試資料建立**

```typescript
// 建立測試使用者（自動產生唯一 email）
const user = await createTestUser({
  email: 'custom@example.com',  // 可選，預設自動產生
  name: 'Test User',             // 可選
  password: 'password123',       // 可選
  role: 'user',                  // 可選，預設為 'user'
  isActive: true                 // 可選，預設為 true
});

// 建立測試管理員
const admin = await createTestAdmin({
  email: 'admin@example.com',
  name: 'Admin User'
});
```

**資料查詢**

```typescript
// 透過 email 查詢使用者
const user = await findUserByEmail('test@example.com');

// 取得使用者總數
const count = await getUserCount();
```

---

### testApi.ts - API 測試工具

提供 API 測試相關的輔助函式，簡化 HTTP 請求和回應驗證。

#### 主要函式

**API 客戶端**

```typescript
// 取得 supertest 實例
const api = getApiClient();
```

**認證相關**

```typescript
// 產生測試用 JWT token
const token = generateTestToken({
  id: '1',
  email: 'test@example.com',
  role: 'user'
});

// 登入並取得 token
const token = await loginAndGetToken('test@example.com', 'password123');
```

**帶認證的 HTTP 請求**

```typescript
// GET 請求
const response = await authenticatedGet('/api/users/profile', token);

// POST 請求
const response = await authenticatedPost('/api/users', token, {
  name: 'New User',
  email: 'new@example.com'
});

// PUT 請求
const response = await authenticatedPut('/api/users/1', token, {
  name: 'Updated Name'
});

// DELETE 請求
const response = await authenticatedDelete('/api/users/1', token);
```

**回應驗證**

```typescript
// 驗證成功回應（預設 200）
assertSuccessResponse(response);
assertSuccessResponse(response, 201); // 自訂狀態碼

// 驗證錯誤回應
assertErrorResponse(response, 400);
assertErrorResponse(response, 401);
assertErrorResponse(response, 403);
```

#### 回應格式

成功回應格式：
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## ✍️ 撰寫測試指南 (Writing Tests)

### 測試檔案命名規範

- 測試檔案應與被測試的檔案同名，並加上 `.test.ts` 後綴
- 範例：`UserService.ts` → `UserService.test.ts`
- 測試檔案應放在對應的測試類型目錄下

### 基本測試結構

```typescript
/**
 * 測試檔案描述
 */

import { /* 需要的模組 */ } from '...';
import { clearDatabase, createTestUser } from '../helpers/testDatabase';

describe('測試套件名稱', () => {
  // 每個測試前執行
  beforeEach(async () => {
    await clearDatabase();
  });

  // 測試群組
  describe('功能名稱', () => {
    it('should 做某件事情', async () => {
      // Arrange - 準備測試資料
      const testData = { /* ... */ };

      // Act - 執行被測試的功能
      const result = await someFunction(testData);

      // Assert - 驗證結果
      expect(result).toBeDefined();
      expect(result.property).toBe(expectedValue);
    });
  });
});
```

### 測試最佳實踐

#### 1. 使用描述性的測試名稱

```typescript
// ✅ 好的命名
it('should return user when valid email is provided', async () => {});
it('should throw error when email is invalid', async () => {});

// ❌ 不好的命名
it('test user', async () => {});
it('works', async () => {});
```

#### 2. 遵循 AAA 模式

```typescript
it('should create user successfully', async () => {
  // Arrange - 準備
  const userData = {
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123'
  };

  // Act - 執行
  const user = await userService.createUser(userData);

  // Assert - 驗證
  expect(user).toBeDefined();
  expect(user.email).toBe(userData.email);
});
```

#### 3. 每個測試應該獨立

```typescript
// ✅ 好的做法 - 每個測試都建立自己的資料
beforeEach(async () => {
  await clearDatabase();
});

it('should find user by email', async () => {
  const user = await createTestUser({ email: 'test@example.com' });
  const found = await userService.findByEmail('test@example.com');
  expect(found?.id).toBe(user.id);
});

// ❌ 不好的做法 - 測試之間有依賴關係
let sharedUser; // 避免使用共享狀態
```

#### 4. 測試正常情況和異常情況

```typescript
describe('createUser', () => {
  // 正常情況
  it('should create user with valid data', async () => {
    // ...
  });

  // 異常情況
  it('should throw error when email is missing', async () => {
    await expect(userService.createUser({})).rejects.toThrow();
  });

  it('should throw error when email already exists', async () => {
    await createTestUser({ email: 'existing@example.com' });
    await expect(
      userService.createUser({ email: 'existing@example.com' })
    ).rejects.toThrow();
  });
});
```

#### 5. 使用輔助函式簡化測試

```typescript
// ✅ 使用輔助函式
it('should login successfully', async () => {
  await createTestUser({
    email: 'test@example.com',
    password: 'password123'
  });

  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: 'password123' });

  assertSuccessResponse(response);
});

// ❌ 重複的驗證邏輯
it('should login successfully', async () => {
  // ...
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('success');
  expect(response.body.success).toBe(true);
  expect(response.body).toHaveProperty('data');
  // 太多重複的驗證...
});
```

### 常用的 Jest 斷言

```typescript
// 基本斷言
expect(value).toBe(expected);           // 嚴格相等 (===)
expect(value).toEqual(expected);        // 深度相等
expect(value).toBeDefined();            // 不是 undefined
expect(value).toBeNull();               // 是 null
expect(value).toBeTruthy();             // 真值
expect(value).toBeFalsy();              // 假值

// 數字
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3);         // 浮點數比較

// 字串
expect(string).toContain('substring');
expect(string).toMatch(/pattern/);

// 陣列
expect(array).toHaveLength(3);
expect(array).toContain(item);

// 物件
expect(object).toHaveProperty('key');
expect(object).toHaveProperty('key', value);

// 例外
expect(() => fn()).toThrow();
expect(() => fn()).toThrow(Error);
expect(() => fn()).toThrow('error message');
// 非同步
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

---

## ⚙️ 測試配置 (Test Configuration)

### Jest 配置檔 (jest.config.js)

專案的 Jest 配置位於根目錄的 [`jest.config.js`](../jest.config.js)。

#### 主要配置項目

```javascript
{
  preset: 'ts-jest',              // 使用 ts-jest 預設配置
  testEnvironment: 'node',        // Node.js 測試環境
  roots: ['<rootDir>/__tests__'], // 測試根目錄
  
  // 測試檔案匹配模式
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.spec.ts'
  ],
  
  // 測試超時設定（30 秒）
  testTimeout: 30000,
  
  // 序列執行測試（避免資料庫衝突）
  maxWorkers: 1,
  
  // 設定檔案
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  
  // 覆蓋率收集
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/index.ts',
    '!src/routes/**',
    '!src/migrations/**'
  ],
  
  // 覆蓋率門檻
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  }
}
```

### 環境變數配置 (.env.test)

測試環境使用獨立的環境變數檔案 `.env.test`。

```bash
# Node 環境
NODE_ENV=test

# 資料庫配置（使用測試資料庫）
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=test_db

# JWT 配置
JWT_SECRET=test-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=test-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# 日誌配置
LOG_LEVEL=error  # 測試時減少日誌輸出
```

**重要提醒**：
- 測試資料庫應與開發/生產資料庫分離
- 測試資料會被頻繁清空，不要使用重要資料
- `.env.test` 不應包含敏感資訊

### TypeScript 配置

測試使用專案的 [`tsconfig.json`](../tsconfig.json) 配置，Jest 會透過 ts-jest 自動處理 TypeScript 編譯。

主要相關設定：
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 測試設定檔 (setup.ts)

[`setup.ts`](./setup.ts) 在每個測試檔案執行前運行，負責：

1. **設定測試環境變數**
   ```typescript
   process.env.NODE_ENV = 'test';
   ```

2. **初始化資料庫連線**
   ```typescript
   beforeAll(async () => {
     if (!AppDataSource.isInitialized) {
       await AppDataSource.initialize();
     }
   });
   ```

3. **清理資源**
   ```typescript
   afterAll(async () => {
     if (AppDataSource.isInitialized) {
       await AppDataSource.destroy();
     }
     logger.close();
   });
   ```

4. **設定測試超時**
   ```typescript
   jest.setTimeout(30000); // 30 秒
   ```

---

## 🔧 常見問題 (Troubleshooting)

### 資料庫相關問題

#### 問題：測試時出現「資料庫連線失敗」

**可能原因**：
- 資料庫服務未啟動
- `.env.test` 配置錯誤
- 測試資料庫不存在

**解決方法**：
```bash
# 1. 確認資料庫服務正在運行
# PostgreSQL 範例
brew services start postgresql  # macOS
sudo service postgresql start   # Linux

# 2. 檢查 .env.test 配置
cat .env.test

# 3. 建立測試資料庫
psql -U postgres -c "CREATE DATABASE test_db;"

# 4. 執行測試
npm test
```

#### 問題：測試之間互相影響，資料沒有清空

**解決方法**：
```typescript
// 確保在 beforeEach 中清空資料庫
beforeEach(async () => {
  await clearDatabase();
});
```

#### 問題：資料庫連線未關閉，Jest 無法退出

**解決方法**：
```typescript
// 確保在 afterAll 中關閉連線
afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});
```

---

### 測試超時問題

#### 問題：測試執行超過 5 秒就超時

**解決方法**：

1. **全域設定**（已在 `jest.config.js` 設定）：
   ```javascript
   testTimeout: 30000  // 30 秒
   ```

2. **個別測試設定**：
   ```typescript
   it('should handle long operation', async () => {
     // ...
   }, 60000); // 60 秒
   ```

3. **測試檔案設定**：
   ```typescript
   jest.setTimeout(60000);
   ```

---

### TypeScript 相關問題

#### 問題：TypeScript 型別錯誤

**解決方法**：
```bash
# 檢查 TypeScript 編譯
npx tsc --noEmit

# 清除 Jest 快取
npm test -- --clearCache

# 重新安裝依賴
rm -rf node_modules package-lock.json
npm install
```

---

### 測試執行問題

#### 問題：測試無法找到模組

**可能原因**：
- 路徑別名配置不一致
- 模組未安裝

**解決方法**：
```bash
# 1. 檢查 jest.config.js 的 moduleNameMapper
# 確保與 tsconfig.json 的 paths 一致

# 2. 安裝缺少的依賴
npm install

# 3. 清除快取
npm test -- --clearCache
```

#### 問題：測試通過但覆蓋率報告顯示 0%

**解決方法**：
```bash
# 確保使用正確的指令
npm run test:coverage

# 檢查 collectCoverageFrom 配置
# 確保包含正確的檔案路徑
```

---

### API 測試問題

#### 問題：API 測試回傳 404

**可能原因**：
- 路由未正確載入
- 應用程式未正確啟動

**解決方法**：
```typescript
// 確保正確匯入 app
import app from '../../src/index';

// 使用 supertest
import request from 'supertest';

const response = await request(app)
  .get('/api/users')
  .expect(200);
```

#### 問題：認證測試失敗

**解決方法**：
```typescript
// 確保使用正確的 token 格式
const token = await loginAndGetToken('user@example.com', 'password');

const response = await request(app)
  .get('/api/users/profile')
  .set('Authorization', `Bearer ${token}`)  // 注意 Bearer 前綴
  .expect(200);
```

---

### 效能問題

#### 問題：測試執行很慢

**優化建議**：

1. **只執行需要的測試**：
   ```bash
   npm test -- unit  # 只執行單元測試
   ```

2. **使用測試監聽模式**：
   ```bash
   npm run test:watch
   ```

3. **檢查是否有不必要的資料庫操作**：
   ```typescript
   // ❌ 避免在每個測試中建立大量資料
   beforeEach(async () => {
     for (let i = 0; i < 1000; i++) {
       await createTestUser();
     }
   });

   // ✅ 只建立必要的資料
   it('should work with minimal data', async () => {
     const user = await createTestUser();
     // ...
   });
   ```

---

### 其他常見問題

#### 問題：Jest 快取導致測試結果不正確

**解決方法**：
```bash
# 清除 Jest 快取
npm test -- --clearCache

# 或在 package.json 中加入腳本
"test:clear": "jest --clearCache"
```

#### 問題：環境變數未正確載入

**解決方法**：
```typescript
// 確保在測試開始前載入環境變數
// 在 setup.ts 中
process.env.NODE_ENV = 'test';
// 或使用 dotenv
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
```

---

## 📚 範例 (Examples)

### 單元測試範例

完整的單元測試範例，測試 UserService 的業務邏輯：

```typescript
/**
 * UserService Unit Tests
 */

import { UserService } from '../../../src/services/UserService';
import {
  clearDatabase,
  createTestUser,
} from '../../helpers/testDatabase';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    await clearDatabase();
    userService = new UserService();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const userData = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'password123',
        role: 'user' as const,
      };

      // Act
      const user = await userService.createUser(userData);

      // Assert
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.password).not.toBe(userData.password); // 密碼應該被加密
    });

    it('should throw error when email already exists', async () => {
      // Arrange
      await createTestUser({ email: 'existing@example.com' });

      // Act & Assert
      await expect(
        userService.createUser({
          email: 'existing@example.com',
          name: 'Test',
          password: 'password'
        })
      ).rejects.toThrow();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      // Arrange
      const testUser = await createTestUser({
        email: 'findme@example.com',
        name: 'Find Me',
      });

      // Act
      const foundUser = await userService.findByEmail('findme@example.com');

      // Assert
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(testUser.id);
      expect(foundUser?.email).toBe(testUser.email);
    });

    it('should return null for non-existent email', async () => {
      // Act
      const foundUser = await userService.findByEmail('nonexistent@example.com');

      // Assert
      expect(foundUser).toBeNull();
    });
  });
});
```

---

### 整合測試範例

完整的 API 整合測試範例：

```typescript
/**
 * Authentication API Integration Tests
 */

import request from 'supertest';
import app from '../../../src/index';
import {
  clearDatabase,
  createTestUser,
} from '../../helpers/testDatabase';
import {
  assertSuccessResponse,
  assertErrorResponse,
} from '../../helpers/testApi';

describe('Authentication API', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      await createTestUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      // Assert
      assertSuccessResponse(response);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should return 401 for invalid credentials', async () => {
      // Arrange
      await createTestUser({
        email: 'test@example.com',
        password: 'correctpassword',
      });

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      // Assert
      assertErrorResponse(response, 401);
      expect(response.body.error.message).toContain('Invalid');
    });

    it('should return 400 for missing fields', async () => {
      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          // password 缺少
        })
        .expect(400);

      // Assert
      assertErrorResponse(response, 400);
    });
  });
});
```

---

### E2E 測試範例

完整的端對端測試範例，測試使用者完整流程：

```typescript
/**
 * User Flow E2E Tests
 */

import request from 'supertest';
import app from '../../src/index';
import {
  clearDatabase,
  createTestUser,
  createTestAdmin,
} from '../helpers/testDatabase';
import { assertSuccessResponse, assertErrorResponse } from '../helpers/testApi';

describe('User Flow E2E Tests', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('Complete User Authentication Flow', () => {
    it('should complete full user journey: login -> get profile -> get dashboard', async () => {
      // Step 1: 建立測試使用者
      await createTestUser({
        email: 'journey@example.com',
        password: 'password123',
        name: 'Journey User',
      });

      // Step 2: 登入
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'journey@example.com',
          password: 'password123',
        })
        .expect(200);

      assertSuccessResponse(loginResponse);
      const token = loginResponse.body.data.token;
      expect(token).toBeDefined();

      // Step 3: 取得使用者資料
      const profileResponse = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      assertSuccessResponse(profileResponse);
      expect(profileResponse.body.data.email).toBe('journey@example.com');

      // Step 4: 取得儀表板資料
      const dashboardResponse = await request(app)
        .get('/api/users/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      assertSuccessResponse(dashboardResponse);
      expect(dashboardResponse.body.data).toHaveProperty('user');
      expect(dashboardResponse.body.data).toHaveProperty('stats');
    });

    it('should reject access without authentication', async () => {
      // 嘗試在未登入的情況下存取受保護的資源
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      assertErrorResponse(response, 401);
    });
  });

  describe('Admin Access Control Flow', () => {
    it('should allow admin to access admin-only endpoints', async () => {
      // Step 1: 建立管理員
      await createTestAdmin({
        email: 'admin@example.com',
        password: 'admin123',
      });

      // Step 2: 管理員登入
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'admin123',
        })
        .expect(200);

      const adminToken = loginResponse.body.data.token;

      // Step 3: 存取管理員專用端點
      const usersResponse = await request(app)
        .get('/api/users/')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      assertSuccessResponse(usersResponse);
      expect(Array.isArray(usersResponse.body.data.items)).toBe(true);
    });

    it('should deny regular user access to admin endpoints', async () => {
      // Step 1: 建立一般使用者
      await createTestUser({
        email: 'user@example.com',
        password: 'password123',
      });

      // Step 2: 一般使用者登入
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'password123',
        })
        .expect(200);

      const userToken = loginResponse.body.data.token;

      // Step 3: 嘗試存取管理員專用端點
      const usersResponse = await request(app)
        .get('/api/users/')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      assertErrorResponse(usersResponse, 403);
    });
  });
});
```

---

## 🎯 總結

本測試架構提供了完整的測試解決方案：

- ✅ **三種測試類型**：單元測試、整合測試、E2E 測試
- ✅ **豐富的輔助工具**：簡化測試資料建立和 API 測試
- ✅ **清晰的文件**：詳細的說明和範例
- ✅ **最佳實踐**：遵循業界標準的測試模式
- ✅ **完整的配置**：開箱即用的測試環境

### 快速開始

```bash
# 安裝依賴
npm install

# 執行所有測試
npm test

# 查看測試覆蓋率
npm run test:coverage

# 監聽模式開發
npm run test:watch
```

### 相關資源

- [Jest 官方文件](https://jestjs.io/)
- [TypeScript Jest 文件](https://kulshekhar.github.io/ts-jest/)
- [Supertest 文件](https://github.com/visionmedia/supertest)
- [專案主要 README](../README.md)

---

**祝測試愉快！** 🚀

如有任何問題或建議，歡迎提出 Issue 或 Pull Request。


