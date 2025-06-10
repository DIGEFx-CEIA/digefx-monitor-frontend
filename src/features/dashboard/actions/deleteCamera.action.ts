"use server";

import { createServerAction, ServerActionError } from "@/libs/action-error-handler.hof";
import fetchWithServerAuth from "@/utils/fetchWithServerAuth";

export const deleteCameraAction = createServerAction(async (cameraId: number) => {
  const API_URL = process.env.API_URL;

  const response = await fetchWithServerAuth(`${API_URL}/cameras/${cameraId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ServerActionError(error.detail || `Error ${response.status}: ${response.statusText}`);
  }

  return { success: true, message: "Camera deleted successfully" };
}); 