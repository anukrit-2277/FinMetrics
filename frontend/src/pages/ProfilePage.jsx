import { useAuth } from '../context/AuthContext';
import { HiOutlineUser, HiOutlineMail, HiOutlineShieldCheck, HiOutlineCalendar } from 'react-icons/hi';

function ProfilePage() {
  const { user } = useAuth();

  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const roleColors = {
    ADMIN: '#dc2626',
    ANALYST: '#10b981',
    VIEWER: '#3b82f6',
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">View your account information</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
        {/* Avatar + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #2a2a2a' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 800,
            color: 'white',
            flexShrink: 0,
          }}>
            {user ? getInitials(user.name) : '?'}
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>{user?.name}</h2>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
                backgroundColor: `${roleColors[user?.role] || '#dc2626'}20`,
                color: roleColors[user?.role] || '#dc2626',
              }}
            >
              {user?.role}
            </span>
          </div>
        </div>

        {/* Details rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#737373', fontSize: 16, flexShrink: 0 }}>
              <HiOutlineUser />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Full Name</div>
              <div style={{ fontSize: 14, color: '#ffffff', fontWeight: 500 }}>{user?.name}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#737373', fontSize: 16, flexShrink: 0 }}>
              <HiOutlineMail />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Email Address</div>
              <div style={{ fontSize: 14, color: '#ffffff', fontWeight: 500 }}>{user?.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#737373', fontSize: 16, flexShrink: 0 }}>
              <HiOutlineShieldCheck />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Role</div>
              <div style={{ fontSize: 14, color: '#ffffff', fontWeight: 500 }}>{user?.role}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#737373', fontSize: 16, flexShrink: 0 }}>
              <HiOutlineCalendar />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Account Status</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>
                <span style={{ color: user?.isActive ? '#10b981' : '#ef4444' }}>
                  {user?.isActive ? '● Active' : '● Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
