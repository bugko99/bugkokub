const express = require('express');
const { db }  = require('../config/db');

const router = express.Router();

// ─── Helper: check if date string is today ────────────────
function isToday(isoString) {
  const d = new Date(isoString).toDateString();
  return d === new Date().toDateString();
}

// ─── Helper: check overdue ────────────────────────────────
const TERMINAL = ['CLOSED', 'RESOLVED', 'CANCELLED'];

function isOverdue(complaint) {
  if (TERMINAL.includes(complaint.status)) return false;
  return new Date(complaint.due_date) < new Date();
}

// ─────────────────────────────────────────────────────────
// GET /api/dashboard/stats
// สถิติรวมสำหรับ Dashboard Cards
// ─────────────────────────────────────────────────────────
router.get('/stats', (req, res) => {
  const complaints = db.complaints;

  const total      = complaints.length;
  const newToday   = complaints.filter(c => isToday(c.created_at)).length;
  const inProgress = complaints.filter(c =>
    ['FORWARDED', 'IN_PROGRESS'].includes(c.status)
  ).length;
  const overdue    = complaints.filter(isOverdue).length;
  const pending    = complaints.filter(c => c.status === 'PENDING').length;
  const resolved   = complaints.filter(c => c.status === 'RESOLVED').length;
  const closed     = complaints.filter(c => c.status === 'CLOSED').length;

  res.json({
    success: true,
    data: {
      total,
      new_today: newToday,
      in_progress: inProgress,
      overdue,
      pending,
      resolved,
      closed,
    },
  });
});

// ─────────────────────────────────────────────────────────
// GET /api/dashboard/by-agency
// สถิติแยกตามหน่วยงาน (Agency Backlog)
// ─────────────────────────────────────────────────────────
router.get('/by-agency', (req, res) => {
  const complaints = db.complaints;

  // Group by agency
  const agencyMap = {};
  complaints.forEach((c) => {
    if (!agencyMap[c.agency]) {
      agencyMap[c.agency] = { agency: c.agency, total: 0, overdue: 0, in_progress: 0 };
    }
    agencyMap[c.agency].total += 1;
    if (isOverdue(c))                             agencyMap[c.agency].overdue      += 1;
    if (['FORWARDED', 'IN_PROGRESS'].includes(c.status)) agencyMap[c.agency].in_progress += 1;
  });

  const result = Object.values(agencyMap).sort((a, b) => b.total - a.total);

  res.json({ success: true, data: result });
});

// ─────────────────────────────────────────────────────────
// GET /api/dashboard/by-category
// สถิติแยกตามประเภทเรื่องร้องเรียน
// ─────────────────────────────────────────────────────────
router.get('/by-category', (req, res) => {
  const complaints = db.complaints;

  const catMap = {};
  complaints.forEach((c) => {
    if (!catMap[c.category]) catMap[c.category] = { category: c.category, total: 0 };
    catMap[c.category].total += 1;
  });

  const result = Object.values(catMap).sort((a, b) => b.total - a.total);

  res.json({ success: true, data: result });
});

// ─────────────────────────────────────────────────────────
// GET /api/dashboard/by-district
// สถิติแยกตามอำเภอ
// ─────────────────────────────────────────────────────────
router.get('/by-district', (req, res) => {
  const complaints = db.complaints;

  const distMap = {};
  complaints.forEach((c) => {
    if (!distMap[c.district]) distMap[c.district] = { district: c.district, total: 0 };
    distMap[c.district].total += 1;
  });

  const result = Object.values(distMap).sort((a, b) => b.total - a.total);

  res.json({ success: true, data: result });
});

// ─────────────────────────────────────────────────────────
// GET /api/dashboard/overdue
// รายการเรื่องที่เกินกำหนด (สำหรับ Overdue Table)
// ─────────────────────────────────────────────────────────
router.get('/overdue', (req, res) => {
  const overdueList = db.complaints
    .filter(isOverdue)
    .map((c) => ({
      id:             c.id,
      complaint_code: c.complaint_code,
      title:          c.title,
      category:       c.category,
      agency:         c.agency,
      district:       c.district,
      status:         c.status,
      due_date:       c.due_date,
      days_overdue:   Math.floor(
        (new Date() - new Date(c.due_date)) / (1000 * 60 * 60 * 24)
      ),
    }))
    .sort((a, b) => b.days_overdue - a.days_overdue);

  res.json({ success: true, data: overdueList });
});

// ─────────────────────────────────────────────────────────
// GET /api/reports/export?format=csv
// Export ข้อมูลเป็น CSV
// ─────────────────────────────────────────────────────────
router.get('/export', (req, res) => {
  const complaints = db.complaints;

  const headers = [
    'เลขที่เรื่อง',
    'หัวข้อ',
    'ประเภท',
    'อำเภอ',
    'หน่วยงาน',
    'สถานะ',
    'วันที่รับเรื่อง',
    'ครบกำหนด',
    'SLA',
  ];

  const rows = complaints.map((c) => {
    const sla = isOverdue(c) ? 'ล่าช้า' : TERMINAL.includes(c.status) ? 'สำเร็จ' : 'ปกติ';
    const created = new Date(c.created_at).toLocaleDateString('th-TH');
    return [
      c.complaint_code,
      `"${c.title}"`,
      c.category,
      c.district,
      `"${c.agency}"`,
      c.status,
      created,
      c.due_date,
      sla,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="dcms-report.csv"');
  res.send('\uFEFF' + csvContent); // BOM สำหรับให้ Excel อ่าน UTF-8 ได้ถูกต้อง
});

module.exports = router;
