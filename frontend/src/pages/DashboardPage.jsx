import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/client';

const FORMATS = ['pdf', 'docx', 'txt', 'html', 'png', 'jpg'];

const BADGE_MAP = {
  pending:    'badge-pending',
  processing: 'badge-processing',
  completed:  'badge-completed',
  failed:     'badge-failed',
};

const STATUS_LABEL = {
  pending:    '⏳ รอดำเนินการ',
  processing: '⚙️ กำลังแปลง',
  completed:  '✅ สำเร็จ',
  failed:     '❌ ล้มเหลว',
};

export default function DashboardPage() {
  const [jobs,         setJobs]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [uploading,    setUploading]    = useState(false);
  const [dragOver,     setDragOver]     = useState(false);
  const [targetFormat, setTargetFormat] = useState('pdf');
  const [error,        setError]        = useState('');
  const fileRef = useRef(null);

  const fetchJobs = useCallback(async () => {
    try {
      const { data } = await api.get('/jobs');
      setJobs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [fetchJobs]);

  const handleUpload = async (file) => {
    if (!file) return;
    setError('');
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_format', targetFormat);
    try {
      await api.post('/jobs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchJobs();
    } catch (err) {
      setError(err.response?.data?.error || 'อัปโหลดล้มเหลว');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('ยืนยันการลบ?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((j) => j.filter((job) => job.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'ลบล้มเหลว');
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <main>
      {/* Hero */}
      <section className="hero container">
        <h1>แปลงเอกสารของคุณ</h1>
        <p>รองรับ PDF, Word, Text, HTML และรูปภาพ — แปลงได้ง่าย ๆ ในไม่กี่วินาที</p>

        {/* Format selector */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.5rem' }}>
          <label htmlFor="target-format" style={{ color: 'var(--color-muted)', fontWeight: 500 }}>
            แปลงเป็น:
          </label>
          <select
            id="target-format"
            className="form-group"
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value)}
            style={{ margin: 0, minWidth: '110px' }}
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>{f.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Upload zone */}
        <div
          id="upload-zone"
          className={`upload-zone${dragOver ? ' drag-over' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <div className="upload-icon">📁</div>
          {uploading ? (
            <>
              <span className="spinner" style={{ margin: '0 auto .5rem' }} />
              <p>กำลังอัปโหลด...</p>
            </>
          ) : (
            <>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '.35rem' }}>
                คลิกหรือลากไฟล์มาที่นี่
              </p>
              <p>รองรับ PDF, DOCX, TXT, HTML, JPG, PNG — สูงสุด 50 MB</p>
            </>
          )}
        </div>
        <input
          ref={fileRef} type="file" id="file-input"
          style={{ display: 'none' }}
          onChange={(e) => handleUpload(e.target.files[0])}
        />
        {error && <p className="error-msg" style={{ marginTop: '1rem' }}>{error}</p>}
      </section>

      {/* Jobs list */}
      <section className="jobs-section container">
        <h2>งานแปลงทั้งหมด</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <span className="spinner" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '3rem' }}>
            ยังไม่มีงานแปลง — ลองอัปโหลดไฟล์ด้านบน
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ชื่อไฟล์</th>
                  <th>รูปแบบ</th>
                  <th>สถานะ</th>
                  <th>วันที่</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.id}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {job.original_name}
                    </td>
                    <td>
                      <span style={{ color: 'var(--color-muted)', fontSize: '.8rem' }}>
                        {job.source_format?.toUpperCase()} → {job.target_format?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${BADGE_MAP[job.status] || ''}`}>
                        {STATUS_LABEL[job.status] || job.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-muted)', fontSize: '.8rem' }}>
                      {new Date(job.created_at).toLocaleDateString('th-TH')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '.5rem' }}>
                        {job.status === 'completed' && job.converted_path && (
                          <a
                            href={`/converted/${job.converted_path}`}
                            download
                            className="btn btn-outline"
                            style={{ fontSize: '.78rem', padding: '.35rem .8rem' }}
                          >
                            ⬇ ดาวน์โหลด
                          </a>
                        )}
                        <button
                          id={`delete-job-${job.id}`}
                          className="btn btn-danger"
                          style={{ fontSize: '.78rem', padding: '.35rem .8rem' }}
                          onClick={() => handleDelete(job.id)}
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
