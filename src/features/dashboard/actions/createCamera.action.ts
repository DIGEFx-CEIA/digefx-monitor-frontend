"use server";

import { createServerAction, ServerActionError } from "@/libs/action-error-handler.hof";
import fetchWithServerAuth from "@/utils/fetchWithServerAuth";

export interface CreateCameraData {
  name: string;
  ip_address: string;
  port: number;
  enabled_alerts: string[];
}

export interface CameraResponse {
  id: number;
  name: string;
  ip_address: string;
  port: number;
  enabled_alerts: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const createCameraAction = createServerAction(async (cameraData: CreateCameraData) => {
  const API_URL = process.env.API_URL;

  const response = await fetchWithServerAuth(`${API_URL}/cameras`, {
    method: "POST",
    body: JSON.stringify(cameraData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ServerActionError(error.detail || `Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json() as CameraResponse;
  return data;
}); 