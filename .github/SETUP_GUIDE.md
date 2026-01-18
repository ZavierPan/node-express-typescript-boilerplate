# GitHub Actions CI/CD Quick Setup Guide

This guide will help you quickly set up the GitHub Actions CI/CD pipeline.

## 📋 Prerequisites

- GitHub account
- Docker Hub account (required for CD pipeline only)
- Codecov account (optional, for test coverage reports)

## 🚀 Quick Start

### Step 1: Fork or Clone the Project

```bash
git clone <your-repo-url>
cd node-express-typescript-boilerplate
```

### Step 2: Configure GitHub Secrets

Navigate to your GitHub repository:
**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

#### CI Pipeline Secrets (Optional)

| Secret Name | Description | How to Obtain |
|------------|-------------|---------------|
| `CODECOV_TOKEN` | Codecov upload token | 1. Go to [codecov.io](https://codecov.io/)<br>2. Sign in with GitHub<br>3. Enable your repository<br>4. Copy the token |

#### CD Pipeline Secrets (Required)

| Secret Name | Description | How to Obtain |
|------------|-------------|---------------|
| `DOCKER_USERNAME` | Docker Hub username | Your Docker Hub account username |
| `DOCKER_PASSWORD` | Docker Hub access token | 1. Log in to [Docker Hub](https://hub.docker.com/)<br>2. Account Settings → Security<br>3. New Access Token<br>4. Permissions: Read, Write, Delete<br>5. Copy the generated token |

### Step 3: Update README.md Badges

Update the badge URLs in README.md with your repository information:

```markdown
# Replace YOUR_USERNAME and YOUR_REPO with actual values
[![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml)
[![CD](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/cd.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/cd.yml)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO)
```

Example:
```markdown
[![CI](https://github.com/johndoe/my-api/actions/workflows/ci.yml/badge.svg)](https://github.com/johndoe/my-api/actions/workflows/ci.yml)
```

### Step 4: Update CD Workflow (Optional)

If your Docker Hub repository name is different, update [`.github/workflows/cd.yml`](.github/workflows/cd.yml):

```yaml
# Find this line and update
images: ${{ secrets.DOCKER_USERNAME }}/node-express-typescript-boilerplate
# Change to your repository name
images: ${{ secrets.DOCKER_USERNAME }}/your-repo-name
```

### Step 5: Test CI Pipeline

Push code to GitHub to trigger the CI pipeline:

```bash
git add .
git commit -m "feat: setup CI/CD pipeline"
git push origin main
```

Go to the **Actions** page in your GitHub repository to view the execution status.

### Step 6: Test CD Pipeline (Optional)

Create and push a version tag to trigger the CD pipeline:

```bash
# Create version tag
git tag v1.0.0

# Push tag
git push origin v1.0.0
```

This will:
1. Build Docker image
2. Push to Docker Hub
3. Create GitHub Release

## ✅ Verify Setup

### Check CI Pipeline

1. Go to the **Actions** page
2. View the "CI/CD Pipeline" workflow
3. Verify all jobs executed successfully:
   - ✅ Code Quality
   - ✅ Tests
   - ✅ Build
   - ✅ Docker Build Test
   - ✅ Security Audit

### Check CD Pipeline

1. Go to the **Actions** page
2. View the "CD - Deploy to Docker Hub" workflow
3. Verify Docker image was pushed to Docker Hub
4. Go to the **Releases** page to confirm Release was created

### Check Test Coverage (if Codecov is configured)

1. Go to [codecov.io](https://codecov.io/)
2. View your repository
3. Verify coverage report was uploaded

## 🔧 Custom Configuration

### Modify Trigger Conditions

Edit [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

```yaml
on:
  push:
    branches: [main, develop, staging]  # Add more branches
  pull_request:
    branches: [main, develop]
```

### Modify Node.js Versions

Edit the strategy matrix in workflow files:

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 21.x]  # Add more versions
```

### Disable Specific Jobs

Comment out jobs you don't need in the workflow file:

```yaml
# jobs:
#   security:
#     name: Security Audit
#     runs-on: ubuntu-latest
#     steps:
#       ...
```

### Configure Branch Protection Rules

Go to **Settings** → **Branches** → **Add rule**:

1. Branch name pattern: `main`
2. ✅ Require a pull request before merging
3. ✅ Require status checks to pass before merging
4. Select required status checks:
   - Code Quality
   - Tests
   - Build
   - Docker Build Test

## 🐛 Troubleshooting

### CI Pipeline Failures

**Issue**: Tests fail
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution**: Ensure MySQL service is properly configured with sufficient wait time.

---

**Issue**: ESLint errors
```
Error: 'variable' is assigned a value but never used
```

**Solution**: Fix the code or run `npm run lint:fix` locally.

### CD Pipeline Failures

**Issue**: Docker Hub login fails
```
Error: Error response from daemon: Get https://registry-1.docker.io/v2/: unauthorized
```

**Solution**: 
1. Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets are correctly set
2. Ensure Docker Hub token has proper permissions

---

**Issue**: Image push fails
```
Error: denied: requested access to the resource is denied
```

**Solution**: 
1. Verify Docker Hub repository exists
2. Verify repository name is correct

### Codecov Upload Failures

**Issue**: Coverage upload fails
```
Error: Codecov token not found
```

**Solution**: 
1. Set `CODECOV_TOKEN` secret
2. Or set `fail_ci_if_error: false` in workflow (already default)

## 📚 Advanced Configuration

### Add Slack Notifications

Add Slack notification step to workflow:

```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'CI Pipeline completed'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

### Add Performance Tests

Create a new job:

```yaml
performance:
  name: Performance Tests
  runs-on: ubuntu-latest
  needs: build
  steps:
    - name: Run performance tests
      run: npm run test:performance
```

### Auto-deploy to Cloud Platforms

Refer to platform-specific GitHub Actions integration documentation:
- [AWS](https://github.com/aws-actions)
- [Google Cloud](https://github.com/google-github-actions)
- [Azure](https://github.com/Azure/actions)
- [Heroku](https://github.com/marketplace/actions/deploy-to-heroku)

## 🎯 Best Practices

1. **Protect Sensitive Information**: Always use GitHub Secrets, never hardcode in code
2. **Regular Dependency Updates**: Use Dependabot for automatic updates
3. **Monitor Workflow Execution Time**: Optimize slow steps
4. **Use Caching**: npm cache is already configured in workflows
5. **Set Up Notifications**: Enable Actions notifications in GitHub settings

## 📖 Related Documentation

- [Complete GitHub Actions Documentation](../docs/GITHUB_ACTIONS.md)
- [GitHub Actions Official Documentation](https://docs.github.com/en/actions)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Codecov Documentation](https://docs.codecov.com/)

## 💡 Need Help?

If you encounter issues:
1. Check the [GitHub Actions Documentation](../docs/GITHUB_ACTIONS.md)
2. Review detailed logs in the Actions page
3. Create an Issue in the repository
