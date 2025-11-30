# Node.js Express TypeScript Boilerplate

A modern Node.js Express TypeScript backend API template project with complete authentication system, auto-generated API documentation, database integration, and Docker deployment configuration.

## 🚀 Features

- **TypeScript** - Complete type safety support
- **Express.js** - Fast, minimalist web framework
- **TSOA** - Auto-generated Swagger documentation and type-safe routes
- **Security** - Helmet and CORS protection
- **ESLint + Prettier** - Code quality and formatting
- **Modular Architecture** - Well-organized project structure
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

## 📁 Project Structure

```
├── src/
│   ├── config/          # Configuration files
│   │   └── index.ts     # Environment configuration
│   ├── controllers/     # TSOA API controllers
│   │   └── HealthController.ts  # Health check endpoints
│   ├── middleware/      # Express middleware
│   │   └── errorHandler.ts     # Global error handling
│   ├── routes/          # Auto-generated TSOA routes
│   │   └── routes.ts    # Generated Express routes
│   ├── swagger/         # Auto-generated Swagger documentation
│   │   └── swagger.json # OpenAPI 3.0 specification
│   ├── services/        # Business logic services (future)
│   ├── types/           # TypeScript type definitions (future)
│   ├── utils/           # Utility functions (future)
│   └── index.ts         # Application entry point
├── .eslintrc.js         # ESLint configuration with comments
├── .prettierrc.js       # Prettier configuration with comments
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
- `npm run lint` - Run ESLint code quality check
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

## 📚 API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Main endpoint with server info |
| GET | `/api/health` | TSOA health check with detailed info |
| GET | `/api/health/ping` | Simple ping endpoint |

### API Documentation
| Method | Endpoint | Description | Available |
|--------|----------|-------------|-----------|
| GET | `/api-docs` | Swagger UI documentation | Development only |

### Response Examples

**GET /api/health**
```json
{
  "status": "OK",
  "timestamp": "2023-12-01T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "version": "1.0.0"
}
```

**GET /api/health/ping**
```json
{
  "message": "pong"
}
```

## ⚙️ Configuration

The application uses environment variables for configuration. Currently supported:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |

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
- **src/controllers/** - API route handlers (to be added)
- **src/middleware/** - Express middleware functions (to be added)
- **src/services/** - Business logic and external service integrations (to be added)
- **src/types/** - TypeScript type definitions (to be added)
- **src/utils/** - Utility functions and helpers (to be added)

## 🔄 Development Workflow

1. **Start development server**: `npm run dev`
2. **Make changes** to TypeScript files in `src/`
3. **Server automatically restarts** when files change
4. **Test endpoints** using browser or API client
5. **Check code quality**: `npm run lint`
6. **Format code**: `npm run format`

## 🚀 Production Deployment

### Build Process

The build process compiles TypeScript files to JavaScript for production use:

```bash
# Build the application
npm run build
```

This creates a `dist/` directory with compiled JavaScript files:
```
dist/
├── config/
│   └── index.js        # Compiled configuration
└── index.js           # Compiled main application
```

### Deployment Methods

#### Method 1: Using npm start (Recommended)
```bash
npm run build
npm start
```

#### Method 2: Direct execution
```bash
npm run build
node dist/index.js
```

#### Method 3: With environment variables
```bash
npm run build
NODE_ENV=production node dist/index.js
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

### Development vs Production

| Environment | Command | File Type | Purpose |
|-------------|---------|-----------|---------|
| **Development** | `npm run dev` | TypeScript (`.ts`) | Development with hot reload |
| **Production** | `npm start` | JavaScript (`.js`) | Optimized for deployment |

### Why Build?

- **Performance**: JavaScript execution is faster than TypeScript transpilation
- **Deployment**: Production environments don't need TypeScript compiler
- **File Size**: Removes type information, smaller files
- **Compatibility**: Ensures compatibility with target Node.js version

## 🚧 Roadmap

This boilerplate is designed to be extended with additional features:

- [x] TSOA integration for auto-generated Swagger documentation
- [x] Error handling middleware
- [ ] JWT authentication system
- [ ] Database integration (TypeORM + MySQL)
- [ ] CRUD API endpoints
- [ ] Docker containerization
- [ ] Deployment scripts
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

- This is a basic boilerplate that will be extended with more features
- The project structure is designed to be scalable and maintainable
- Configuration files include detailed comments for learning purposes