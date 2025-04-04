// actions.ts
import { z } from "zod";

// Define a schema with all the validations
export const settingsSchema = z.object({
  device_id: z
    .string()
    .max(32, "Device ID must be at most 32 characters"),
  min_voltage: z
    .number({ invalid_type_error: "Minimum Voltage must be a number" })
    .min(9, "Minimum voltage must be at least 9.0 Volts")
    .max(15, "Minimum voltage must be at most 15.0 Volts")
    .refine(val => Number.isInteger(val * 10), { message: "Minimum voltage must have one decimal place" }),
  relay1_time: z
    .number({ invalid_type_error: "Camera Time must be a number" })
    .int("Camera Time must be an integer")
    .min(1, "Camera time must be at least 1 minute")
    .max(300, "Camera time must be at most 300 minutes (5 hours)"),
  relay2_time: z
    .number({ invalid_type_error: "System Time must be a number" })
    .int("System Time must be an integer")
    .min(1, "System time must be at least 1 minute")
    .max(300, "System time must be at most 300 minutes (5 hours)"),
});

export type Settings = z.infer<typeof settingsSchema>;