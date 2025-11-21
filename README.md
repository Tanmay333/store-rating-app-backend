# Store Rating App  

## 🚀 Tech Stack
- Node.js + Express  
- PostgreSQL  
- Prisma ORM  
- JWT Authentication  
- Role-based authorization (ADMIN / USER)  
- Modular MVC folder structure  

---

## 📂 Project Structure
```
store-rating-app/
│── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   └── routes/
│   ├── server.js
│   └── package.json
└── README.md
```

---

## 🛠 Setup Guide

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup PostgreSQL Database
Create a database:
```sql
CREATE DATABASE store_rating_db;
```

### 3. Copy environment file
```
cp backend/.env.example backend/.env
```

Edit `.env` with your DB credentials.

---

## 🔧 Prisma Setup
Run migrations:
```bash
npx prisma migrate dev
```

Seed database:
```bash
node prisma/seed.js
```

---

## ▶ Run the Backend
```bash
npm run dev
```
Backend runs at:
```
http://localhost:5000
```

---

# 🔐 Authentication
### Register
`POST /api/auth/register`

### Login
`POST /api/auth/login`

Successful login returns:
- JWT token  
- user details  

---

# 🏬 Store APIs

### Get all stores
`GET /api/stores?page=1&limit=10&search=tech`

### Get store details
`GET /api/stores/:id`

### Create store (ADMIN only)
`POST /api/stores`

JWT bearer token required.

---

# ⭐ Review APIs

### Create or update review
`POST /api/stores/:storeId/reviews`

### Update review
`PUT /api/reviews/:id`

### Delete review
`DELETE /api/reviews/:id`

---

# 🧪 Seeded Test Accounts

### Admin Account
```
email: admin@example.com
password: Admin@123
```

### User Account
```
email: user@example.com
password: User@1234
```

---


