import type { ApiResponse, QuestionItem, TestItem } from '../models/types'

const BASE_URL = 'https://apisunsale.azurewebsites.net/api/PublicQuestoes'

class ApiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new ApiError('Failed to fetch data', response.status)
  }
  return response.json() as Promise<T>
}

export async function getTests(): Promise<TestItem[]> {
  const data = await fetchJson<ApiResponse<TestItem[]>>(`${BASE_URL}/GetTests`)
  if (!data.success) {
    throw new ApiError(data.message || 'Failed to load tests')
  }
  return data.object
}

export async function getQuestionsByTest(codigoProva: number): Promise<QuestionItem[]> {
  const data = await fetchJson<ApiResponse<QuestionItem[]>>(
    `${BASE_URL}/GetQuestoes?codigoProva=${codigoProva}`
  )
  if (!data.success) {
    throw new ApiError(data.message || 'Failed to load questions')
  }
  return data.object
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

