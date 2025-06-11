'use server'

import { createServerAction, ServerActionError } from "@/libs/action-error-handler.hof";
import fetchWithServerAuth from "@/utils/fetchWithServerAuth";

export const resolveAlertAction = createServerAction(async (alertId: number) => {
  const API_URL = process.env.API_URL;

  const response = await fetchWithServerAuth(`${API_URL}/alerts/cameras/${alertId}/resolve`, {
    method: 'PUT',
    body: JSON.stringify({
      resolved: true
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ServerActionError(error.detail || `Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}); 