export type MetricResponse = {
    device_status: DeviceMetric;
    host_status: HostMetric;
    camera_status: CameraMetric;
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

export type CameraMetric = {
    camera1_ip?: string;
    camera2_ip?: string;
    camera3_ip?: string;
    camera4_ip?: string;
    camera1_connected: boolean;
    camera2_connected: boolean;
    camera3_connected: boolean;
    camera4_connected: boolean;
    timestamp: Date
}