# Node.js Express TypeScript Boilerplate

A modern Node.js Express TypeScript backend API template project with complete authentication system, auto-generated API documentation, unified response format, and modular architecture.

## 🚀 Features

- **TypeScript** - Complete type safety support
- **Express.js** - Fast, minimalist web framework
- **TSOA** - Auto-generated Swagger documentation and type-safe routes
- **JWT Authentication** - Complete authentication system with role-based access control
- **Unified API Response** - Consistent response format across all endpoints
- **Security** - Helmet and CORS protection
- **ESLint + Prettier** - Code quality and formatting
- **Modular Architecture** - Well-organized project structure with response types
- **Development Tools** - Hot reload with nodemon

## 📋 System Requirements

- Node.js >= 18.0.0
- npm or yarn

## 🛠️ Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`.

### 3. Test the API

- Main endpoint: `http://localhost:3000`
- Health check: `http://localhost:3000/health`
- **API Documentation**: `http://localhost:3000/api-docs` (development only)
- **Authentication**: `http://localhost:3000/auth/login`
- **User Management**: `http://localhost:3000/users/profile` (requires authentication)

## 📁 Project Structure

```
├── src/
│   ├── config/          # Configuration files
│   │   └── index.ts     # Environment configuration
│   ├── controllers/     # TSOA API controllers
│   │   ├── AuthController.ts    # Authentication endpoints
│   │   ├── HealthController.ts  # Health check endpoints
│   │   ├── UserController.ts    # User management endpoints
│   │   └── response/    # Response type definitions
│   │       ├── auth.res.ts      # Authentication response types
│   │       ├── common.res.ts    # Common response types and builder
│   │       ├── user.res.ts      # User response types
│   │       └── index.ts         # Unified export
│   ├── middleware/      # Express middleware
│   │   ├── authentication.ts   # JWT authentication middleware
│   │   └── errorHandler.ts     # Global error handling
│   ├── routes/          # Auto-generated TSOA routes
│   │   └── routes.ts    # Generated Express routes
│   ├── swagger/         # Auto-generated Swagger documentation
│   │   └── swagger.json # OpenAPI 3.0 specification
│   ├── services/        # Business logic services (future)
│   ├── utils/           # Utility functions (future)
│   └── index.ts         # Application entry point
├── .eslintrc.js         # ESLint configuration
├── .prettierrc.js       # Prettier configuration
├── tsconfig.json        # TypeScript configuration
├── tsoa.json           # TSOA configuration
├── package.json         # Project dependencies and scripts
└── README.md           # Project documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload (includes Swagger generation)
- `npm run build` - Build production version (includes Swagger generation)
- `npm run start` - Start production server
- `npm run swagger` - Generate TSOA routes and Swagger documentation
- `npm run clean` - Clean dist directory
- `npm run lint` - Run ESLint code quality check
- `npm run lint:fix` - Run ESLint and fix issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting with Prettier
- `npm run typecheck` - Run TypeScript type checking

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
| POST | `/auth/login` | User login with email/password | None |
| POST | `/auth/demo-credentials` | Get demo credentials for testing | None |

### User Management
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/users/profile` | Get current user profile | JWT Required |
| GET | `/users/dashboard` | Get user dashboard with stats | JWT Required |
| GET | `/users/` | Get all users (admin only) | JWT Required (Admin) |

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
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

2. **Use token** in subsequent requests:
```bash
curl -X GET http://localhost:3000/users/profile \
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

The application uses environment variables for configuration:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-jwt-key` |
| `JWT_EXPIRES_IN` | JWT token expiration | `24h` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` |

## 🧪 Development

### Code Quality

This project uses ESLint and Prettier for code quality and formatting:

```bash
# Check code quality
npm run lint

# Format code
npm run format

# Type checking
npm run typecheck
```

### File Structure Guidelines

- **src/config/** - Configuration and environment variables
- **src/controllers/** - API route handlers with TSOA decorators
- **src/controllers/response/** - Response type definitions organized by feature
- **src/middleware/** - Express middleware functions (authentication, error handling)
- **src/services/** - Business logic and external service integrations (future)
- **src/utils/** - Utility functions and helpers (future)

## 🔄 Development Workflow

1. **Start development server**: `npm run dev`
2. **Make changes** to TypeScript files in `src/`
3. **Server automatically restarts** when files change
4. **TSOA regenerates** routes and Swagger documentation automatically
5. **Test endpoints** using Swagger UI at `http://localhost:3000/api-docs`
6. **Check code quality**: `npm run lint`
7. **Format code**: `npm run format`

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

## 🚧 Roadmap

This boilerplate is designed to be extended with additional features:

- [x] TSOA integration for auto-generated Swagger documentation
- [x] Error handling middleware with unified response format
- [x] JWT authentication system with role-based access control
- [x] CRUD API endpoints with user management
- [x] Unified API response format with builder pattern
- [x] Modular response type definitions
- [ ] Database integration (TypeORM + MySQL)
- [ ] Docker containerization
- [ ] Deployment scripts (build.sh, deploy.sh)
- [ ] Logging system
- [ ] Testing framework
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