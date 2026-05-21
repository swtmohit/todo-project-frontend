import { getAuthorizedConfig, getRequestErrorMessage, projectApiClient } from './apiClient'

export async function createProjectRequest(payload, token) {
  try {
    return await projectApiClient.post('/project', payload, getAuthorizedConfig(token))
  } catch (error) {
    throw new Error(getRequestErrorMessage(error), { cause: error })
  }
}

export async function retrieveProjectsRequest(token) {
  try {
    return await projectApiClient.get('/project', getAuthorizedConfig(token))
  } catch (error) {
    throw new Error(getRequestErrorMessage(error), { cause: error })
  }
}

export async function deleteProjectRequest(projectId, token) {
  try {
    return await projectApiClient.delete(`/project/${projectId}`, getAuthorizedConfig(token))
  } catch (error) {
    throw new Error(getRequestErrorMessage(error), { cause: error })
  }
}
