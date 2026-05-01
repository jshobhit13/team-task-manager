import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut } from 'lucide-react'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'fixed',
        height: '100vh'
      }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.3px' }}>
            TaskFlow
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>{user?.name}</div>
          <div style={{
            display: 'inline-block', marginTop: 6, fontSize: 10, padding: '2px 8px',
            borderRadius: 20, background: 'rgba(95,168,168,0.12)', color: 'var(--accent)',
            letterSpacing: '0.5px', textTransform: 'uppercase'
          }}>{user?.role}</div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {[
            { to: '/', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
            { to: '/projects', icon: <FolderKanban size={16} />, label: 'Projects' },
            { to: '/tasks', icon: <CheckSquare size={16} />, label: 'Tasks' },
          ].map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              borderRadius: 8, marginBottom: 4, color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(95,168,168,0.1)' : 'transparent',
              transition: 'all 0.18s ease', fontSize: 13, fontWeight: isActive ? 500 : 400
            })}>
              {icon}{label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '0 12px' }}>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '9px 12px', borderRadius: 8, border: 'none',
            background: 'transparent', color: 'var(--text-dim)', fontSize: 13,
            transition: 'all 0.18s ease', cursor: 'pointer'
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
          >
            <LogOut size={16} />Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 220, flex: 1, padding: '32px', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  )
}