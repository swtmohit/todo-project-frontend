import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const projectSchema = Yup.object({
  name: Yup.string().trim().required('Project name is required.'),
  description: Yup.string().trim().required('Project description is required.'),
})

function ProjectForm({ onCreateProject }) {
  const [error, setError] = useState('')

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: projectSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setError('')
        await onCreateProject({
          name: values.name.trim(),
          description: values.description.trim(),
        })
        resetForm()
      } catch (apiError) {
        setError(apiError.message)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="form-block">
      <div className="section-heading">
        <h3>New project</h3>
        <p>Create a focused space for related tasks.</p>
      </div>

      <form className="stack-form" onSubmit={formik.handleSubmit} noValidate>
        {error ? <div className="auth-message error">{error}</div> : null}
        <label className="field">
          <span>Project name</span>
          <input
            className="form-control"
            type="text"
            name="name"
            placeholder="Enter Your Project Name"
            value={formik.values.name}
            disabled={formik.isSubmitting}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          {formik.touched.name && formik.errors.name ? (
            <small className="field-error">{formik.errors.name}</small>
          ) : null}
        </label>
        <label className="field">
          <span>Description</span>
          <textarea
            className="form-control"
            rows="3"
            name="description"
            placeholder="What is this project about?"
            value={formik.values.description}
            disabled={formik.isSubmitting}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          {formik.touched.description && formik.errors.description ? (
            <small className="field-error">{formik.errors.description}</small>
          ) : null}
        </label>
        <button type="submit" className="btn btn-primary primary-button" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Adding project...' : 'Add project'}
        </button>
      </form>
    </div>
  )
}

export default ProjectForm
