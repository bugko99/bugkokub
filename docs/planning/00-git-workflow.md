# Git Workflow & Commit Rules

เอกสารนี้กำหนดมาตรฐานการทำงานกับ Git สำหรับโปรเจกต์ DocConverter (Damrongdham SSK) เพื่อให้มั่นใจว่าประวัติการทำงานชัดเจน และสามารถย้อนกลับ (Rollback) ได้อย่างปลอดภัยในทุกขั้นตอนเมื่อทำงานร่วมกับ AI

---

## 1. Branch Strategy
เนื่องจากการทำงานร่วมกับ AI มักจะเป็นแบบรวดเร็วและเป็นลำดับขั้น แนะนำให้ใช้โครงสร้าง Branch ที่เรียบง่าย:
* **`main`**: กิ่งหลักสำหรับโค้ดที่ผ่านการทดสอบและพร้อมใช้งานเสมอ (Production-ready)
* **`dev` (Optional)**: หากมีการพัฒนาที่เสี่ยงหรือกินเวลาหลาย Phase ให้แยกกิ่งออกมาทำ เมื่อพร้อมจึง Merge กลับเข้า `main`

## 2. Commit Convention
โปรเจกต์นี้ยึดหลักการตั้งชื่อตาม **Conventional Commits** เพื่อให้ง่ายต่อการอ่านและการสร้าง Changelog อัตโนมัติ:
* `feat:` ฟีเจอร์ใหม่
* `fix:` แก้ไขบั๊กหรือข้อผิดพลาด
* `docs:` แก้ไขหรือเพิ่มเอกสาร (เช่น โฟลเดอร์ `docs/` หรือ `README.md`)
* `chore:` อัปเดตเครื่องมือ, config, dependency, หรือ Docker (ไม่มีผลกระทบกับโค้ดหลัก)
* `refactor:` ปรับปรุงโครงสร้างโค้ดโดยไม่เปลี่ยนการทำงาน
* `test:` เพิ่มหรือแก้ไขโค้ดที่เกี่ยวกับการทดสอบ

## 3. Commit Message Format
รูปแบบของ Commit Message ควรเป็นไปตามมาตรฐานดังนี้:
```text
<type>([optional scope]): <description>

[optional body details or explanation]
```
*(เน้นเฉพาะบรรทัดแรกให้กระชับ ชัดเจน และเป็นพิมพ์เล็กทั้งหมด)*

## 4. When to Commit
* ห้ามดองโค้ดนานๆ (Don't accumulate big changes)
* ให้ Commit ทุกครั้งเมื่อจบงานย่อยที่มีความหมายในตัวมันเอง
* ก่อน Commit ต้องตรวจดู `git status` เสมอ เพื่อให้แน่ใจว่าไม่ได้รวมไฟล์ความลับเข้าไป

## 5. Commit per Planning Step
* ในช่วงของการวางแผน (Planning) ต้องทำการ Commit เมื่อเอกสารหรือแผนนั้นเสร็จสมบูรณ์ 1 เรื่อง เพื่อให้มีจุด Checkpoint ก่อนเริ่มสเต็ปต่อไป
* *ตัวอย่าง:* เมื่อเขียน 01-system-overview จบ ให้รัน `git commit -m "docs: add system overview"`

## 6. Commit per Implementation Phase
* หลังจบแต่ละ Phase ที่ตกลงกันไว้ (ตาม `10-implementation-plan.md`) จะต้อง **บังคับ Commit ทันที 1 ครั้งเป็นอย่างน้อย**
* ช่วยให้หาก Phase ถัดไปพัง เราสามารถย้อนกลับมาที่จุดจบ Phase ก่อนหน้าได้อย่างไร้รอยต่อ
* *ตัวอย่าง:* `feat: complete phase 1 project setup`

## 7. Commit after Bug Fix
* เมื่อพบ Bug และทำการแก้ไขสำเร็จ ต้องแยก Commit ของ Bug นั้นๆ ออกมาต่างหาก ห้ามรวมไปกับการทำฟีเจอร์ใหม่
* *ตัวอย่าง:* `fix: resolve backend database connection`

## 8. Rollback Strategy
* หากเกิดปัญหาขั้นรุนแรงระหว่างทำงานใน Phase ปัจจุบัน ให้ใช้คำสั่ง `git checkout .` หรือ `git reset --hard HEAD` เพื่อลบล้างสิ่งที่ทำพลาด และกลับไปยัง Checkpoint ล่าสุด (จบ Phase ที่แล้ว)
* หากทำไปแล้วหลาย Commit ให้ใช้ `git revert <commit-hash>` เพื่อสร้าง commit ใหม่ที่ย้อนการกระทำเดิม (ปลอดภัยต่อประวัติ)

---

## 9. Files that Should Be Committed
* ไฟล์ Source Code ทั้งหมด (`frontend/`, `backend/`)
* ไฟล์ Configuration (`package.json`, `vite.config.js`, `docker-compose.yml`, `Dockerfile`)
* ไฟล์เอกสารโปรเจกต์ (`docs/`, `README.md`, `SKILL.md`)
* ไฟล์ตัวอย่าง Config (`.env.example`)

## 10. Files that Should Not Be Committed
* รหัสผ่านจริงหรือความลับ (`.env`, `*.pem`, `*.key`)
* โฟลเดอร์ที่ถูกสร้างอัตโนมัติหรือโหลดมา (`node_modules/`, `dist/`, `build/`)
* ไฟล์ขยะของ OS หรือ Editor (`.DS_Store`, `.vscode/`, `.idea/`)
* ไฟล์ฐานข้อมูลชั่วคราวหรือ Logs (`*.log`, ข้อมูลใน database volumes)

---

## 11. Suggested `.gitignore` Rules
*(ตัวอย่างข้อบังคับเบื้องต้นสำหรับไฟล์ `.gitignore` ของโปรเจกต์นี้)*
```gitignore
# Dependencies
node_modules/
package-lock.json      # (หากต้องการใช้ yarn หรือ pnpm ให้ละเว้นไฟล์ lock ที่ไม่ตรงกัน)

# Secrets & Environment
.env
.env.production

# Build outputs
dist/
build/
.next/

# Logs & Databases
*.log
npm-debug.log*
db/data/

# OS / Editor Files
.DS_Store
.vscode/
.idea/
```

---

## 12. Example Commit Messages
ตัวอย่างการเขียน Commit Messages ในสถานการณ์ต่างๆ ของโปรเจกต์:

**Planning Phase:**
* `docs: add tech stack decision`
* `docs: add AI working rules`
* `docs: add system overview`
* `docs: add project context`

**Implementation Phase:**
* `feat: complete phase 1 project setup`
* `feat(frontend): create login page and routing`
* `feat(backend): implement job conversion api`

**Fixes & Chores:**
* `fix: resolve backend database connection`
* `fix(docker): correct internal port mapping for mysql`
* `chore: update docker compose configuration`
* `refactor: extract api logic into separate controller files`
