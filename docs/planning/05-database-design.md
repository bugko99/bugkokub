# 05 — Database Design Overview
## ระบบรับเรื่องร้องเรียนศูนย์ดำรงธรรมจังหวัดศรีสะเกษ (DCMS)

> **Planning Only** — ออกแบบสำหรับ MySQL 8 (ใช้ Snake_case)

---

## 1. ภาพรวมกลุ่มตาราง (Table Categories)

เพื่อการจัดการที่เป็นระบบและรองรับการขยายตัวในอนาคต ฐานข้อมูลจะถูกแบ่งออกเป็น 3 กลุ่มหลัก:

1. **Master Data Tables:** ตารางข้อมูลพื้นฐานที่มักจะไม่มีการลบ แต่ใช้การเปิด/ปิดสถานะ (Active/Inactive)
2. **Transaction Tables:** ตารางที่เก็บข้อมูลที่เกิดขึ้นจากการทำงานประจำวัน (เรื่องร้องเรียน, ผู้ร้อง)
3. **Log / History Tables:** ตารางสำหรับบันทึกประวัติเพื่อการตรวจสอบ (Audit)

---

## 2. รายชื่อตารางและวัตถุประสงค์ (Tables & Purposes)

### 📊 กลุ่ม Master Data
| ชื่อตาราง | วัตถุประสงค์ |
|---|---|
| `roles` | เก็บประเภทสิทธิ์การใช้งาน (Super Admin, Officer, etc.) |
| `agencies` | เก็บรายชื่อหน่วยงานภายในและภายนอกที่รับผิดชอบเรื่องร้องเรียน |
| `users` | เก็บข้อมูลบัญชีผู้ใช้งานระบบของเจ้าหน้าที่ |
| `complaint_categories` | เก็บหมวดหมู่เรื่องร้องเรียน พร้อมค่ามาตรฐาน SLA (วัน) |
| `districts` | เก็บข้อมูลอำเภอในจังหวัดศรีสะเกษ สำหรับระบุพื้นที่เกิดเหตุ |

### 📝 กลุ่ม Transaction
| ชื่อตาราง | วัตถุประสงค์ |
|---|---|
| `complaints` | ตารางหลัก เก็บข้อมูลเรื่องร้องเรียน (หัวใจหลักของระบบ) |
| `complainants` | เก็บข้อมูลส่วนบุคคลของผู้ร้องเรียน (แยกตารางเพื่อรักษาความปลอดภัย PDPA) |
| `complaint_attachments` | เก็บข้อมูลไฟล์แนบต่างๆ ของเรื่องร้องเรียน (รูปภาพ, PDF) |
| `complaint_progress_notes` | เก็บประวัติการอัปเดตความคืบหน้าจากหน่วยงานหรือเจ้าหน้าที่ |

### 🔍 กลุ่ม Log / History
| ชื่อตาราง | วัตถุประสงค์ |
|---|---|
| `complaint_status_history` | บันทึกประวัติทุกครั้งที่สถานะของเรื่องเปลี่ยนไป |
| `complaint_forward_history` | บันทึกประวัติการส่งต่อระหว่างหน่วยงาน |
| `audit_logs` | บันทึกการกระทำสำคัญในระบบ (เช่น ลบผู้ใช้, เปลี่ยนสิทธิ์) |

---

## 3. รายละเอียด Field สำคัญและ Keys (Schema Design)

### 3.1 `users` (เจ้าหน้าที่ระบบ)
- **PK:** `id` (INT, Auto Increment)
- **Fields:** `username`, `password_hash`, `first_name`, `last_name`, `is_active`
- **FK:** 
  - `role_id` -> `roles(id)`
  - `agency_id` -> `agencies(id)`

### 3.2 `agencies` (หน่วยงาน)
- **PK:** `id`
- **Fields:** `code` (เช่น D01), `name`, `description`, `is_internal` (BOOLEAN)

### 3.3 `complaint_categories` (หมวดหมู่เรื่องร้องเรียน)
- **PK:** `id`
- **Fields:** `name`, `sla_days` (INT), `is_active`
- **FK:** `default_agency_id` -> `agencies(id)` (หน่วยงานแนะนำเบื้องต้น)

### 3.4 `complaints` (เรื่องร้องเรียนหลัก)
- **PK:** `id`
- **Fields:** 
  - `complaint_code` (VARCHAR, Unique) เช่น DCMS-2024-000001
  - `tracking_code` (VARCHAR, Hashed/Random) สำหรับประชาชนเช็คสถานะ
  - `channel` (ENUM: 'walk-in', 'phone', 'letter', 'online', 'import')
  - `priority` (ENUM: 'low', 'medium', 'high', 'urgent')
  - `title`, `description` (TEXT)
  - `incident_date` (DATE)
  - `status` (ENUM: 'PENDING', 'IN_REVIEW', 'FORWARDED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED')
  - `due_date` (DATE)
  - `created_at`, `updated_at`, `deleted_at` (Soft Delete)
- **FK:**
  - `category_id` -> `complaint_categories(id)`
  - `district_id` -> `districts(id)`
  - `current_agency_id` -> `agencies(id)` (หน่วยงานที่ถือเรื่องอยู่ปัจจุบัน)
  - `created_by` -> `users(id)` (กรณีเจ้าหน้าที่คีย์แทน)

### 3.5 `complainants` (ผู้ร้องเรียน - เชื่อม 1:1 กับ Complaints)
- **PK:** `id`
- **Fields:** 
  - `is_anonymous` (BOOLEAN) - หาก True ไม่ต้องแสดงชื่อ
  - `id_card_number` (VARCHAR 13) - *ควรพิจารณาเข้ารหัส (Encrypt)*
  - `first_name`, `last_name`, `phone_number`, `email`
  - `address_details`
- **FK:** `complaint_id` -> `complaints(id)`

### 3.6 `complaint_progress_notes` (บันทึกความคืบหน้า)
- **PK:** `id`
- **Fields:** `note_text` (TEXT), `is_public` (BOOLEAN - ให้ประชาชนเห็นหรือไม่), `created_at`
- **FK:** 
  - `complaint_id` -> `complaints(id)`
  - `user_id` -> `users(id)`
  - `agency_id` -> `agencies(id)` (หน่วยงานที่บันทึก)

### 3.7 `complaint_status_history` (ประวัติสถานะ)
- **PK:** `id`
- **Fields:** `old_status`, `new_status`, `reason_text`, `created_at`
- **FK:**
  - `complaint_id` -> `complaints(id)`
  - `user_id` -> `users(id)` (ใครเป็นคนเปลี่ยน)

### 3.8 `audit_logs` (บันทึกความปลอดภัย)
- **PK:** `id`
- **Fields:** `action_type`, `entity_type` (เช่น 'user', 'complaint'), `entity_id`, `old_value` (JSON), `new_value` (JSON), `ip_address`, `created_at`
- **FK:** `user_id` -> `users(id)`

---

## 4. ความสัมพันธ์ระหว่างตาราง (Entity Relationships)

- **`complaints`** คือศูนย์กลางของ Database (Hub)
- `complaints` ➡️ `complainants` (1 to 1) 
  - 1 เรื่องร้องเรียน มีรายละเอียดผู้ร้องเรียน 1 ชุดเก็บแนบไว้เสมอ เพื่อให้ข้อมูลคงที่ไม่เปลี่ยนตามเวลา
- `complaints` ➡️ `complaint_attachments` (1 to Many)
- `complaints` ➡️ `complaint_progress_notes` (1 to Many)
- `complaints` ➡️ `complaint_status_history` (1 to Many)
- `complaints` ➡️ `complaint_forward_history` (1 to Many)
- `users` ➡️ `roles` (Many to 1)
- `users` ➡️ `agencies` (Many to 1)

---

## 5. ข้อควรระวังเรื่องข้อมูลส่วนบุคคล (PDPA & Security Considerations)

ในการออกแบบระดับ Database สำหรับระบบภาครัฐที่มีข้อมูลส่วนบุคคลชั้นที่ 2 (เช่น เลขบัตรประชาชน) ควรปฏิบัติดังนี้:

1. **การเข้ารหัสข้อมูล (Encryption at Rest):** Field `id_card_number` ในตาราง `complainants` ควรถูกเข้ารหัส (Encrypt) ก่อนบันทึกลง Database
2. **การแยกตารางผู้ร้อง:** การแยก `complainants` ออกจาก `complaints` ช่วยให้จำกัดสิทธิ์การ Query ข้อมูลส่วนบุคคลได้ง่ายขึ้น (เช่น หาก Executive ดึงรายงาน จะ Query เฉพาะ `complaints` โดยไม่ต้อง Join ข้อมูลผู้ร้อง)
3. **Soft Deletes:** ตาราง `complaints` ควรมี `deleted_at` แทนการลบข้อมูลจริง (Hard Delete) เพื่อป้องการการสูญหายของข้อมูลและการตรวจสอบย้อนหลัง
4. **Anonymous Records:** หาก `is_anonymous = true` ระบบอาจล้างค่า Name/Phone ให้เป็น Null ตั้งแต่ระดับ Backend เพื่อไม่ให้ Database มีข้อมูลทิ้งรอยไว้
5. **No Password in Plain Text:** ตาราง `users` ต้องเก็บรหัสผ่านผ่านการ Hash ด้วย `bcrypt` เสมอ ห้ามมี Field `password` ตรงๆ
