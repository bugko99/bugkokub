import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function RegisterPage() {
  const [form,    setForm]    = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box card">
        <h1>สมัครสมาชิก</h1>
        <p className="sub">สร้างบัญชีใหม่</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">ชื่อผู้ใช้</label>
            <input
              id="username" type="text" name="username"
              value={form.username} onChange={handleChange}
              placeholder="johndoe" required
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-email">อีเมล</label>
            <input
              id="reg-email" type="email" name="email"
              value={form.email} onChange={handleChange}
              placeholder="john@example.com" required
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-password">รหัสผ่าน</label>
            <input
              id="reg-password" type="password" name="password"
              value={form.password} onChange={handleChange}
              placeholder="อย่างน้อย 6 ตัวอักษร" minLength={6} required
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button
            id="register-btn" type="submit"
            className="btn btn-primary" style={{ width: '100%', marginTop: '.5rem' }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'สมัครสมาชิก'}
          </button>
        </form>
        <p style={{ marginTop: '1.25rem', textAlign: 'center', color: 'var(--color-muted)', fontSize: '.875rem' }}>
          มีบัญชีแล้ว?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
