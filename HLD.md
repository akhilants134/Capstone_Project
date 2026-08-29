# High-Level Design (HLD)

## Project: Resource Matcher - Donation Platform

---

### 1. Architectural Overview

The **Resource Matcher** platform follows a decoupled, client-server **N-Tier Architecture**. The system comprises a React-based single-page application (SPA) frontend, an Express-powered RESTful API gateway/application tier, an in-memory caching and rate-limiting subsystem, and a persistent MongoDB database layer.

```mermaid
graph TD
    Client[React Client SPA / Browser] -->|HTTP / REST API| Proxy[Nginx / Reverse Proxy]
    Proxy -->|Forward Requests| AppServer[Node.js / Express Application Server]
    
    subgraph Express Application Server Infrastructure
        Sec[Layer 8: Security Headers Middleware] --> Rate[Layer 9: Rate Limiter Middleware]
        Rate --> Cache[Layer 10: In-Memory Cache Middleware]
        Cache --> Log[Layer 12: HTTP Request Logger]
        Log --> Routes[Layer 2: API Routes / Controllers]
    end

    AppServer --> Sec
    Routes -->|Mongoose ODM| DB[(MongoDB Persistent Database)]
    Routes -->|Health Check| Health[Layer 13: System Health Monitor]
```

---

### 2. Subsystem Descriptions

#### 2.1 Presentation Tier (Frontend Client)
* **Framework**: React 18 powered by Vite.
* **Navigation & State**: React Router client-side routing, React Context API for global session and theme management (`useAuth`, `useTheme`).
* **UI Components**: Modular components (Navbar, Sidebar, Stats Cards, Donation List, Leaderboards, User Management).
* **HTTP Client**: Axios wrapper with global request/response interceptors for automatic JWT token injection and error handling.

#### 2.2 Application Tier (Backend Express Server)
* **Runtime**: Node.js v18+.
* **API Gateway & Routing**: Express routes separated by concern (`auth`, `donations`, `requests`, `users`, `categories`, `stats`, `system`, `health`, `seed`).
* **Middleware Pipeline**:
  * **Security Layer**: Custom security headers (XSS filtering, frameguard, content-type protection).
  * **Traffic Management**: Rate limiting applied to authentication (`authLimiter`) and global API endpoints (`apiLimiter`).
  * **Caching Layer**: Route-level TTL caching for frequently requested static or aggregated endpoints (`/api/stats`, `/api/categories`).
  * **Logging & Observability**: HTTP request duration logging and error tracking.

#### 2.3 Persistence Tier (Database)
* **Database Engine**: MongoDB (Local instance or MongoDB Atlas cloud cluster).
* **Object Document Mapper (ODM)**: Mongoose schemas enforcing model structure, validation rules, indexing, and virtual fields.

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
