# 06 — API Contract Design
## ระบบรับเรื่องร้องเรียนศูนย์ดำรงธรรมจังหวัดศรีสะเกษ (DCMS)

> **Planning Only** — ออกแบบ RESTful API สไตล์ (JSON) สำหรับ Node.js + Express

---

## 1. มาตรฐานการตอบกลับ (Standard Response Format)

เพื่อความเป็นระเบียบและให้ Frontend ทำงานง่าย ทุก API ควรตอบกลับด้วยโครงสร้าง JSON พื้นฐานดังนี้:

**Success (20X):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error (40X, 50X):**
```json
{
  "success": false,
  "error": {
    "code": "ERR_VALIDATION",
    "message": "Invalid input data",
    "details": [ ... ]
  }
}
```

---

## 2. สรุป API Endpoints 

*(หมายเหตุ: `Auth = Y` หมายถึงต้องส่ง JWT Token ใน Header, `Auth = N` หมายถึง Public API)*

### 1. Auth Module
| Method | Endpoint | Description | Request Body | Response | Auth | Role |
|:---:|---|---|---|---|:---:|---|
| `POST` | `/api/auth/login` | เข้าสู่ระบบสำหรับเจ้าหน้าที่ | `username`, `password` | JWT token, user info | N | - |
| `POST` | `/api/auth/logout` | ออกจากระบบ (Client clear token) | - | success message | Y | All |
| `GET` | `/api/auth/me` | ดึงข้อมูลโปรไฟล์ตัวเอง | - | user info, permissions | Y | All |

### 2. Users Module
| Method | Endpoint | Description | Request Body | Response | Auth | Role |
|:---:|---|---|---|---|:---:|---|
| `GET` | `/api/users` | แสดงรายการเจ้าหน้าที่ทั้งหมด | - (Query: page, search) | users array, pagination | Y | Super Admin |
| `POST` | `/api/users` | สร้างบัญชีเจ้าหน้าที่ใหม่ | `username`, `password`, `role_id`, `agency_id`, etc. | created user data | Y | Super Admin |
| `PUT` | `/api/users/:id` | อัปเดตข้อมูลเจ้าหน้าที่ | `first_name`, `role_id`, etc. | updated user data | Y | Super Admin |
| `PATCH`| `/api/users/:id/status`| ระงับ/เปิดใช้งานบัญชี | `is_active` | updated status | Y | Super Admin |

### 3. Agencies Module
| Method | Endpoint | Description | Request Body | Response | Auth | Role |
|:---:|---|---|---|---|:---:|---|
| `GET` | `/api/agencies` | แสดงรายชื่อหน่วยงานทั้งหมด | - | agencies array | Y | All |
| `POST` | `/api/agencies` | เพิ่มหน่วยงานใหม่ | `code`, `name`, `is_internal` | created agency data | Y | Super Admin |
| `PUT` | `/api/agencies/:id` | แก้ไขข้อมูลหน่วยงาน | `name`, `description`, etc. | updated agency data | Y | Super Admin |

### 4. Complaint Categories Module
| Method | Endpoint | Description | Request Body | Response | Auth | Role |
|:---:|---|---|---|---|:---:|---|
| `GET` | `/api/categories` | ดึงหมวดหมู่ทั้งหมด | - | categories array | N | All, Public |
| `POST` | `/api/categories` | เพิ่มหมวดหมู่ใหม่ | `name`, `sla_days`, `agency_id`| created category | Y | Super Admin |
| `PUT` | `/api/categories/:id`| แก้ไขหมวดหมู่ (เช่น อัปเดต SLA) | `name`, `sla_days` | updated category | Y | Super Admin |

### 5. Complaints Module (เรื่องร้องเรียนหลัก)
| Method | Endpoint | Description | Request Body | Response | Auth | Role |
|:---:|---|---|---|---|:---:|---|
| `POST` | `/api/complaints/public`| ปชช. ยื่นเรื่องออนไลน์ | `title`, `description`, `category_id`, `complainant_data` | `tracking_code`, `complaint_code` | N | Public |
| `GET` | `/api/complaints/track`| ปชช. เช็คสถานะ | `complaint_code`, `tracking_code` | status history, public notes | N | Public |
| `POST` | `/api/complaints` | จนท. บันทึกเรื่องเข้าระบบ | `title`, `description`, `channel`, etc. | created complaint | Y | Officer |
| `GET` | `/api/complaints` | ดึงรายการเรื่องทั้งหมด (Filter) | - (Query: status, agency, date) | complaints array | Y | All (except Public)* |
| `GET` | `/api/complaints/:id` | ดึงรายละเอียดเรื่องเดียว | - | full details, history | Y | All (except Public)* |
| `PUT` | `/api/complaints/:id` | แก้ไขข้อมูลเรื่องเบื้องต้น | `title`, `category_id`, etc. | updated complaint | Y | Officer, Supervisor |
| `PATCH`| `/api/complaints/:id/status`| อัปเดตสถานะ (Close, Cancel) | `new_status`, `reason` | new status details | Y | Supervisor |

*(หมายเหตุ: Backend ต้องกรองข้อมูล `GET /api/complaints` ตาม Role เช่น Agency Officer เห็นเฉพาะเรื่องของตนเอง)*

### 6. Complaint Assignment & Forwarding Module
| Method | Endpoint | Description | Request Body | Response | Auth | Role |
|:---:|---|---|---|---|:---:|---|
| `POST` | `/api/complaints/:id/forward` | ส่งต่อเรื่องให้หน่วยงาน | `to_agency_id`, `note` | forward history log | Y | Officer, Supervisor |
| `POST` | `/api/complaints/:id/acknowledge`| หน่วยงานกดยอมรับเรื่อง | - | status changed to IN_PROGRESS | Y | Agency Officer |
| `POST` | `/api/complaints/:id/reject` | หน่วยงานกดปฏิเสธรับเรื่อง | `reason` | status changed back to IN_REVIEW | Y | Agency Officer |

### 7. Complaint Updates (Progress Notes)
| Method | Endpoint | Description | Request Body | Response | Auth | Role |
|:---:|---|---|---|---|:---:|---|
| `GET` | `/api/complaints/:id/notes` | ดึงรายการความคืบหน้า | - | notes array | Y | All |
| `POST` | `/api/complaints/:id/notes` | บันทึกความคืบหน้า | `note_text`, `is_public` | created note | Y | Officer, Agency |

### 8. Attachments Module
| Method | Endpoint | Description | Request Body | Response | Auth | Role |
|:---:|---|---|---|---|:---:|---|
| `POST` | `/api/upload` | อัปโหลดไฟล์ | FormData (`file`) | `file_path`, `file_name` | N** | All, Public |
| `POST` | `/api/complaints/:id/attachments`| ผูกไฟล์กับเรื่องร้องเรียน | `file_path`, `file_name` | attachment data | Y | Officer, Agency |
| `DELETE`|`/api/attachments/:id` | ลบไฟล์แนบ (ถ้าทำผิด) | - | success message | Y | Officer, Agency |

*(** หมายเหตุ: `/api/upload` ให้ Public เข้าได้เพื่อยื่นเรื่องออนไลน์ แต่ต้องจำกัดชนิดไฟล์/ขนาด อย่างเข้มงวด)*

### 9. Notifications Module
| Method | Endpoint | Description | Request Body | Response | Auth | Role |
|:---:|---|---|---|---|:---:|---|
| `GET` | `/api/notifications` | ดึงรายการแจ้งเตือนของตนเอง | - | notifications array | Y | All |
| `PATCH`| `/api/notifications/:id/read` | มาร์คว่าอ่านแล้ว | - | success message | Y | All |
| `POST` | `/api/notifications/read-all` | มาร์คอ่านแล้วทั้งหมด | - | success message | Y | All |

### 10. Dashboard Module
| Method | Endpoint | Description | Request Body | Response | Auth | Role |
|:---:|---|---|---|---|:---:|---|
| `GET` | `/api/dashboard/stats` | สถิติจำนวนเรื่องร้องเรียนรวม | - | count by status/priority | Y | Supervisor, Exec |
| `GET` | `/api/dashboard/agency` | สถิติแยกตามหน่วยงาน | - | count per agency | Y | Supervisor, Exec |
| `GET` | `/api/dashboard/overdue` | รายการที่เกิน SLA | - | overdue list | Y | Supervisor, Exec |

### 11. Reports Module
| Method | Endpoint | Description | Request Body | Response | Auth | Role |
|:---:|---|---|---|---|:---:|---|
| `GET` | `/api/reports/export` | ดาวน์โหลดรายงาน CSV/Excel | - (Query params) | File Stream | Y | Supervisor, Exec |

### 12. Audit Logs Module
| Method | Endpoint | Description | Request Body | Response | Auth | Role |
|:---:|---|---|---|---|:---:|---|
| `GET` | `/api/audit-logs` | ดึงประวัติ Log ทั้งหมดในระบบ | - (Query: user, action) | audit logs array | Y | Super Admin |

---

## 3. ความปลอดภัยและข้อควรระวัง (Security Notes)

- **Authentication:** `JWT (JSON Web Token)` ส่งผ่าน Header `Authorization: Bearer <token>`
- **Authorization (RBAC):** ต้องสร้าง Express Middleware เช่น `requireRole(['SuperAdmin', 'Officer'])` เพื่อดักจับระดับ Router
- **Rate Limiting:** เปิดใช้ Rate Limit ที่ Endpoint `/api/complaints/public` เพื่อป้องกันสแปม
- **Data Sanitization:** ควรกรอง (Sanitize) ข้อมูล `description` และ `note_text` เพื่อป้องกัน XSS
