import { useEffect, useRef, useState } from 'react'

function Header({ user, greetingVariant, projectCount, taskCount, doneCount, onLogout, isLogoutLoading }) {
  const greeting = greetingVariant === 'signup' ? 'Welcome' : 'Welcome back'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handleDocumentClick = (event) => {
      if (!menuRef.current) {
        return
      }

      if (!menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen])

  const avatarLetter = user.name?.trim()?.slice(0, 1)?.toUpperCase()

  return (
    <header className="topbar panel card">
      <div>
        <span className="eyebrow">Workspace dashboard</span>
        <h2>
          {greeting}, {user.name}
        </h2>
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

        <div className="profile-menu" ref={menuRef}>
          <button
            type="button"
            className="profile-trigger"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-label="Open user menu"
            onClick={() => setIsMenuOpen((current) => !current)}
            disabled={isLogoutLoading}
          >
            <span className="profile-avatar" aria-hidden="true">
              {avatarLetter || 'U'}
            </span>
          </button>

          {isMenuOpen ? (
            <div className="profile-dropdown" role="menu" aria-label="User menu">
              <button
                type="button"
                className="profile-dropdown-item logout"
                role="menuitem"
                onClick={onLogout}
                disabled={isLogoutLoading}
              >
                <span className="logout-icon" aria-hidden="true">↩</span>
                {isLogoutLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Header
