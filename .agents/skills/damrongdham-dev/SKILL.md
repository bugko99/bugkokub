---
name: damrongdham-dev
description: คู่มือการทำงาน กติกา และมาตรฐานการเขียนโค้ดสำหรับโปรเจกต์ Damrongdham SSK (DocConverter)
---

# 🤖 AI Developer SKILL: damrongdham-dev

คู่มือนี้คือกฎหมายสูงสุดที่ AI ต้องอ่านและยึดถือเป็นแนวทางปฏิบัติในระหว่างการทำงานกับโปรเจกต์ **Damrongdham SSK (DocConverter)**

## 1. Purpose
เอกสารนี้จัดทำขึ้นเพื่อกำหนดขอบเขต มาตรฐาน และพฤติกรรมการทำงานของ AI เพื่อให้การพัฒนาโค้ดเป็นระบบ ตรงตามแผน ไม่หลุดจาก Tech Stack ที่กำหนด และทำให้ผู้พัฒนา (Human Developer) สามารถติดตาม ทบทวน และส่งมอบงานได้อย่างมีประสิทธิภาพ

## 2. Project Working Principles
* **Read Before Act:** AI ต้องอ่านเอกสารนี้ทุกครั้งก่อนเริ่มงาน
* **Context is King:** AI ต้องอ่าน `docs/planning/PROJECT_CONTEXT.md` ก่อนเริ่มเขียนโค้ดเสมอ
* **Stick to the Plan:** AI ต้องอ่าน `docs/planning/10-implementation-plan.md` เพื่อเช็คเป้าหมายของ Phase ปัจจุบันเสมอ

## 3. AI General Rules
* ตอบให้กระชับ ชัดเจน และพุ่งเป้าไปที่การแก้ปัญหา
* ก่อนเริ่มเขียนหรือแก้ไขไฟล์ ให้ระบุรายชื่อไฟล์ทั้งหมดที่จะได้รับผลกระทบเสมอ
* หากเกิดข้อสงสัยหรือความต้องการจากผู้ใช้มีความคลุมเครือ ให้หยุดเพื่อสอบถามและนำเสนอทางเลือก (Options) ทันที ห้ามเดาสุ่มเด็ดขาด

## 4. Planning Rules
* ห้ามข้ามขั้นตอน Planning 
* โค้ดจะถูกเขียนได้ต่อเมื่อมี Implementation Plan ที่ผ่านการอนุมัติแล้วเท่านั้น
* โครงสร้างโฟลเดอร์ต้องสอดคล้องกับโครงสร้างมาตรฐานที่ตกลงกันไว้ (React/Express/Docker)

## 5. Implementation by Phase Rules
* **Strict Phase Assignment:** ทำงานเฉพาะใน Phase ที่ได้รับมอบหมายเท่านั้น
* **No Leaping:** ห้ามลงมือทำหรือเสนอโค้ดสำหรับ Phase ถัดไปล่วงหน้า
* **Scope Lock:** ห้ามแอบเพิ่มฟีเจอร์นอกเหนือจากที่ระบุใน Planning
* **Validation:** ทุก Phase ที่สำเร็จ ต้องมีวิธีรัน วิธีทดสอบ และ Acceptance Criteria Checklist ให้ผู้ใช้ตรวจสอบเสมอ

## 6. Frontend Development Rules
* **Tech:** `React 18` + `Vite 5` + `MUI 5`
* จัดการโครงสร้าง Component แบบ Modular แยกระหว่าง UI Components และ Business Logic
* ใช้ MUI 5 เป็นหลักในการวางโครงสร้างและตกแต่งหน้าจอ
* ใช้พอร์ต `5173` สำหรับ Dev

## 7. Backend Development Rules
* **Tech:** `Node.js 20 LTS` + `Express 4`
* แยกโฟลเดอร์ให้ชัดเจน เช่น Routes, Controllers, Models, Services, Middlewares
* คืนค่า (Response) เป็นรูปแบบ JSON ที่มีโครงสร้างมาตรฐานเดียวกันทั้งแอปพลิเคชัน
* ใช้พอร์ต `5001` (หลีกเลี่ยงพอร์ต 5000 เพื่อแก้ปัญหา macOS conflict)

## 8. Database Development Rules
* **Tech:** `MySQL 8`
* การติดต่อ DB จากฝั่ง Backend ให้กระทำผ่าน Services หรือ Models ห้ามให้ Controller สั่ง Query ตรงๆ
* Schema หรือ โครงสร้างตารางต้องเป็นไปตามที่ Planning กำหนดเท่านั้น

## 9. API Development Rules
* ออกแบบ API สไตล์ RESTful (เช่น `GET /api/users`, `POST /api/jobs`)
* ห้ามปรับแก้ API Contract (Request/Response format) โดยไม่มีเหตุผลอันควร หากจำเป็นต้องแก้ ต้องแจ้งเหตุผลและขออนุมัติก่อน

## 10. Docker Development Rules
* **Tech:** `Docker Compose` (สำหรับการพัฒนา) / `Railway` (สำหรับ Production)
* `docker-compose.yml` ต้องไม่มีแอตทริบิวต์ `version`
* พอร์ตการเชื่อมต่อ: MySQL Host `3307` ➡️ Container `3306`, phpMyAdmin Host `8081` ➡️ Container `80`
* Service ภายในต้องคุยกันผ่าน **Service Name และ Internal Port** เท่านั้น (เช่น `db:3306`) ห้ามใช้ `localhost`
* Production จะ Deploy ขึ้น Railway ด้วย `Dockerfile` (Multi-stage, Single-container) โดยไม่ใช้ Nginx แยก

## 11. Testing Rules
* ทุก Phase ต้องกำหนดวิธีการทดสอบ (Manual / Curl / UI Test) ที่ชัดเจนและผู้ใช้ทำตามได้ทันที
* ต้องคำนึงถึง Edge Cases เบื้องต้น (เช่น กรณี User ส่งข้อมูลผิด, ข้อมูลไม่มีในระบบ, Token หมดอายุ)

## 12. Debugging Rules
* หากผู้ใช้แจ้ง Error ให้วิเคราะห์บริบทอย่างเป็นขั้นตอน เริ่มตั้งแต่ Docker logs, Network issues, ไปจนถึง Code logic
* ห้ามแก้ปัญหาด้วยวิธีข้ามขั้นตอนความปลอดภัย หรือปิดฟังก์ชัน Healthcheck 

## 13. Documentation Rules
* หากมีการแก้ Logic ที่มีผลต่อ Architecture ให้แจ้งผู้ใช้เพื่ออัปเดตไฟล์ใน `docs/planning/`
* ทุกครั้งที่มีการแก้ไข Environment Variable ต้องแจ้งอัปเดตไฟล์ `.env.example` หรือ `README.md` ด้วย

## 14. Git Commit Rules
* แนะนำคำสั่ง `git commit -m` พร้อมข้อความที่อิงตามหลัก **Conventional Commits** ท้ายทุก Phase
* ตัวอย่าง: `feat(auth): implement user login API` หรือ `fix(docker): correct mysql port mapping`

## 15. Security Rules
* **No Secrets in Code:** ห้ามใส่ Password, Token, หรือ Credentials จริงลงในโค้ดหรือเอกสารเด็ดขาด ให้ใช้ตัวแปรสภาพแวดล้อม (Env Vars) แทน
* ป้องกัน SQL Injection เบื้องต้น (ใช้ Parameterized Queries เสมอ)

## 16. Forbidden Actions
* ห้ามเพิ่ม Feature นอกแผน
* ห้ามเปลี่ยน Architecture / Tech Stack ถ้าไม่จำเป็น (หากจำเป็น ต้องขออนุมัติพร้อมอธิบายเหตุผล)
* ห้ามทำ Phase หน้าล่วงหน้า

## 17. Required Response Format
เมื่อ AI ตอบกลับผู้ใช้งาน ควรใช้รูปแบบต่อไปนี้:
* เริ่มด้วยการสรุปสั้นๆ ว่าจะทำอะไร
* **Files Affected:** ระบุรายชื่อไฟล์ทั้งหมดที่เกี่ยวข้อง
* **Code Blocks:** นำเสนอโค้ดพร้อมคำอธิบายจุดที่สำคัญ
* **Next Steps:** แจ้งว่าผู้ใช้ต้องทำอะไรต่อ (เช่น รันคำสั่งอะไร)

## 18. Phase Completion Report Format
หลังจบแต่ละ Phase, AI ต้องสรุปรายงานรูปแบบนี้เสมอ:

```markdown
## 🏁 Phase [X] Completion Report

**✅ What was done:**
- [สรุปสิ่งที่พัฒนา]
- [สรุปสิ่งที่พัฒนา]

**🧪 How to Run & Test:**
1. [คำสั่งหรือวิธีการรัน]
2. [วิธีทดสอบด้วยตาหรือ Curl]

**📋 Acceptance Criteria Checklist:**
- [x] [เกณฑ์ข้อ 1]
- [x] [เกณฑ์ข้อ 2]

**📝 Suggested Git Commit:**
\`git commit -m "feat(scope): your descriptive message"\`

**🚀 Ready for Phase [X+1]?**
(รอคำยืนยันจากผู้ใช้เพื่อไปยัง Phase ถัดไป)
```
