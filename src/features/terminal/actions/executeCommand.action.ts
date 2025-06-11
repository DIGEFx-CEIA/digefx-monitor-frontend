'use server'

import { createServerAction, ServerActionError } from "@/libs/action-error-handler.hof";
import fetchWithServerAuth from "@/utils/fetchWithServerAuth";

export interface CommandRequest {
  category: string
  command: string
  args?: string[]
}

export interface CommandResponse {
  success: boolean
  output: string
  error?: string
  execution_time: number
  command_executed: string
}

export const executeCommandAction = createServerAction(
  async (request: CommandRequest): Promise<CommandResponse> => {
    const apiUrl = process.env.API_URL
    if (!apiUrl) {
      throw new ServerActionError('API_URL não configurada')
    }

    const response = await fetchWithServerAuth(`${apiUrl}/terminal/execute`, {
      method: 'POST',
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new ServerActionError(error.detail || `Erro ao executar comando: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  }
) 