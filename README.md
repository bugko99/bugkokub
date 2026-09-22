# ⚡ DCMS – ระบบรับเรื่องร้องเรียนศูนย์ดำรงธรรมจังหวัดศรีสะเกษ
(Damrongdham Center Management System)

> **สถานะการพัฒนา:** `กำลังพัฒนา` (Phase 1: Project Setup - เสร็จสิ้น)

ระบบรับเรื่องร้องเรียนออนไลน์ที่พัฒนาด้วย React + Vite, Node.js + Express และ MySQL 8 (ใช้ Docker Compose สำหรับ Development)

## 📦 Services (Development Environment)

| Service      | URL                          | Port             | หน้าที่ |
|-------------|------------------------------|------------------|---|
| Frontend    | http://localhost:5173         | 5173             | หน้าจอ Web UI |
| Backend API | http://localhost:5001/api     | 5001             | เซิร์ฟเวอร์ API |
| Database    | -                             | 3307 (Host)      | MySQL 8 Database |
| phpMyAdmin  | http://localhost:8081         | 8081             | จัดการ Database ผ่านเว็บ |

---

## 🚀 คำสั่ง Docker

### เริ่มต้นระบบ (build + start background)
```bash
docker compose up -d --build
```

### เริ่มต้น (ไม่ build ใหม่)
```bash
docker compose up -d
```

### หยุดทุก service
```bash
docker compose down
```

### ดู logs
```bash
# ดูทุก service
docker compose logs -f

# เฉพาะ service
docker compose logs -f backend
docker compose logs -f frontend
```

---

## 📁 Directory Structure (Phase 1)

```text
bugkokub/
├── docker-compose.yml
├── .env
├── .env.example
├── docs/                      # เอกสาร Planning & Architecture
├── db/
│   └── init/                  # โฟลเดอร์สำหรับ SQL Scripts (Phase 2)
├── backend/
│   ├── Dockerfile.dev
│   ├── package.json
│   └── src/
│       └── server.js          # Entry point
└── frontend/
    ├── Dockerfile.dev
    ├── package.json
    ├── vite.config.js
    └── src/
```

---

## ⚙️ Environment Variables (.env)

ไฟล์ `.env` ต้องสร้างไว้ที่ Root folder (ใช้ `.env.example` เป็นต้นแบบ)

| Variable              | Description                        |
|-----------------------|------------------------------------|
| `JWT_SECRET`          | Secret key สำหรับ Sign JWT         |
| `VITE_API_URL`        | URL สำหรับเชื่อมต่อ Backend API       |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | ข้อมูลเชื่อมต่อ MySQL |

---

## 📝 Roadmap & Phases
*อ้างอิงจาก `docs/planning/10-implementation-plan.md`*

- ✅ **Phase 0:** Requirement and Architecture
- ✅ **Phase 1:** Project Setup
- ⏳ **Phase 2:** Database Schema and Seed Data
- ⏳ **Phase 3:** Backend Core and MySQL Connection
- ⏳ **Phase ...**
