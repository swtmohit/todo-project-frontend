import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const initialLoginForm = {
  email: '',
  password: '',
}

const initialSignupForm = {
  name: '',
  email: '',
  password: '',
}

const MIN_PASSWORD_LENGTH = 6

const loginSchema = Yup.object({
  email: Yup.string().trim().email('Please enter a valid email address.').required('Email is required.'),
  password: Yup.string().min(MIN_PASSWORD_LENGTH, 'Password must be at least 6 characters.').required('Password is required.'),
})

const signupSchema = Yup.object({
  name: Yup.string().trim().required('Name is required.'),
  email: Yup.string().trim().email('Please enter a valid email address.').required('Email is required.'),
  password: Yup.string().min(MIN_PASSWORD_LENGTH, 'Password must be at least 6 characters.').required('Password is required.'),
})

function EyeIcon({ isVisible }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      {isVisible ? (
        <>
          <path d="M3 4.3 4.3 3 21 19.7 19.7 21l-3.1-3.1A10.9 10.9 0 0 1 12 19C5 19 2 12 2 12a18.7 18.7 0 0 1 4-5.4L3 4.3Z" />
          <path d="M12 5c7 0 10 7 10 7a17 17 0 0 1-3.1 4.6l-2.2-2.2A5 5 0 0 0 9.6 7.3L7.9 5.6A11 11 0 0 1 12 5Z" />
        </>
      ) : (
        <>
          <path d="M12 5c7 0 10 7 10 7s-3 7-10 7S2 12 2 12s3-7 10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  )
}

function LoginPanel({ onLogin, onSignup }) {
  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)

  const loginFormik = useFormik({
    initialValues: initialLoginForm,
    validationSchema: loginSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        await onLogin({
          email: values.email.trim(),
          password: values.password,
        })
        setError('')
        resetForm()
      } catch (apiError) {
        setError(apiError.message)
      } finally {
        setSubmitting(false)
      }
    },
  })

  const signupFormik = useFormik({
    initialValues: initialSignupForm,
    validationSchema: signupSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        await onSignup({
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
        })
        setError('')
        resetForm()
      } catch (apiError) {
        setError(apiError.message)
      } finally {
        setSubmitting(false)
      }
    },
  })

  const isSubmitting = loginFormik.isSubmitting || signupFormik.isSubmitting

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setError('')
    loginFormik.resetForm()
    signupFormik.resetForm()
    setShowLoginPassword(false)
    setShowSignupPassword(false)
  }

  return (
    <main className="auth-shell">
      <section className="panel auth-panel">
        <span className="eyebrow">Simple internal tool</span>
        <h1>{mode === 'login' ? 'Login to manage projects and tasks' : 'Create your account'}</h1>

        <div className="auth-toggle">
          <button
            type="button"
            className={`auth-toggle-button ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
            disabled={isSubmitting}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-toggle-button ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => switchMode('signup')}
            disabled={isSubmitting}
          >
            Sign up
          </button>
        </div>

        {error ? <div className="auth-message error">{error}</div> : null}

        {mode === 'login' ? (
          <form className="stack-form" onSubmit={loginFormik.handleSubmit} noValidate>
            <label className="field">
              <span>Email</span>
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginFormik.values.email}
                disabled={isSubmitting}
                onBlur={loginFormik.handleBlur}
                onChange={loginFormik.handleChange}
              />
              {loginFormik.touched.email && loginFormik.errors.email ? (
                <small className="field-error">{loginFormik.errors.email}</small>
              ) : null}
            </label>
            <label className="field">
              <span>Password</span>
              <div className="password-input">
                <input
                  className="form-control"
                  type={showLoginPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={loginFormik.values.password}
                  disabled={isSubmitting}
                  onBlur={loginFormik.handleBlur}
                  onChange={loginFormik.handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                  disabled={isSubmitting}
                  onClick={() => setShowLoginPassword((current) => !current)}
                >
                  <EyeIcon isVisible={showLoginPassword} />
                </button>
              </div>
              {loginFormik.touched.password && loginFormik.errors.password ? (
                <small className="field-error">{loginFormik.errors.password}</small>
              ) : null}
            </label>
            <button type="submit" className="btn btn-primary primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form className="stack-form" onSubmit={signupFormik.handleSubmit} noValidate>
            <label className="field">
              <span>Name</span>
              <input
                className="form-control"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={signupFormik.values.name}
                disabled={isSubmitting}
                onBlur={signupFormik.handleBlur}
                onChange={signupFormik.handleChange}
              />
              {signupFormik.touched.name && signupFormik.errors.name ? (
                <small className="field-error">{signupFormik.errors.name}</small>
              ) : null}
            </label>
            <label className="field">
              <span>Email</span>
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={signupFormik.values.email}
                disabled={isSubmitting}
                onBlur={signupFormik.handleBlur}
                onChange={signupFormik.handleChange}
              />
              {signupFormik.touched.email && signupFormik.errors.email ? (
                <small className="field-error">{signupFormik.errors.email}</small>
              ) : null}
            </label>
            <label className="field">
              <span>Password</span>
              <div className="password-input">
                <input
                  className="form-control"
                  type={showSignupPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create your password"
                  value={signupFormik.values.password}
                  disabled={isSubmitting}
                  onBlur={signupFormik.handleBlur}
                  onChange={signupFormik.handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                  title={showSignupPassword ? 'Hide password' : 'Show password'}
                  disabled={isSubmitting}
                  onClick={() => setShowSignupPassword((current) => !current)}
                >
                  <EyeIcon isVisible={showSignupPassword} />
                </button>
              </div>
              {signupFormik.touched.password && signupFormik.errors.password ? (
                <small className="field-error">{signupFormik.errors.password}</small>
              ) : null}
            </label>
            <button type="submit" className="btn btn-primary primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}

export default LoginPanel
