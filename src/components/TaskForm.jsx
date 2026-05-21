import { useEffect, useMemo, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { getStoredToken } from '../utils/authApi'
import { retrieveProjectsRequest } from '../utils/projectApi'
import { TASK_STATUSES } from '../utils/taskUtils'

const taskSchema = Yup.object({
  title: Yup.string().trim().required('Task title is required.'),
  projectId: Yup.string().required('Project selection is required.'),
  status: Yup.string().oneOf(TASK_STATUSES, 'Invalid task status.').required('Status is required.'),
  details: Yup.string(),
})

function TaskForm({ activeProjectId, onCreateTask }) {
  const [projectOptions, setProjectOptions] = useState([])
  const [isProjectLoading, setIsProjectLoading] = useState(true)
  const [projectError, setProjectError] = useState('')
  const activeProject = useMemo(
    () => projectOptions.find((project) => project.id === activeProjectId),
    [activeProjectId, projectOptions],
  )
  const defaultProjectId = activeProject?.id ?? ''
  const [taskError, setTaskError] = useState('')

  const formik = useFormik({
    initialValues: {
      title: '',
      projectId: '',
      status: 'Pending',
      details: '',
    },
    validationSchema: taskSchema,
    enableReinitialize: false,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const selectedProject = projectOptions.find((project) => project.id === values.projectId)

      try {
        setTaskError('')
        await onCreateTask({
          title: values.title.trim(),
          details: values.details.trim(),
          projectId: values.projectId,
          assignee: selectedProject?.name ?? '',
          status: values.status,
        })
        resetForm({
          values: {
            title: '',
            projectId: defaultProjectId,
            status: 'Pending',
            details: '',
          },
        })
      } catch (apiError) {
        setTaskError(apiError.message)
      } finally {
        setSubmitting(false)
      }
    },
  })
  const { setFieldValue } = formik

  useEffect(() => {
    const loadProjects = async () => {
      const storedToken = getStoredToken()

      if (!storedToken) {
        setProjectError('Please login again to load projects.')
        setIsProjectLoading(false)
        return
      }

      try {
        setProjectError('')
        setIsProjectLoading(true)
        const response = await retrieveProjectsRequest(storedToken)
        const projects = response.data.data.map((project) => ({
          id: project._id,
          name: project.name,
          description: project.description,
        }))
        const defaultProject = projects.find((project) => project.id === activeProjectId) ?? projects[0]

        setProjectOptions(projects)
        setFieldValue('projectId', defaultProject?.id || '', false)
      } catch (apiError) {
        setProjectError(apiError.message)
      } finally {
        setIsProjectLoading(false)
      }
    }

    loadProjects()
  }, [activeProjectId, setFieldValue])

  return (
    <form className="stack-form task-form" onSubmit={formik.handleSubmit} noValidate>
      <div className="section-heading">
        <h3>Add task</h3>
        <p>Capture the next piece of work for this project.</p>
      </div>

      <label className="field">
        <span>Task title</span>
        <input
          className="form-control"
          type="text"
          name="title"
          placeholder="Enter Your Title"
          value={formik.values.title}
          disabled={formik.isSubmitting}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.title && formik.errors.title ? (
          <small className="field-error">{formik.errors.title}</small>
        ) : null}
      </label>
      <label className="field">
        <span>Project</span>
        <select
          className="form-select"
          name="projectId"
          value={formik.values.projectId}
          disabled={isProjectLoading || formik.isSubmitting}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        >
          <option value="" disabled>
            {isProjectLoading ? 'Loading projects...' : 'Select project'}
          </option>
          {projectOptions.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        {formik.touched.projectId && formik.errors.projectId ? (
          <small className="field-error">{formik.errors.projectId}</small>
        ) : null}
        {projectError ? <small className="field-error">{projectError}</small> : null}
      </label>
      <label className="field">
        <span>Status</span>
        <select
          className="form-select"
          name="status"
          value={formik.values.status}
          disabled={formik.isSubmitting}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        >
          {TASK_STATUSES.map((taskStatus) => (
            <option key={taskStatus} value={taskStatus}>
              {taskStatus}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Details</span>
        <textarea
          className="form-control"
          rows="3"
          name="details"
          placeholder="Enter Your Task Notes"
          value={formik.values.details}
          disabled={formik.isSubmitting}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
      </label>
      {taskError ? <div className="auth-message error">{taskError}</div> : null}
      <button type="submit" className="btn btn-primary primary-button" disabled={formik.isSubmitting || isProjectLoading}>
        {formik.isSubmitting ? 'Adding task...' : 'Add task'}
      </button>
    </form>
  )
}

export default TaskForm
