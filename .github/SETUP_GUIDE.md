# GitHub Actions CI/CD 快速設定指南

本指南將協助你快速設定 GitHub Actions CI/CD pipeline。

## 📋 前置需求

- GitHub 帳號
- Docker Hub 帳號（僅 CD pipeline 需要）
- Codecov 帳號（可選，用於測試覆蓋率報告）

## 🚀 快速開始

### 步驟 1: Fork 或 Clone 專案

```bash
git clone <your-repo-url>
cd node-express-typescript-boilerplate
```

### 步驟 2: 設定 GitHub Secrets

前往你的 GitHub repository：
**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

#### CI Pipeline 所需 Secrets（可選）

| Secret 名稱 | 說明 | 如何取得 |
|------------|------|---------|
| `CODECOV_TOKEN` | Codecov 上傳 token | 1. 前往 [codecov.io](https://codecov.io/)<br>2. 使用 GitHub 登入<br>3. 啟用你的 repository<br>4. 複製 token |

#### CD Pipeline 所需 Secrets（必要）

| Secret 名稱 | 說明 | 如何取得 |
|------------|------|---------|
| `DOCKER_USERNAME` | Docker Hub 使用者名稱 | 你的 Docker Hub 帳號名稱 |
| `DOCKER_PASSWORD` | Docker Hub 存取 token | 1. 登入 [Docker Hub](https://hub.docker.com/)<br>2. Account Settings → Security<br>3. New Access Token<br>4. 權限選擇: Read, Write, Delete<br>5. 複製產生的 token |

### 步驟 3: 更新 README.md 徽章

將 README.md 中的徽章 URL 更新為你的 repository：

```markdown
# 將 YOUR_USERNAME 和 YOUR_REPO 替換為實際值
[![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml)
[![CD](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/cd.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/cd.yml)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO)
```

例如：
```markdown
[![CI](https://github.com/johndoe/my-api/actions/workflows/ci.yml/badge.svg)](https://github.com/johndoe/my-api/actions/workflows/ci.yml)
```

### 步驟 4: 更新 CD Workflow（可選）

如果你的 Docker Hub repository 名稱不同，需要更新 [`.github/workflows/cd.yml`](.github/workflows/cd.yml)：

```yaml
# 找到這一行並更新
images: ${{ secrets.DOCKER_USERNAME }}/node-express-typescript-boilerplate
# 改為你的 repository 名稱
images: ${{ secrets.DOCKER_USERNAME }}/your-repo-name
```

### 步驟 5: 測試 CI Pipeline

推送程式碼到 GitHub 觸發 CI pipeline：

```bash
git add .
git commit -m "feat: setup CI/CD pipeline"
git push origin main
```

前往 GitHub repository 的 **Actions** 頁面查看執行狀態。

### 步驟 6: 測試 CD Pipeline（可選）

建立並推送版本標籤來觸發 CD pipeline：

```bash
# 建立版本標籤
git tag v1.0.0

# 推送標籤
git push origin v1.0.0
```

這將會：
1. 建置 Docker 映像
2. 推送到 Docker Hub
3. 建立 GitHub Release

## ✅ 驗證設定

### 檢查 CI Pipeline

1. 前往 **Actions** 頁面
2. 查看 "CI/CD Pipeline" workflow
3. 確認所有 jobs 都成功執行：
   - ✅ Code Quality
   - ✅ Tests
   - ✅ Build
   - ✅ Docker Build Test
   - ✅ Security Audit

### 檢查 CD Pipeline

1. 前往 **Actions** 頁面
2. 查看 "CD - Deploy to Docker Hub" workflow
3. 確認 Docker 映像已推送到 Docker Hub
4. 前往 **Releases** 頁面確認 Release 已建立

### 檢查測試覆蓋率（如果設定了 Codecov）

1. 前往 [codecov.io](https://codecov.io/)
2. 查看你的 repository
3. 確認覆蓋率報告已上傳

## 🔧 自訂設定

### 修改觸發條件

編輯 [`.github/workflows/ci.yml`](.github/workflows/ci.yml)：

```yaml
on:
  push:
    branches: [main, develop, staging]  # 加入更多分支
  pull_request:
    branches: [main, develop]
```

### 修改 Node.js 版本

編輯 workflow 檔案中的 matrix：

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 21.x]  # 加入更多版本
```

### 停用特定 Job

在 workflow 檔案中註解掉不需要的 job：

```yaml
# jobs:
#   security:
#     name: Security Audit
#     runs-on: ubuntu-latest
#     steps:
#       ...
```

### 設定分支保護規則

前往 **Settings** → **Branches** → **Add rule**：

1. Branch name pattern: `main`
2. ✅ Require a pull request before merging
3. ✅ Require status checks to pass before merging
4. 選擇必要的狀態檢查：
   - Code Quality
   - Tests
   - Build
   - Docker Build Test

## 🐛 常見問題排除

### CI Pipeline 失敗

**問題**: 測試失敗
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**解決方案**: 確認 MySQL service 已正確設定，等待時間足夠。

---

**問題**: ESLint 錯誤
```
Error: 'variable' is assigned a value but never used
```

**解決方案**: 修正程式碼或在本地執行 `npm run lint:fix`。

### CD Pipeline 失敗

**問題**: Docker Hub 登入失敗
```
Error: Error response from daemon: Get https://registry-1.docker.io/v2/: unauthorized
```

**解決方案**: 
1. 確認 `DOCKER_USERNAME` 和 `DOCKER_PASSWORD` secrets 已正確設定
2. 確認 Docker Hub token 有正確的權限

---

**問題**: 映像推送失敗
```
Error: denied: requested access to the resource is denied
```

**解決方案**: 
1. 確認 Docker Hub repository 已建立
2. 確認 repository 名稱正確

### Codecov 上傳失敗

**問題**: 覆蓋率上傳失敗
```
Error: Codecov token not found
```

**解決方案**: 
1. 設定 `CODECOV_TOKEN` secret
2. 或在 workflow 中設定 `fail_ci_if_error: false`（已預設）

## 📚 進階設定

### 加入 Slack 通知

在 workflow 中加入 Slack 通知步驟：

```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'CI Pipeline completed'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

### 加入效能測試

建立新的 job：

```yaml
performance:
  name: Performance Tests
  runs-on: ubuntu-latest
  needs: build
  steps:
    - name: Run performance tests
      run: npm run test:performance
```

### 自動部署到雲端平台

參考各平台的 GitHub Actions 整合文件：
- [AWS](https://github.com/aws-actions)
- [Google Cloud](https://github.com/google-github-actions)
- [Azure](https://github.com/Azure/actions)
- [Heroku](https://github.com/marketplace/actions/deploy-to-heroku)

## 🎯 最佳實踐

1. **保護敏感資訊**: 永遠使用 GitHub Secrets，不要在程式碼中硬編碼
2. **定期更新依賴**: 使用 Dependabot 自動更新
3. **監控 workflow 執行時間**: 優化慢速步驟
4. **使用快取**: 已在 workflow 中設定 npm 快取
5. **設定通知**: 在 GitHub 設定中啟用 Actions 通知

## 📖 相關文件

- [完整 GitHub Actions 文件](../docs/GITHUB_ACTIONS.md)
- [GitHub Actions 官方文件](https://docs.github.com/en/actions)
- [Docker Hub 文件](https://docs.docker.com/docker-hub/)
- [Codecov 文件](https://docs.codecov.com/)

## 💡 需要協助？

如果遇到問題：
1. 查看 [GitHub Actions 文件](../docs/GITHUB_ACTIONS.md)
2. 檢查 Actions 頁面的詳細日誌
3. 在 repository 建立 Issue
