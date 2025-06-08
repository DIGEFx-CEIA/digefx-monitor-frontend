import { Button, Container, Grid2 as Grid, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { MetricResponse } from "./models/metric";
import Image from "next/image";
import { CameraAlt, DeviceThermostat, Memory, Settings, VideoSettings, Wifi, SdStorage, Public } from "@mui/icons-material";
import { convertMinutesToHoursMinutes } from "@/utils/time.utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import VehicleMap from "./components/vehicle-map";
import { LocationData } from "./actions/getTodayLocations.action";

interface IMetric {
    metrics: MetricResponse;
    locations: LocationData[];
}

export default function Dashboard({ metrics, locations }: IMetric) {
    type StatusColor = "success" | "warning" | "error";
    const [localTime, setLocalTime] = useState("");
    const [localDate, setLocalDate] = useState("");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const date = new Date(metrics.device_status?.timestamp ?? new Date());
        setLocalTime(date.toLocaleTimeString("pt-BR", { timeZone: userTimeZone }));
        setLocalDate(date.toLocaleDateString("pt-BR", { timeZone: userTimeZone }));
    }, [metrics.device_status?.timestamp]);

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

    const paperStyle = {
        width: '100%',
        mb: isMobile ? 2 : 0,
        height: '100%', 
        display: 'flex',
        flexDirection: 'column' as const
    };

    return (
        <Container sx={{ mt: 8, pb: 4 }}>
            <Typography variant={isMobile ? "h3" : "h2"} gutterBottom>Dashboard</Typography>
            <Typography variant="subtitle1">Power Supply Management and Status</Typography>
            <Typography variant="subtitle1" gutterBottom>Device ID: {metrics.device_status?.device_id ?? "Not Configured"}</Typography>
            
            <VehicleMap locations={locations} />

            <Grid container spacing={{xs: 2, sm: 4}} alignItems="stretch" mt={3}>
                <Grid size={{xs: 12, sm: 6, md: 6, xl: 3}}>
                    <Paper elevation={8} sx={paperStyle}>
                        <Grid container spacing={1}
                            sx={{
                                alignItems: "flex-start",
                                flexGrow: 1
                            }} p={2}>
                            <Grid size={9} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                <Typography variant={isMobile ? "h5" : "h4"}>{localTime}</Typography>
                                <Typography variant="h6">{localDate}</Typography>
                                <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"}>Last Synchronization</Typography>
                            </Grid>
                            <Grid size={3} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
                                <Image src={"/time-sync.png"} width={isMobile ? 80 : 60} height={isMobile ? 80 : 60} alt="Time Sync" />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 6, xl: 3}}>
                    <Paper elevation={8} sx={paperStyle}>
                        <Grid container spacing={1}
                            sx={{
                                alignItems: "flex-start",
                                flexGrow: 1
                            }} p={2}>
                            <Grid size={9} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                <Typography variant={isMobile ? "h4" : "h3"} color={metrics.device_status?.battery_voltage <= metrics.device_status?.min_voltage ? "error" : "primary"}>{`${metrics.device_status?.battery_voltage ?? 0} V`}</Typography>
                            <Typography variant={isMobile ? "h6" : "body1"} >{`Min. Voltage: ${metrics.device_status?.min_voltage ?? 0} V`}</Typography>
                                <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"} >Batery Voltage</Typography>
                            </Grid>
                            <Grid size={3} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
                                <Image src={"/car-battery.png"} width={isMobile ? 80 : 60} height={isMobile ? 80 : 60} alt="Car Battery" />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 6, xl: 3}}>
                    <Paper elevation={8} sx={paperStyle}>
                        <Grid container spacing={1}
                            sx={{
                                alignItems: "flex-start",
                                flexGrow: 1
                            }} p={2}>
                            <Grid size={9} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                <Typography variant={isMobile ? "h4" : "h3"}>GPS</Typography>
                            <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"}>is</Typography>
                            <Typography variant="h6" color={metrics.device_status?.gps_status === "Valid" ? "primary" : "error"}>
                                {metrics.device_status?.gps_status === "Valid" ? "Active" : "Inactive"}
                            </Typography>
                            </Grid>
                            <Grid size={3} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
                                <Image src={metrics.device_status?.gps_status === "Valid" ? "/gps-on.webp" : "/gps-off.png"} width={isMobile ? 80 : 60} height={isMobile ? 80 : 60} alt="Ignition" />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 6, xl: 3}}>
                    <Paper elevation={8} sx={paperStyle}>
                        <Grid container spacing={1}
                            sx={{
                                alignItems: "flex-start",
                                flexGrow: 1
                            }} p={2}>
                            <Grid size={9} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                <Typography variant={isMobile ? "h4" : "h3"}>Ignition</Typography>
                            <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"}>is</Typography>
                                <Typography variant="h6" color={metrics.device_status?.ignition === "On" ? "primary" : "error"}>{metrics.device_status?.ignition ?? "Off"}</Typography>
                            </Grid>
                            <Grid size={3} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
                                <Image src={metrics.device_status?.ignition === "On" ? "/car-key-on.png" : "/car-key-off.png"} width={isMobile ? 80 : 60} height={isMobile ? 80 : 60} alt="Ignition" />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid size={{xs: 12, md: 12, xl: 6}}>
                    <Paper elevation={8} sx={paperStyle}>
                        <Grid container spacing={2}
                            sx={{
                                alignItems: "flex-start",
                                flexGrow: 1
                            }} p={2}>
                            <Grid size={9} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                <Typography variant={isMobile ? "h4" : "h3"}>Cameras</Typography>
                                <Typography variant="h6" color={metrics.device_status?.relay1_status === "On" ? "primary" : "error"}>{metrics.device_status?.relay1_status ?? "Off"}</Typography>
                                <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"}>Power Timer: {convertMinutesToHoursMinutes(metrics.device_status?.relay1_time ?? 0)} </Typography>
                            </Grid>
                            <Grid size={3} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
                                <Image src={metrics.device_status?.relay1_status === "On" ? "/camera-on.png" : "/camera-off.png"} width={isMobile ? 80 : 110} height={isMobile ? 80 : 110} alt="Camera" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} p={2}>
                            <Grid size={9}>
                                <Grid container spacing={2}>
                                    {metrics.camera_status?.camera1_ip && <Grid size={isMobile ? 12 : 6} direction={"row"} justifyItems={"center"} display="flex" alignItems="center">
                                        {metrics.camera_status.camera1_connected?(
                                        <Link href={`http://${metrics.host_status.public_ip}:5000/#camera_1`} target="_blank" rel="noopener noreferrer">
                                            <CameraAlt color="success" />
                                        </Link>): (
                                            <CameraAlt color="error" />
                                        )}
                                        <Typography variant="subtitle2" sx={{ ml: 1, display: "inline-block" }}>Cam1: {metrics.camera_status.camera1_ip}</Typography>
                                    </Grid>}
                                    {metrics.camera_status?.camera2_ip && <Grid size={isMobile ? 12 : 6} direction={"row"} justifyItems={"center"} display="flex" alignItems="center">
                                        {metrics.camera_status.camera2_connected?(
                                        <Link href={`http://${metrics.host_status.public_ip}:5000/#camera_2`} target="_blank" rel="noopener noreferrer">
                                            <CameraAlt color="success" />
                                        </Link>): (
                                            <CameraAlt color="error" />
                                        )}
                                        <Typography variant="subtitle2" sx={{ ml: 1, display: "inline-block" }}>Cam2: {metrics.camera_status.camera2_ip}</Typography>
                                    </Grid>}
                                    {metrics.camera_status?.camera3_ip && <Grid size={isMobile ? 12 : 6} direction={"row"} justifyItems={"center"} display="flex" alignItems="center">
                                        {metrics.camera_status.camera3_connected?(
                                        <Link href={`http://${metrics.host_status.public_ip}:5000/#camera_3`} target="_blank" rel="noopener noreferrer">
                                            <CameraAlt color="success" />
                                        </Link>): (
                                            <CameraAlt color="error" />
                                        )}
                                        <Typography variant="subtitle2" sx={{ ml: 1, display: "inline-block" }}>Cam3: {metrics.camera_status.camera3_ip}</Typography>
                                    </Grid>}
                                    {metrics.camera_status?.camera4_ip && <Grid size={isMobile ? 12 : 6} direction={"row"} justifyItems={"center"} display="flex" alignItems="center">
                                        {metrics.camera_status.camera4_connected?(
                                        <Link href={`http://${metrics.host_status.public_ip}:5000/#camera_4`} target="_blank" rel="noopener noreferrer">
                                            <CameraAlt color="success" />
                                        </Link>): (
                                            <CameraAlt color="error" />
                                        )}
                                        <Typography variant="subtitle2" sx={{ ml: 1, display: "inline-block" }}>Cam4: {metrics.camera_status.camera4_ip}</Typography>
                                    </Grid>}
                                </Grid>
                            </Grid>
                            <Grid size={3} alignSelf={"flex-end"} display={"flex"} justifyContent={"flex-end"}>
                                <Link href={`http://${metrics.host_status.public_ip}:5000`} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outlined" startIcon={<VideoSettings />} size={isMobile ? "small" : "medium"}>
                                        Access
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid size={{xs: 12, md: 12, xl: 6}}>
                    <Paper elevation={8} sx={paperStyle}>
                        <Grid container spacing={2}
                            sx={{
                                alignItems: "flex-start",
                                flexGrow: 1
                            }} p={2}>
                            <Grid size={8} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                <Typography variant={isMobile ? "h4" : "h3"}>Computer</Typography>
                                <Typography variant="h6" color={metrics.device_status?.relay2_status === "On" ? "primary" : "error"}>{metrics.device_status?.relay2_status ?? "Off"}</Typography>
                                <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"}>Power Timer: {convertMinutesToHoursMinutes(metrics.device_status?.relay2_time ?? 0)} </Typography>
                            </Grid>
                            <Grid size={4} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
                                <Image src={metrics.device_status?.relay2_status === "On" ? "/pc-on.png" : "/pc-off.png"} width={isMobile ? 80 : 110} height={isMobile ? 80 : 110} alt="Computer" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} p={2}>
                            <Grid size={9}>
                                <Grid container spacing={2}>
                                    <Grid size={isMobile ? 6 : 4} direction={"row"} justifyItems={"center"} display="flex" alignItems="center">
                                        <Memory color={getStatusColor(metrics.host_status.cpu_usage, "cpu")} />
                                        <Typography variant="subtitle2" ml={1}>
                                            CPU: {metrics.host_status.cpu_usage.toFixed(1)}%
                                        </Typography>
                                    </Grid>
                                    <Grid size={isMobile ? 6 : 4} direction={"row"} justifyItems={"center"} display="flex" alignItems="center">
                                        <Memory color={getStatusColor(metrics.host_status.ram_usage, "ram")} />
                                        <Typography variant="subtitle2" ml={1}>
                                            RAM: {metrics.host_status.ram_usage.toFixed(1)}%
                                        </Typography>
                                    </Grid>
                                    <Grid size={isMobile ? 6 : 4} direction={"row"} justifyItems={"center"} display="flex" alignItems="center">
                                        <SdStorage color={getStatusColor(metrics.host_status.disk_usage, "disk")} />
                                        <Typography variant="subtitle2" ml={1}>
                                            DISK: {metrics.host_status.disk_usage.toFixed(1)}%
                                        </Typography>
                                    </Grid>
                                    <Grid size={isMobile ? 6 : 4} direction={"row"} justifyItems={"center"} display="flex" alignItems="center">
                                        <DeviceThermostat color={getStatusColor(metrics.host_status.temperature, "temperature")} />
                                        <Typography variant="subtitle2" ml={1}>Temp: {metrics.host_status.temperature.toFixed(1)} ºC</Typography>
                                    </Grid>
                                    <Grid size={isMobile ? 6 : 4} direction={"row"} justifyItems={"center"} display="flex" alignItems="center">
                                        <Wifi color="success" />
                                        <Typography variant="subtitle2" ml={1}>{metrics.host_status.host_ip}</Typography>
                                    </Grid>
                                    <Grid size={isMobile ? 6 : 4} direction={"row"} justifyItems={"center"} display="flex" alignItems="center">
                                        <Public color={metrics.host_status.online ? "success" : "error"} />
                                        <Typography variant="subtitle2" ml={1}>{metrics.host_status.online ? metrics.host_status.public_ip : "Offline"}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size={3} alignSelf={"flex-end"} display={"flex"} justifyContent={"flex-end"}>
                                <Button variant="outlined" startIcon={<Settings />} size={isMobile ? "small" : "medium"}>
                                    Setup
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}