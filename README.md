# Resource Matcher - Donation Platform

A full-stack donation management platform connecting donors with recipients. Features an admin dashboard with analytics, user management, and system monitoring.

## Tech Stack

- **Frontend**: React + Vite, React Router, Axios, Lucide React
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Auth**: JWT-based authentication with bcrypt password hashing

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Setup

1. **Clone and install dependencies:**

```bash
# Server
cd server
cp .env.example .env   # Edit .env with your MongoDB URL
npm install

# Client
cd ../client
npm install
```

2. **Start the server:**

```bash
cd server
npm start
```

3. **Seed the database:**

```bash
curl -X POST http://localhost:5000/api/seed
```

4. **Start the client:**

```bash
cd client
npm run dev
```

5. **Open** http://localhost:5173 and log in with:
   - Username: `admin`
   - Password: `admin123`

## Features

- **Role-based login** (Admin, Donor, Recipient, Community)
- **Admin Dashboard** with:
  - Overview with stats cards
  - User management
  - Donation tracking
  - Top donors leaderboard
  - Category analytics
  - System status monitoring
  - Data reset functionality
