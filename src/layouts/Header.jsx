import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header-search">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input type="text" placeholder="Search anything..." className="header-search-input" />
      </div>

      <div className="header-right">
        <button className="header-notif" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="notif-badge">2</span>
        </button>

        <div className="header-user">
          <div className="header-user-info">
            <span className="header-user-name">John Doe</span>
            <span className="header-user-role">Administrator</span>
          </div>
          <div className="header-avatar">JD</div>
        </div>
      </div>
    </header>
  )
}
