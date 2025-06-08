import { createServerAction, ServerActionError } from "@/libs/action-error-handler.hof";
import { CameraStatusResponse } from "../models/metric";
import fetchWithServerAuth from "@/utils/fetchWithServerAuth";

export const getCameraStatusAction = createServerAction(async () => {
    const API_URL = process.env.API_URL;

    const response = await fetchWithServerAuth(`${API_URL}/cameras/status`, {
        method: "GET",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new ServerActionError(error.message);
    }
    
    const data = await response.json() as CameraStatusResponse;
    return data;
}) 