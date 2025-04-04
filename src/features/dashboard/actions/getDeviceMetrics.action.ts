import { createServerAction, ServerActionError } from "@/libs/action-error-handler.hof";
import { Metric } from "../models/metric";
import fetchWithServerAuth from "@/utils/fetchWithServerAuth";

export const getDeviceMetricsAction = createServerAction(async () => {

    const API_URL = process.env.API_URL;

    const response = await fetchWithServerAuth(`${API_URL}/status`, {
        method: "GET",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new ServerActionError(error.message);
      }
    
      const data = await response.json() as Metric;
      return data;
})