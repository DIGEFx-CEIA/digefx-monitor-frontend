"use server";

import fetchWithServerAuth from "@/utils/fetchWithServerAuth";
import { Settings, settingsSchema } from "./form-validation.action";
import { ServerActionError } from "@/libs/action-error-handler.hof";

// Server action that receives the validated data and persists the settings
export async function updateSettings(data: Settings) {


    // Validate the data again on the server side
    const parseResult = settingsSchema.safeParse(data);
    if (!parseResult.success) {
        console.error("Validation failed:", parseResult.error.flatten());
        throw new Error("Validation failed on server.");
    }

    const settings = parseResult.data;

    const API_URL = process.env.API_URL;

    const response = await fetchWithServerAuth(`${API_URL}/configure`, {
        method: "POST",
        body: JSON.stringify(settings),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new ServerActionError(error.message);
    }

    return { success: true, message: "Configurations updated successfully." };
}
