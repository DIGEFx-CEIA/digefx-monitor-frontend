export type Metric = {
    device_id: string;
    ignition: string;
    battery_voltage: number;
    min_voltage: number;
    relay1_status: string;
    relay2_status: string;
    relay1_time: number;
    relay2_time: number;
    timestamp: Date
}