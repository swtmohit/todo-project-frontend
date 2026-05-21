import { getAuthorizedConfig, getRequestErrorMessage, taskApiClient } from './apiClient'

export async function createTaskRequest(payload, token) {
  try {
    return await taskApiClient.post('/task', payload, getAuthorizedConfig(token))
  } catch (error) {
    throw new Error(getRequestErrorMessage(error), { cause: error })
  }
}

export async function retrieveTasksRequest(token) {
  try {
    return await taskApiClient.get('/task', getAuthorizedConfig(token))
  } catch (error) {
    throw new Error(getRequestErrorMessage(error), { cause: error })
  }
}

export async function updateTaskRequest(taskId, payload, token) {
  try {
    return await taskApiClient.patch(`/task/${taskId}`, payload, getAuthorizedConfig(token))
  } catch (error) {
    throw new Error(getRequestErrorMessage(error), { cause: error })
  }
}

export async function deleteTaskRequest(taskId, token) {
  try {
    return await taskApiClient.delete(`/task/${taskId}`, getAuthorizedConfig(token))
  } catch (error) {
    throw new Error(getRequestErrorMessage(error), { cause: error })
  }
}
