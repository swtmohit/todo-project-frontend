import { authApiClient, getAuthorizedConfig, getRequestErrorMessage } from './apiClient'

const TOKEN_KEY = 'todo_app_token'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function storeToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function signupRequest(payload) {
  try {
    return await authApiClient.post('/signup', payload)
  } catch (error) {
    throw new Error(getRequestErrorMessage(error), { cause: error })
  }
}

export async function loginRequest(payload) {
  try {
    return await authApiClient.post('/login', payload)
  } catch (error) {
    throw new Error(getRequestErrorMessage(error), { cause: error })
  }
}

export async function logoutRequest(token) {
  try {
    return await authApiClient.post('/logout', null, getAuthorizedConfig(token))
  } catch (error) {
    throw new Error(getRequestErrorMessage(error), { cause: error })
  }
}

export async function profileRequest(token) {
  try {
    return await authApiClient.get('/profile', getAuthorizedConfig(token))
  } catch (error) {
    throw new Error(getRequestErrorMessage(error), { cause: error })
  }
}
