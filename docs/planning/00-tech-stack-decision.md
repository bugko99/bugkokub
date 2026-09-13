# Tech Stack Decision

## 1. Project Name
ระบบรับเรื่องร้องเรียนศูนย์ดำรงธรรมจังหวัดศรีสะเกษ (DCMS - Damrongdhama Center Management System)

## 2. Purpose of the System
เป็นระบบสำหรับรับเรื่องร้องเรียนของศูนย์ดำรงธรรมจังหวัดศรีสะเกษ เพื่ออำนวยความสะดวกในการจัดการและติดตามเรื่องร้องเรียนต่างๆ

## 3. Selected Tech Stack
* **Frontend:** React 18 + Vite 5 + MUI 5
* **Backend:** Node.js 20 LTS + Express 4
* **Database:** MySQL 8
* **Docker:** Docker Compose (Dev)
* **Database Tool:** phpMyAdmin (Dev)
* **Deploy:** Railway (single-container จาก Dockerfile multi-stage)

## 4. Reason for Each Technology
* **React 18 + Vite 5:** เป็นมาตรฐานปัจจุบันสำหรับการพัฒนา Frontend ช่วยให้ build และ hot reload ได้รวดเร็วมากยิ่งขึ้น
* **MUI 5:** เป็น UI Component Library ที่ครอบคลุม มีความเป็นมืออาชีพ และช่วยให้พัฒนาหน้าจอได้รวดเร็ว
* **Node.js 20 LTS + Express 4:** เสถียรและมีคอมมูนิตี้ที่แข็งแกร่ง เหมาะสมกับโครงสร้างสถาปัตยกรรมแบบ API-driven
* **MySQL 8:** ฐานข้อมูลเชิงสัมพันธ์ที่มีความน่าเชื่อถือ รองรับภาษาไทยได้สมบูรณ์แบบ
* **Docker Compose:** ช่วยให้การตั้งค่า Development Environment บนเครื่องของทีมเป็นมาตรฐานเดียวกัน
* **Railway:** บริการ PaaS ที่ใช้งานง่าย รองรับการ deploy ผ่าน Dockerfile และจัดการ SSL/Domain ให้อัตโนมัติ

## 5. Development Environment
* **Frontend:** รันผ่าน Vite ที่ Port `5173` รองรับระบบ Hot Reload
* **Backend:** รันผ่าน Express ที่ Port `5001` (หลีกเลี่ยง Port 5000 เพราะอาจชนกับ AirPlay Receiver ของ macOS) และรองรับ Hot Reload ด้วย nodemon
* **MySQL 8:** ใช้ Host Port `3307` map เข้าไปยัง Container Port `3306`
* **phpMyAdmin:** ใช้ Host Port `8081` map เข้าไปยัง Container Port `80` (สำหรับ Apple Silicon M1/M2/M3/M4 อาจต้องระบุ `platform: linux/amd64`)
* **Volume Strategy:** 
  * ใช้ **bind mounts** สำหรับ Frontend และ Backend เพื่อรองรับ Hot Reload
  * ใช้ **anonymous volume** สำหรับ `node_modules` ป้องกันปัญหา host overwrite และ architecture ของ host กับ container ไม่ตรงกัน
* **Docker Compose Config:** ไม่ต้องระบุ `version` (เนื่องจากเป็น attribute ที่ล้าสมัยแล้ว)
* **Database Init:** วาง SQL script เริ่มต้นที่ `db/init/01-init.sql` โดยต้องกำหนด charset/collation รองรับภาษาไทย (เช่น `utf8mb4`)
* **Healthcheck:** MySQL ต้องมีการกำหนด healthcheck และ Service ที่เชื่อมต่อกับ DB ต้องใช้ `depends_on` ร่วมกับ `condition: service_healthy`

## 6. Production Environment
* **Primary Target:** Railway (รันด้วย root `Dockerfile` แบบ multi-stage สำหรับ single-container app)
* **Web Server/SSL:** Railway เป็นผู้จัดการเรื่องโดเมนและ SSL ให้อัตโนมัติ ไม่จำเป็นต้องใช้ Nginx แยก
* **Alternative/On-premise (Ubuntu):** สามารถนำ Image/App ชุดเดียวกันไปทำงานร่วมกับ MySQL และ Nginx reverse proxy ได้ โดยห้ามผูกมัดโค้ดเข้ากับแพลตฟอร์มใดแพลตฟอร์มหนึ่ง
* **Configuration:** ห้าม Hardcode ค่าความลับ (Secrets) ใน Source code เด็ดขาด ให้จัดการผ่าน Environment Variables เท่านั้น
* **File Storage:** ระบบไฟล์ของ Railway เป็นแบบ Ephemeral (หายไปเมื่อรีสตาร์ท) หากในอนาคตมีฟีเจอร์อัปโหลดไฟล์ จะต้องใช้ Railway Volume หรือ Object Storage ภายนอก

## 7. Tools Required
* Docker Desktop หรือ Docker Engine พร้อม Docker Compose Plugin
* Git
* Node.js (ทางเลือกหากต้องการรันคำสั่งภายนอก container)
* Editor: VS Code (หรือเทียบเท่า)

## 8. Folder Strategy เบื้องต้น
* `/frontend`: สำหรับ Source code ของ React
* `/backend`: สำหรับ Source code ของ Node.js/Express
* `/db/init`: สำหรับไฟล์ Initial Database SQL
* `/docs`: สำหรับเก็บเอกสารที่เกี่ยวข้อง
* `docker-compose.yml`: สำหรับกำหนด Service ทั้งหมด
* `Dockerfile` (root): สำหรับทำ Production Multi-stage Build
* `.env`: สำหรับกำหนดค่าตัวแปรใน Dev

## 9. Constraints
* ฐานข้อมูลหลักคือ MySQL 8
* ห้ามเก็บ Secrets ใน Source code
* การนำระบบขึ้น Production ต้องทำงานได้บน Railway แบบ Single-container
* ไม่มีการอัปโหลดไฟล์ในเวอร์ชันเริ่มต้น (เนื่องจากข้อจำกัด Ephemeral file system)

## 10. Assumptions
* ผู้พัฒนาทุกคนมีสิทธิ์เข้าถึง Docker Environment บนเครื่องตนเอง
* เซิร์ฟเวอร์ฐานข้อมูล Production จะถูกสร้างแยกต่างหาก (บน Railway หรือบริการ Database الاื่น)

## 11. Open Questions
* รูปแบบโครงสร้าง Folder ภายในของ Frontend และ Backend ที่เหมาะสม
* เครื่องมือสำหรับทำ Database Migration หรือใช้เพียงแค่ SQL Script?

## 12. Key Decisions
* เปลี่ยนการทำงานจากระบบหลาย Container บน Production มาเป็นการรวม Frontend/Backend เข้าใน Single-container Multi-stage Dockerfile เพื่อความสะดวกในการใช้ Railway
* ใช้ Docker Compose เฉพาะสำหรับการ Development เท่านั้น
* เลี่ยง Port 5000 เพื่อแก้ปัญหา macOS

## 13. Docker Service Map & Port Mapping
| Service | Host Port | Container Port | Purpose |
| --- | --- | --- | --- |
| frontend | 5173 | 5173 | React (Vite) |
| backend | 5001 | 5001 | Node.js (Express) |
| db | 3307 | 3306 | MySQL 8 |
| phpmyadmin | 8081 | 80 | Database Admin |

## 14. Docker Network Rules
* ทุก Service ใน Development จะต้องเชื่อมโยงกันใน Custom Docker bridge network เดียวกัน
* การเชื่อมต่อระหว่าง Backend (และ phpMyAdmin) ไปหา MySQL จะต้องอ้างอิงชื่อ Service เป็น `db` และเชื่อมต่อผ่าน Internal Port `3306`
* ห้ามใช้ `localhost` ในการให้ Container ติดต่อกันเอง

## 15. Environment Variable Strategy
* ควบคุมการตั้งค่าทั้งหมดผ่านไฟล์ `.env` เพียงจุดเดียว
* อ้างอิงตัวแปรใน `docker-compose.yml` ด้วย syntax `${VARIABLE:-default}` เพื่อลดข้อผิดพลาดหากตัวแปรบางตัวหายไป

## 16. Known Setup Risks / Lessons Learned
* **Port Conflict:** Port 5000 อาจชนกับบริการของ macOS (AirPlay Receiver) ทำให้รันไม่ขึ้น จึงเปลี่ยนมาใช้ backend port 5001 แทน
* **Architecture Mismatch:** การรัน phpMyAdmin บน Apple Silicon อาจเกิดปัญหา ไม่เจอ Image หรือ Error จึงอาจต้องกำหนด `platform: linux/amd64`
* **Docker Compose Versioning:** `version` ในไฟล์ `docker-compose.yml` เป็น attribute ที่ล้าสมัยแล้ว ไม่ควรนำมาใส่
* **Node Modules Conflict:** 
  * ไดเรกทอรี `node_modules` ใน Docker อาจเกิดปัญหากับ `node_modules` ฝั่ง Host จึงควรใช้ anonymous volume
  * ทุกครั้งที่มีการแก้ไข/เพิ่ม Package ใหม่ใน `package.json` จะต้อง rebuild container เสมอ
* **Startup Race Condition:** 
  * Backend อาจเชื่อมต่อ DB ไม่ได้และล้มเหลวหากรันขึ้นมาก่อนที่ MySQL จะพร้อมทำงาน 
  * ต้องเพิ่ม MySQL healthcheck และในฝั่งของ backend/phpmyadmin ต้องมี `depends_on` ที่รอ DB พร้อมด้วย `condition: service_healthy`
