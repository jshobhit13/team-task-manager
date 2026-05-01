import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { CheckSquare, FolderKanban, Clock, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0, projects: 0 })

  useEffect(() => {
    api.get('/api/tasks/stats').then(r => setStats(r.data)).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Tasks', value: stats.total, icon: <CheckSquare size={18} />, color: 'var(--accent)' },
    { label: 'Projects', value: stats.projects, icon: <FolderKanban size={18} />, color: '#7C72D8' },
    { label: 'In Progress', value: stats.inProgress, icon: <TrendingUp size={18} />, color: 'var(--warning)' },
    { label: 'Completed', value: stats.done, icon: <Clock size={18} />, color: 'var(--success)' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '0.3px' }}>
          Welcome back, {user?.name}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 13 }}>
          Here's what's happening with your projects.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {cards.map(({ label, value, icon, color }) => (
          <div key={label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '20px 22px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--text)' }}>{value}</div>
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: 8, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                background: `${color}18`, color
              }}>{icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '20px 22px'
      }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>Task Overview</div>
        {[
          { label: 'To Do', value: stats.todo, color: 'var(--text-dim)' },
          { label: 'In Progress', value: stats.inProgress, color: 'var(--warning)' },
          { label: 'Done', value: stats.done, color: 'var(--success)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
              <span style={{ fontSize: 12, color }}>{value}</span>
            </div>
            <div style={{ height: 4, background: 'var(--border)', borderRadius: 4 }}>
              <div style={{
                height: '100%', borderRadius: 4, background: color,
                width: stats.total ? `${(value / stats.total) * 100}%` : '0%',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}