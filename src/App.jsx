import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import LoginPanel from './components/LoginPanel'
import ProjectForm from './components/ProjectForm'
import ProjectSidebar from './components/ProjectSidebar'
import TaskBoard from './components/TaskBoard'
import TaskForm from './components/TaskForm'
import SummaryCards from './components/SummaryCards'
import EmptyState from './components/EmptyState'
import ConfirmDialog from './components/ConfirmDialog'
import {
  clearStoredToken,
  getStoredToken,
  loginRequest,
  logoutRequest,
  profileRequest,
  signupRequest,
  storeToken,
} from './utils/authApi'
import { createProjectRequest, deleteProjectRequest, retrieveProjectsRequest } from './utils/projectApi'
import { createTaskRequest, deleteTaskRequest, retrieveTasksRequest, updateTaskRequest } from './utils/taskApi'
import { getStatusCounts, moveTaskToNextStatus } from './utils/taskUtils'
import './App.css'

function mapProjectFromApi(project) {
  return {
    id: project._id,
    name: project.name,
    description: project.description,
    tasks: [],
  }
}

function mapTaskFromApi(task) {
  const project = task.assignee
  const projectId = typeof project === 'string' ? project : project?._id ?? ''

  return {
    id: task._id,
    title: task.title,
    details: task.details,
    status: task.status,
    assignee: project && typeof project === 'object' ? project.name : '',
    projectId,
  }
}

function App() {
  const [user, setUser] = useState(null)
  const [greetingVariant, setGreetingVariant] = useState('login')
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isLogoutLoading, setIsLogoutLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [updatingTaskIds, setUpdatingTaskIds] = useState({})
  const [projects, setProjects] = useState([])
  const [activeProjectId, setActiveProjectId] = useState(null)

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? null,
    [activeProjectId, projects],
  )

  const allTasks = useMemo(() => projects.flatMap((project) => project.tasks), [projects])
  const statusCounts = useMemo(() => getStatusCounts(activeProject?.tasks ?? []), [activeProject])
  const doneTaskCount = useMemo(() => allTasks.filter((task) => task.status === 'Done').length, [allTasks])

  useEffect(() => {
    const restoreUserSession = async () => {
      const storedToken = getStoredToken()

      if (!storedToken) {
        setIsAuthLoading(false)
        return
      }

      try {
        const response = await profileRequest(storedToken)
        setUser(response.data.data)
        setGreetingVariant('login')
      } catch {
        clearStoredToken()
        setUser(null)
      } finally {
        setIsAuthLoading(false)
      }
    }

    restoreUserSession()
  }, [])

  useEffect(() => {
    const loadProjects = async () => {
      const storedToken = getStoredToken()

      if (!user || !storedToken) {
        return
      }

      try {
        const [projectResponse, taskResponse] = await Promise.all([
          retrieveProjectsRequest(storedToken),
          retrieveTasksRequest(storedToken),
        ])
        const apiProjects = projectResponse.data.data.map(mapProjectFromApi)
        const apiTasks = taskResponse.data.data.map(mapTaskFromApi)
        const projectsWithTasks = apiProjects.map((project) => ({
          ...project,
          tasks: apiTasks.filter((task) => task.projectId === project.id),
        }))

        setProjects(projectsWithTasks)
        setActiveProjectId(projectsWithTasks[0]?.id ?? null)
      } catch (error) {
        console.error('Project list request failed:', error.message)
      }
    }

    loadProjects()
  }, [user])

  const handleLogin = async ({ email, password }) => {
    const response = await loginRequest({ email, password })
    storeToken(response.data.data.token)
    setUser(response.data.data.user)
    setGreetingVariant('login')

    return response
  }

  const handleSignup = async ({ name, email, password }) => {
    const response = await signupRequest({ name, email, password })
    storeToken(response.data.data.token)
    setUser(response.data.data.user)
    setGreetingVariant('signup')

    return response
  }

  const handleLogout = async () => {
    const storedToken = getStoredToken()

    try {
      setIsLogoutLoading(true)
      if (storedToken) {
        await logoutRequest(storedToken)
      }
    } catch (error) {
      console.error('Logout request failed:', error.message)
    } finally {
      clearStoredToken()
      setUser(null)
      setGreetingVariant('login')
      setProjects([])
      setActiveProjectId(null)
      setIsLogoutLoading(false)
    }
  }

  const handleCreateProject = async ({ name, description }) => {
    const storedToken = getStoredToken()

    if (!storedToken) {
      throw new Error('Please login again before creating a project.')
    }

    const response = await createProjectRequest({ name, description }, storedToken)
    const createdProject = response.data.data
    const nextProject = mapProjectFromApi(createdProject)

    setProjects((currentProjects) => [...currentProjects, nextProject])
    setActiveProjectId(nextProject.id)

    return response
  }

  const handleCreateTask = async ({ title, assignee, details, projectId, status }) => {
    const storedToken = getStoredToken()

    if (!storedToken) {
      throw new Error('Please login again before creating a task.')
    }

    const response = await createTaskRequest({ title, details, assignee: projectId, status }, storedToken)
    const createdTask = response.data.data
    const nextTask = {
      id: createdTask._id,
      title: createdTask.title,
      details: createdTask.details,
      status: createdTask.status,
      assignee,
      projectId,
    }

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: [...project.tasks, nextTask],
            }
          : project,
      ),
    )

    setActiveProjectId(projectId)

    return response
  }

  const requestDeleteProject = (projectId) => {
    const selectedProject = projects.find((project) => project.id === projectId)

    if (!selectedProject) {
      return
    }

    setPendingDelete({
      type: 'project',
      id: projectId,
      title: `Delete ${selectedProject.name}?`,
      message: 'This will also delete every task inside this project.',
    })
  }

  const requestDeleteTask = (taskId) => {
    if (!activeProject) {
      return
    }

    const selectedTask = activeProject.tasks.find((task) => task.id === taskId)

    if (!selectedTask) {
      return
    }

    setPendingDelete({
      type: 'task',
      id: taskId,
      title: `Delete ${selectedTask.title}?`,
      message: 'This task will be removed from the board.',
    })
  }

  const confirmDeleteProject = async (projectId) => {
    const storedToken = getStoredToken()
    const selectedProject = projects.find((project) => project.id === projectId)

    if (!storedToken || !selectedProject) {
      return
    }

    await deleteProjectRequest(projectId, storedToken)

    const nextProjects = projects.filter((project) => project.id !== projectId)

    setProjects(nextProjects)

    if (activeProjectId === projectId) {
      setActiveProjectId(nextProjects[0]?.id ?? null)
    }
  }

  const confirmDeleteTask = async (taskId) => {
    if (!activeProject) {
      return
    }

    const storedToken = getStoredToken()
    const selectedTask = activeProject.tasks.find((task) => task.id === taskId)

    if (!storedToken || !selectedTask) {
      return
    }

    await deleteTaskRequest(taskId, storedToken)

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProject.id
          ? {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
            }
          : project,
      ),
    )
  }

  const handleConfirmDelete = async () => {
    if (!pendingDelete) {
      return
    }

    try {
      setIsDeleting(true)

      if (pendingDelete.type === 'project') {
        await confirmDeleteProject(pendingDelete.id)
      } else {
        await confirmDeleteTask(pendingDelete.id)
      }

      setPendingDelete(null)
    } catch (error) {
      console.error('Delete request failed:', error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStatusChange = async (taskId) => {
    if (!activeProject) {
      return
    }

    const storedToken = getStoredToken()
    const selectedTask = activeProject.tasks.find((task) => task.id === taskId)

    if (!storedToken || !selectedTask) {
      return
    }

    const nextStatus = moveTaskToNextStatus(selectedTask.status)

    if (selectedTask.id.length === 36) {
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === activeProject.id
            ? {
                ...project,
                tasks: project.tasks.map((task) =>
                  task.id === taskId ? { ...task, status: nextStatus } : task,
                ),
              }
            : project,
        ),
      )
      return
    }

    try {
      setUpdatingTaskIds((current) => ({ ...current, [taskId]: true }))
      await updateTaskRequest(taskId, { status: nextStatus }, storedToken)

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === activeProject.id
            ? {
                ...project,
                tasks: project.tasks.map((task) =>
                  task.id === taskId ? { ...task, status: nextStatus } : task,
                ),
              }
            : project,
        ),
      )
    } finally {
      setUpdatingTaskIds((current) => {
        const { [taskId]: removed, ...rest } = current
        void removed
        return rest
      })
    }
  }

  const handleMoveTask = async (taskId, nextStatus) => {
    if (!activeProject) {
      return
    }

    const storedToken = getStoredToken()
    const selectedTask = activeProject.tasks.find((task) => task.id === taskId)

    if (!storedToken || !selectedTask) {
      return
    }

    if (selectedTask.status === nextStatus) {
      return
    }

    if (selectedTask.id.length === 36) {
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === activeProject.id
            ? {
                ...project,
                tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, status: nextStatus } : task)),
              }
            : project,
        ),
      )
      return
    }

    try {
      setUpdatingTaskIds((current) => ({ ...current, [taskId]: true }))
      await updateTaskRequest(taskId, { status: nextStatus }, storedToken)

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === activeProject.id
            ? {
                ...project,
                tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, status: nextStatus } : task)),
              }
            : project,
        ),
      )
    } finally {
      setUpdatingTaskIds((current) => {
        const { [taskId]: removed, ...rest } = current
        void removed
        return rest
      })
    }
  }

  if (isAuthLoading) {
  return (
    <main className="auth-shell container">
      <section className="card panel auth-panel">
          <h1>Checking your session...</h1>
          <p>Please wait while we connect to the backend.</p>
        </section>
      </main>
    )
  }

  if (!user) {
    return <LoginPanel onLogin={handleLogin} onSignup={handleSignup} />
  }

  return (
    <main className="app-shell container-fluid">
      <Header
        user={user}
        greetingVariant={greetingVariant}
        projectCount={projects.length}
        taskCount={allTasks.length}
        doneCount={doneTaskCount}
        onLogout={handleLogout}
        isLogoutLoading={isLogoutLoading}
      />

      <section className="workspace-grid row g-4">
        <aside className="panel sidebar-panel card col-12 col-xl-3">
          <ProjectForm onCreateProject={handleCreateProject} />
          <ProjectSidebar
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={setActiveProjectId}
            onDeleteProject={requestDeleteProject}
          />
        </aside>

        <section className="content-panel col-12 col-xl-9">
          {activeProject ? (
            <>
              <div className="panel card">
                <div className="project-overview">
                  <div>
                    <span className="eyebrow">Active workstream</span>
                    <h1>{activeProject.name}</h1>
                    <p>{activeProject.description}</p>
                  </div>
                  <TaskForm
                    key={activeProjectId}
                    activeProjectId={activeProjectId}
                    onCreateTask={handleCreateTask}
                  />
                </div>
              </div>

              <SummaryCards counts={statusCounts} totalTasks={activeProject.tasks.length} />
              <TaskBoard
                tasks={activeProject.tasks}
                onAdvanceTask={handleStatusChange}
                onMoveTask={handleMoveTask}
                updatingTaskIds={updatingTaskIds}
                onDeleteTask={requestDeleteTask}
              />
            </>
          ) : (
            <EmptyState
              title="Create your first project"
              description="Ek project add karo aur uske andar tasks track karna start karo."
            />
          )}
        </section>
      </section>
      <ConfirmDialog
        dialog={pendingDelete}
        isDeleting={isDeleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </main>
  )
}

export default App
