# 10 — Implementation Plan (Master Plan)
## ระบบรับเรื่องร้องเรียนศูนย์ดำรงธรรมจังหวัดศรีสะเกษ (DCMS)

> **Implementation Plan** — แผนการพัฒนาแบบละเอียด อิงจากเอกสาร Planning ทั้งหมด (01-09)

---

# [Goal Description]
พัฒนาระบบรับเรื่องร้องเรียน DCMS ที่ประกอบด้วย Frontend (React/Vite/MUI) และ Backend (Node.js/Express) พร้อมฐานข้อมูล (MySQL 8) บนสถาปัตยกรรม Docker แบบ Single-container สำหรับการนำไปใช้งานจริง (Production) โดยเน้นระบบรักษาความปลอดภัยและการจัดการสิทธิ์ที่ถูกต้อง

## User Review Required
> [!IMPORTANT]
> - เอกสารนี้จะเป็น Master Plan สำหรับการเริ่มเขียนโค้ด (Phase 2 เป็นต้นไป)
> - กรุณาตรวจสอบให้แน่ใจว่าลำดับการทำงาน (Phases) ตอบโจทย์ความต้องการ
> - หากยืนยันแล้ว AI จะนำแผนนี้ไปสร้างเป็น `task.md` (TODO list) ในระหว่างการพัฒนา

## Open Questions
> [!WARNING]
> - ลำดับการทำ Frontend อยู่หลัง Backend ทั้งหมด ท่านต้องการให้สลับเป็นแบบทำสลับกันหน้า/หลังไปพร้อมกันหรือไม่ (เช่น API เสร็จ ทำหน้าจอนั้นเลย)?
> - ใน Phase 13 (Docker) ท่านต้องการให้เน้นไปที่ Railway ทันที หรือทดสอบ Local On-premise ให้เสถียรก่อน?

---

## 🚀 Phases Breakdown

### Phase 0: Requirement and Architecture
- **เป้าหมาย:** สรุป Requirement, Architecture, Roles, Workflow, และ Database (เสร็จสิ้นแล้ว)
- **งานที่ต้องทำ:** จัดทำเอกสาร Planning 01-09
- **ผลลัพธ์:** ไฟล์ Markdown ทั้งหมดใน `docs/planning/`
- **สถานะ:** ✅ เสร็จสิ้น

### Phase 1: Project Setup
- **เป้าหมาย:** ตั้งค่าโปรเจกต์ โครงสร้างโฟลเดอร์ และ Environment
- **งานที่ต้องทำ:** 
  - สร้างไฟล์ `.env` สำหรับ Development
  - ปรับแต่ง `docker-compose.yml` ให้พร้อมรัน
  - ตั้งค่า Vite config และ Express server เบื้องต้น
- **ผลลัพธ์:** สามารถรัน `docker-compose up` แล้วใช้งาน Frontend (5173), Backend (5001), DB ได้ทันที
- **Acceptance Criteria:** 
  - [x] เข้า http://localhost:5173 แล้วหน้าเว็บโหลดขึ้น (ทดสอบสำเร็จ)
  - [x] ไฟล์ `.env` และ `.env.example` มีค่า Environment ของระบบใหม่ครบถ้วน
  - [x] `docker-compose.yml` มี MySQL และ phpMyAdmin
- **Git Commit:** `chore: initial project setup and docker compose`
- **สถานะ:** ✅ เสร็จสิ้น (Phase 1 Completed)

### Phase 2: Database Schema and Seed Data
- **เป้าหมาย:** สร้างโครงสร้างฐานข้อมูลและข้อมูลตั้งต้น
- **งานที่ต้องทำ:** 
  - สร้างไฟล์ SQL ใน `db/init/` เพื่อ `CREATE TABLE` ตามเอกสาร 05
  - เพิ่ม `INSERT` ข้อมูล Master Data (Roles, Users เริ่มต้น, Agencies, Categories)
- **ผลลัพธ์:** Database พร้อมใช้งานและมี Super Admin เริ่มต้น
- **วิธีทดสอบ:** เข้า phpMyAdmin แล้วเห็นตารางครบถ้วน
- **Git Commit:** `feat(db): create database schema and seed data`

### Phase 3: Backend Core and MySQL Connection
- **เป้าหมาย:** ตั้งค่า Backend ให้เชื่อมต่อ MySQL สำเร็จ
- **งานที่ต้องทำ:** 
  - ติดตั้ง `mysql2`
  - สร้าง Service สำหรับ Database Connection Pool
  - เขียน Middleware พื้นฐาน (CORS, Error Handler)
- **ผลลัพธ์:** API `/api/health` คืนค่า "OK" พร้อมสถานะ DB Connection
- **Git Commit:** `feat(backend): setup mysql connection pool and core middlewares`

### Phase 4: Authentication and Authorization
- **เป้าหมาย:** ทำระบบ Login และแบ่งสิทธิ์ (RBAC)
- **งานที่ต้องทำ:** 
  - สร้าง Auth Controller (`login`, `me`)
  - ติดตั้ง `jsonwebtoken`, `bcrypt`
  - สร้าง Middleware `requireAuth`, `requireRole`
- **วิธีทดสอบ:** ใช้ Postman ยิง Login และนำ Token ไปใช้กับ API อื่น
- **Git Commit:** `feat(auth): implement jwt authentication and rbac middleware`

### Phase 5: Complaint CRUD API
- **เป้าหมาย:** สร้าง API สำหรับรับเรื่องและจัดการข้อมูลเรื่องร้องเรียนเบื้องต้น
- **งานที่ต้องทำ:** 
  - API ยื่นเรื่องออนไลน์ (Public)
  - API เพิ่ม/แก้ไขเรื่องสำหรับเจ้าหน้าที่
  - API อัปโหลดไฟล์ (Attachments) - เบื้องต้นเก็บใน Local FS
- **Git Commit:** `feat(api): implement complaints crud and file upload`

### Phase 6: Assignment and Status Workflow API
- **เป้าหมาย:** สร้าง API สำหรับการเปลี่ยนสถานะ ส่งต่อ และแจ้งเตือน
- **งานที่ต้องทำ:** 
  - API `forward`, `acknowledge`, `reject`
  - API บันทึก `Progress Notes`
  - บันทึกประวัติลง `complaint_status_history`
- **วิธีทดสอบ:** ทดสอบ Flow ตั้งแต่รับเรื่องไปจนถึงปิดเรื่องด้วย Postman
- **Git Commit:** `feat(api): implement complaint workflow and status history`

### Phase 7: Dashboard and Report API
- **เป้าหมาย:** สร้าง API สรุปข้อมูลสำหรับผู้บริหาร
- **งานที่ต้องทำ:** 
  - API ดึงสถิติ Dashboard (`stats`, `agency`, `overdue`)
  - API Export CSV
- **Acceptance Criteria:**
  - [x] `GET /api/dashboard/stats` คืนค่า total, new_today, in_progress, overdue
  - [x] `GET /api/dashboard/by-agency` คืนสถิติแยกตามหน่วยงาน
  - [x] `GET /api/dashboard/by-category` คืนสถิติแยกตามประเภท
  - [x] `GET /api/dashboard/by-district` คืนสถิติแยกตามอำเภอ
  - [x] `GET /api/dashboard/overdue` คืนรายการเกินกำหนดพร้อม days_overdue
  - [x] `GET /api/reports/export` ดาวน์โหลดไฟล์ CSV พร้อม BOM (Excel อ่านภาษาไทยได้)
- **Git Commit:** `feat(api): implement dashboard stats and report export`
- **สถานะ:** ✅ เสร็จสิ้น (Phase 7 Completed)

### Phase 8: Frontend Layout and Routing
- **เป้าหมาย:** สร้างโครงสร้างหน้าจอ Frontend ตามแบบ 07
- **งานที่ต้องทำ:** 
  - ตั้งค่า React Router DOM
  - สร้าง `PublicLayout` และ `AdminLayout` (มี Sidebar/Topbar)
  - ติดตั้ง MUI Theme
- **Git Commit:** `feat(ui): setup layouts, routing and mui theme`

### Phase 9: Frontend Authentication
- **เป้าหมาย:** นำ API Auth มาเชื่อมกับหน้าจอ
- **งานที่ต้องทำ:** 
  - สร้างหน้า Login
  - สร้าง `AuthContext` เก็บ Token และสิทธิ์
  - สร้าง Protected Routes เพื่อบล็อกคนไม่มีสิทธิ์
- **Git Commit:** `feat(ui): implement login and protected routes`

### Phase 10: Complaint Management UI
- **เป้าหมาย:** สร้างหน้าจอจัดการเรื่องร้องเรียนหลัก
- **งานที่ต้องทำ:** 
  - ฟอร์มยื่นเรื่องออนไลน์
  - DataGrid แสดงรายการเรื่องร้องเรียน (ใช้ MUI DataGrid)
  - หน้ารายละเอียดเรื่อง (Tabs: ข้อมูล, ไฟล์, ประวัติ)
- **Git Commit:** `feat(ui): implement complaint management pages`

### Phase 11: Dashboard and Report UI
- **เป้าหมาย:** สร้างหน้าจอสำหรับผู้บริหาร
- **งานที่ต้องทำ:** 
  - นำข้อมูลจาก API มาแสดงเป็น Charts (ใช้ Recharts หรือ Chart.js)
  - สร้าง Card สรุปข้อมูล
- **Git Commit:** `feat(ui): implement executive dashboard`

### Phase 12: Notification and SLA Alert
- **เป้าหมาย:** แสดงผลการแจ้งเตือนและการตั้งเวลาตรวจสอบ SLA
- **งานที่ต้องทำ:** 
  - Backend: ตั้ง Cron Job สำหรับเช็ค SLA และอัปเดตแจ้งเตือน
  - Frontend: สร้าง Dropdown แจ้งเตือน และระบบ Notification
- **Git Commit:** `feat(system): implement notifications and sla cron jobs`

### Phase 13: Docker Integration
- **เป้าหมาย:** บิ้ว Production Image
- **งานที่ต้องทำ:** 
  - สร้าง Multi-stage `Dockerfile` (ให้ Backend serve `dist` ของ Frontend)
  - ปรับปรุง `docker-compose.prod.yml`
- **วิธีทดสอบ:** รัน Image เดี่ยวแล้วเช็คว่าเข้าเว็บได้และ API ทำงาน
- **Git Commit:** `feat(docker): create production multi-stage dockerfile`

### Phase 14: Testing and Bug Fix
- **เป้าหมาย:** ตรวจสอบความถูกต้องของทั้งระบบ
- **งานที่ต้องทำ:** 
  - รัน End-to-End Test ด้วยผู้ใช้ 5 Roles
  - ตรวจสอบ Edge Cases
- **Git Commit:** `fix: resolve bugs from end-to-end testing`

### Phase 15: Production Deployment Guide
- **เป้าหมาย:** เตรียมระบบขึ้น Production
- **งานที่ต้องทำ:** 
  - ร่างเอกสาร Deploy ขึ้น Railway
  - ยืนยันการตั้งค่า Database และ Volume บน Railway
- **ผลลัพธ์:** ระบบสามารถเข้าใช้งานจากอินเทอร์เน็ตได้จริง
- **Git Commit:** `docs: add production deployment guide`

---

## Verification Plan

### Automated / API Tests
- การทดสอบ API จะทำผ่าน cURL หรือ POSTMAN ในขณะที่พัฒนา Phase 3-7

### Manual Verification
- การทดสอบ UI จะทำผ่าน Browser `http://localhost:5173` ใน Phase 8-12
- การทดสอบ Production Image จะทำผ่าน `http://localhost:5001` หลังบิ้ว Dockerfile ใน Phase 13
