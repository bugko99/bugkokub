# 11 — Testing Plan
## ระบบรับเรื่องร้องเรียนศูนย์ดำรงธรรมจังหวัดศรีสะเกษ (DCMS)

> อ้างอิงจากเอกสาร: `02-requirements.md`, `03-roles-permissions.md`, `04-complaint-workflow.md`, `06-api-contract.md`, `07-frontend-pages.md`, `10-implementation-plan.md`

---

## 1. Testing Objectives (เป้าหมายการทดสอบ)

1. ตรวจสอบว่าทุก Functional Requirement (FR-01 ถึง FR-10) ทำงานได้ถูกต้อง
2. ยืนยัน Role-based Access Control (RBAC) ทำงานถูกต้องทุก Role (6 Roles)
3. ตรวจสอบ Complaint Workflow ทุก Status Transition
4. ทดสอบ API ทุก Endpoint ทั้ง Success และ Error cases
5. ตรวจสอบ Database Integrity และ Data Persistence
6. ทดสอบ Docker Integration ทั้ง Dev และ Prod
7. ตรวจสอบความปลอดภัยเบื้องต้น (Security Baseline)
8. ยืนยัน Non-functional Requirements (Performance, Thai Language, Responsive)

---

## 2. Scope of Testing (ขอบเขต)

| หมวด | อยู่ใน Scope | นอก Scope |
|---|---|---|
| **Functional** | Auth, CRUD, Workflow, Dashboard, Reports | Email/SMS Notification จริง |
| **API** | ทุก Endpoint ตาม 06-api-contract.md | Third-party Integrations |
| **UI** | React Pages ทุกหน้าตาม 07-frontend-pages.md | Mobile App |
| **Database** | Schema, CRUD, Constraints, Seed Data | DB Performance Tuning |
| **Security** | Auth, RBAC, Input Validation, CORS | Penetration Testing เชิงลึก |
| **Docker** | Dev Compose, Prod Image | Kubernetes / Cloud Orchestration |

---

## 3. Test Environment (สภาพแวดล้อมทดสอบ)

| Environment | ใช้สำหรับ | วิธีเข้าถึง |
|---|---|---|
| **Local Dev** | Unit, Functional, API Tests | `docker-compose up -d` |
| **Frontend** | UI Tests | `http://localhost:5173` |
| **Backend API** | API Tests (Postman/cURL) | `http://localhost:5001` |
| **MySQL** | Database Tests | `http://localhost:8081` (phpMyAdmin) |
| **Production (Staging)** | Integration, E2E, Docker | Railway URL |

**เครื่องมือที่ใช้:**
- **API Testing:** Postman หรือ cURL
- **Browser Testing:** Chrome (Primary), Firefox (Secondary)
- **DB Management:** phpMyAdmin (Dev), MySQL Workbench (Optional)
- **Log Monitoring:** `docker-compose logs -f backend`

---

## 4. Test Data (ข้อมูลทดสอบ)

### 4.1 Seed Users สำหรับทดสอบ

| Username | Password | Role | วัตถุประสงค์ |
|---|---|---|---|
| `admin` | `admin123` | super_admin | ทดสอบการจัดการระบบ |
| `supervisor1` | `Super@123` | supervisor | ทดสอบการปิดเรื่อง |
| `officer1` | `Officer@123` | officer | ทดสอบการรับเรื่องและส่งต่อ |
| `agency1` | `Agency@123` | agency_officer | ทดสอบการรับและดำเนินการ |
| `exec1` | `Exec@123` | executive | ทดสอบ View-only Dashboard |

### 4.2 Seed Complaints สำหรับทดสอบ

| รหัส | สถานะ | วัตถุประสงค์ |
|---|---|---|
| DCMS-2024-000001 | PENDING | ทดสอบ Flow รับเรื่องใหม่ |
| DCMS-2024-000002 | FORWARDED | ทดสอบ Agency Acknowledge/Reject |
| DCMS-2024-000003 | IN_PROGRESS | ทดสอบบันทึกความคืบหน้า |
| DCMS-2024-000004 | RESOLVED | ทดสอบการปิดเรื่องโดย Supervisor |
| DCMS-2024-000005 | CLOSED | ทดสอบว่าเรื่องปิดแล้วแก้ไขไม่ได้ (BR-03) |
| DCMS-2024-000099 | IN_PROGRESS | เรื่องที่ due_date เกินกำหนด (ทดสอบ Overdue) |

---

## 5. Functional Test Cases (การทดสอบ Functional)

### Module: Auth (Authentication)

| TC-ID | Module | Scenario | Preconditions | Test Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|:---:|---|
| TC-AUTH-001 | Auth | Login สำเร็จด้วย Username | มี User ใน DB | 1. เปิด /login 2. กรอก username=officer1, password=Officer@123 3. กด Login | ได้รับ JWT Token, Redirect ไปหน้า Dashboard | P1 | ⬜ |
| TC-AUTH-002 | Auth | Login ด้วย Email แทน Username | มี User ใน DB | 1. กรอก Email ของ User แทน Username | Login สำเร็จเช่นกัน | P2 | ⬜ |
| TC-AUTH-003 | Auth | Login ด้วยรหัสผ่านผิด | มี User ใน DB | 1. กรอก username=officer1, password=wrongpass | Error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" | P1 | ⬜ |
| TC-AUTH-004 | Auth | Login ด้วย User ที่ไม่มีในระบบ | - | 1. กรอก username=notexist | Error message ชัดเจน | P1 | ⬜ |
| TC-AUTH-005 | Auth | Logout สำเร็จ | Login อยู่ | 1. กดปุ่ม Logout | ล้าง Token, Redirect ไป /login | P1 | ⬜ |
| TC-AUTH-006 | Auth | Token หมดอายุ | Login อยู่ | 1. ปรับ Token ให้หมดอาย 2. เรียก API | ได้รับ 401, Redirect ไป /login | P1 | ⬜ |
| TC-AUTH-007 | Auth | เข้า Protected Route โดยไม่ Login | ไม่ได้ Login | 1. เปิด /admin/dashboard โดยตรง | Redirect ไป /login ทันที | P1 | ⬜ |

---

## 6. API Test Cases

### Module: Complaints API

| TC-ID | Module | Scenario | Preconditions | Test Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|:---:|---|
| TC-API-001 | Complaints | POST /api/complaints/public สำเร็จ | Server รัน | POST {title, description, category_id, complainant_data} | Status 201, ได้รับ complaint_code และ tracking_code | P1 | ⬜ |
| TC-API-002 | Complaints | POST /api/complaints/public ไม่ใส่ title | - | POST body ไม่มี title | Status 400, Error validation | P1 | ⬜ |
| TC-API-003 | Complaints | GET /api/complaints แบบไม่มี Token | - | GET โดยไม่ส่ง Authorization header | Status 401 Unauthorized | P1 | ⬜ |
| TC-API-004 | Complaints | GET /api/complaints ในฐานะ Officer | Login เป็น officer1 | GET พร้อม Token | Status 200, รายการเรื่องร้องเรียน | P1 | ⬜ |
| TC-API-005 | Complaints | GET /api/complaints ในฐานะ Agency | Login เป็น agency1 | GET พร้อม Token | Status 200, เห็นเฉพาะเรื่องของหน่วยงานตนเอง | P1 | ⬜ |
| TC-API-006 | Complaints | GET /api/complaints/track ตรวจสอบสถานะ | มีเรื่องในระบบ | GET ?complaint_code=X&tracking_code=Y | Status 200, แสดง status history | P1 | ⬜ |
| TC-API-007 | Complaints | PUT /api/complaints/:id แก้ไขเรื่อง | มีเรื่อง PENDING | PUT ด้วย Token ของ officer1 | Status 200, ข้อมูลอัปเดต | P1 | ⬜ |
| TC-API-008 | Complaints | PUT /api/complaints/:id ที่ CLOSED | มีเรื่อง CLOSED | PUT ด้วย Token | Status 400/403, ไม่สามารถแก้ไขได้ (BR-03) | P1 | ⬜ |
| TC-API-009 | Complaints | POST /api/complaints/:id/forward | Login เป็น officer1, มีเรื่อง IN_REVIEW | POST {to_agency_id, note} | Status 200, สถานะเปลี่ยนเป็น FORWARDED | P1 | ⬜ |
| TC-API-010 | Complaints | POST /api/complaints/:id/acknowledge | Login เป็น agency1, มีเรื่อง FORWARDED | POST acknowledge | Status 200, สถานะเปลี่ยนเป็น IN_PROGRESS | P1 | ⬜ |
| TC-API-011 | Complaints | PATCH /api/complaints/:id/status ปิดเรื่อง | Login เป็น supervisor1 | PATCH {new_status: CLOSED, reason} | Status 200, สถานะเปลี่ยนเป็น CLOSED | P1 | ⬜ |
| TC-API-012 | Complaints | PATCH ปิดเรื่องโดย Officer | Login เป็น officer1 | PATCH {new_status: CLOSED} | Status 403 Forbidden (ไม่มีสิทธิ์) | P1 | ⬜ |

### Module: Dashboard API

| TC-ID | Module | Scenario | Preconditions | Test Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|:---:|---|
| TC-API-020 | Dashboard | GET /api/dashboard/stats สำเร็จ | มีข้อมูลใน DB | GET พร้อม Token | JSON: total, new_today, in_progress, overdue | P1 | ⬜ |
| TC-API-021 | Dashboard | GET /api/dashboard/stats ไม่มี Token | - | GET โดยไม่ส่ง Token | Status 401 | P1 | ⬜ |
| TC-API-022 | Dashboard | GET /api/dashboard/overdue | มีเรื่อง Overdue | GET พร้อม Token | รายการเรื่อง + days_overdue | P1 | ⬜ |
| TC-API-023 | Dashboard | GET /api/reports/export CSV | มีข้อมูล | GET /api/reports/export | ดาวน์โหลดไฟล์ CSV พร้อม BOM | P2 | ⬜ |
| TC-API-024 | Dashboard | ตัวเลข new_today ถูกต้อง | มีเรื่องที่สร้างวันนี้ | GET /api/dashboard/stats | new_today ตรงกับจำนวนจริงของวันนี้ | P1 | ⬜ |

---

## 7. Authentication & Authorization Test Cases

| TC-ID | Module | Scenario | Role ที่ทดสอบ | Test Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|:---:|---|
| TC-SEC-001 | Auth | JWT ไม่มี try/catch | - | ส่ง Token ที่ Tampered (แก้ Payload) | Status 401 ไม่ Crash Server | P1 | ⬜ |
| TC-SEC-002 | Auth | Token payload มี role field | officer1 | Decode JWT หลัง Login | payload มี id, username, role | P1 | ⬜ |
| TC-SEC-003 | Auth | API ทุก endpoint ที่ต้อง Auth | ทุก Role | เรียก API โดยไม่มี Token | ทุก API คืน 401 (ไม่มีการ Bypass) | P1 | ⬜ |

---

## 8. Role-based Access Test Cases (RBAC)

| TC-ID | Feature | Super Admin | Supervisor | Officer | Agency | Executive | Citizen |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| TC-RBAC-001 | ยื่นเรื่องออนไลน์ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| TC-RBAC-002 | ดูรายการเรื่องทั้งหมด | ✅ | ✅ | ✅ | Own Only | ✅ | ❌ |
| TC-RBAC-003 | แก้ไขเรื่องร้องเรียน | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| TC-RBAC-004 | ส่งต่อเรื่อง (Forward) | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| TC-RBAC-005 | กดรับเรื่อง (Acknowledge) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| TC-RBAC-006 | ปิดเรื่อง (Close/Cancel) | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| TC-RBAC-007 | ดู Dashboard/รายงาน | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| TC-RBAC-008 | จัดการ Users | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| TC-RBAC-009 | ดู Audit Log | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| TC-RBAC-010 | เห็น Internal Notes | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

*วิธีทดสอบ: Login แต่ละ Role → เรียก API/เปิดหน้าที่ไม่มีสิทธิ์ → ต้องได้รับ 403 หรือไม่เห็นเมนูนั้น*

---

## 9. Database Test Cases

| TC-ID | Module | Scenario | Test Steps | Expected Result | Priority | Status |
|---|---|---|---|---|:---:|---|
| TC-DB-001 | Schema | ตารางทั้งหมดถูกสร้างอย่างถูกต้อง | เข้า phpMyAdmin ตรวจสอบ | เห็นตารางครบ: users, agencies, complaints, complainants, etc. | P1 | ⬜ |
| TC-DB-002 | Seed Data | Master Data พร้อมใช้ | SELECT * FROM roles; SELECT * FROM agencies; | มีข้อมูล Roles และ Agencies เริ่มต้น | P1 | ⬜ |
| TC-DB-003 | Integrity | สร้าง Complaint แล้วมี FK ถูกต้อง | INSERT complaint → ตรวจ complainants.complaint_id | FK ชี้ถูกต้อง ไม่มี Orphan Record | P1 | ⬜ |
| TC-DB-004 | Encoding | บันทึกภาษาไทย | INSERT ข้อความไทย → SELECT กลับมา | ได้ภาษาไทยครบถ้วน ไม่มีอักขระเสีย (utf8mb4) | P1 | ⬜ |
| TC-DB-005 | History | เปลี่ยนสถานะแล้วบันทึก History | เปลี่ยนสถานะ → SELECT complaint_status_history | มี Record ใน History ถูกต้อง | P1 | ⬜ |
| TC-DB-006 | Soft Delete | ลบเรื่อง (Soft) | ลบเรื่อง → SELECT รวม deleted_at | มี deleted_at ไม่ใช่ NULL, ไม่หายจาก DB | P2 | ⬜ |
| TC-DB-007 | Persistence | ข้อมูลคงอยู่หลัง Restart | บันทึกข้อมูล → Restart Docker DB → SELECT | ข้อมูลยังอยู่ครบ (MySQL Volume ทำงาน) | P1 | ⬜ |

---

## 10. Frontend UI Test Cases

| TC-ID | หน้าจอ | Scenario | Test Steps | Expected Result | Priority | Status |
|---|---|---|---|---|:---:|---|
| TC-UI-001 | Landing Page | เปิดหน้าแรกสำเร็จ | เปิด / โดยไม่ Login | เห็นหน้า Landing พร้อมปุ่ม "ยื่นเรื่อง" และ "ตรวจสอบสถานะ" | P1 | ⬜ |
| TC-UI-002 | ฟอร์มยื่นเรื่อง | Stepper ทำงานครบ 3 ขั้น | เปิด /complaint/new, กรอก Step 1→2→3 | ทุก Step ทำงาน, มี Validation ก่อนไปขั้นถัดไป | P1 | ⬜ |
| TC-UI-003 | ติดตามสถานะ | ป้อน Tracking Code ถูก | เปิด /track, กรอก complaint_code + tracking_code | เห็น Status Timeline | P1 | ⬜ |
| TC-UI-004 | ติดตามสถานะ | ป้อน Tracking Code ผิด | กรอก Code ไม่ถูกต้อง | Error "ไม่พบข้อมูล" | P1 | ⬜ |
| TC-UI-005 | Login | แสดง Error เมื่อรหัสผ่านผิด | กรอกรหัสผ่านผิด | แสดง Error Message ใต้ฟอร์ม ไม่ Crash | P1 | ⬜ |
| TC-UI-006 | Admin Layout | Sidebar ยืดหยุ่นตาม Role | Login เป็น Officer → ตรวจ Sidebar | ไม่เห็นเมนู "จัดการระบบ" | P1 | ⬜ |
| TC-UI-007 | รายการเรื่อง | Filter และ Search ทำงาน | เปิดหน้าเรื่อง, ค้นหาด้วยคำสำคัญ | รายการกรองถูกต้อง | P2 | ⬜ |
| TC-UI-008 | รายละเอียดเรื่อง | Tabs ทำงานครบ 4 Tabs | เปิดเรื่อง, คลิก Tab ต่างๆ | ข้อมูล, ไฟล์, ประวัติ, Progress Notes แสดงถูกต้อง | P1 | ⬜ |
| TC-UI-009 | Dashboard | Cards แสดงตัวเลขถูกต้อง | Login Supervisor/Exec, เปิด Dashboard | ตัวเลขใน Cards ตรงกับ API /stats | P1 | ⬜ |
| TC-UI-010 | ภาษาไทย | ข้อความภาษาไทยแสดงถูกต้อง | ทุกหน้า | ไม่มีอักขระเสีย, Font ถูกต้อง | P1 | ⬜ |
| TC-UI-011 | Responsive | ใช้งานได้บน Tablet (768px) | ปรับขนาด Browser เป็น 768px | Layout ไม่แตก, ปุ่มคลิกได้ | P2 | ⬜ |
| TC-UI-012 | Error Page | หน้า 404 | เปิด URL ไม่มีในระบบ | แสดงหน้า 404 พร้อมปุ่มกลับหน้าหลัก | P3 | ⬜ |

---

## 11. Workflow Test Cases

| TC-ID | Workflow | Scenario | Test Steps | Expected Result | Priority | Status |
|---|---|---|---|---|:---:|---|
| TC-WF-001 | Full Flow | ทดสอบ Flow ปกติตั้งแต่ต้นจนจบ | 1. Citizen ยื่นเรื่อง → 2. Officer รับ → 3. Forward ไป Agency → 4. Agency Acknowledge → 5. Agency Resolve → 6. Supervisor Close | ทุกขั้นตอนเปลี่ยนสถานะถูกต้อง, ประวัติบันทึกครบ | P1 | ⬜ |
| TC-WF-002 | Reject Flow | Agency ปฏิเสธรับเรื่อง | Forward → Agency กด Reject พร้อมเหตุผล | สถานะกลับเป็น IN_REVIEW, Officer ได้รับแจ้งเตือน | P1 | ⬜ |
| TC-WF-003 | Cancel Flow | ยกเลิกเรื่อง | Supervisor กด Cancel พร้อมเหตุผล | สถานะเป็น CANCELLED, แก้ไขอีกไม่ได้ | P1 | ⬜ |
| TC-WF-004 | BR-03 | เรื่อง CLOSED ห้ามแก้ไข | ลองเรียก PUT /api/complaints/:id บน CLOSED | Status 400/403 | P1 | ⬜ |
| TC-WF-005 | BR-05 | Forward ต้องมี Note | Forward โดยไม่ใส่ note | Error Validation | P1 | ⬜ |
| TC-WF-006 | SLA | Due Date คำนวณถูกต้อง | สร้างเรื่อง Category SLA=15 วัน | due_date = created_at + 15 วัน (อาจข้ามเสาร์-อาทิตย์) | P1 | ⬜ |
| TC-WF-007 | Status History | ทุกการเปลี่ยนสถานะบันทึก | เปลี่ยนสถานะ 3 ครั้ง | complaint_status_history มี 3 Records | P1 | ⬜ |
| TC-WF-008 | Progress Note | บันทึก Internal Note | Officer บันทึก Note แบบ is_public=false | Agency ไม่เห็น Note นี้ | P2 | ⬜ |

---

## 12. Dashboard and Report Test Cases

| TC-ID | Module | Scenario | Test Steps | Expected Result | Priority | Status |
|---|---|---|---|---|:---:|---|
| TC-DASH-001 | Stats | ตัวเลข Total ถูกต้อง | นับ complaint ทั้งหมดใน DB → เปรียบกับ /api/dashboard/stats | ตัวเลขตรงกัน | P1 | ⬜ |
| TC-DASH-002 | Stats | ตัวเลข New Today ถูกต้อง | เพิ่มเรื่องใหม่วันนี้ → เรียก stats | new_today เพิ่มขึ้น 1 | P1 | ⬜ |
| TC-DASH-003 | Overdue | รายการ Overdue แสดงถูกต้อง | มีเรื่องที่ due_date < today | แสดงเรื่องนั้นใน /api/dashboard/overdue | P1 | ⬜ |
| TC-DASH-004 | Overdue | เรื่อง CLOSED ไม่โผล่ใน Overdue | มีเรื่อง CLOSED ที่ due_date < today | ไม่แสดงใน Overdue List | P1 | ⬜ |
| TC-DASH-005 | Export | CSV ดาวน์โหลดได้และเปิดใน Excel | GET /api/reports/export | ไฟล์ CSV เปิดใน Excel ได้ ภาษาไทยไม่เสีย | P1 | ⬜ |
| TC-DASH-006 | Filter | Dashboard กรองตามช่วงวันที่ | ส่ง Query param date_from, date_to | ตัวเลขเปลี่ยนตาม Filter ที่เลือก | P2 | ⬜ |

---

## 13. Docker Integration Test Cases

| TC-ID | Module | Scenario | Test Steps | Expected Result | Priority | Status |
|---|---|---|---|---|:---:|---|
| TC-DOK-001 | Dev | docker-compose up สำเร็จ | `docker-compose up -d --build` | 4 Services ขึ้นทั้งหมด (frontend, backend, db, phpmyadmin) | P1 | ⬜ |
| TC-DOK-002 | Dev | Frontend เข้าถึงได้ | เปิด http://localhost:5173 | เห็นหน้าเว็บ React | P1 | ⬜ |
| TC-DOK-003 | Dev | Backend Health Check | GET http://localhost:5001/api/health | `{"status":"ok"}` | P1 | ⬜ |
| TC-DOK-004 | Dev | MySQL ใน Docker ใช้งานได้ | เปิด http://localhost:8081 → Login phpMyAdmin | Login สำเร็จ เห็น dcms_db | P1 | ⬜ |
| TC-DOK-005 | Dev | MySQL Volume Persist | บันทึกข้อมูล → docker-compose down → up | ข้อมูลยังอยู่ | P1 | ⬜ |
| TC-DOK-006 | Dev | Hot Reload Backend | แก้ไขไฟล์ JS → บันทึก | Backend Restart อัตโนมัติ (Nodemon) | P2 | ⬜ |
| TC-DOK-007 | Dev | Hot Reload Frontend | แก้ไขไฟล์ JSX → บันทึก | Browser อัปเดตอัตโนมัติ (Vite HMR) | P2 | ⬜ |
| TC-DOK-008 | Prod | docker build สำเร็จ (Multi-stage) | `docker build -t dcms-prod .` | Image Build สำเร็จ ไม่มี Error | P1 | ⬜ |
| TC-DOK-009 | Prod | รัน Production Image | `docker run -p 5001:5001 dcms-prod` | เปิด http://localhost:5001 เห็น Frontend UI | P1 | ⬜ |

---

## 14. Security Test Cases (เบื้องต้น)

| TC-ID | Module | Scenario | Test Steps | Expected Result | Priority | Status |
|---|---|---|---|---|:---:|---|
| TC-SEC-010 | Input | SQL Injection ผ่าน Login | กรอก username = `' OR 1=1 --` | Error Validation ไม่สามารถ Bypass Auth | P1 | ⬜ |
| TC-SEC-011 | Input | XSS ผ่าน Description | กรอก `<script>alert(1)</script>` ใน description | ข้อความถูก Escape ไม่มี Script รัน | P1 | ⬜ |
| TC-SEC-012 | Auth | Brute Force Login | ส่ง Login Request 100 ครั้งติดต่อกัน | อยากให้มี Rate Limit (หากไม่มี ให้บันทึกเป็น Issue) | P2 | ⬜ |
| TC-SEC-013 | Auth | แก้ไข JWT Payload | Decode JWT, เปลี่ยน role เป็น super_admin, Encode กลับ | API ปฏิเสธ Token (JWT Signature Invalid) | P1 | ⬜ |
| TC-SEC-014 | CORS | เรียก API จาก Domain อื่น | ใช้ cURL กำหนด Origin ต่างออกไป | ควรถูก Block (ถ้า CORS ตั้งค่าถูก) | P2 | ⬜ |
| TC-SEC-015 | Upload | อัปโหลดไฟล์ประเภทอันตราย | อัปโหลดไฟล์ .exe หรือ .php | Error "ประเภทไฟล์ไม่รองรับ" (BR-08) | P1 | ⬜ |
| TC-SEC-016 | Upload | อัปโหลดไฟล์เกิน 10MB | อัปโหลดไฟล์ขนาด 15MB | Error "ไฟล์มีขนาดเกินกำหนด" (BR-08) | P1 | ⬜ |
| TC-SEC-017 | Password | Password เก็บแบบ Hash | SELECT password FROM users | ค่าที่เห็นต้องเป็น bcrypt hash ไม่ใช่ Plain Text | P1 | ⬜ |

---

## 15. Acceptance Criteria (เกณฑ์ตัดสินผ่าน)

### 15.1 เกณฑ์ผ่านขั้นต่ำ (Minimum Viable Acceptance)

| เกณฑ์ | ระดับ |
|---|---|
| Test Case Priority P1 ผ่านทั้งหมด ≥ 95% | บังคับ (Go/No-Go) |
| ไม่มี Blocker หรือ Critical Bug ค้างอยู่ | บังคับ |
| Auth, RBAC, และ Workflow ทำงานถูกต้อง 100% | บังคับ |
| Database Persist ข้อมูลได้หลัง Restart | บังคับ |
| Docker Build และรัน Production Image ได้ | บังคับ |

### 15.2 เกณฑ์คุณภาพ (Quality Gates)

| เกณฑ์ | เป้าหมาย |
|---|---|
| Test Case Priority P2 ผ่าน | ≥ 80% |
| Performance: หน้า Dashboard โหลด | < 3 วินาที |
| ภาษาไทยแสดงถูกต้องทุกหน้า | 100% |
| ไม่มี Console Error ใน Browser | ≥ 90% |

---

## 16. Test Result Template

ให้ใช้ Template นี้บันทึกผลทดสอบหลังจากรันแต่ละ Test Case:

```
Test Run Date: ______________________
Tester Name:  ______________________
Environment:  [ ] Local Docker  [ ] Production
Build/Version: ______________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Test Case ID   : ______________________
Module         : ______________________
Status         : [ ] PASS  [ ] FAIL  [ ] SKIP  [ ] BLOCKED
Actual Result  : ______________________
Notes/Evidence : ______________________
Screenshot     : ______________________
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary:
- Total TCs     : ______
- Pass          : ______
- Fail          : ______
- Blocked       : ______
- Pass Rate     : ______%
- Ready for Release: [ ] YES  [ ] NO
```

---

## 17. สัญลักษณ์ที่ใช้ใน Status Column

| Symbol | ความหมาย |
|---|---|
| ⬜ | ยังไม่ได้ทดสอบ (Not Tested) |
| ✅ | ผ่าน (PASS) |
| ❌ | ไม่ผ่าน (FAIL) |
| ⏭️ | ข้าม (SKIP) |
| 🚫 | บล็อคอยู่ (BLOCKED — รอ Phase อื่น) |
