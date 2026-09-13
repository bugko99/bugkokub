import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">⚡ DocConverter</Link>
        <div className="navbar-actions">
          {isLoggedIn ? (
            <>
              <span style={{ color: 'var(--color-muted)', fontSize: '.875rem' }}>
                👋 {user?.username}
              </span>
              <button className="btn btn-outline" onClick={handleLogout}>
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-outline">เข้าสู่ระบบ</Link>
              <Link to="/register" className="btn btn-primary">สมัครสมาชิก</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
