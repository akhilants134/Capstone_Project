# Resource Matcher - Full Stack Donation & Resource Matching Ecosystem

An enterprise-grade donation and resource coordination platform connecting resource donors with verified recipients and community organizations. Features real-time matching, SQL & NoSQL hybrid persistence, Redis caching, WebSockets, scheduled background workers, payment gateway integration, and an AI tool-calling assistant.

---

## 🚀 Key Architecture & Competencies

### 1. Hybrid Persistence (SQL & NoSQL)
* **SQL (PostgreSQL)**: Normalized schema design (3NF) for transactional data (`donors`, `campaigns`, `monetary_transactions`, `audit_logs`) featuring:
  - Primary & Foreign Key relationships with cascade constraints
  - Performance indexing on frequently filtered and joined columns
  - Atomic multi-table ACID transactions (`BEGIN`, `COMMIT`, `ROLLBACK`)
  - Advanced analytical queries (`INNER JOIN`, `LEFT JOIN`, `GROUP BY`, `HAVING`, `ORDER BY`)
* **NoSQL (MongoDB & Mongoose)**: High-speed document store for dynamic donation listings, users, messages, and notifications with compound and full-text indexes.

### 2. System Architecture & Integrations
* **Redis Caching**: Dual-mode caching with TTL invalidation for high-traffic endpoints (leaderboards, category distribution, financial summaries) and in-memory fallback.
* **WebSockets (Socket.io)**: Real-time event propagation, live instant-match alerts, and direct messaging channels.
* **Scheduled Jobs (Cron)**: Automated recurring cron routines for database cleanups, pre-computed analytics caching, and periodic system health heartbeats.
* **Payment Gateway**: Stripe Checkout integration supporting secure monetary donations and webhooks.
* **AI App Engineering**: LLM Function Calling and Tool Execution engine (`searchAvailableDonations`, `getUrgentRequests`, `calculateMatchingScore`).
* **Auth, Security & Sanitization**: JWT-based RBAC, 2FA support, rate limiting, Helmet security headers, HTTP Parameter Pollution protection, and Zod request body validation.
* **Server-Side Rendering (SSR)**: Next.js App Router providing server-rendered pages and fast client hydration.
* **Core JavaScript Implementations**: Documented event loop mechanics, Microtask/Macrotask scheduling, Promises vs. Callbacks promisification, and Hoisting/TDZ behavior.

---

## 🛠️ Getting Started

### Prerequisites
* Node.js 18+
* MongoDB (Local or MongoDB Atlas)
* PostgreSQL & Redis (Optional / Graceful fallbacks enabled for dev)

### 1. Installation
```bash
# Install root, server, and client dependencies
npm run install:all
```

### 2. Environment Configuration
Create `.env` in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/resourcematcher
POSTGRES_URI=postgresql://postgres:postgres@localhost:5432/resourcematcher
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=super-secret-production-grade-key-12345
CLIENT_URL=http://localhost:3000,http://localhost:5173
STRIPE_SECRET_KEY=sk_test_mock_secret_key_12345
```

### 3. Run Development Servers
```bash
# Run backend and frontend concurrently
npm run dev
```

* Frontend: `http://localhost:3000` (or `http://localhost:5173`)
* Backend API: `http://localhost:5000/api/v1`

---

## 🧪 Testing & Verification

Run the comprehensive test suite verifying client linting, build pipelines, auth lifecycle, database updates, SQL transactions, Redis caching, and AI tool use:

```bash
npm test
```

---

## 👥 Default Credentials

* **Admin User**: `admin@resourcematcher.org` / `admin123`
* **Demo Donor**: `donor@resourcematcher.org` / `donor123`
