const bcrypt = require('bcrypt');

// In-memory mock database
const db = {
  users: [],
  jobs: [],
  complaints: []
};

// Seed a demo user
(async () => {
  const hashedAdmin = await bcrypt.hash('admin123', 10);
  const hashedOfficer = await bcrypt.hash('Officer@123', 10);
  const hashedAgency = await bcrypt.hash('Agency@123', 10);

  db.users.push(
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      password: hashedAdmin,
      role: 'super_admin',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      username: 'officer1',
      email: 'officer@example.com',
      password: hashedOfficer,
      role: 'officer',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      username: 'agency1',
      email: 'agency@example.com',
      password: hashedAgency,
      role: 'agency_officer',
      created_at: new Date().toISOString()
    }
  );

  // ── Seed complaints (ข้อมูลจำลองสำหรับทดสอบ Dashboard) ─────────────
  const today = new Date();
  const mkDate = (daysAgo) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  };
  const mkDue = (daysFromNow) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split('T')[0];
  };

  db.complaints.push(
    { id: 1, complaint_code: 'DCMS-2024-000001', title: 'น้ำประปาไม่ไหล', category: 'สาธารณูปโภค', district: 'เมืองศรีสะเกษ', agency: 'องค์การบริหารส่วนจังหวัด', status: 'CLOSED',      due_date: mkDue(-5),  created_at: mkDate(30) },
    { id: 2, complaint_code: 'DCMS-2024-000002', title: 'ถนนชำรุดเสียหาย', category: 'โครงสร้างพื้นฐาน', district: 'กันทรลักษ์',   agency: 'แขวงทางหลวงชนบท',    status: 'IN_PROGRESS', due_date: mkDue(-2),  created_at: mkDate(20) },
    { id: 3, complaint_code: 'DCMS-2024-000003', title: 'ร้องเรียนเรื่องเสียงดัง', category: 'เดือดร้อนรำคาญ', district: 'ขุขันธ์',        agency: 'เทศบาลตำบลขุขันธ์',   status: 'FORWARDED',   due_date: mkDue(3),   created_at: mkDate(10) },
    { id: 4, complaint_code: 'DCMS-2024-000004', title: 'ปัญหาขยะกองทิ้ง', category: 'สิ่งแวดล้อม',    district: 'ศรีรัตนะ',      agency: 'องค์การบริหารส่วนจังหวัด', status: 'IN_PROGRESS', due_date: mkDue(-1),  created_at: mkDate(15) },
    { id: 5, complaint_code: 'DCMS-2024-000005', title: 'ขอความช่วยเหลือที่ดิน', category: 'ที่ดิน',          district: 'เมืองศรีสะเกษ', agency: 'สำนักงานที่ดิน',          status: 'PENDING',     due_date: mkDue(10),  created_at: mkDate(0) },
    { id: 6, complaint_code: 'DCMS-2024-000006', title: 'ไฟฟ้าดับบ่อยครั้ง', category: 'สาธารณูปโภค', district: 'กันทรลักษ์',   agency: 'การไฟฟ้าส่วนภูมิภาค',   status: 'RESOLVED',    due_date: mkDue(0),   created_at: mkDate(25) },
    { id: 7, complaint_code: 'DCMS-2024-000007', title: 'น้ำท่วมขัง', category: 'สิ่งแวดล้อม',    district: 'ขุขันธ์',        agency: 'เทศบาลตำบลขุขันธ์',   status: 'IN_PROGRESS', due_date: mkDue(-3),  created_at: mkDate(0) },
    { id: 8, complaint_code: 'DCMS-2024-000008', title: 'ขอสิ่งอำนวยความสะดวก', category: 'โครงสร้างพื้นฐาน', district: 'ศรีรัตนะ', agency: 'องค์การบริหารส่วนจังหวัด', status: 'PENDING',     due_date: mkDue(7),   created_at: mkDate(0) }
  );
})();

async function testConnection() {
  console.log('✅ In-memory mock DB initialized successfully (No MySQL)');
}

module.exports = { db, testConnection };
