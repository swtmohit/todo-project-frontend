import TaskColumn from './TaskColumn'
import { TASK_STATUSES } from '../utils/taskUtils'

function TaskBoard({ tasks, onAdvanceTask, onDeleteTask }) {
  return (
    <section className="board-grid">
      {TASK_STATUSES.map((status) => (
        <TaskColumn
          key={status}
          title={status}
          tasks={tasks.filter((task) => task.status === status)}
          onAdvanceTask={onAdvanceTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </section>
  )
}

export default TaskBoard
