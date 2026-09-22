# 07 — Frontend Page Structure
## ระบบรับเรื่องร้องเรียนศูนย์ดำรงธรรมจังหวัดศรีสะเกษ (DCMS)

> **Planning Only** — ออกแบบสำหรับ React + Vite + MUI 5 + React Router DOM

---

## 1. โครงสร้าง Layout หลัก (Main Layouts)

ระบบจะแบ่ง Layout เป็น 2 ประเภทหลัก เพื่อแยกส่วนประชาชนและส่วนเจ้าหน้าที่:

### 1.1 Public Layout (สำหรับประชาชน)
- **Topbar:** โลโก้ศูนย์ดำรงธรรม, เมนู "หน้าแรก", "ยื่นเรื่องร้องเรียน", "ติดตามสถานะ", ปุ่ม "สำหรับเจ้าหน้าที่ (Login)"
- **Content Area:** แสดงเนื้อหาหลักตรงกลาง (Centered/Container)
- **Footer:** ที่อยู่ติดต่อ, ลิขสิทธิ์หน่วยงาน

### 1.2 Admin Layout (สำหรับเจ้าหน้าที่ทุกระดับที่ Login)
- **Sidebar (เมนูด้านซ้าย):** 
  - เมนูยืดหยุ่นตาม Role (เช่น Admin เห็นเมนูจัดการ User, Officer เห็นรายการรับเรื่อง)
  - สามารถย่อ/ขยายได้ (Collapsible)
- **Topbar (เมนูด้านบน):**
  - ปุ่ม Toggle Sidebar
  - ไอคอนแจ้งเตือน (Notifications Dropdown) พร้อม Badge ตัวเลข
  - โปรไฟล์ผู้ใช้ (ชื่อ, บทบาท) & ปุ่ม Logout
- **Content Area:** พื้นที่แสดงข้อมูลหลักทางขวา

---

## 2. โครงสร้างหน้าจอแยกตามกลุ่มผู้ใช้ (Pages by User Group)

### 👥 2.1 ส่วนของประชาชน (Citizen - Public Layout)

| หน้าจอ | URL Path | ข้อมูล/UI ที่แสดง | API ที่เชื่อมโยง |
|---|---|---|---|
| **หน้าแรก (Landing)** | `/` | Banner, ปุ่ม "ยื่นเรื่องใหม่", ปุ่ม "ติดตามสถานะ" | - |
| **ฟอร์มยื่นเรื่อง** | `/complaint/new` | - **ฟอร์ม (Stepper):** ข้อมูลส่วนตัว -> รายละเอียดเรื่อง -> แนบไฟล์<br/>- **ปุ่ม:** บันทึก, ยกเลิก | `GET /api/categories`<br/>`POST /api/upload`<br/>`POST /api/complaints/public` |
| **หน้าความสำเร็จ** | `/complaint/success` | แสดง **หมายเลขเรื่อง** และ **Tracking Code** (ให้ Copy) | - |
| **ฟอร์มเช็คสถานะ** | `/track` | กล่องกรอก: หมายเลขเรื่อง + Tracking Code | - |
| **หน้าแสดงสถานะ** | `/track/result` | - **Timeline:** สถานะตั้งแต่เริ่มจนปัจจุบัน<br/>- **Public Notes:** โน้ตที่ จนท. อนุญาตให้เห็น | `GET /api/complaints/track` |

---

### 🛡️ 2.2 ส่วนของเจ้าหน้าที่ศูนย์ดำรงธรรม (Officer & Supervisor)

| หน้าจอ | URL Path | ข้อมูล/UI ที่แสดง | API ที่เชื่อมโยง |
|---|---|---|---|
| **Dashboard** | `/admin/dashboard` | - **Cards:** จำนวนเรื่องทั้งหมด, ค้างอยู่, เกิน SLA<br/>- **Charts:** กราฟวงกลมแยกตามสถานะ/หมวดหมู่ | `GET /api/dashboard/...` |
| **รายการเรื่องทั้งหมด** | `/admin/complaints` | - **DataGrid:** เลขที่, หัวข้อ, หมวดหมู่, สถานะ, SLA<br/>- **Filter:** ค้นหาตามวัน, สถานะ, อำเภอ | `GET /api/complaints` |
| **ฟอร์มรับเรื่องใหม่** | `/admin/complaints/new`| - เหมือนฟอร์มประชาชน แต่มีช่องรับเรื่องผ่าน "โทรศัพท์/มาเอง"<br/>- ให้ จนท. กรอกชื่อผู้บันทึก | `POST /api/complaints` |
| **รายละเอียดเรื่อง** | `/admin/complaints/:id`| แบ่งเป็น Tabs:<br/>1. **ข้อมูลทั่วไป:** ข้อมูลผู้ร้อง, เนื้อหา<br/>2. **ไฟล์แนบ:** รูปภาพ, เอกสาร<br/>3. **ประวัติสถานะ:** Timeline Log<br/>4. **Progress Notes:** บันทึกข้อความ (แชท)<br/><br/>- **ปุ่ม Action:** แก้ไข, ส่งต่อ, ปิดเรื่อง (เฉพาะหัวหน้า), ยกเลิก | `GET /api/complaints/:id`<br/>`PUT /api/complaints/:id`<br/>`POST /api/complaints/:id/forward`<br/>`POST /api/complaints/:id/notes` |

---

### 🏢 2.3 ส่วนของหน่วยงานที่รับผิดชอบ (Agency Officer)

| หน้าจอ | URL Path | ข้อมูล/UI ที่แสดง | API ที่เชื่อมโยง |
|---|---|---|---|
| **รายการเรื่องของหน่วย**| `/agency/complaints` | - **DataGrid:** คล้ายของ Officer แต่**เห็นเฉพาะเรื่องของตัวเอง**<br/>- แถบไฮไลต์เรื่องใหม่ที่ยังไม่กด "รับเรื่อง" | `GET /api/complaints` (Filtered) |
| **รายละเอียดเรื่อง** | `/agency/complaints/:id`| - คล้ายของ Officer แต่ **ไม่มีปุ่มส่งต่อ** และ **ไม่มีปุ่มปิดเรื่อง**<br/>- **ปุ่ม Action:** กดรับเรื่อง (Acknowledge), บันทึกผลงาน, แนบไฟล์ | `POST /api/complaints/:id/acknowledge`<br/>`POST /api/complaints/:id/notes` |

---

### 📊 2.4 ส่วนของผู้บริหารจังหวัด (Executive)

| หน้าจอ | URL Path | ข้อมูล/UI ที่แสดง | API ที่เชื่อมโยง |
|---|---|---|---|
| **Executive Dashboard**| `/exec/dashboard` | - เน้นกราฟและสถิติภาพรวม (สถิติรายหน่วยงาน, รายอำเภอ)<br/>- **ตารางแจ้งเตือน:** รายการที่เกินกำหนด (Overdue) | `GET /api/dashboard/...` |
| **ดูรายละเอียดเรื่อง** | `/exec/complaints/:id` | - **View-only Mode:** ดูข้อมูลได้ทุกอย่างแต่ไม่มีปุ่มแก้ไขหรือส่งต่อใดๆ | `GET /api/complaints/:id` |
| **รายงาน (Reports)** | `/exec/reports` | - ฟอร์มเลือกช่วงวันที่, หน่วยงาน<br/>- ปุ่ม Export เป็น Excel/PDF | `GET /api/reports/export` |

---

### ⚙️ 2.5 ส่วนของผู้ดูแลระบบ (Super Admin)

| หน้าจอ | URL Path | ข้อมูล/UI ที่แสดง | API ที่เชื่อมโยง |
|---|---|---|---|
| **จัดการผู้ใช้งาน** | `/system/users` | - **DataGrid:** รายชื่อพนักงาน, Role, สถานะ<br/>- **ฟอร์ม:** สร้าง/แก้ไข User, Reset Password | `GET / POST / PUT /api/users` |
| **จัดการหน่วยงาน** | `/system/agencies` | - **DataGrid:** รหัส, ชื่อหน่วยงาน<br/>- **ฟอร์ม:** เพิ่ม/แก้ไขหน่วยงาน | `GET / POST / PUT /api/agencies` |
| **จัดการหมวดหมู่เรื่อง** | `/system/categories`| - **DataGrid:** ชื่อหมวด, จำนวนวัน SLA<br/>- **ฟอร์ม:** กำหนด SLA มาตรฐาน | `GET / POST / PUT /api/categories` |
| **Audit Logs** | `/system/audit` | - **DataGrid (View Only):** ประวัติการใช้งานระบบ (ใคร ทำอะไร เมื่อไหร่) | `GET /api/audit-logs` |

---

## 3. หน้าจอทั่วไป (Common Pages)

| หน้าจอ | URL Path | ข้อมูล/UI ที่แสดง | API ที่เชื่อมโยง |
|---|---|---|---|
| **หน้า Login** | `/login` | - ฟอร์ม Username, Password<br/>- แจ้งเตือนกรณีรหัสผิด | `POST /api/auth/login` |
| **หน้าแจ้งเตือน (Noti)**| `/notifications` | - รายการแจ้งเตือนทั้งหมด<br/>- ปุ่ม "อ่านทั้งหมด" | `GET /api/notifications` |
| **Not Found / 403** | `*` | - หน้าจอแสดง "ไม่พบหน้า" หรือ "ไม่มีสิทธิ์เข้าถึง" พร้อมปุ่มกลับหน้าหลัก | - |

---

## 4. Components หลักที่จะใช้บ่อย (Reusable MUI Components)

1. **Status Chip:** ป้ายสีแสดงสถานะ (เช่น `PENDING`=เหลือง, `IN_PROGRESS`=ฟ้า, `CLOSED`=เขียว, `OVERDUE`=แดง)
2. **Priority Badge:** แสดงความเร่งด่วน (ด่วนที่สุด = แดง, ปกติ = เทา)
3. **Timeline Component (MUI Lab):** สำหรับแสดงประวัติสถานะเรื่องร้องเรียนในหน้ารายละเอียด
4. **Custom DataGrid:** ตารางที่มี Pagination, Sorting, Search และ Export ในตัว
5. **Form Dialogs:** Modal สำหรับการกดบันทึกย่อยๆ เช่น กดอัปเดตสถานะ, กรอกเหตุผลการยกเลิกเรื่อง
