import { Button, Container, Grid2 as Grid, Paper, Typography } from "@mui/material";
import { Metric } from "./models/metric";
import Image from "next/image";
import { CameraAlt, DeviceThermostat, Memory, Settings, VideoSettings, Wifi } from "@mui/icons-material";
import { convertMinutesToHoursMinutes } from "@/utils/time.utils";
interface IMetric {
    metrics: Metric;
}
export default function Dashboard({ metrics }: IMetric) {

    return (
        <Container sx={{ mt: 8 }}>
            <Typography variant="h2">Dashboard</Typography>
            <Typography variant="subtitle1">Power Supply Management and Status</Typography>
            <Typography variant="subtitle1">Device ID: {metrics.device_id}</Typography>
            <Grid container spacing={4}
                alignItems={"flex-start"} mt={3}>
                <Grid size={4}>
                    <Paper elevation={8} >
                        <Grid container spacing={2}
                            sx={{
                                alignItems: "flex-start",
                            }} p={2}>
                            <Grid size={8} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                <Typography variant="h3" >{new Date(metrics.timestamp).toLocaleTimeString()}</Typography>
                                <Typography variant="h6" >{new Date(metrics.timestamp).toLocaleDateString()}</Typography>
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
                                <Typography variant="h3" color={metrics.battery_voltage <= metrics.min_voltage ? "error" : "primary"}>{`${metrics.battery_voltage} V`}</Typography>
                                <Typography variant="h6" >{`Min. Voltage: ${metrics.min_voltage} V`}</Typography>
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
                                <Typography variant="h6" color={metrics.ignition === "On" ? "primary" : "error"}>{metrics.ignition}</Typography>
                            </Grid>
                            <Grid size={4} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
                                <Image src={metrics.ignition === "On" ? "/car-key-on.png" : "/car-key-off.png"} width={110} height={110} alt="Time Sync" />
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
                                <Typography variant="h6" color={metrics.relay1_status === "On" ? "primary" : "error"}>{metrics.relay1_status}</Typography>
                                <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"}>Power Timer: {convertMinutesToHoursMinutes(metrics.relay1_time)} </Typography>
                            </Grid>
                            <Grid size={3} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
                                <Image src={metrics.relay1_status === "On" ? "/camera-on.png" : "/camera-off.png"} width={110} height={110} alt="Time Sync" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} p={2}>
                            <Grid size={9}>
                                <Grid container spacing={2}>
                                    <Grid size={3} direction={"row"} justifyItems={"center"}>
                                        <CameraAlt color="success" />
                                        <Typography variant="subtitle2">Cam1</Typography>
                                    </Grid>
                                    <Grid size={3} direction={"row"} justifyItems={"center"}>
                                        <CameraAlt color="success" />
                                        <Typography variant="subtitle2">Cam2</Typography>
                                    </Grid>
                                    <Grid size={3} direction={"row"} justifyItems={"center"}>
                                        <CameraAlt color="success" />
                                        <Typography variant="subtitle2">Cam3</Typography>
                                    </Grid>
                                    <Grid size={3} direction={"row"} justifyItems={"center"}>
                                        <CameraAlt color="error" />
                                        <Typography variant="subtitle2">Cam4</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size={3} alignSelf={"flex-end"} display={"flex"} justifyContent={"flex-end"}>
                                <Button variant="outlined" startIcon={<VideoSettings />}>
                                    Access
                                </Button>
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
                                <Typography variant="h6" color={metrics.relay2_status === "On" ? "primary" : "error"}>{metrics.relay2_status}</Typography>
                                <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"}>Power Timer: {convertMinutesToHoursMinutes(metrics.relay2_time)} </Typography>
                            </Grid>
                            <Grid size={4} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
                                <Image src={metrics.relay2_status === "On" ? "/pc-on.png" : "/pc-off.png"} width={110} height={110} alt="Time Sync" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} p={2}>
                            <Grid size={9}>
                                <Grid container spacing={2}>
                                    <Grid size={4} direction={"row"} justifyItems={"center"}>
                                        <Memory color="warning" />
                                        <Typography variant="subtitle2">CPU: 35%</Typography>
                                    </Grid>
                                    <Grid size={4} direction={"row"} justifyItems={"center"}>
                                        <DeviceThermostat color="success" />
                                        <Typography variant="subtitle2">Temp: 50 ºC</Typography>
                                    </Grid>
                                    <Grid size={4} direction={"row"} justifyItems={"center"}>
                                        <Wifi color="success" />
                                        <Typography>192.168.0.1</Typography>
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