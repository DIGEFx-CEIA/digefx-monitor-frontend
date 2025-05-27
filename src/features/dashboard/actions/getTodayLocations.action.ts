import { createServerAction, ServerActionError } from "@/libs/action-error-handler.hof";
import fetchWithServerAuth from "@/utils/fetchWithServerAuth";

export interface LocationData {
  device_id: string;
  latitude: number;
  longitude: number;
  speed: number;
  hdop: number;
  sats: number;
  timestamp: string;
}

export interface LocationResponse {
  locations: LocationData[];
  total_count: number;
}

export interface ActionResult<T> {
  success: boolean;
  value?: T;
  error?: string;
}


export const getTodayLocationsAction = createServerAction(async () => {

    const API_URL = process.env.API_URL;

    const response = await fetchWithServerAuth(`${API_URL}/locations/today`, {
        method: "GET",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new ServerActionError(error.message);
      }
    
      const data = await response.json() as LocationResponse;
      return data;
})