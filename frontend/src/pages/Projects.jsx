import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Plus, Trash2, FolderKanban } from 'lucide-react'

export default function Projects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)

  const fetch = () => api.get('/api/projects').then(r => setProjects(r.data)).catch(() => {})
  useEffect(() => { fetch() }, [])

  const create = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/projects', form)
      setForm({ name: '', description: '' })
      setShowForm(false)
      fetch()
    } catch {} finally { setLoading(false) }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this project?')) return
    await api.delete(`/api/projects/${id}`)
    fetch()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>Projects</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>{projects.length} projects total</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button onClick={() => setShowForm(!showForm)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
            borderRadius: 8, border: 'none', background: 'var(--accent)',
            color: '#0F1115', fontWeight: 500, fontSize: 13, transition: 'background 0.18s ease'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
          >
            <Plus size={15} /> New Project
          </button>
        )}
      </div>

      {showForm && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 10, padding: 20, marginBottom: 20
        }}>
          <form onSubmit={create}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Project Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                required placeholder="Enter project name"
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: 8,
                  border: '1px solid var(--border)', background: 'var(--bg)',
                  color: 'var(--text)', fontSize: 14, outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Optional description" rows={2}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: 8,
                  border: '1px solid var(--border)', background: 'var(--bg)',
                  color: 'var(--text)', fontSize: 14, outline: 'none', resize: 'vertical'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={loading} style={{
                padding: '8px 18px', borderRadius: 8, border: 'none',
                background: 'var(--accent)', color: '#0F1115', fontWeight: 500, fontSize: 13
              }}>{loading ? 'Creating...' : 'Create'}</button>
              <button type="button" onClick={() => setShowForm(false)} style={{
                padding: '8px 18px', borderRadius: 8, border: '1px solid var(--border)',
                background: 'transparent', color: 'var(--text-secondary)', fontSize: 13
              }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {projects.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 48, color: 'var(--text-dim)' }}>
            No projects yet. {user?.role === 'ADMIN' && 'Create your first project.'}
          </div>
        )}
        {projects.map(p => (
          <div key={p.id} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: 20, transition: 'border-color 0.18s ease'
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, background: 'rgba(95,168,168,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)'
              }}>
                <FolderKanban size={16} />
              </div>
              {user?.role === 'ADMIN' && (
                <button onClick={() => remove(p.id)} style={{
                  background: 'transparent', border: 'none', color: 'var(--text-dim)',
                  cursor: 'pointer', padding: 4, borderRadius: 6, transition: 'color 0.18s'
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                ><Trash2 size={14} /></button>
              )}
            </div>
            <div style={{ marginTop: 14, fontSize: 15, fontWeight: 500 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
              {p.description || 'No description'}
            </div>
            <div style={{ marginTop: 14, fontSize: 11, color: 'var(--text-dim)' }}>
              By {p.owner?.name} · {new Date(p.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}