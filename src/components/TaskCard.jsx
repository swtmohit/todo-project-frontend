import { getNextActionLabel } from '../utils/taskUtils'

function TrashIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M9 3h6l1 2h4v2H4V5h4l1-2Z" />
      <path d="M6 9h12l-1 11H7L6 9Zm4 2v7h2v-7h-2Zm4 0v7h2v-7h-2Z" />
    </svg>
  )
}

function TaskCard({ task, onAdvanceTask, onDeleteTask, isUpdating }) {
  const nextActionLabel = getNextActionLabel(task.status)
  const isCompleted = task.status === 'Done'

  const handleDragStart = (event) => {
    if (isUpdating) {
      event.preventDefault()
      return
    }

    event.dataTransfer.setData('text/task-id', task.id)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <article
      className={`card task-card ${isUpdating ? 'is-updating' : ''}`}
      draggable={!isUpdating}
      onDragStart={handleDragStart}
      aria-busy={isUpdating ? 'true' : 'false'}
    >
      {isUpdating ? <div className="task-card-loader" aria-hidden="true" /> : null}
      <div className="task-card-top">
        <div className="task-card-heading">
          <span className={`status-pill ${task.status.toLowerCase().replaceAll(' ', '-')}`}>{task.status}</span>
          <button
            type="button"
            className="icon-button danger"
            aria-label={`Delete ${task.title}`}
            title="Delete task"
            onClick={() => onDeleteTask(task.id)}
            disabled={isUpdating}
          >
            <TrashIcon />
          </button>
        </div>
        <strong>{task.title}</strong>
      </div>

      <p>{task.details}</p>

      <div className="task-card-footer">
        <span>{task.assignee ? `Project: ${task.assignee}` : 'No project'}</span>
        <button
          type="button"
          className="btn btn-outline-primary ghost-button"
          onClick={() => onAdvanceTask(task.id)}
          disabled={isCompleted || isUpdating}
        >
          {isUpdating ? 'Updating…' : nextActionLabel}
        </button>
      </div>
    </article>
  )
}

export default TaskCard
