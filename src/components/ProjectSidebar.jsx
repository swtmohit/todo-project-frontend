function TrashIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M9 3h6l1 2h4v2H4V5h4l1-2Z" />
      <path d="M6 9h12l-1 11H7L6 9Zm4 2v7h2v-7h-2Zm4 0v7h2v-7h-2Z" />
    </svg>
  )
}

function ProjectSidebar({ projects, activeProjectId, onSelectProject, onDeleteProject }) {
  return (
    <div className="form-block">
      <div className="section-heading">
        <h3>Projects</h3>
        <p>Switch between your workstreams.</p>
      </div>

      <div className="project-list">
        {projects.map((project) => {
          const isActive = project.id === activeProjectId

          return (
            <div
              key={project.id}
              className={`project-item ${isActive ? 'active' : ''}`}
            >
              <button type="button" className="project-select" onClick={() => onSelectProject(project.id)}>
                <span>{project.name}</span>
                <small>{project.tasks.length} task{project.tasks.length === 1 ? '' : 's'}</small>
              </button>
              <button
                type="button"
                className="icon-button danger"
                aria-label={`Delete ${project.name}`}
                title="Delete project"
                onClick={() => onDeleteProject(project.id)}
              >
                <TrashIcon />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProjectSidebar
