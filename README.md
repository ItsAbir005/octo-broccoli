# Real-time Notification Service
A production-ready Node.js/TypeScript backend service with WebSocket support, Redis pub/sub, JWT authentication, and comprehensive middleware stack.
Features

WebSocket Server - Real-time bidirectional communication
Redis Pub/Sub - Scalable message broadcasting
JWT Authentication - Access & refresh token mechanism
Rate Limiting - Request throttling for auth endpoints
Health Checks - Liveness and readiness endpoints
Error Handling - Global error handler with custom error types
Validation - Zod schema validation
Compression - Response compression middleware
Security - Helmet.js security headers
Logging - Request/response logging with unique IDs
Docker Support - Complete containerization setup

Tech Stack

Runtime: Node.js 20
Language: TypeScript
Framework: Express 5.x
WebSocket: ws
Database: Redis 5.x
Validation: Zod
Authentication: jsonwebtoken
Security: Helmet, CORS, compression
Development: Nodemon, ts-node

Prerequisites

Node.js 20+
Redis 5+
Docker & Docker Compose (optional)

Installation
Local Development
bash# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start Redis (if not using Docker)
redis-server

# Run development server
npm run dev
Docker Setup
bash# Build and start services
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
Environment Variables
Create a .env file in the root directory:
env# Server
PORT=8080
NODE_ENV=development

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secrets (change these in production!)
JWT_ACCESS=your-super-secret-access-key-change-this
JWT_REFRESH=your-super-secret-refresh-key-change-this
API Endpoints
Health Checks
httpGET /health
Response: { status: "UP", timestamp: "ISO-8601" }

GET /readiness
Response: { status: "READY", redis: "connected" }
Authentication
httpPOST /temp-login
Response: { access: "token", refresh: "token" }
Description: Generate temporary tokens (dev only)

POST /refresh
Body: { token: "refresh_token" }
Response: { accessToken: "new_token", refreshToken: "new_token" }
Description: Refresh access token

POST /logout
Body: { token: "refresh_token" }
Response: { success: true, message: "Logged out safely" }
Description: Invalidate refresh token
Notifications
httpPOST /notify
Body: { userId: "string", message: "string" }
Response: { success: true }
Description: Publish notification to user via WebSocket
Testing
httpGET /error
Description: Test error handling

GET /status-test
Response: { success: true, data: { service: "running" } }

POST /zod-test
Body: { name: "string", age: number }
Response: { success: true, data: { name, age } }
Description: Test Zod validation
WebSocket Connection
javascript// Connect with access token
const ws = new WebSocket('ws://localhost:8080?token=YOUR_ACCESS_TOKEN');

ws.onopen = () => {
  console.log('Connected');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
  // { type: "NOTIFICATION", data: { message: "..." } }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected');
};
Architecture
Request Flow
Client Request
    ↓
Express Middleware Stack
    → Request ID Generation
    → Helmet Security Headers
    → CORS
    → Cookie Parser
    → JSON Parser
    → Request Logger
    → Compression
    ↓
Route Handler
    → Validation (Zod)
    → Rate Limiting (if applicable)
    → Business Logic
    → Redis Operations
    ↓
Response / Error Handler
WebSocket Flow
Client → WS Connection (with token)
    ↓
Token Verification
    ↓
Store in clients Map
    ↓
Listen for Redis Pub/Sub messages
    ↓
Forward to specific client
Redis Pub/Sub
HTTP POST /notify
    ↓
Publish to Redis channel "notifications"
    ↓
Subscriber receives message
    ↓
Look up WebSocket connection
    ↓
Send to connected client
Project Structure
project2/
├── src/
│   ├── auth/
│   │   └── refreshTokenService.ts    # JWT token generation & validation
│   ├── constants/
│   │   └── statusCodes.ts            # HTTP status code enums
│   ├── controllers/
│   │   └── notifyController.ts       # Notification endpoint logic
│   ├── error/
│   │   ├── AppError.ts               # Custom error class
│   │   └── GlobalError.ts            # Global error handler
│   ├── health/
│   │   └── healthController.ts       # Health check endpoints
│   ├── middleware/
│   │   ├── asyncWarpper.ts           # Async error wrapper
│   │   ├── compressionMiddleware.ts  # Response compression
│   │   ├── logger.middleware.ts      # Request logging
│   │   ├── rateLimiter.ts            # Rate limiting config
│   │   ├── requestId.ts              # Unique request ID
│   │   └── validate.ts               # Zod validation middleware
│   ├── queue/
│   │   ├── redisPublisher.ts         # Redis publisher
│   │   └── redisSubscriber.ts        # Redis subscriber
│   ├── service/
│   │   └── redisTokenService.ts      # Redis token operations
│   ├── utils/
│   │   └── apiResponse.ts            # Response helpers
│   ├── validation/
│   │   └── testSchema.ts             # Zod schemas
│   ├── ws/
│   │   ├── socketServer.ts           # WebSocket server
│   │   └── wsAuth.ts                 # WebSocket authentication
│   └── server.ts                     # Main entry point
├── dist/                             # Compiled JavaScript
├── .dockerignore
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
Scripts
bash# Development with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Production mode
npm run start
Error Handling
All errors are handled by the global error handler:
typescript// Throw custom errors
throw new AppError("Custom message", 400);

// Async route handlers auto-catch errors
app.get('/route', asyncWrapper(async (req, res) => {
  // Errors automatically caught and passed to error handler
}));
Security Features

Helmet.js - Sets secure HTTP headers
CORS - Configurable cross-origin resource sharing
Rate Limiting - Prevents abuse on auth endpoints
JWT - Stateless authentication
Redis Token Store - Prevents token reuse attacks

Production Considerations

Change JWT Secrets - Use strong, random secrets
Configure CORS - Restrict allowed origins
Enable HTTPS - Use reverse proxy (nginx/Traefik)
Redis Persistence - Configure RDB/AOF
Monitoring - Add APM tools (New Relic, DataDog)
Logging - Use structured logging (Winston, Pino)
Environment - Use proper secret management (Vault, AWS Secrets)

Testing WebSocket Flow
bash# 1. Get access token
curl -X POST http://localhost:8080/temp-login

# 2. Connect WebSocket (use token from step 1)
# Use any WebSocket client or browser console

# 3. Send notification
curl -X POST http://localhost:8080/notify \
  -H "Content-Type: application/json" \
  -d '{"userId": "19", "message": "Hello from server!"}'

# 4. Check WebSocket client for received message
Troubleshooting
Redis Connection Issues
bash# Check Redis is running
redis-cli ping
# Expected: PONG

# Check Docker Redis
docker-compose logs redis
Port Already in Use
bash# Find process using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>
TypeScript Build Errors
bash# Clean build directory
rm -rf dist/

# Rebuild
npm run build
Contributing

Fork the repository
Create feature branch (git checkout -b feature/amazing-feature)
Commit changes (git commit -m 'Add amazing feature')
Push to branch (git push origin feature/amazing-feature)
Open Pull Request
