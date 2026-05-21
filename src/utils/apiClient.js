import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function createAuthorizationConfig(token) {
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {}
}

export const authApiClient = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
})

export const projectApiClient = axios.create({
  baseURL: `${API_BASE_URL}/projects`,
})

export const taskApiClient = axios.create({
  baseURL: `${API_BASE_URL}/tasks`,
})

export function getAuthorizedConfig(token) {
  return createAuthorizationConfig(token)
}

export function getRequestErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Request failed'
}
