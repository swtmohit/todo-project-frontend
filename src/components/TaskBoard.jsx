import TaskColumn from './TaskColumn'
import { TASK_STATUSES } from '../utils/taskUtils'

function TaskBoard({ tasks, onAdvanceTask, onMoveTask, onDeleteTask, updatingTaskIds }) {
  return (
    <section className="board-grid">
      {TASK_STATUSES.map((status) => (
        <TaskColumn
          key={status}
          title={status}
          tasks={tasks.filter((task) => task.status === status)}
          onAdvanceTask={onAdvanceTask}
          onMoveTask={onMoveTask}
          onDeleteTask={onDeleteTask}
          updatingTaskIds={updatingTaskIds}
        />
      ))}
    </section>
  )
}

export default TaskBoard
