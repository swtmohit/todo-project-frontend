function Header({ user, greetingVariant, projectCount, taskCount, doneCount, onLogout, isLogoutLoading }) {
  const greeting = greetingVariant === 'signup' ? 'Welcome' : 'Welcome back'

  return (
    <header className="topbar panel card">
      <div>
        <span className="eyebrow">Workspace dashboard</span>
        <h2>{greeting}, {user.name}</h2>
        <p className="topbar-subtitle">{user.email}</p>
      </div>
      <div className="topbar-stats" aria-label="Workspace overview">
        <div>
          <span>{projectCount}</span>
          <small>Projects</small>
        </div>
        <div>
          <span>{taskCount}</span>
          <small>Tasks</small>
        </div>
        <div>
          <span>{doneCount}</span>
          <small>Done</small>
        </div>
      </div>
      <div className="topbar-actions">
        <div className="topbar-badge">Logged in</div>
        <button type="button" className="btn btn-danger logout-button" onClick={onLogout} disabled={isLogoutLoading}>
          {isLogoutLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </header>
  )
}

export default Header
