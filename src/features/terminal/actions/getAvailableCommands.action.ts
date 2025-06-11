'use server'

import { createServerAction, ServerActionError } from "@/libs/action-error-handler.hof";
import fetchWithServerAuth from "@/utils/fetchWithServerAuth";

export interface AvailableCommandsResponse {
  categories: Record<string, Record<string, string[]>>
  total_commands: number
  security_info: {
    timeout: string
    working_directory: string
    shell_disabled: boolean
    argument_validation: boolean
  }
}

export const getAvailableCommandsAction = createServerAction(
  async (): Promise<AvailableCommandsResponse> => {
    const apiUrl = process.env.API_URL
    if (!apiUrl) {
      throw new ServerActionError('API_URL não configurada')
    }

    const response = await fetchWithServerAuth(`${apiUrl}/terminal/commands`, {
      method: 'GET'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new ServerActionError(error.detail || `Erro ao buscar comandos disponíveis: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  }
) 