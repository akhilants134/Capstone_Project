# Security Policy & Hardening Guidelines

## Overview
The **Resource Matcher** platform implements a defense-in-depth security architecture protecting user data, financial transactions, and community assets.

---

## 🛡️ Implemented Security Controls

### 1. Input Sanitization & Injection Awareness
* **SQL Injection Mitigation**: All relational queries utilize parameterized prepared statements and ORM abstraction with strict parameter type checking.
* **NoSQL Injection Defense**: Recursive sanitization middleware strips MongoDB operator keys (e.g., `$where`, `$gt`, `$ne`, and nested dot keys `.`).
* **Cross-Site Scripting (XSS)**: Automatic script-tag neutralization via regex stripping and sanitization middleware across all incoming request bodies.
* **HTTP Parameter Pollution (HPP)**: Protection against parameter duplication exploits.

### 2. Authentication & Authorization
* **Password Security**: Passwords salted and hashed with `bcryptjs` (work factor 12).
* **Two-Factor Authentication (2FA)**: RFC 6238 TOTP algorithm support with encrypted backup code generation.
* **Role-Based Access Control (RBAC)**: Fine-grained middleware authorization restricting administrative and sensitive financial endpoints.
* **JWT Tokens**: Signed with secure algorithms and short expiration lifetimes.

### 3. Traffic Protection & Security Headers
* **Rate Limiting**: `express-rate-limit` prevents brute-force login attempts (15-minute window) and API DDoS floods.
* **Helmet Security Headers**: Content Security Policy (CSP), X-Frame-Options (`DENY`), X-Content-Type-Options (`nosniff`), and strict transport security headers.

---

## 🚨 Reporting a Vulnerability

If you identify a potential security vulnerability in this project, please report it immediately:
1. Email security disclosure to **security@resourcematcher.org**.
2. Provide a detailed summary, steps to reproduce, and attack surface details.
3. The development team responds to acknowledged disclosures within **24 hours**.
