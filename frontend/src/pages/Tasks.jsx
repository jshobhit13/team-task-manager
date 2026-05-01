import { useState, useEffect } from 'react'
import api from '../services/api'
import { Plus, Trash2, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const STATUS_COLORS = {
  TODO: 'var(--text-dim)',
  IN_PROGRESS: 'var(--warning)',
  IN_REVIEW: '#7C72D8',
  DONE: 'var(--success)'
}

const PRIORITY_COLORS = {
  LOW: 'var(--success)',
  MEDIUM: 'var(--warning)',
  HIGH: 'var(--danger)'
}

export default function Tasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const [form, setForm] = useState({
    title: '', description: '', status: 'TODO',
    priority: 'MEDIUM', projectId: '', assigneeId: '', dueDate: ''
  })

  const fetchAll = () => {
    api.get('/api/tasks').then(r => setTasks(r.data)).catch(() => {})
    api.get('/api/projects').then(r => setProjects(r.data)).catch(() => {})
    api.get('/api/users').then(r => setUsers(r.data)).catch(() => {})
  }
  useEffect(() => { fetchAll() }, [])

  const create = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/tasks', {
        ...form,
        projectId: parseInt(form.projectId),
        assigneeId: form.assigneeId ? parseInt(form.assigneeId) : null,
        dueDate: form.dueDate || null
      })
      setForm({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', projectId: '', assigneeId: '', dueDate: '' })
      setShowForm(false)
      fetchAll()
    } catch {}
  }

  const updateStatus = async (task, status) => {
    await api.put(`/api/tasks/${task.id}`, {
      title: task.title, description: task.description,
      status, priority: task.priority,
      projectId: task.project?.id,
      assigneeId: task.assignee?.id,
      dueDate: task.dueDate
    })
    fetchAll()
  }

  const remove = async (id) => {
    if (!window.confirm('Delete task?')) return
    await api.delete(`/api/tasks/${id}`)
    fetchAll()
  }

  const filtered = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter)

  const selectStyle = {
    padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)',
    background: 'var(--bg)', color: 'var(--text)', fontSize: 14, outline: 'none', width: '100%'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>Tasks</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>{tasks.length} tasks total</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
          borderRadius: 8, border: 'none', background: 'var(--accent)',
          color: '#0F1115', fontWeight: 500, fontSize: 13
        }}>
          <Plus size={15} /> New Task
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['ALL', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border)',
            background: filter === s ? 'var(--accent)' : 'transparent',
            color: filter === s ? '#0F1115' : 'var(--text-secondary)',
            fontSize: 12, fontWeight: filter === s ? 500 : 400, cursor: 'pointer',
            transition: 'all 0.18s ease'
          }}>{s.replace('_', ' ')}</button>
        ))}
      </div>

      {/* Create form */}
      {showForm && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 10, padding: 20, marginBottom: 20
        }}>
          <form onSubmit={create}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  required placeholder="Task title"
                  style={{ ...selectStyle }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Project *</label>
                <select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} required style={selectStyle}>
                  <option value="">Select project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={selectStyle}>
                  {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={selectStyle}>
                  {['LOW', 'MEDIUM', 'HIGH'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Assignee</label>
                <select value={form.assigneeId} onChange={e => setForm({ ...form, assigneeId: e.target.value })} style={selectStyle}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                  style={selectStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{
                padding: '8px 18px', borderRadius: 8, border: 'none',
                background: 'var(--accent)', color: '#0F1115', fontWeight: 500, fontSize: 13
              }}>Create Task</button>
              <button type="button" onClick={() => setShowForm(false)} style={{
                padding: '8px 18px', borderRadius: 8, border: '1px solid var(--border)',
                background: 'transparent', color: 'var(--text-secondary)', fontSize: 13
              }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-dim)' }}>No tasks found.</div>
        )}
        {filtered.map(task => (
          <div key={task.id} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '16px 20px', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
            transition: 'border-color 0.18s ease'
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{task.title}</span>
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 20,
                  background: `${PRIORITY_COLORS[task.priority]}18`,
                  color: PRIORITY_COLORS[task.priority], fontWeight: 500
                }}>{task.priority}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
                <span>{task.project?.name}</span>
                {task.assignee && <span>→ {task.assignee.name}</span>}
                {task.dueDate && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={11} />{task.dueDate}
                </span>}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <select value={task.status}
                onChange={e => updateStatus(task, e.target.value)}
                style={{
                  padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                  border: '1px solid var(--border)', background: 'var(--bg)',
                  color: STATUS_COLORS[task.status], cursor: 'pointer', outline: 'none'
                }}>
                {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map(s =>
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                )}
              </select>
              <button onClick={() => remove(task.id)} style={{
                background: 'transparent', border: 'none', color: 'var(--text-dim)',
                cursor: 'pointer', padding: 4, borderRadius: 6
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
              ><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}