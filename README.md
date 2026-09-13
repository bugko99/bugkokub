# ⚡ DocConverter – ระบบแปลงเอกสาร

ระบบแปลงเอกสารออนไลน์ที่ใช้ Docker Compose พร้อม React + Vite, Node.js + Express (ใช้ In-memory Database ไม่ต้องต่อฐานข้อมูลภายนอก)

## 📦 Services

| Service      | URL                          | Port             |
|-------------|------------------------------|------------------|
| Frontend    | http://localhost:5173         | 5173             |
| Backend API | http://localhost:5001/api     | 5001             |

---

## 🚀 คำสั่ง Docker

### เริ่มต้นครั้งแรก (build + start)
```bash
docker compose up --build
```

### เริ่มต้น (ไม่ build ใหม่)
```bash
docker compose up
```

### เริ่มต้น background (detached)
```bash
docker compose up -d
```

### หยุดทุก service
```bash
docker compose down
```

### Build ใหม่เฉพาะ service
```bash
docker compose build backend
docker compose build frontend
```

### ดู logs
```bash
# ดูทุก service
docker compose logs -f

# เฉพาะ service
docker compose logs -f backend
docker compose logs -f frontend
```

### เข้า container
```bash
docker compose exec backend sh
docker compose exec frontend sh
```

### ดูสถานะ service
```bash
docker compose ps
```

### Restart เฉพาะ service
```bash
docker compose restart backend
```

---

## 📁 Directory Structure

```
bugkokub/
├── docker-compose.yml
├── .env
├── .gitignore
│
├── backend/
│   ├── Dockerfile.dev
│   ├── package.json
│   └── src/
│       ├── index.js             # Entry point
│       ├── config/
│       │   └── db.js            # In-memory mock storage
│       ├── middleware/
│       │   ├── auth.js          # JWT middleware
│       │   ├── upload.js        # Multer middleware
│       │   └── errorHandler.js
│       └── routes/
│           ├── auth.routes.js   # POST /api/auth/login|register
│           └── jobs.routes.js   # CRUD /api/jobs
│
└── frontend/
    ├── Dockerfile.dev
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   └── client.js        # Axios instance
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   └── PrivateRoute.jsx
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            └── DashboardPage.jsx
```

---

## 🔑 Demo Account

| Field    | Value             |
|----------|-------------------|
| Email    | demo@example.com  |
| Password | demo1234          |

---

## 🌐 API Endpoints

| Method | Path                   | Auth | Description              |
|--------|------------------------|------|--------------------------|
| GET    | /api/health            | ❌   | Health check             |
| POST   | /api/auth/register     | ❌   | สมัครสมาชิก              |
| POST   | /api/auth/login        | ❌   | เข้าสู่ระบบ              |
| GET    | /api/jobs              | ✅   | ดูรายการงานทั้งหมด       |
| POST   | /api/jobs              | ✅   | อัปโหลดไฟล์และแปลง      |
| GET    | /api/jobs/:id          | ✅   | ดูสถานะงาน              |
| DELETE | /api/jobs/:id          | ✅   | ลบงาน                   |

---

## ⚙️ Environment Variables (.env)

| Variable              | Description                        |
|-----------------------|------------------------------------|
| `JWT_SECRET`          | Secret key for JWT signing         |
| `VITE_API_URL`        | Frontend → Backend API URL         |

---

## 📝 Notes

- **bind mounts**: source code ถูก mount เข้า container แบบ real-time
- **anonymous volume**: `/app/node_modules` ถูกแยกออกจาก bind mount
- **In-memory Database**: ข้อมูลผู้ใช้และงานจะหายไปเมื่อรีสตาร์ท backend
- **Hot reload**: ทั้ง frontend (Vite HMR) และ backend (nodemon) รองรับ hot reload
