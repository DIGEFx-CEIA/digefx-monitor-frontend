export type MetricResponse = {
    device_status: DeviceMetric;
    host_status: HostMetric;
}

export type DeviceMetric = {
    device_id: string;
    ignition: string;
    battery_voltage: number;
    min_voltage: number;
    relay1_status: string;
    relay2_status: string;
    relay1_time: number;
    relay2_time: number;
    gps_status: string;
    timestamp: Date
}

export type HostMetric = {
    host_ip: string;
    public_ip: string;
    cpu_usage: number;
    ram_usage: number;
    disk_usage: number;
    temperature: number;
    online: boolean;
    timestamp: Date
}

// New dynamic camera types
export type CameraStatus = {
    camera_id: number;
    camera_name: string;
    camera_ip: string;
    camera_port: number;
    is_connected: boolean;
    is_active: boolean;
    last_ping_time?: string;
    response_time_ms?: number;
    timestamp: string;
}

export type CameraStatusResponse = {
    statuses: CameraStatus[];
    total_count: number;
}