import TaskCard from './TaskCard'
import { useState } from 'react'

function TaskColumn({ title, tasks, onAdvanceTask, onMoveTask, onDeleteTask }) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDragEnter = () => {
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragOver(false)

    const taskId = event.dataTransfer.getData('text/task-id')

    if (!taskId) {
      return
    }

    onMoveTask?.(taskId, title)
  }

  return (
    <section
      className={`panel card task-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <h3>{title}</h3>
        <span>{tasks.length}</span>
      </div>

      <div className="task-list">
        {tasks.length ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onAdvanceTask={onAdvanceTask}
              onDeleteTask={onDeleteTask}
            />
          ))
        ) : (
          <div className="column-empty">No tasks here yet.</div>
        )}
      </div>
    </section>
  )
}

export default TaskColumn
