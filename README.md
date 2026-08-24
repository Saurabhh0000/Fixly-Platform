# Fixly Platform 🚀

Fixly is a full-stack service marketplace platform that connects customers with verified local service providers.

The platform enables users to discover services, book professionals, track service progress, receive notifications, and manage their service experience through a modern web application — with an AI-powered assistant guiding them through it all.

Fixly provides a complete ecosystem with three roles:

- 👤 User
- 🛠 Service Provider
- 🛡 Admin

---

# 📌 Project Overview

Fixly solves the problem of finding reliable local service professionals by providing:

- Service discovery
- Provider verification
- Online booking management
- OTP-based service completion
- Reviews and ratings
- Real-time notification system
- Role-based dashboards
- An in-app AI assistant for guided help across every role

---

# 🏗 Project Architecture

Fixly follows a monorepo structure:

```
Fixly
│
├── backend
│   └── Spring Boot REST API
│
├── frontend
│   └── React + Vite Application
│
└── screenshots
    └── Application Screenshots
```

---

# ✨ Features

## 👤 User Features

- User registration and login
- HTTP Basic Authentication
- Browse service categories
- Search service providers
- View provider details
- Add multiple addresses
- Book services
- Track booking status
- Receive booking notifications
- OTP based service verification
- Rate and review providers
- Manage profile
- Change password
- Notification center
- Ask the Fixly Assistant about bookings, services, or account help

---

# 🛠 Service Provider Features

- Provider registration
- Upload verification documents
- Admin approval workflow
- Provider dashboard
- Manage availability
- Receive booking requests
- Accept or reject bookings
- View customer details after acceptance
- Complete services using OTP verification
- View customer reviews
- Manage profile
- Ask the Fixly Assistant about booking requests, verification status, OTP, or availability

---

# 🛡 Admin Features

- Admin dashboard
- Manage users
- Manage service providers
- Verify provider applications
- Approve providers
- Reject provider applications
- Suspend providers
- Manage service categories
- Monitor platform activity

---

# 🤖 Fixly Assistant (AI Chatbot)

Fixly includes a role-aware in-app assistant available on the Home page, User Dashboard, and Provider Dashboard.

- **Public on the Home page** — visitors can ask general questions (what Fixly is, how booking works, how to become a provider) without logging in.
- **Role-aware once logged in** — the same assistant answers differently for a Customer vs. a Provider, and always resolves the real identity and role server-side from Spring Security, never from anything the frontend sends.
- **Backed by real account data** — logged-in users get answers grounded in their actual bookings, provider status, ratings, and notifications rather than generic text.
- **Graceful for private questions when logged out** — asking about "my bookings" as a guest returns a clear login prompt instead of an error.
- **Quick questions** — a curated set of role-specific quick-reply prompts (e.g. _"Where is my booking?"_ for customers, _"How do I accept a booking?"_ for providers).
- **Never invents data** — pricing, availability, provider details, and booking status are only stated when they come from the database; the assistant says so explicitly when it can't verify something (e.g. payment status).

### Assistant API

```
POST /api/chat
```

Public endpoint — works for guests and authenticated users alike.

**Request**

```json
{
  "message": "Where is my booking?",
  "lastIntent": null
}
```

**Response**

```json
{
  "text": "Your most recent booking is currently ACCEPTED...",
  "action": {
    "label": "View My Bookings",
    "to": "/user/bookings"
  },
  "suggestions": [],
  "intent": "USER_BOOKING_STATUS",
  "requiresFollowUp": false
}
```

---

# 🔔 Notification System

Fixly includes an in-app notification system.

Users receive notifications for:

- New bookings
- Booking acceptance
- Booking cancellation
- Service completion
- Provider approval
- Provider rejection
- Account updates
- New reviews
- Address updates

Features:

- Notification dropdown
- Notification center page
- Read/unread tracking
- Notification filtering
- Pagination

---

# 📧 Email Notification System

Fixly supports email communication for important events:

Examples:

- Welcome emails
- Booking confirmation
- Provider approval
- Password changes
- Service updates

(Email service powered by Spring Boot Mail)

---

# ⚙️ Tech Stack

## Backend

- Java 17
- Spring Boot
- Spring Security (HTTP Basic Authentication)
- Spring Data JPA
- Hibernate
- REST APIs
- PostgreSQL (Supabase)
- Maven

## Frontend

- React JS
- Vite
- JavaScript ES6+
- HTML5
- CSS3
- Axios
- React Router
- React Icons

## Tools

- Git
- GitHub
- Postman
- Swagger UI
- VS Code

---

# 🔐 Security

Fixly implements:

- HTTP Basic Authentication
- Role Based Authorization

Roles:

```
USER
PROVIDER
ADMIN
```

Protected routes are secured using Spring Security. The authenticated user's identity and role are always resolved server-side from the security context — never trusted from request bodies — for both standard API routes and the Fixly Assistant endpoint.

---

# 🚀 Installation & Setup

## Prerequisites

Install:

- Java 17+
- Node.js 18+
- PostgreSQL
- Maven

---

# Backend Setup

Clone repository:

```bash
git clone https://github.com/Saurabhh0000/Fixly-Platform.git
```

Navigate:

```bash
cd Fixly-Platform/backend
```

Build project:

```bash
mvn clean install
```

Run application:

```bash
mvn spring-boot:run
```

Backend URL:

```
http://localhost:8080
```

---

# Frontend Setup

Navigate:

```bash
cd Fixly-Platform/frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Frontend URL:

```
http://localhost:5173
```

---

# 📘 API Documentation

Fixly uses Swagger OpenAPI documentation.

After running backend:

```
http://localhost:8080/swagger-ui/index.html
```

Swagger provides:

- API testing
- Request/Response documentation
- Endpoint details

---

# 🔗 API Overview

## Authentication

```
POST /api/auth/register

POST /api/auth/login

GET /api/auth/me
```

## Users

```
GET /api/users/{id}

PUT /api/users/{id}

PUT /api/users/change-password
```

## Providers

```
POST /api/providers/register

GET /api/providers/search

GET /api/providers/{id}

PUT /api/providers/status
```

## Bookings

```
POST /api/bookings

GET /api/bookings/user

GET /api/bookings/provider

PUT /api/bookings/{id}/accept

PUT /api/bookings/{id}/complete
```

## Reviews

```
POST /api/reviews

GET /api/reviews/provider/{id}
```

## Notifications

```
GET /api/notifications

GET /api/notifications/count

PUT /api/notifications/{id}/read

PUT /api/notifications/read-all
```

## Fixly Assistant

```
POST /api/chat
```

Public endpoint; see the [Fixly Assistant](#-fixly-assistant-ai-chatbot) section above for the request/response contract.

---

# 🌍 Deployment

Frontend:

```
Netlify
```

Backend:

```
Render
```

Database:

```
PostgreSQL (Supabase)
```

---

# 📸 Screenshots

## Home Page

![Home](screenshots/HomePage-1.png)

## Login

![Login](screenshots/LoginPage.png)

## User Dashboard

![Dashboard](screenshots/UserDashboard.png)

## Provider Dashboard

![Provider](screenshots/ProviderDashboard-1.png)

## Admin Dashboard

![Admin](screenshots/AdminDashboard.png)

## Notification Center

![Notifications](screenshots/NotificationPage.png)

## Swagger Documentation

![Swagger](screenshots/Swagger-API-1.png)

---

# 🔒 Environment Variables

Create environment files:

Backend:

```
application.properties
```

Frontend:

```
.env
```

Example:

```
DATABASE_URL=
DATABASE_USERNAME=
DATABASE_PASSWORD=
VITE_API_BASE_URL=
```

⚠️ Never commit environment files.

---

# 🤝 Contribution

1. Fork repository

2. Create branch

```
git checkout -b feature/new-feature
```

3. Commit changes

```
git commit -m "Added new feature"
```

4. Push branch

```
git push origin feature/new-feature
```

5. Create Pull Request

---

# 📜 License

This project is proprietary software.

© Fixly Platform

---

# 👨‍💻 Developer

**Saurabh Kumar**

Full Stack Developer

GitHub:
https://github.com/Saurabhh0000

Portfolio:
https://saurabh-kumar-dev.netlify.app

---

Built with ❤️ using Spring Boot + React
