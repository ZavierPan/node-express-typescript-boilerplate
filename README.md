# Node.js Express TypeScript Boilerplate

[![CI](https://github.com/ZavierPan/node-express-typescript-boilerplate/actions/workflows/ci.yml/badge.svg)](https://github.com/ZavierPan/node-express-typescript-boilerplate/actions/workflows/ci.yml)
[![CD](https://github.com/ZavierPan/node-express-typescript-boilerplate/actions/workflows/cd.yml/badge.svg)](https://github.com/ZavierPan/node-express-typescript-boilerplate/actions/workflows/cd.yml)
[![codecov](https://codecov.io/gh/ZavierPan/node-express-typescript-boilerplate/branch/main/graph/badge.svg)](https://codecov.io/gh/ZavierPan/node-express-typescript-boilerplate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

A modern Node.js Express TypeScript backend API template project with complete authentication system, auto-generated API documentation, unified response format, and modular architecture.

## 🚀 Features

- **TypeScript** - Complete type safety support
- **Express.js** - Fast, minimalist web framework
- **TSOA** - Auto-generated Swagger documentation and type-safe routes
- **JWT Authentication** - Complete authentication system with role-based access control
- **Database Integration** - TypeORM with MySQL support and automatic migrations
- **Unified API Response** - Consistent response format across all endpoints
- **Logging System** - Comprehensive Winston-based logging with structured logs and file rotation
- **Testing Framework** - Complete Jest + Supertest setup with unit, integration, and E2E tests
- **CI/CD Pipeline** - GitHub Actions for automated testing, building, and deployment
- **Security** - Helmet and CORS protection
- **ESLint + Prettier** - Code quality and formatting
- **Modular Architecture** - Well-organized project structure with response types
- **Development Tools** - Hot reload with nodemon
- **Docker Support** - Complete containerization with multi-stage builds and health checks

## 📋 System Requirements

- Node.js >= 18.0.0
- npm or yarn
- MySQL 5.7+ or 8.0+ (for database)
- Docker & Docker Compose (for containerized deployment)

## 🛠️ Quick Start

Choose one of the following methods to get started:

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd node-express-typescript-boilerplate

# Start with Docker (includes database)
npm run docker:compose:up:dev

# The application will be available at http://localhost:3000
# API documentation: http://localhost:3000/api-docs
```

### Option 2: Local Development

#### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

#### 2. Setup Database

Make sure you have MySQL running and create a database:

```sql
CREATE DATABASE node_express_boilerplate;
```

#### 3. Configure Environment

The application will use the database configuration from `.env.dev` by default:

```bash
# Database Configuration (Development - MySQL)
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=node_express_boilerplate
DB_SYNCHRONIZE=false
DB_LOGGING=true
```

Update these values according to your MySQL setup.

#### 4. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000` and automatically:
- Connect to the database
- Run pending migrations to create/update tables

#### 5. Seed Database (Optional)

Create demo users for testing:

```bash
npm run db:seed
```

This creates:
- Admin user: `admin@example.com` / `admin123`
- Demo user: `user@example.com` / `password123`

#### 6. Test the API

- Main endpoint: `http://localhost:3000`
- Health check: `http://localhost:3000/api/health`
- **API Documentation**: `http://localhost:3000/api-docs` (development only)
- **Authentication**: `http://localhost:3000/api/auth/login`
- **User Management**: `http://localhost:3000/api/users/profile` (requires authentication)

## 🐳 Docker Deployment

### Quick Start with Docker

#### Development Environment

```bash
# Start development environment with hot reload
npm run docker:compose:up:dev

# Stop development environment
npm run docker:compose:down:dev
```

#### Production Environment

```bash
# Start production environment
npm run docker:compose:up

# Stop production environment
npm run docker:compose:down
```

### Docker Commands

| Command | Description |
|---------|-------------|
| `npm run docker:compose:up:dev` | Start development environment with hot reload |
| `npm run docker:compose:down:dev` | Stop development environment |
| `npm run docker:compose:up` | Start production environment |
| `npm run docker:compose:down` | Stop production environment |

### When to Rebuild Docker Images

You need to rebuild Docker images when:
- **Dependencies change** (package.json modifications)
- **Build configuration changes** (tsconfig.json, tsoa.json modifications)
- **Dockerfile changes**

```bash
# Force rebuild and start (development)
docker-compose -f docker-compose.dev.yml up --build

# Force rebuild and start (production)
docker-compose -f docker-compose.yml up --build

# Or rebuild specific service
docker-compose -f docker-compose.dev.yml build app
```

### Docker Features

- **Multi-stage builds** for optimized production images
- **Health checks** for both application and database
- **Volume persistence** for database data and uploads
- **Security hardening** with non-root users and read-only containers
- **Automatic migrations** run before application start
- **Hot reload** in development environment

### Environment Files for Docker

- **Development**: Uses `.env.dev` automatically
- **Production**: Requires `.env.production` file (create manually)

## 📁 Project Structure

```
├── src/
│   ├── config/          # Configuration files
│   │   ├── index.ts     # Environment configuration and dotenv loading
│   │   └── database.ts  # TypeORM database configuration
│   ├── controllers/     # TSOA API controllers
│   │   ├── AuthController.ts    # Authentication endpoints
│   │   ├── HealthController.ts  # Health check endpoints
│   │   ├── UserController.ts    # User management endpoints
│   │   └── response/    # Response type definitions
│   │       ├── auth.res.ts      # Authentication response types
│   │       ├── common.res.ts    # Common response types and builder
│   │       ├── user.res.ts      # User response types
│   │       └── index.ts         # Unified export
│   ├── entities/        # TypeORM database entities
│   │   └── User.ts      # User entity model
│   ├── middleware/      # Express middleware
│   │   ├── authentication.ts   # JWT authentication middleware
│   │   └── errorHandler.ts     # Global error handling
│   ├── routes/          # Auto-generated TSOA routes
│   │   └── routes.ts    # Generated Express routes
│   ├── scripts/         # Database and utility scripts
│   │   └── seed-database.ts    # Database seeding script
│   ├── services/        # Business logic services
│   │   └── UserService.ts      # User database operations
│   ├── swagger/         # Auto-generated Swagger documentation
│   │   └── swagger.json # OpenAPI 3.0 specification
│   ├── utils/           # Utility functions (future)
│   └── index.ts         # Application entry point
├── scripts/             # Utility scripts
│   ├── init-db.sql      # Database initialization script
│   └── test-env.js      # Environment variable testing script
├── .env.dev             # Development environment variables
├── .env.production      # Production environment variables (create manually)
├── .dockerignore        # Docker ignore rules
├── .eslintrc.js         # ESLint configuration
├── .prettierrc.js       # Prettier configuration
├── .gitignore           # Git ignore rules
├── docker-compose.yml   # Production Docker Compose configuration
├── docker-compose.dev.yml # Development Docker Compose configuration
├── Dockerfile           # Production Docker image (multi-stage build)
├── Dockerfile.dev       # Development Docker image
├── tsconfig.json        # TypeScript configuration
├── tsoa.json           # TSOA configuration
├── package.json         # Project dependencies and scripts
└── README.md           # Project documentation
```

### Environment Files (not all tracked in git)

```
├── .env.dev             # Development config (tracked)
├── .env.production      # Production config (create manually, not tracked)
└── .env.local          # Local overrides (not tracked, highest priority)
```

## 🔧 Available Scripts

### Development
- `npm run dev` - Start development server with hot reload (includes Swagger generation)
- `npm run build` - Build production version (includes Swagger generation)
- `npm run start` - Start production server
- `npm run swagger` - Generate TSOA routes and Swagger documentation
- `npm run clean` - Clean dist directory

### Code Quality
- `npm run lint` - Run ESLint code quality check
- `npm run lint:fix` - Run ESLint and fix issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting with Prettier
- `npm run typecheck` - Run TypeScript type checking

### Testing
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run test:e2e` - Run E2E tests only

### Database
- `npm run db:migration:generate` - Auto-generate migration from entity changes (compares entities with database)
- `npm run db:migration:create` - Create empty migration file
- `npm run db:migration:run` - Run pending migrations (development)
- `npm run db:migration:run:prod` - Run pending migrations (production)
- `npm run db:migration:revert` - Revert last migration (development)
- `npm run db:seed` - Seed database with demo users (development)
- `npm run db:seed:prod` - Seed database with demo users (production)

## 📚 API Endpoints

### Health Check
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/` | Main endpoint with server info | None |
| GET | `/api/health` | TSOA health check with detailed info | None |
| GET | `/api/health/ping` | Simple ping endpoint | None |

### Authentication
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/auth/login` | User login with email/password | None |
| POST | `/api/auth/demo-credentials` | Get demo credentials for testing | None |

### User Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/users/profile` | Get current user profile | JWT Required |
| GET | `/api/users/dashboard` | Get user dashboard with stats | JWT Required |
| GET | `/api/users/` | Get all users (admin only) | JWT Required (Admin) |

### API Documentation
| Method | Endpoint | Description | Available |
|--------|----------|-------------|-----------|
| GET | `/api-docs` | Swagger UI documentation | Development only |

## 🔐 Authentication System

### Demo Credentials

For testing purposes, use these demo credentials:

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`
- Role: `admin`

**Regular User:**
- Email: `user@example.com`
- Password: `password123`
- Role: `user`

### JWT Token Usage

1. **Login** to get JWT token:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

2. **Use token** in subsequent requests:
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Response Format

All API responses follow a unified format:

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "timestamp": "2023-12-01T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { /* optional error details */ }
  },
  "timestamp": "2023-12-01T10:30:00.000Z"
}
```

## ⚙️ Configuration

### Environment Variables

The application uses environment variables for configuration. Environment variables are loaded based on `NODE_ENV`:

- **Development**: `.env.dev` (automatically loaded when `NODE_ENV=development`)
- **Production**: `.env.production` (automatically loaded when `NODE_ENV=production`)
- **Local overrides**: `.env.local` (highest priority, not tracked in git)

### Environment Setup

1. **Development Environment** (default):
   ```bash
   npm run dev  # Automatically sets NODE_ENV=development
   ```

2. **Production Environment**:
   ```bash
   npm run build
   npm start    # Automatically sets NODE_ENV=production
   ```

3. **Custom Environment**:
   ```bash
   NODE_ENV=development npm run dev
   ```

### Available Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `PORT` | Server port | `3000` | `3000` |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-jwt-key` | `your-production-secret-key` |
| `JWT_EXPIRES_IN` | JWT token expiration | `24h` | `1h` (dev), `24h` (prod) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` | `24h` (dev), `7d` (prod) |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | `http://localhost:3000` | `http://localhost:3000,http://localhost:3001` |
| `CORS_CREDENTIALS` | Allow credentials in CORS | `true` | `true` |
| `API_PREFIX` | API route prefix | `/api` | `/api` |
| `SWAGGER_ENABLED` | Enable Swagger documentation | `false` (prod), `true` (dev) | `true` |
| `DB_TYPE` | Database type | `mysql` | `mysql` |
| `DB_HOST` | Database host | `localhost` | `localhost` |
| `DB_PORT` | Database port | `3306` | `3306` |
| `DB_USERNAME` | Database username | `root` | `root` |
| `DB_PASSWORD` | Database password | `password` | `your-db-password` |
| `DB_DATABASE` | Database name | `node_express_boilerplate` | `your-database-name` |
| `DB_SYNCHRONIZE` | Auto-sync database schema | `false` (all environments) | `false` |
| `DB_LOGGING` | Enable database query logging | `false` (prod), `true` (dev) | `true` |

### Environment Files

- **`.env.dev`** - Development configuration (tracked in git)
- **`.env.production`** - Production configuration (create manually, not tracked)
- **`.env.local`** - Local overrides (not tracked in git, highest priority)

**Note**: `NODE_ENV` should be set by your deployment environment or npm scripts, not in `.env` files.

## 🧪 Development

### Code Quality

This project uses ESLint and Prettier for code quality and formatting:

```bash
# Check code quality
npm run lint

# Auto-fix linting issues (only fixes formatting and simple issues)
npm run lint:fix

# Format code
npm run format

# Check formatting without modifying files
npm run format:check

# Type checking
npm run typecheck
```

**Note**: `npm run lint:fix` can only auto-fix formatting-related issues. It cannot fix:
- Unused variables (must be manually removed)
- `any` type usage (must be replaced with proper types like `unknown` or specific interfaces)
- Logic errors (must be manually corrected)

### TypeScript Best Practices

This project follows strict TypeScript practices:

- ❌ **Never use `any`** - Use `unknown`, specific types, or generics instead
- ✅ **Use `unknown`** for uncertain types that need runtime checking
- ✅ **Define interfaces** for all data structures
- ✅ **Use type guards** when working with `unknown` types
- ✅ **Enable strict mode** in tsconfig.json

### File Structure Guidelines

- **src/config/** - Configuration and environment variables
- **src/controllers/** - API route handlers with TSOA decorators
- **src/controllers/response/** - Response type definitions organized by feature
- **src/entities/** - TypeORM database entities
- **src/middleware/** - Express middleware functions (authentication, error handling)
- **src/migrations/** - Database migration files
- **src/routes/** - Auto-generated TSOA routes
- **src/scripts/** - Database and utility scripts
- **src/services/** - Business logic and database operations
- **src/swagger/** - Auto-generated Swagger documentation
- **src/utils/** - Utility functions and helpers (future)

## 🗄️ Database Migration Workflow

### Auto-Generate Migration

TypeORM can automatically compare your entities with the database structure and generate the required migration files:

```bash
# Auto-generate migration with specified name (recommended)
npm run db:migration:generate src/migrations/AddUserPhoneField

# This will automatically:
# 1. Scan all entities in the src/entities/ folder
# 2. Compare with current database structure
# 3. Generate migration file with the differences
# 4. File will be named src/migrations/AddUserPhoneField-{timestamp}.ts
```

### Migration Workflow

1. **Modify Entity**:
   ```typescript
   // For example, add a field in src/entities/User.ts
   @Column({ nullable: true })
   phone?: string;
   ```

2. **Generate Migration**:
   ```bash
   npm run db:migration:generate src/migrations/AddPhoneField
   ```

3. **Review Generated Migration**:
   ```typescript
   // Check src/migrations/AutoGenerated-{timestamp}.ts
   // Verify SQL statements are correct
   ```

4. **Run Migration**:
   ```bash
   npm run db:migration:run
   ```

### Manual Migration Creation

If you need to manually create an empty migration file:

```bash
# Create empty migration file
npm run db:migration:create src/migrations/AddCustomLogic
```

### Migration Management

```bash
# Run all pending migrations
npm run db:migration:run

# Revert the last migration
npm run db:migration:revert

# Run migrations in production environment
npm run db:migration:run:prod
```

### Important Notes

- **DB_SYNCHRONIZE set to false**: All environments use migrations instead of auto-sync
- **Test before deployment**: Test migrations in development environment before deploying to production
- **Backup database**: Always backup database before running migrations in production
- **Review SQL**: Check generated SQL statements before execution

## 📊 Logging System

This project includes a comprehensive logging system built with Winston, providing structured logging, file rotation, and different log levels for development and production environments.

### Logging Features

- **Winston-based logging** with structured JSON format
- **Multiple log levels**: error, warn, info, http, debug
- **File rotation** with daily rotation and automatic compression
- **Console logging** in development with colorized output
- **HTTP request/response logging** middleware
- **Security event logging** for authentication and authorization
- **Database operation logging**
- **Performance metrics logging**

### Log Configuration

Logging is configured through environment variables:

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `LOG_LEVEL` | Minimum log level | `info` | `debug`, `info`, `warn`, `error` |
| `LOG_ENABLE_FILE` | Enable file logging | `false` | `true` |
| `LOG_MAX_FILE_SIZE` | Maximum file size before rotation | `20m` | `10m`, `50m` |
| `LOG_MAX_FILES` | Number of files to keep | `14d` | `7d`, `30d` |
| `LOG_ENABLE_HTTP` | Enable HTTP request logging | `false` | `true` |

### Log Files Structure

```
logs/
├── combined-YYYY-MM-DD.log     # All log levels
├── error-YYYY-MM-DD.log        # Error logs only
├── access-YYYY-MM-DD.log       # HTTP access logs
├── exceptions-YYYY-MM-DD.log   # Uncaught exceptions
└── rejections-YYYY-MM-DD.log   # Unhandled promise rejections
```

### Using the Logger

#### Basic Logging

```typescript
import Logger from '../utils/logger';

// Basic log levels
Logger.error('Something went wrong', { error, userId: '123' });
Logger.warn('Warning message', { context: 'additional data' });
Logger.info('Information message');
Logger.debug('Debug information', { details: 'debug data' });
```

#### Specialized Logging Methods

```typescript
// Database operations
Logger.database('SELECT', 'users', { userId: '123', query: 'SELECT * FROM users' });

// Authentication events
Logger.auth('login_success', '123', { ip: '192.168.1.1' });
Logger.auth('login_failed', undefined, { email: 'user@example.com', ip: '192.168.1.1' });

// API requests (automatically logged by middleware)
Logger.api('GET', '/api/users', 200, 150, '123', { ip: '192.168.1.1' });

// Security events
Logger.security('unauthorized_access', {
  userId: '123',
  resource: '/admin/users',
  ip: '192.168.1.1'
});

// Performance metrics
Logger.performance('database_query', 250, 'ms', {
  query: 'SELECT * FROM users',
  table: 'users'
});

// Application lifecycle
Logger.startup('Server started on port 3000');
Logger.shutdown('Graceful shutdown initiated');
```

### HTTP Request Logging

The application automatically logs all HTTP requests and responses when `LOG_ENABLE_HTTP=true`:

```json
{
  "level": "http",
  "message": "API Request",
  "method": "GET",
  "url": "/api/users/profile",
  "statusCode": 200,
  "responseTime": 45,
  "userId": "123",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "contentLength": "1024",
  "timestamp": "2023-12-01T10:30:00.000Z"
}
```

### Security Event Logging

Security-related events are automatically logged:

```typescript
// Authentication attempts
securityLoggingMiddleware.logAuthAttempt(
  'user@example.com',
  true,
  '192.168.1.1',
  'Mozilla/5.0...'
);

// Unauthorized access attempts
securityLoggingMiddleware.logUnauthorizedAccess(req, 'Invalid JWT token');

// Suspicious activities
securityLoggingMiddleware.logSuspiciousActivity('Multiple failed login attempts', {
  email: 'user@example.com',
  attempts: 5,
  timeWindow: '5 minutes'
});
```

### Development vs Production

**Development Environment:**
- Console logging enabled with colors
- Debug level logging
- File logging enabled
- HTTP request logging enabled

**Production Environment:**
- Console logging disabled
- Info level logging (errors and warnings)
- File logging enabled
- HTTP request logging configurable
- Log compression and rotation

### Log Analysis

Log files are in JSON format for easy parsing and analysis:

```bash
# View recent errors
tail -f logs/error-$(date +%Y-%m-%d).log | jq '.'

# Search for specific user activity
grep "userId.*123" logs/combined-$(date +%Y-%m-%d).log | jq '.'

# Monitor API performance
grep "API Request" logs/access-$(date +%Y-%m-%d).log | jq '.responseTime'
```

## 🧪 Testing

This project includes a comprehensive testing framework using Jest and Supertest, with support for unit tests, integration tests, and end-to-end (E2E) tests.

### Testing Stack

- **Jest** - Testing framework with built-in coverage reporting
- **Supertest** - HTTP assertion library for API testing
- **ts-jest** - TypeScript support for Jest
- **Test Database** - Separate test database configuration

### Test Structure

```
src/__tests__/
├── setup.ts                    # Jest setup file
├── helpers/                    # Test helper functions
│   ├── testDatabase.ts        # Database utilities
│   └── testApi.ts             # API testing utilities
├── unit/                      # Unit tests
│   └── services/
│       └── UserService.test.ts
├── integration/               # Integration tests
│   └── api/
│       └── auth.test.ts
└── e2e/                       # End-to-end tests
    └── userFlow.test.ts
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test types
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e          # E2E tests only
```

### Test Database Setup

Before running tests, create a test database:

```sql
CREATE DATABASE node_express_boilerplate_test;
```

The test environment uses `.env.test` configuration file with a separate database to avoid affecting development data.

### Writing Tests

#### Unit Test Example

```typescript
import { UserService } from '../../../services/UserService';
import { createTestUser } from '../../helpers/testDatabase';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    await clearDatabase();
    userService = new UserService();
  });

  it('should create a new user', async () => {
    const user = await userService.createUser({
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });
});
```

#### Integration Test Example

```typescript
import request from 'supertest';
import app from '../../../index';

describe('Authentication API', () => {
  it('should login successfully', async () => {
    await createTestUser({
      email: 'test@example.com',
      password: 'password123',
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(response.body.data).toHaveProperty('token');
  });
});
```

#### E2E Test Example

```typescript
describe('User Flow E2E', () => {
  it('should complete full user journey', async () => {
    // 1. Create user
    await createTestUser({ email: 'user@example.com', password: 'pass123' });

    // 2. Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'pass123' });

    const token = loginRes.body.data.token;

    // 3. Access protected route
    const profileRes = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(profileRes.body.data.email).toBe('user@example.com');
  });
});
```

### Test Coverage

View coverage report after running tests:

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory:
- `coverage/lcov-report/index.html` - HTML coverage report
- `coverage/coverage-summary.json` - JSON summary

### Coverage Thresholds

The project enforces minimum coverage thresholds:
- **Branches**: 50%
- **Functions**: 50%
- **Lines**: 50%
- **Statements**: 50%

### Test Helpers

#### Database Helpers

```typescript
import {
  initTestDatabase,
  closeTestDatabase,
  clearDatabase,
  createTestUser,
  createTestAdmin,
} from '../helpers/testDatabase';

// Initialize database connection
await initTestDatabase();

// Clear all data
await clearDatabase();

// Create test users
const user = await createTestUser({ email: 'test@example.com' });
const admin = await createTestAdmin({ email: 'admin@example.com' });

// Close connection
await closeTestDatabase();
```

#### API Helpers

```typescript
import {
  authenticatedGet,
  authenticatedPost,
  assertSuccessResponse,
  assertErrorResponse,
} from '../helpers/testApi';

// Make authenticated requests
const response = await authenticatedGet('/api/users/profile', token);

// Assert response structure
assertSuccessResponse(response, 200);
assertErrorResponse(response, 401);
```

### Best Practices

1. **Isolate Tests**: Each test should be independent and not rely on other tests
2. **Clean Database**: Clear database before each test to ensure clean state
3. **Use Factories**: Use helper functions to create test data consistently
4. **Test Edge Cases**: Test both success and failure scenarios
5. **Meaningful Names**: Use descriptive test names that explain what is being tested
6. **Arrange-Act-Assert**: Follow the AAA pattern for test structure

### Continuous Integration

Tests are automatically run in the CI/CD pipeline on every push and pull request. See the [GitHub Actions documentation](docs/GITHUB_ACTIONS.md) for more details.

The CI pipeline includes:
- ✅ Code quality checks (ESLint, Prettier, TypeScript)
- ✅ Unit, integration, and E2E tests
- ✅ Test coverage reporting
- ✅ Docker build verification
- ✅ Security audits

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm test

- name: Upload coverage
  run: npm run test:coverage
```

## 🔄 Development Workflow

1. **Start development server**: `npm run dev`
2. **Make changes** to TypeScript files in `src/`
3. **Server automatically restarts** when files change
4. **TSOA regenerates** routes and Swagger documentation automatically
5. **Write tests** for new features in `src/__tests__/`
6. **Run tests**: `npm test`
7. **Test endpoints** using Swagger UI at `http://localhost:3000/api-docs`
8. **Check code quality**: `npm run lint`
9. **Format code**: `npm run format`
10. **Monitor logs**: Check `logs/` directory for application logs

## 🚀 Production Deployment

### Build Process

```bash
# Build the application
npm run build
```

This creates a `dist/` directory with compiled JavaScript files.

### Deployment Methods

#### Method 1: Using npm start (Recommended)
```bash
npm run build
npm start
```

#### Method 2: With environment variables
```bash
npm run build
NODE_ENV=production JWT_SECRET=your-production-secret node dist/index.js
```

### Complete Production Deployment

```bash
# 1. Install production dependencies only
npm ci --only=production

# 2. Build the application
npm run build

# 3. Start the production server
npm start
```

## 🔄 CI/CD Pipeline

This project includes a complete CI/CD pipeline using GitHub Actions. See [docs/GITHUB_ACTIONS.md](docs/GITHUB_ACTIONS.md) for detailed documentation.

### CI Pipeline Features

- **Automated Testing**: Runs on every push and pull request
- **Multi-Version Testing**: Tests against Node.js 18.x and 20.x
- **Code Quality Checks**: ESLint, Prettier, and TypeScript type checking
- **Test Coverage**: Automatic coverage reporting with Codecov integration
- **Docker Build Verification**: Ensures Docker images build successfully
- **Security Audits**: npm audit for dependency vulnerabilities

### CD Pipeline Features

- **Automatic Deployment**: Deploys to Docker Hub on main branch pushes
- **Multi-Platform Images**: Builds for linux/amd64 and linux/arm64
- **Semantic Versioning**: Automatic tagging based on git tags
- **GitHub Releases**: Auto-generates releases with changelogs

### Quick Setup

1. **Fork or clone this repository**
2. **Set up GitHub Secrets** (for CD pipeline):
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub access token
   - `CODECOV_TOKEN`: Your Codecov token (optional)

3. **Push to trigger CI/CD**:
   ```bash
   git push origin main
   ```

For detailed setup instructions, see [docs/GITHUB_ACTIONS.md](docs/GITHUB_ACTIONS.md).

## 🚧 Roadmap

This boilerplate is designed to be extended with additional features:

- [x] TSOA integration for auto-generated Swagger documentation
- [x] Error handling middleware with unified response format
- [x] JWT authentication system with role-based access control
- [x] CRUD API endpoints with user management
- [x] Unified API response format with builder pattern
- [x] Modular response type definitions
- [x] Environment variable configuration with dotenv
- [x] Database integration (TypeORM + MySQL)
- [x] Docker containerization with multi-stage builds and health checks
- [x] Logging system
- [x] Testing framework (Jest + Supertest with unit, integration, and E2E tests)
- [x] GitHub Actions CI/CD pipeline
- [ ] Rate limiting
- [ ] API versioning

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check if similar issues exist in [Issues](../../issues)
2. Create a new Issue with detailed description
3. Provide error messages and reproduction steps

## 📝 Notes

- This boilerplate includes a complete authentication system with JWT tokens
- All API responses follow a unified format for consistency
- Response types are modularly organized by feature
- The project structure is designed to be scalable and maintainable
- Swagger documentation is automatically generated from TSOA decorators
- Demo credentials are provided for easy testing