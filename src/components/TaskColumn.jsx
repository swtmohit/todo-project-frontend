import TaskCard from './TaskCard'

function TaskColumn({ title, tasks, onAdvanceTask, onDeleteTask }) {
  return (
    <section className="panel card task-column">
      <div className="column-header">
        <h3>{title}</h3>
        <span>{tasks.length}</span>
      </div>

      <div className="task-list">
        {tasks.length ? (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onAdvanceTask={onAdvanceTask} onDeleteTask={onDeleteTask} />
          ))
        ) : (
          <div className="column-empty">No tasks here yet.</div>
        )}
      </div>
    </section>
  )
}

export default TaskColumn
