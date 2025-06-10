"use server";

import { createServerAction, ServerActionError } from "@/libs/action-error-handler.hof";
import fetchWithServerAuth from "@/utils/fetchWithServerAuth";

export interface AlertType {
  id: number;
  code: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  created_at: string;
}

export interface AlertTypesResponse {
  alert_types: AlertType[];
  total_count: number;
}

export const getAlertTypesAction = createServerAction(async () => {
  const API_URL = process.env.API_URL;

  const response = await fetchWithServerAuth(`${API_URL}/alerts/types`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ServerActionError(error.detail || `Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json() as AlertTypesResponse;
  return data.alert_types || [];
}); 