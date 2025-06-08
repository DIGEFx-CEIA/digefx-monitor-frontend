"use client";

import { CameraAlt, DeviceThermostat, Memory, Public, SdStorage, Settings, VideoSettings, Wifi } from "@mui/icons-material";
import { Button, Container, Grid2 as Grid, Link, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import { LocationData } from "./actions/getTodayLocations.action";
import { MetricResponse, CameraStatusResponse } from "./models/metric";

// Import do VehicleMap de forma dinâmica para evitar problemas de SSR com Leaflet
const VehicleMap = dynamic(() => import("./components/vehicle-map"), {
  ssr: false,
  loading: () => <Paper elevation={8} sx={{ mt: 3, height: '400px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Typography>Carregando mapa...</Typography>
  </Paper>
});

interface IMetric {
  metrics: MetricResponse;
  locations: LocationData[];
}

interface IMetricWithCamera extends IMetric {
  cameraStatus: CameraStatusResponse;
}

export default function Dashboard({ metrics, locations, cameraStatus }: IMetricWithCamera) {
  type StatusColor = "success" | "warning" | "error";
  const [localTime, setLocalTime] = useState("");
  const [localDate, setLocalDate] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const paperStyle = {
    minHeight: "140px",
    display: "flex",
    flexDirection: "column",
  };

  const getStatusColor = (value: number, type: string): StatusColor => {
    const thresholds: Record<string, { warning: number; error: number }> = {
      cpu: { warning: 70, error: 85 },
      ram: { warning: 80, error: 90 },
      disk: { warning: 85, error: 95 },
      temperature: { warning: 60, error: 70 }
    };

    const threshold = thresholds[type];
    if (!threshold) return "success";

    if (value >= threshold.error) return "error";
    if (value >= threshold.warning) return "warning";
    return "success";
  };

  const convertMinutesToHoursMinutes = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Atualiza a data e hora local a cada segundo
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      const dateOptions: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      };

      setLocalTime(now.toLocaleTimeString("en-US", timeOptions));
      setLocalDate(now.toLocaleDateString("en-US", dateOptions));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

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
                <Typography variant={isMobile ? "h4" : "h3"}>{localTime}</Typography>
                <Typography variant={isMobile ? "h6" : "body1"}>{localDate}</Typography>
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
                <Typography variant={isMobile ? "h6" : "body1"} color={metrics.device_status?.gps_status === "Valid" ? "primary" : "error"}>
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
                <Typography variant={isMobile ? "h6" : "body1"} color={metrics.device_status?.ignition === "On" ? "primary" : "error"}>{metrics.device_status?.ignition ?? "Off"}</Typography>
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
                  {cameraStatus.statuses.map((camera) => (
                    <Grid key={camera.camera_id} size={isMobile ? 12 : 6} direction={"row"} justifyItems={"center"} display="flex" alignItems="center">
                      {camera.is_connected ? (
                        <Link href={`http://${metrics.host_status.public_ip}:5000/#camera_${camera.camera_id}`} target="_blank" rel="noopener noreferrer">
                          <CameraAlt color="success" />
                        </Link>
                      ) : (
                        <CameraAlt color="error" />
                      )}
                      <Typography variant="subtitle2" sx={{ ml: 1, display: "inline-block" }}>
                        {camera.camera_name}: {camera.camera_ip}
                      </Typography>
                    </Grid>
                  ))}
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