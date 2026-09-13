# Documentation Structure

เอกสารนี้ระบุโครงสร้างการจัดเก็บเอกสาร กติกาการตั้งชื่อ และวัตถุประสงค์ของเอกสารทั้งหมดสำหรับโปรเจกต์ DocConverter (Damrongdham SSK)

---

## 1. โครงสร้างโฟลเดอร์ `docs/`
ไดเรกทอรี `docs/` เป็นศูนย์กลางในการเก็บเอกสารที่เกี่ยวข้องกับการวางแผน การพัฒนา การทดสอบ และการนำระบบขึ้นใช้งานจริง
```text
docs/
├── planning/       # เอกสารที่เกี่ยวข้องกับการวางแผนระบบ โครงสร้าง และกติกา
├── testing/        # เอกสารที่เกี่ยวข้องกับการทดสอบระบบ
└── deployment/     # เอกสารที่เกี่ยวข้องกับการนำระบบขึ้น Production
```

## 2. โครงสร้าง `docs/planning/`
จัดเก็บเอกสารที่ใช้กำหนดทิศทางของโปรเจกต์ก่อนเริ่มเขียนโค้ด
```text
docs/planning/
├── 00-tech-stack-decision.md
├── 00-ai-working-rules.md
├── 00-documentation-structure.md
├── 01-system-overview.md
├── ...
├── PROJECT_CONTEXT.md
└── 10-implementation-plan.md
```

## 3. โครงสร้าง `docs/testing/`
จัดเก็บเอกสารทดสอบและ Acceptance Criteria
```text
docs/testing/
├── api-test-cases.md
├── ui-test-cases.md
└── end-to-end-tests.md
```

## 4. โครงสร้าง `docs/deployment/`
จัดเก็บเอกสารสำหรับการนำระบบขึ้น Production (เช่น Railway)
```text
docs/deployment/
├── railway-setup-guide.md
├── environment-variables-checklist.md
└── rollback-procedures.md
```

---

## 5. รายชื่อไฟล์ Planning และ (7) วัตถุประสงค์ของแต่ละไฟล์

| ชื่อไฟล์ | วัตถุประสงค์ |
|---|---|
| `00-tech-stack-decision.md` | บันทึกเทคโนโลยีที่ใช้ โครงสร้าง Environment (Dev/Prod) และ Network |
| `00-ai-working-rules.md` | กติกาการทำงานร่วมกับ AI รวมถึงข้อห้ามและข้อบังคับ |
| `00-documentation-structure.md` | กำหนดโครงสร้างเอกสารของโปรเจกต์ (เอกสารฉบับนี้) |
| `01-system-overview.md` | ภาพรวมของระบบ เป้าหมาย และสถาปัตยกรรมระดับสูง |
| `02-requirements.md` | ข้อกำหนดระบบ (Functional & Non-Functional Requirements) |
| `03-roles-permissions.md` | กำหนดสิทธิ์และระดับการเข้าถึงของผู้ใช้แต่ละกลุ่ม |
| `04-complaint-workflow.md` | โฟลว์การทำงานหลักของระบบ เช่น การจัดการเรื่องร้องเรียน |
| `05-database-design.md` | โครงสร้างฐานข้อมูล ตาราง ความสัมพันธ์ (ER Diagram) |
| `06-api-contract.md` | มาตรฐานและรายละเอียดของ API (Endpoints, Request/Response) |
| `07-frontend-pages.md` | รายการหน้าจอ UI และ Component สรุปการแสดงผล |
| `08-dashboard-report-notification.md` | รายละเอียดการแสดงผล Dashboard, รายงาน และระบบแจ้งเตือน |
| `09-project-docker-architecture.md` | สถาปัตยกรรมระดับ Container, Port mapping, Networks และ Volumes |
| `PROJECT_CONTEXT.md` | สรุปภาพรวมและบริบทโปรเจกต์แบบสั้น เพื่อให้ AI ใช้อ้างอิงเป็นแผนที่หลัก |
| `10-implementation-plan.md` | แผนการพัฒนาโค้ดแบบแบ่งเป็น Phase พร้อม Checklist และการประเมิน |

---

## 6. ลำดับการสร้างไฟล์ Planning
การจัดทำเอกสารให้ดำเนินการสร้างตามลำดับดังต่อไปนี้:
1. `00-tech-stack-decision.md`, `00-ai-working-rules.md`, `00-documentation-structure.md`
2. `01-system-overview.md` และ `02-requirements.md`
3. `03-roles-permissions.md` และ `04-complaint-workflow.md`
4. `05-database-design.md` และ `06-api-contract.md`
5. `07-frontend-pages.md` และ `08-dashboard-report-notification.md`
6. `09-project-docker-architecture.md`
7. `PROJECT_CONTEXT.md`
8. `10-implementation-plan.md` (สุดท้าย เพื่อรวบรวมบริบททั้งหมดมาจัดเป็น Phase)

---

## 8. กติกาการตั้งชื่อไฟล์
* ใช้ตัวพิมพ์เล็กทั้งหมด (Lowercase)
* ใช้เครื่องหมายยัติภังค์ (`-`) เพื่อคั่นคำแทนการเว้นวรรค
* ไฟล์ที่เป็นขั้นตอนที่ต้องอ่านตามลำดับ ให้นำหน้าด้วยหมายเลข (เช่น `01-`, `02-`)
* นามสกุลไฟล์เป็น `.md` (Markdown) เสมอ
* ยกเว้นไฟล์ `PROJECT_CONTEXT.md` ที่ต้องเขียนตัวพิมพ์ใหญ่เพื่อเน้นย้ำความสำคัญ

---

## 9. กติกาการเขียน Markdown
* **Heading:** ใช้ `##` และ `###` ในการแบ่งหัวข้อย่อยให้ชัดเจน (ห้ามข้ามระดับ Header)
* **Code Blocks:** ใช้ Code blocks (พร้อมระบุภาษา เช่น `json`, `sql`, `yaml`) ทุกครั้งเมื่อมีการระบุโค้ดหรือโครงสร้าง Data
* **Tables:** ใช้ตารางสรุปข้อมูลให้เป็นระเบียบ เช่น รายชื่อตารางฐานข้อมูล หรือ API Routes
* **Bold/Italic:** เน้นคำสำคัญด้วยตัวหนา (`**`) เพื่อให้ AI จับใจความสำคัญได้ง่าย
* **Checklists:** ใช้ `- [ ]` สำหรับส่วนที่เป็นงานต้องทำหรือ Acceptance Criteria

---

## 10. วิธีใช้เอกสารเหล่านี้กับ AI ในแต่ละ Phase
1. **Preparation:** ก่อนเริ่มทำงานในแต่ละ Phase (หรือเมื่อเริ่ม Session ใหม่) ผู้ใช้ต้องสั่งให้ AI อ่านเอกสาร `SKILL.md` และ `PROJECT_CONTEXT.md` เป็นอันดับแรก
2. **Phase Assignment:** ผู้ใช้สั่งให้ AI อ่าน `10-implementation-plan.md` เพื่อตรวจสอบเป้าหมายของ Phase ปัจจุบัน
3. **Reference:** หาก AI ต้องการข้อมูลเจาะจง (เช่น API หรือ Database) ผู้ใช้หรือ AI จะต้องอ้างอิงและเปิดดูไฟล์ที่เกี่ยวข้อง (เช่น `05-database-design.md`, `06-api-contract.md`) แทนที่จะเดาสุ่ม
4. **Validation:** เมื่อ AI พัฒนาเสร็จใน Phase นั้นๆ ให้กลับมาอ่าน Acceptance Criteria ในเอกสารเพื่อตรวจสอบความครบถ้วนก่อนส่งมอบงาน
