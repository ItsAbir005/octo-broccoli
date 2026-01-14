# Real-Time Notification Service

A **production-ready real-time backend service** built using **Node.js + TypeScript**, featuring **WebSockets**, **Redis Pub/Sub**, **JWT authentication**, and a **robust middleware stack**.  
Designed to demonstrate **SDE-2 level backend engineering skills**.

---

##  Features

- **WebSocket Server**
  - Real-time, bidirectional communication
  - JWT-authenticated connections

- **Redis Pub/Sub**
  - Scalable message broadcasting
  - Decoupled HTTP → WebSocket architecture

- **JWT Authentication**
  - Access & refresh token flow
  - Refresh token invalidation via Redis

- **Rate Limiting**
  - Protects authentication endpoints

- **Health Checks**
  - Liveness and readiness probes

- **Centralized Error Handling**
  - Custom error abstraction
  - Global error handler

- **Validation**
  - Zod-based request validation

- **Security**
  - Helmet headers
  - CORS configuration

- **Observability**
  - Request logging
  - Unique request IDs

- **Dockerized**
  - Fully containerized backend + Redis

---

##  Tech Stack

| Layer | Technology |
|-----|-----------|
| Runtime | Node.js 20 |
| Language | TypeScript |
| Framework | Express 5 |
| WebSocket | ws |
| Messaging | Redis Pub/Sub |
| Authentication | JWT |
| Validation | Zod |
| Security | Helmet, CORS |
| Dev Tools | ts-node, nodemon |
| Containers | Docker, Docker Compose |

---

##  Prerequisites

- Node.js **20+**
- Redis **5+**
- Docker & Docker Compose (optional)

---

## ⚙️ Installation

### Local Setup

```bash
npm install
cp .env.example .env
redis-server
npm run dev
