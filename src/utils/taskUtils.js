export const TASK_STATUSES = ['Pending', 'In Progress', 'Done']

export function createProject(name, description) {
  return {
    id: crypto.randomUUID(),
    name,
    description,
    tasks: [],
  }
}

export function createTask(title, details, status = 'Pending', assignee = '', projectId = '') {
  return {
    id: crypto.randomUUID(),
    title,
    details,
    status,
    assignee,
    projectId,
  }
}

export function moveTaskToNextStatus(status) {
  const currentIndex = TASK_STATUSES.indexOf(status)

  if (currentIndex === -1 || currentIndex === TASK_STATUSES.length - 1) {
    return TASK_STATUSES[TASK_STATUSES.length - 1]
  }

  return TASK_STATUSES[currentIndex + 1]
}

export function getNextActionLabel(status) {
  if (status === 'Pending') {
    return 'Move to In Progress'
  }

  if (status === 'In Progress') {
    return 'Move to Done'
  }

  return 'Completed'
}

export function getStatusCounts(tasks) {
  return TASK_STATUSES.reduce(
    (accumulator, status) => ({
      ...accumulator,
      [status]: tasks.filter((task) => task.status === status).length,
    }),
    {},
  )
}
