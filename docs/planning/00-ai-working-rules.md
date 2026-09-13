# AI Working Rules

## 1. General AI Rules
* **Strict Adherence:** AI ต้องปฏิบัติตามกติกานี้อย่างเคร่งครัด
* **Context Awareness:** AI ต้องเข้าใจบริบทของโปรเจกต์ (Damrongdham SSK / ระบบ DocConverter) รวมถึง Tech Stack และ Environment ที่กำหนด
* **No Assumption of Secrets:** ห้ามคาดเดาหรือสร้างรหัสผ่านจริง ให้ใช้ placeholder เสมอ

## 2. Planning Rules
* **Plan Before Code:** ห้ามเขียน Code หรือสร้างโครงสร้างโปรเจกต์ใดๆ จนกว่าขั้นตอน Planning จะเสร็จสิ้นและได้รับการอนุมัติ
* **Strict Scope:** ห้ามเพิ่ม Feature หรือแก้ไขสิ่งที่อยู่นอกเหนือแผนการทำงานปัจจุบัน
* **Reasoned Changes:** ห้ามเปลี่ยน Tech Stack, Database Schema, API Contract หรือ Project Structure โดยไม่มีเหตุผลอันควร หากจำเป็นต้องเปลี่ยนแปลงจากแผนเดิม ต้องแจ้งเหตุผลและขออนุมัติก่อนเสนอโค้ด

## 3. Implementation Rules
* โค้ดต้องสอดคล้องกับโครงสร้างและเครื่องมือที่ตกลงไว้ (React 18, Vite 5, Node.js 20, Express 4, MySQL 8)
* ปฏิบัติตามมาตรฐานการโค้ดของแต่ละภาษา/เฟรมเวิร์กอย่างเคร่งครัด
* โค้ดที่สร้างขึ้นต้องคำนึงถึง Security, Performance และความสามารถในการขยาย (Scalability) ตั้งแต่ต้น

## 4. Phase Control Rules
* **No Phase Jumping:** ห้ามทำงานข้าม Phase หรือทำเกินขอบเขตของ Phase ที่กำหนดให้ทำอยู่ในปัจจุบัน
* **Phase Requirements:** ทุก Phase ต้องมีการระบุ **วิธีรัน**, **วิธีทดสอบ**, และ **Acceptance Criteria** อย่างชัดเจน
* **Phase Completion:** หลังจบการทำงานในแต่ละ Phase ต้องมี **Phase Completion Report** เพื่อสรุปสิ่งที่ทำไป และต้องมี **Git Commit Message ที่แนะนำ** ทุกครั้ง

## 5. Code Generation Rules
* ผลลัพธ์โค้ดที่สร้างต้องสามารถนำไปใช้งานได้จริง ไม่ใช่เพียงแค่โค้ดตัวอย่างที่ตัดทอนจนใช้งานไม่ได้
* หากมีโค้ดส่วนไหนที่เป็น Boilerplate ต้องแจ้งให้ทราบ
* การสร้างไฟล์ใหม่ต้องอ้างอิงและสอดคล้องกับ Folder Strategy ที่วางแผนไว้

## 6. Debugging Rules
* เมื่อเกิดข้อผิดพลาด (Error) AI ต้องวิเคราะห์สาเหตุที่เป็นไปได้ตามบริบทของ Docker, Network, หรือ Code ก่อนเสนอทางแก้
* ให้คำแนะนำในการตรวจสอบ Logs ของ Docker Container ที่เกี่ยวข้อง
* ห้ามเสนอทางแก้ด้วยวิธีปิดระบบความปลอดภัยหรือข้ามขั้นตอน Healthcheck

## 7. Documentation Rules
* เอกสาร Planning หรือ API Specs ต้องอัปเดตเสมอหากมีการเปลี่ยนแปลงระหว่าง Implementation
* การเขียนคู่มือต้องชัดเจน เป็นขั้นตอน (Step-by-step) และอ่านเข้าใจง่าย

## 8. Testing Rules
* ทุก API หรือ Feature ที่เพิ่มเข้ามาใหม่ ต้องมีวิธีทดสอบที่ทำตามได้จริง
* ต้องครอบคลุมถึงกรณี Error/Edge cases ขั้นพื้นฐาน

## 9. Git Commit Rules
* ใช้รูปแบบ **Conventional Commits** เป็นหลัก (เช่น `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`)
* ทุก Phase ต้องมีการเสนอ Commit Message ที่ชัดเจน สอดคล้องกับเนื้องานที่ทำเสร็จ
* ห้าม Commit Secrets, Production Credentials, Token หรือข้อมูลส่วนบุคคลจริงลงใน Repository อย่างเด็ดขาด

## 10. Forbidden Actions
* ห้ามเขียน Code ก่อน Planning เสร็จ
* ห้ามทำเกิน Phase ที่กำหนด
* ห้ามเพิ่ม Feature นอกแผน
* ห้ามเปลี่ยน Tech Stack โดยไม่ได้รับอนุญาต
* ห้ามเปลี่ยน Database Schema, API Contract หรือ Project Structure โดยไม่มีเหตุผล

## 11. Required Output Format
* ผลลัพธ์ต้องจัดรูปแบบเป็น Markdown ที่อ่านง่าย
* มีการใช้ Heading, Bullet point, Code block ที่เหมาะสม
* ไม่รวมโค้ดนอกบล็อก หรือใช้คำอธิบายที่เยิ่นเย้อเกินความจำเป็น

## 12. How AI Should Ask Questions
* ถามทีละประเด็น หรือแยกเป็นข้อๆ ให้ชัดเจน
* หากมีตัวเลือก ให้เสนอทางเลือก (Options) พร้อมข้อดี-ข้อเสีย เพื่อให้ผู้พัฒนาตัดสินใจง่ายขึ้น

## 13. How AI Should Handle Unclear Requirements
* หากความต้องการไม่ชัดเจน หรือมีความขัดแย้งในเอกสาร AI ต้องหยุดและตั้งคำถามเพื่อยืนยันความต้องการที่แท้จริงก่อน
* ห้ามเดาหรือตัดสินใจเรื่องสำคัญ (Core Logic/Architecture) แทนผู้ใช้เด็ดขาด

## 14. How AI Should Report Changes
* ทุกครั้งที่แก้ไข Architecture, Flow หรือ Logic สำคัญ ต้องสรุปการเปลี่ยนแปลง (What Changed & Why) ให้เห็นภาพรวมเสมอ

## 15. Docker Development Rules
* ใช้ `docker-compose.yml` สำหรับ Development Environment
* ห้ามระบุคำสั่ง `version` ในไฟล์ `docker-compose.yml` (ล้าสมัยแล้ว)
* **Port Mapping:**
  * Frontend: ใช้ Port `5173`
  * Backend: ใช้ Port `5001` (หลีกเลี่ยง Port `5000` เนื่องจาก macOS AirPlay Receiver อาจใช้งานอยู่)
  * MySQL: Host Port `3307` ➡️ Container Port `3306`
  * phpMyAdmin: Host Port `8081` ➡️ Container Port `80`
* **Apple Silicon:** หากใช้งานบน M1/M2/M3/M4 และ Image ไม่รองรับ ARM โดยตรง ให้พิจารณาใส่ `platform: linux/amd64` เฉพาะกับ Service ที่มีความจำเป็น (เช่น phpMyAdmin)
* **Volumes:** ใช้ `bind mounts` สำหรับ Source Code เพื่อทำ Hot Reload และใช้ `anonymous volume` สำหรับ `node_modules`
* **Network & DB Connection:** Backend และ phpMyAdmin ต้องติดต่อ Database ผ่าน Service Name `db` และ Internal Port `3306` ห้ามใช้ `localhost`
* **Healthcheck:** MySQL ต้องมีการตั้งค่า `healthcheck` และทุก Service ที่พึ่งพาฐานข้อมูลจะต้องตั้งค่า `depends_on` พร้อม `condition: service_healthy`
* **Dependency Updates:** เมื่อมีการเพิ่ม Dependency ใหม่ ต้องแจ้งว่าให้ทำเพียงการ Rebuild Container หรือ Restart Service เท่านั้น ไม่ให้ลบทิ้งทำใหม่ถ้าไม่จำเป็น

## 16. Git / GitHub Workflow Rules
* ก่อน Commit ต้องแนะนำให้ตรวจสอบ `git status` และตรวจให้แน่ใจเสมอว่าไฟล์ `.env` ไม่ถูก Track
* ไฟล์ `.gitignore` ต้องครอบคลุมไฟล์/โฟลเดอร์สำคัญ: `.env`, `node_modules`, `dist`, logs และไฟล์ Local ที่ไม่ควร Commit
* หากมีการเปลี่ยนแปลงคำสั่งรัน, Dependency, Port หรือ Workflow ใดๆ ต้องอัปเดตไฟล์ `README.md` เสมอ
* หากยังไม่มี `README.md` ที่สมบูรณ์ AI ต้องเสนอหัวข้อให้ครบถ้วน ได้แก่: Project Name, Description, Tech Stack, Install/Run, Port Mapping, Docker Commands, Folder Structure, License/Owner
* อนุญาตให้ใช้ GitHub CLI (`gh`) ได้ แต่ **ห้าม** ทำขั้นตอน Login/Authorize แทนผู้ใช้โดยไม่แจ้งให้ทราบล่วงหน้า

## 17. Skill / Project Instruction Rules
* AI ต้องอ่านเอกสาร Project Instruction หรือ Skill ที่เกี่ยวข้องก่อนเริ่มปฏิบัติงานทุกครั้ง
* หากมีโฟลเดอร์ทักษะที่ `.agents/skills/[skill-name]/SKILL.md` ให้ใช้ร่วมกับเอกสาร Planning เป็นแหล่งกติกาหลัก
* กฎการตั้งชื่อ Skill: ใช้พิมพ์เล็กทั้งหมด และคั่นด้วยเครื่องหมาย `-` (เช่น `damrongdham-dev`)
* โครงสร้าง `SKILL.md`: 
  * ต้องมี YAML Frontmatter ประกอบด้วย `name` และ `description` ที่สั้น ชัดเจน สอดคล้องกับโปรเจกต์
  * ต้องมีเนื้อหาครอบคลุม: When to Use, When NOT to Use, Project Architecture, Service Map & Ports, Network Rules, Environment Variables, Commands, Coding Guidelines, Output Format และ Examples
* หลีกเลี่ยงการนำข้อมูลที่ยาวมากๆ (เช่น API Spec หรือ DB Schema ทั้งหมด) ใส่ใน Skill ให้ใช้วิธีอ้างอิง (Reference) ไปยังเอกสารใน `docs/planning/` แทน
* เมื่อใดก็ตามที่ Architecture, Ports, Service หรือ Convention เปลี่ยนแปลง ต้องพิจารณาเสนอการอัปเดต Skill และเอกสาร Planning ให้ตรงกันเสมอ

## 18. Environment & Secret Handling Rules
* ใช้ไฟล์ `.env` สำหรับ Local Development เท่านั้น และใช้ `.env.example` สำหรับเป็นโครงสร้างแม่แบบให้ทีม
* ห้ามใส่ Secret จริงใน Source Code, Prompt, README หรือเอกสาร Planning อย่างเด็ดขาด
* สำหรับ Production Environment ให้จัดการค่าการตั้งค่าต่างๆ ผ่าน Platform Environment Variables (เช่น Variables ใน Railway) เท่านั้น
* เมื่อ AI จำเป็นต้องแสดงตัวอย่างไฟล์ Config ต้องใช้ Placeholder (เช่น `your_super_secret_key_here`) แทนค่าจริงเสมอ
