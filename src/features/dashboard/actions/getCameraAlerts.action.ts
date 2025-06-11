'use server'

import { createServerAction, ServerActionError } from "@/libs/action-error-handler.hof";
import fetchWithServerAuth from "@/utils/fetchWithServerAuth";

export interface CameraAlertResponse {
  id: number
  camera_id: number
  camera_name: string
  alert_type_id: number
  alert_type_name: string
  alert_type_code: string
  resolved: boolean
  triggered_at: string
  resolved_at?: string
  severity?: string
}

export interface CameraAlertListResponse {
  alerts: CameraAlertResponse[]
  total_count: number
}

interface GetCameraAlertsParams {
  camera_id?: number
  alert_type_code?: string
  resolved?: boolean
  limit?: number
  offset?: number
}

export const getCameraAlertsAction = createServerAction(async (params: GetCameraAlertsParams = {}) => {
  const API_URL = process.env.API_URL;
  
  const searchParams = new URLSearchParams()
  
  if (params.camera_id) {
    searchParams.append('camera_id', params.camera_id.toString())
  }
  if (params.alert_type_code) {
    searchParams.append('alert_type_code', params.alert_type_code)
  }
  if (params.resolved !== undefined) {
    searchParams.append('resolved', params.resolved.toString())
  }
  if (params.limit) {
    searchParams.append('limit', params.limit.toString())
  }
  if (params.offset) {
    searchParams.append('offset', params.offset.toString())
  }

  const url = `${API_URL}/alerts/cameras?${searchParams.toString()}`
  const response = await fetchWithServerAuth(url, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ServerActionError(error.detail || `Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json() as CameraAlertListResponse;
  return data;
}); 