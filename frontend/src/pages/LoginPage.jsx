import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form,    setForm]    = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box card">
        <h1>เข้าสู่ระบบ</h1>
        <p className="sub">ยินดีต้อนรับกลับมา</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">ชื่อผู้ใช้ หรือ อีเมล</label>
            <input
              id="username" type="text" name="username"
              value={form.username} onChange={handleChange}
              placeholder="admin / admin@example.com" required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              id="password" type="password" name="password"
              value={form.password} onChange={handleChange}
              placeholder="••••••••" required
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button
            id="login-btn" type="submit"
            className="btn btn-primary" style={{ width: '100%', marginTop: '.5rem' }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'เข้าสู่ระบบ'}
          </button>
        </form>
        <p style={{ marginTop: '1.25rem', textAlign: 'center', color: 'var(--color-muted)', fontSize: '.875rem' }}>
          ยังไม่มีบัญชี?{' '}
          <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </div>
  );
}
