# 09 — Project Structure & Docker Architecture
## ระบบรับเรื่องร้องเรียนศูนย์ดำรงธรรมจังหวัดศรีสะเกษ (DCMS)

> **Planning Only** — โครงสร้าง Project และสถาปัตยกรรม Docker สำหรับ Development และ Production

---

## 1. Project Folder Structure (โครงสร้างโปรเจกต์)

เพื่อให้การจัดการโค้ดง่ายต่อการดูแล ทั้ง Frontend และ Backend จะรวมอยู่ใน Repository เดียวกัน (Monorepo-style) โดยมีโครงสร้างดังนี้:

```text
/ (Project Root)
├── .agents/                    # สำหรับเก็บทักษะและคู่มือของ AI (เช่น SKILL.md)
├── docs/                       # เอกสาร Planning, Testing, Deployment ทั้งหมด
├── db/
│   └── init/                   # สคริปต์ SQL สำหรับสร้างตาราง (Mount เข้า /docker-entrypoint-initdb.d)
├── frontend/                   # React 18 + Vite 5 + MUI 5
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   ├── pages/              # Page Components (อิงตาม 07-frontend-pages.md)
│   │   ├── services/           # ฟังก์ชันสำหรับยิง API (Axios/Fetch)
│   │   ├── contexts/           # React Context (เช่น AuthContext, ThemeContext)
│   │   └── utils/              # Helper functions
│   ├── package.json
│   └── vite.config.js
├── backend/                    # Node.js 20 LTS + Express 4
│   ├── src/
│   │   ├── controllers/        # จัดการ Request/Response
│   │   ├── routes/             # กำหนด Endpoint Paths
│   │   ├── models/             # Database Queries/Models
│   │   ├── middlewares/        # Auth, Error Handler, Upload
│   │   ├── utils/              # Helpers
│   │   └── server.js           # Entry point ของ Backend (Start server)
│   ├── uploads/                # โฟลเดอร์เก็บไฟล์แนบชั่วคราว/ถาวร
│   └── package.json
├── nginx/
│   └── default.conf            # Nginx config สำหรับ On-premise Production
├── docker-compose.yml          # สำหรับ Development Environment
├── docker-compose.prod.yml     # สำหรับ On-premise Production Environment
├── Dockerfile                  # Multi-stage Dockerfile สำหรับ Production (ทั้ง Railway และ On-prem)
├── railway.toml                # Configuration สำหรับ Railway Deployment
├── .env                        # Environment Variables (ไม่ push ขึ้น Git)
├── .env.example                # ตัวอย่าง Environment Variables
└── README.md                   # คู่มือเริ่มต้นโปรเจกต์
```

---

## 2. Docker Architecture

### 2.1 Development Environment (ผ่าน `docker-compose.yml`)
ออกแบบมาเพื่อให้ Developer แก้ไขโค้ดได้แบบ Hot-reload และมีเครื่องมือช่วยจัดการฐานข้อมูล

- **Services:**
  1. `frontend`: รันด้วย `npm run dev` (Vite HMR)
  2. `backend`: รันด้วย `nodemon` หรือ `npm run dev` เพื่อ Restart เมื่อแก้โค้ด
  3. `db`: MySQL 8
  4. `phpmyadmin`: GUI สำหรับจัดการ Database

- **Ports Mapping (Host ➡️ Container):**
  - Frontend: `5173` ➡️ `5173`
  - Backend: `5001` ➡️ `5001`
  - MySQL: `3307` ➡️ `3306` (หลีกเลี่ยงพอร์ต 3306 ชนกับ Host)
  - phpMyAdmin: `8081` ➡️ `80`

- **Volumes:**
  - `mysql_data`: ผูกกับ `/var/lib/mysql` ของ service `db` เพื่อไม่ให้ข้อมูลหายเมื่อปิด Container
  - Bind mounts สำหรับ `frontend` และ `backend` เพื่อให้รองรับ Hot-reload

### 2.2 Production Environment

การ Deploy Production รองรับ 2 เป้าหมายจาก **Image เดียวกัน (ที่สร้างจาก Dockerfile ที่ Root)**:

**สถาปัตยกรรม Multi-stage Dockerfile (Single-container):**
- **Stage 1 (Build Frontend):** ติดตั้ง Dependencies และรัน `npm run build` ของ Vite 
- **Stage 2 (Production):** Copy โฟลเดอร์ `dist` จาก Stage 1 มาไว้ในโฟลเดอร์ `backend/public`
- **Result:** Backend Node.js จะทำหน้าที่ 2 อย่างคือ:
  1. ให้บริการ API ผ่าน `/api/*`
  2. ให้บริการไฟล์ Frontend (Static Files) ผ่าน `/` (Serve static files จาก `./public`)

**Target A: Railway (Cloud PaaS)**
- ใช้ `Dockerfile` และ `railway.toml`
- Railway จัดการเรื่อง Domain, SSL, และ Network routing ให้อัตโนมัติ
- รันบน Container เดียว ไม่ต้องใช้ Nginx แยก
- ฐานข้อมูลใช้ MySQL Managed Service ของ Railway แยกต่างหาก (หรือ Add-on)

**Target B: On-premise (Local Server / VM)**
- ใช้ `docker-compose.prod.yml` ร่วมกับ `nginx/default.conf`
- **Services:**
  1. `app`: รัน Image ที่ Build จาก Dockerfile (รวม Frontend+Backend)
  2. `db`: MySQL 8 (มี Volume หุ้มข้อมูล)
  3. `proxy`: Nginx ทำหน้าที่เป็น Reverse Proxy รับ Port 80/443 แล้วส่งทราฟฟิกเข้าไปที่ `app:5001`

---

## 3. Networks ระหว่าง Containers

- ใน Docker Compose ทุก Service ให้อยู่ใน Bridge Network เดียวกัน (เช่น `dcms_network`)
- **สำคัญ:** Backend ต้องเชื่อมต่อ MySQL โดยใช้ **Service Name** เป็น Hostname ไม่ใช่ `localhost` (เช่น `DB_HOST=db`)
- **สำคัญ:** Frontend ตอน Dev (`docker-compose.yml`) จะเรียก API ผ่าน `http://localhost:5001/api/...`
- **สำคัญ:** Frontend ตอน Prod จะเรียก API ผ่าน `/api/...` (Relative path) เพราะถูกเสิร์ฟจาก Backend โดเมนเดียวกัน

---

## 4. Environment Variables ที่จำเป็น (`.env`)

ต้องมีตัวแปรที่ครอบคลุมการทำงานทั้ง 2 ฝั่ง โดยวางไว้ที่ Root `.env`:

```env
# Backend & DB Settings
PORT=5001
NODE_ENV=development

DB_HOST=db               # สำหรับ Docker (ถ้าเปิด Local นอก Docker ใช้ localhost)
DB_PORT=3306
DB_USER=root
DB_PASSWORD=secret
DB_NAME=dcms_db

# Authentication
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=24h

# Frontend Settings (ใช้ Vite ต้องขึ้นต้นด้วย VITE_)
VITE_API_BASE_URL=http://localhost:5001
```

---

## 5. ข้อควรระวังและการจัดการเฉพาะกรณี (Caveats & Considerations)

### 5.1 CORS (Cross-Origin Resource Sharing)
- **Dev:** Backend ต้องตั้งค่า `cors` middleware ให้รับ Request จาก `http://localhost:5173` เพื่อให้ Vite ใช้งานได้
- **Prod:** เนื่องจากเสิร์ฟจาก Origin เดียวกัน (Single-container) ปัญหา CORS จะน้อยลงมาก แต่ก็ควรตั้งค่าให้รับเฉพาะ Domain ของระบบเท่านั้น

### 5.2 การอัปโหลดไฟล์ (File Uploads)
- **ปัญหา Ephemeral Filesystem บน Railway:** หากใช้ Railway ตัว Container จะถูก Reset ใหม่ทุกครั้งที่ Deploy ไฟล์แนบต่างๆ ที่อัปโหลดไว้ในโฟลเดอร์ `backend/uploads` จะหายไปทั้งหมด
- **วิธีแก้เบื้องต้น (MVP):** 
  - หากใช้ Railway ให้สร้าง Persistent Volume ไปแปะที่ `/app/backend/uploads`
  - หากใช้ On-premise ให้ Map Volume จาก Host ไปที่ Container
- **วิธีแก้ระยะยาว:** ควรเปลี่ยนไปอัปโหลดขึ้น Object Storage (เช่น AWS S3, Cloudflare R2, หรือ MinIO)

### 5.3 Database Connection & Init
- สคริปต์สร้างตารางและ Insert ข้อมูลพื้นฐาน (Master Data) ต้องอยู่ใน `db/init/` และต้องเป็น `.sql`
- เมื่อ `db` Container ถูก Start ครั้งแรก มันจะรันไฟล์ SQL ในนั้นอัตโนมัติ (ผ่าน `/docker-entrypoint-initdb.d`)
- Backend ควรใส่ Logic การเช็ค Database Connection ตอน Start (`server.js`) ว่า MySQL พร้อมหรือยัง (เพราะ MySQL มักจะ Start ช้ากว่า Node.js)
