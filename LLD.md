# Low-Level Design (LLD)

## Project: Resource Matcher - Donation Platform

---

### 1. Module & Directory Structure

```text
capstone_project/
├── client/                      # React Frontend Application
│   ├── src/
│   │   ├── app/                # Route definitions & app root
│   │   ├── components/         # Reusable UI components (Navbar, Sidebar, Modal, Cards)
│   │   ├── context/            # AuthContext, ThemeContext providers
│   │   ├── hooks/              # Custom hooks (useAuth, useTheme, useFetch)
│   │   ├── page-views/         # Top-level view modules (Dashboard, Donations, Users)
│   │   ├── services/           # Axios instance & API method calls (api.js)
│   │   └── index.css           # Design tokens, CSS variables, utility classes
├── server/                      # Node.js Express Backend API
│   ├── config/                 # DB connection setup (db.js)
│   ├── middleware/             # Security, rate limiter, cache, error handlers
│   ├── models/                 # Mongoose schemas (User.js, Donation.js, Request.js)
│   ├── routes/                 # Express route handlers
│   ├── utils/                  # Logger utility
│   ├── index.js                # Express app initialization & server entrypoint
│   └── seed.js                 # Database seeder logic
├── docker-compose.yml           # Multi-container orchestrator configuration
├── Dockerfile                   # Node app container specification
├── PRD.md                       # Product Requirements Document
├── HLD.md                       # High-Level Design
└── LLD.md                       # Low-Level Design
```

---

### 2. Database Schema Specifications (Mongoose Models)

#### 2.1 User Model (`models/User.js`)
Stores system user identities, authentication credentials, assigned role, and status.

```javascript
{
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  password: { type: String, required: true }, // Salted & hashed via bcryptjs (cost factor 12)
  role: { 
    type: String, 
    enum: ['admin', 'donor', 'recipient', 'community'], 
    default: 'community' 
  },
  fullName: { type: String, default: '' },
  organization: { type: String, default: '' },
  verified: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'pending'], 
    default: 'active' 
  },
  timestamps: true // createdAt, updatedAt
}
```

* **Pre-save Hook**: Automatically hashes `password` using `bcrypt.hash(password, 12)` if modified.
* **Instance Method**: `comparePassword(candidatePassword)` returns boolean matching outcome.

#### 2.2 Donation Model (`models/Donation.js`)
Represents resources posted by donors available for allocation.

```javascript
{
  itemName: { type: String, required: true },
  description: { type: String, default: '' },
  quantity: { type: String, default: '' },
  category: { type: String, required: true },
  value: { type: Number, required: true },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  donorName: { type: String, required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  recipientName: { type: String, default: null },
  status: { 
    type: String, 
    enum: ['listed', 'in_transit', 'completed', 'cancelled'], 
    default: 'listed' 
  },
  matchedAt: { type: Date, default: null },
  timestamps: true
}
```

#### 2.3 Request Model (`models/Request.js`)
Represents resource requests created by recipients or community representatives.

```javascript
{
  itemName: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, required: true },
  urgency: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  requesterName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['open', 'matched', 'fulfilled', 'cancelled'], 
    default: 'open' 
  },
  matchedDonation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', default: null },
  timestamps: true
}
```

---

### 3. API Contract Specifications

#### 3.1 Auth Endpoint Group (`/api/auth`)

##### POST `/api/auth/login`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d5ec49f1b2c81234567890",
      "username": "admin",
      "role": "admin",
      "fullName": "System Administrator"
    }
  }
  ```
* **Error Response (401 Unauthorized)**:
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

#### 3.2 Donations Endpoint Group (`/api/donations`)

##### GET `/api/donations`
* **Access**: Authenticated / Role-based
* **Response (200 OK)**: Array of donation objects.

##### POST `/api/donations`
* **Access**: Donor / Admin
* **Request Body**: `itemName`, `category`, `value`, `quantity`, `description`.
* **Response (201 Created)**: Newly created donation document.

#### 3.3 System & Analytics Endpoints

##### GET `/api/stats`
* **Access**: Admin / Public overview
* **Caching**: In-Memory (TTL 30s)
* **Response (200 OK)**: Total donation count, active users, matched requests, value breakdown by category.

##### GET `/api/health`
* **Access**: Public / Probe Monitoring
* **Response (200 OK)**:
  ```json
  {
    "status": "UP",
    "timestamp": "2026-08-29T13:50:00.000Z",
    "database": "connected",
    "uptimeSeconds": 1420
  }
  ```

---

### 4. Middleware & Utility Implementation Specifications

#### 4.1 Rate Limiting (`middleware/rateLimiter.js`)
* `authLimiter`: Max 5 login attempts per window (15 minutes). Prevents brute-force attempts.
* `apiLimiter`: Max 100 requests per 15-minute window for standard API operations.

#### 4.2 In-Memory Caching (`middleware/cache.js`)
* Higher-order middleware accepting `durationSeconds`.
* Intercepts `res.send` to store successful responses in node memory key-indexed by `req.originalUrl`.

#### 4.3 Security Headers (`middleware/security.js`)
Sets essential security response headers:
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

#### 4.4 Global Error Handler (`middleware/errorHandler.js`)
Captures thrown errors across route handlers and sanitizes sensitive tracebacks in production:
```javascript
module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

---

### 5. Error Handling & HTTP Status Matrix

| HTTP Status Code | Meaning | Common Scenario |
| :--- | :--- | :--- |
| **200 OK** | Request Succeeded | Successful data retrieval or state modification |
| **201 Created** | Resource Created | Successful donation/request creation |
| **400 Bad Request** | Validation Failure | Missing required schema fields (`itemName`, `value`) |
| **401 Unauthorized** | Authentication Failed | Invalid or missing JWT token |
| **403 Forbidden** | Authorization Denied | Recipient attempting to access admin management routes |
| **404 Not Found** | Resource Missing | Non-existent donation ID |
| **429 Too Many Requests** | Rate Limit Exceeded | Exceeded auth or API request threshold |
| **500 Internal Error** | System Failure | Database query exception or server crash |
