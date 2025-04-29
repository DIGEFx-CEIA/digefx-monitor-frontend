import { Button, Container, Grid2 as Grid, Paper, Typography } from "@mui/material";
import { MetricResponse } from "./models/metric";
import Image from "next/image";
import { CameraAlt, DeviceThermostat, Memory, Settings, VideoSettings, Wifi, SdStorage, Public } from "@mui/icons-material";
import { convertMinutesToHoursMinutes } from "@/utils/time.utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface IMetric {
    metrics: MetricResponse;
    coordinates: {
        latitude: number;
        longitude: number;
        velocidade: number;
        horario: string;
    }[];
}

// Configuração do ícone do veículo
const vehicleIcon = L.icon({
    iconUrl: '/car.webp',
    iconSize: [24, 40],
    iconAnchor: [12, 20],
});

export default function Dashboard({ metrics, coordinates }: IMetric) {
    type StatusColor = "success" | "warning" | "error";
    const [localTime, setLocalTime] = useState("");
    const [localDate, setLocalDate] = useState("");

    useEffect(() => {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log(userTimeZone);
        const date = new Date(metrics.device_status.timestamp);
        console.log(date);
        setLocalTime(date.toLocaleTimeString("pt-BR", { timeZone: userTimeZone }));
        setLocalDate(date.toLocaleDateString("pt-BR", { timeZone: userTimeZone }));
    }, [metrics.device_status.timestamp]);


    const getStatusColor = (value: number, type: string): StatusColor => {
        const colorThresholds: Record<string, { success: number; warning: number }> = {
            cpu: { success: 40, warning: 75 },
            ram: { success: 50, warning: 80 },
            disk: { success: 60, warning: 80 },
            temperature: { success: 60, warning: 80 },
        };
    
        const thresholds = colorThresholds[type] || { success: 50, warning: 75 };
    
        if (value < thresholds.success) return "success";
        if (value < thresholds.warning) return "warning";
        return "error";
    };
    return (
        <Container sx={{ mt: 8 }}>
            <Typography variant="h2">Dashboard</Typography>
            <Typography variant="subtitle1">Power Supply Management and Status</Typography>
            <Typography variant="subtitle1">Device ID: {metrics.device_status.device_id}</Typography>
            
            {/* Mapa */}
            <Paper elevation={8} sx={{ mt: 3, height: '400px', width: '100%', position: 'relative' }}>
                <MapContainer
                    center={coordinates.length > 0 ? [coordinates[coordinates.length - 1].latitude, coordinates[coordinates.length - 1].longitude] : [-23.5505, -46.6333]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {coordinates.length > 0 && (
                        <>
                            <Polyline
                                positions={coordinates.map(coord => [coord.latitude, coord.longitude])}
                                color="blue"
                            />
                            <Marker
                                position={[coordinates[coordinates.length - 1].latitude, coordinates[coordinates.length - 1].longitude]}
                                icon={vehicleIcon}
                            />
                        </>
                    )}
                </MapContainer>
                {coordinates.length > 0 && (
                    <Paper 
                        elevation={8} 
                        sx={{ 
                            position: 'absolute', 
                            top: 10, 
                            right: 10, 
                            padding: 2,
                            backgroundColor: 'rgba(12, 12, 12, 0.8)',
                            zIndex: 1000
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Vehicle Status
                        </Typography>
                        <Typography variant="body1">
                            Speed: {coordinates[coordinates.length - 1].velocidade} km/h
                        </Typography>
                        <Typography variant="body1">
                            Last Update: {new Date(coordinates[coordinates.length - 1].horario).toLocaleString('pt-BR')}
                        </Typography>
                    </Paper>
                )}
            </Paper>

            <Grid container spacing={4}
                alignItems={"flex-start"} mt={3}>
                <Grid size={4}>
                    <Paper elevation={8} >
                        <Grid container spacing={2}
                            sx={{
                                alignItems: "flex-start",
                            }} p={2}>
                            <Grid size={8} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                <Typography variant="h4">{localTime}</Typography>
                                <Typography variant="h6">{localDate}</Typography>
                                <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"}>Last Synchronization</Typography>
                            </Grid>
                            <Grid size={4} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
                                <Image src={"/time-sync.png"} width={110} height={110} alt="Time Sync" />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid size={4}>
                    <Paper elevation={8} >
                        <Grid container spacing={2}
                            sx={{
                                alignItems: "flex-start",
                            }} p={2}>
                            <Grid size={8} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                <Typography variant="h3" color={metrics.device_status.battery_voltage <= metrics.device_status.min_voltage ? "error" : "primary"}>{`${metrics.device_status.battery_voltage} V`}</Typography>
                                <Typography variant="h6" >{`Min. Voltage: ${metrics.device_status.min_voltage} V`}</Typography>
                                <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"} >Batery Voltage</Typography>
                            </Grid>
                            <Grid size={4} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
                                <Image src={"/car-battery.png"} width={100} height={100} alt="Time Sync" />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid size={4}>
                    <Paper elevation={8} >
                        <Grid container spacing={2}
                            sx={{
                                alignItems: "flex-start",
                            }} p={2}>
                            <Grid size={8} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                <Typography variant="h3">Ignition</Typography>
                                <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"}>is</Typography>
                                <Typography variant="h6" color={metrics.device_status.ignition === "On" ? "primary" : "error"}>{metrics.device_status.ignition}</Typography>
                            </Grid>
                            <Grid size={4} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
                                <Image src={metrics.device_status.ignition === "On" ? "/car-key-on.png" : "/car-key-off.png"} width={110} height={110} alt="Time Sync" />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid size={6}>
                    <Paper elevation={8} >
                        <Grid container spacing={2}
                            sx={{
                                alignItems: "flex-start",
                            }} p={2}>
                            <Grid size={9} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                <Typography variant="h3">Cameras</Typography>
                                <Typography variant="h6" color={metrics.device_status.relay1_status === "On" ? "primary" : "error"}>{metrics.device_status.relay1_status}</Typography>
                                <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"}>Power Timer: {convertMinutesToHoursMinutes(metrics.device_status.relay1_time)} </Typography>
                            </Grid>
                            <Grid size={3} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
                                <Image src={metrics.device_status.relay1_status === "On" ? "/camera-on.png" : "/camera-off.png"} width={110} height={110} alt="Time Sync" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} p={2}>
                            <Grid size={9}>
                                <Grid container spacing={2}>
                                    {metrics.camera_status.camera1_ip && <Grid size={6} direction={"row"} justifyItems={"center"}>
                                        {metrics.camera_status.camera1_connected?(
                                        <Link href={`http://${metrics.host_status.public_ip}:5000/#camera_1`} target="_blank" rel="noopener noreferrer">
                                            <CameraAlt color="success" />
                                        </Link>): (
                                            <CameraAlt color="error" />
                                        )}
                                        <Typography variant="subtitle2">Cam1: {metrics.camera_status.camera1_ip}</Typography>
                                    </Grid>}
                                    {metrics.camera_status.camera2_ip && <Grid size={6} direction={"row"} justifyItems={"center"}>
                                        {metrics.camera_status.camera2_connected?(
                                        <Link href={`http://${metrics.host_status.public_ip}:5000/#camera_2`} target="_blank" rel="noopener noreferrer">
                                            <CameraAlt color="success" />
                                        </Link>): (
                                            <CameraAlt color="error" />
                                        )}
                                        <Typography variant="subtitle2">Cam2: {metrics.camera_status.camera2_ip}</Typography>
                                    </Grid>}
                                    {metrics.camera_status.camera3_ip && <Grid size={6} direction={"row"} justifyItems={"center"}>
                                        {metrics.camera_status.camera3_connected?(
                                        <Link href={`http://${metrics.host_status.public_ip}:5000/#camera_3`} target="_blank" rel="noopener noreferrer">
                                            <CameraAlt color="success" />
                                        </Link>): (
                                            <CameraAlt color="error" />
                                        )}
                                        <Typography variant="subtitle2">Cam3: {metrics.camera_status.camera3_ip}</Typography>
                                    </Grid>}
                                    {metrics.camera_status.camera4_ip && <Grid size={6} direction={"row"} justifyItems={"center"}>
                                        {metrics.camera_status.camera4_connected?(
                                        <Link href={`http://${metrics.host_status.public_ip}:5000/#camera_4`} target="_blank" rel="noopener noreferrer">
                                            <CameraAlt color="success" />
                                        </Link>): (
                                            <CameraAlt color="error" />
                                        )}
                                        <Typography variant="subtitle2">Cam4: {metrics.camera_status.camera4_ip}</Typography>
                                    </Grid>}
                                </Grid>
                            </Grid>
                            <Grid size={3} alignSelf={"flex-end"} display={"flex"} justifyContent={"flex-end"}>
                                <Link href={`http://${metrics.host_status.public_ip}:5000`} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outlined" startIcon={<VideoSettings />}>
                                        Access
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid size={6}>
                    <Paper elevation={8} >
                        <Grid container spacing={2}
                            sx={{
                                alignItems: "flex-start",
                            }} p={2}>
                            <Grid size={8} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                <Typography variant="h3">Computer</Typography>
                                <Typography variant="h6" color={metrics.device_status.relay2_status === "On" ? "primary" : "error"}>{metrics.device_status.relay2_status}</Typography>
                                <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"}>Power Timer: {convertMinutesToHoursMinutes(metrics.device_status.relay2_time)} </Typography>
                            </Grid>
                            <Grid size={4} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
                                <Image src={metrics.device_status.relay2_status === "On" ? "/pc-on.png" : "/pc-off.png"} width={110} height={110} alt="Time Sync" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} p={2}>
                            <Grid size={9}>
                                <Grid container spacing={2}>
                                    <Grid size={4} direction={"row"} justifyItems={"center"}>
                                        <Memory color={getStatusColor(metrics.host_status.cpu_usage, "cpu")} />
                                        <Typography variant="subtitle2" ml={1}>
                                            CPU: {metrics.host_status.cpu_usage.toFixed(1)}%
                                        </Typography>
                                    </Grid>
                                    <Grid size={4} direction={"row"} justifyItems={"center"}>
                                        <Memory color={getStatusColor(metrics.host_status.ram_usage, "ram")} />
                                        <Typography variant="subtitle2" ml={1}>
                                            RAM: {metrics.host_status.ram_usage.toFixed(1)}%
                                        </Typography>
                                    </Grid>
                                    <Grid size={4} direction={"row"} justifyItems={"center"}>
                                        <SdStorage color={getStatusColor(metrics.host_status.disk_usage, "disk")} />
                                        <Typography variant="subtitle2" ml={1}>
                                            DISK: {metrics.host_status.disk_usage.toFixed(1)}%
                                        </Typography>
                                    </Grid>
                                    <Grid size={4} direction={"row"} justifyItems={"center"}>
                                        <DeviceThermostat color={getStatusColor(metrics.host_status.temperature, "temperature")} />
                                        <Typography variant="subtitle2">Temp: {metrics.host_status.temperature.toFixed(1)} ºC</Typography>
                                    </Grid>
                                    <Grid size={4} direction={"row"} justifyItems={"center"}>
                                        <Wifi color="success" />
                                        <Typography>{metrics.host_status.host_ip}</Typography>
                                    </Grid>
                                    <Grid size={4} direction={"row"} justifyItems={"center"}>
                                        <Public color={metrics.host_status.online ? "success" : "error"} />
                                        <Typography>{metrics.host_status.online ? metrics.host_status.public_ip : "Offline"}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size={3} alignSelf={"flex-end"} display={"flex"} justifyContent={"flex-end"}>
                                <Button variant="outlined" startIcon={<Settings />}>
                                    Setup
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>)
}