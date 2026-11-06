import { handleResponse, JSON_HEADERS } from '@/helpers/API'
import { JustificationModel, JustificationRequest, JustificationTypeOption } from '@/model/justification.model'

const apiUrl = `${process.env.BASE_URL_API}/v1/template/justification`

export const allJustifications = async (): Promise<JustificationModel[]> => {
  const response = await fetch(apiUrl)
  return handleResponse<JustificationModel[]>(response)
}

export const justificationById = async (id: string | number): Promise<JustificationModel> => {
  const response = await fetch(`${apiUrl}/${id}`)
  return handleResponse<JustificationModel>(response)
}

export const saveJustification = async (justification: JustificationRequest): Promise<JustificationModel> => {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(justification)
  })
  return handleResponse<JustificationModel>(response)
}

export const updateJustification = async (id: string | number,justification: JustificationRequest): Promise<JustificationModel> => {
  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(justification)
  })
  return handleResponse<JustificationModel>(response)
}

export const deleteJustification = async (id: string | number): Promise<void> => {
  const response = await fetch(`${apiUrl}/${id}`, {method: 'DELETE'})
  return handleResponse<void>(response)
}
export const allJustificationTypes = async (): Promise<JustificationTypeOption[]> => {
  const response = await fetch(`${process.env.BASE_URL_API}/v1/template/justification-type`)
  return handleResponse<JustificationTypeOption[]>(response)
}
