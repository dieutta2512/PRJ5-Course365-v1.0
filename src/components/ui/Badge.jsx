import './Badge.css'

// API trả về: published, draft
// published → hiển thị "Active" (xanh) theo mockup
// draft     → hiển thị "Draft"  (xám)
export function StatusBadge({ status }) {
  const s = (status || '').toLowerCase()

  const config = {
    published: { label: 'Active', css: 'active' },
    draft:     { label: 'Draft',  css: 'draft'  },
  }

  const { label, css } = config[s] || { label: s.charAt(0).toUpperCase() + s.slice(1), css: s }

  return <span className={`badge badge-status badge-${css}`}>{label}</span>
}

export function LevelBadge({ level }) {
  const l = (level || '').toLowerCase()
  const label = l.charAt(0).toUpperCase() + l.slice(1)
  return <span className={`badge badge-level badge-${l}`}>{label}</span>
}