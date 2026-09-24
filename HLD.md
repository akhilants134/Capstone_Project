# High-Level Design (HLD)

## Project: Resource Matcher - Donation Platform

---

### 1. Architectural Overview

The **Resource Matcher** platform follows a decoupled, client-server **N-Tier Architecture**. The system comprises a React-based single-page application (SPA) frontend, an Express-powered RESTful API gateway/application tier, an in-memory caching and rate-limiting subsystem, and a persistent MongoDB database layer.

```mermaid
graph TD
    Client[Next.js SSR & React Client] -->|HTTP / REST API| Proxy[Nginx / Reverse Proxy]
    Client <-->|WebSocket Events| SocketLayer[Socket.io Real-Time Hub]
    Proxy -->|Forward Requests| AppServer[Node.js / Express Application Server]
    
    subgraph Express Application Infrastructure
        Sec[Security & Sanitization Middleware] --> Val[Zod Request Validator]
        Val --> Rate[Rate Limiter Middleware]
        Rate --> Cache[Redis Caching Layer]
        Cache --> Routes[API Routes & Controllers]
        Routes --> AI[AI Function Calling Engine]
    end

    AppServer --> Sec
    Routes -->|Mongoose ODM| Mongo[(MongoDB Document Store)]
    Routes -->|ACID Transactions| PG[(PostgreSQL Relational DB)]
    Cron[Node-Cron Scheduled Workers] --> Mongo
    Cron --> Cache
    Routes --> SocketLayer
```

---

### 2. Subsystem Descriptions

#### 2.1 Presentation Tier (Frontend Client)
* **Framework**: Next.js App Router (SSR + Client Components) with React 19.
* **Navigation & State**: Server-rendered routing with hydration, React Context API for global session and theme management (`useAuth`, `useTheme`).
* **UI Components**: Modular responsive components (Navbar, Sidebar, Stats Cards, Donation List, Leaderboards, User Management).
* **JavaScript Core Concepts**: Validated event loop mechanics, Promise/Callback patterns, and Hoisting/TDZ management.

#### 2.2 Application Tier (Backend Express Server)
* **Runtime**: Node.js v18+.
* **API Gateway & Routing**: Express routes separated by concern (`auth`, `listings`, `matches`, `messages`, `notifications`, `admin`, `payments`, `ai`).
* **Middleware Pipeline**:
  * **Security & Validation Layer**: Helmet headers, XSS sanitizer, HPP protection, and strict Zod request schema validation.
  * **Traffic Management**: Express rate limiting applied to authentication and global API endpoints.
  * **Caching Layer**: Redis client with in-memory fallback for hot endpoints (`/api/v1/payments/analytics`, category statistics).
  * **Real-time WebSockets**: Socket.io server handling match alerts and live messaging.
  * **Background Cron Workers**: Scheduled jobs handling data hygiene, cache pre-computation, and health monitoring.
  * **AI Assistant**: LLM Function Calling engine with executable tool bindings.

#### 2.3 Persistence Tier (Hybrid Data Architecture)
* **NoSQL Engine (MongoDB)**: High-speed flexible document store for user profiles, donation/request listings, messages, and notifications with compound/text indexing.
* **Relational SQL Engine (PostgreSQL)**: Normalized 3NF transactional ledger (`donors`, `campaigns`, `monetary_transactions`, `audit_logs`) enforcing foreign key constraints, indexing, and multi-table ACID transactions.


#### 2.4 Infrastructure & Container Layer
* **Containerization**: Docker container definitions for API Server, Client, and Nginx.
* **Orchestration**: `docker-compose` managing multi-container services, environment variables, network bridges, and volumes.

---

### 3. Data Flow & Sequence Diagrams

#### 3.1 User Authentication & Authorization Flow
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React Client
    participant Express as Express API Server
    participant DB as MongoDB Database

    User->>Client: Submit Login Credentials
    Client->>Express: POST /api/auth/login
    Express->>DB: Query User by Email/Username
    DB-->>Express: User Document + Hashed Password
    Express->>Express: Compare Hash (bcrypt.compare)
    alt Credentials Valid
        Express->>Express: Generate JWT Sign Signature
        Express-->>Client: 200 OK + JWT Token & User Profile
        Client->>Client: Store JWT in LocalStorage / Auth Context
    else Credentials Invalid
        Express-->>Client: 401 Unauthorized (Invalid Credentials)
    end
```

#### 3.2 Donation Creation & Cataloging Flow
```mermaid
sequenceDiagram
    autonumber
    actor Donor
    participant Client as React Client
    participant Middleware as Auth & Security Pipeline
    participant Controller as Donation Controller
    participant DB as MongoDB Database

    Donor->>Client: Fill Donation Form & Click Submit
    Client->>Middleware: POST /api/donations (Bearer JWT)
    Middleware->>Middleware: Validate Security Headers & Rate Limit
    Middleware->>Middleware: Verify JWT & Attach User to Req
    Middleware->>Controller: Pass Control
    Controller->>DB: Donation.create(donationPayload)
    DB-->>Controller: Saved Donation Document
    Controller-->>Client: 201 Created + Donation Object
    Client->>Client: Update Local State & Toast Notification
```

---

### 4. Non-Functional & Topology Design

#### 4.1 Scalability & Load Handling
* **Stateless API Design**: The application server stores no session state locally, allowing seamless horizontal scaling behind a load balancer (Nginx / HAProxy).
* **Caching Strategy**: Shared/in-memory cache reduces database queries for read-heavy routes (`/api/stats`, `/api/categories`).

#### 4.2 Security Architecture
* **Data in Transit**: Encrypted over TLS/HTTPS.
* **Data at Rest**: Passwords stored as `bcrypt` hashes with unique salts.
* **Defense in Depth**: Combination of Rate Limiting, CORS restrictions, JWT expiration, input validation, and Helmet-equivalent custom headers.
