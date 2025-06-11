"use client";

import { Container, Grid2 as Grid, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import { LocationData } from "./actions/getTodayLocations.action";
import { MetricResponse, CameraStatusResponse } from "./models/metric";
import { getCameraAction } from "./actions/getCamera.action";
import { CamerasCard } from "./components/cameras-card";
import { ComputerCard } from "./components/computer-card";
import { AddCameraModal } from "./components/add-camera-modal";
import { EditCameraModal } from "./components/edit-camera-modal";
import { DeleteCameraModal } from './components/delete-camera-modal';
import AlertManagementModal from './components/alert-management-modal';

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
  onRefreshData?: () => Promise<void>;
  onRefreshCameras?: () => Promise<void>;
}

export default function Dashboard({ 
  metrics, 
  locations, 
  cameraStatus, 
  onRefreshData, 
  onRefreshCameras 
}: IMetricWithCamera) {
  const [localTime, setLocalTime] = useState("");
  const [localDate, setLocalDate] = useState("");
  const [addCameraModalOpen, setAddCameraModalOpen] = useState(false);
  const [editCameraModalOpen, setEditCameraModalOpen] = useState(false);
  const [cameraToEdit, setCameraToEdit] = useState<{
    id: number;
    name: string;
    ip_address: string;
    port: number;
    enabled_alerts: string[];
  } | null>(null);
  const [deleteCameraModalOpen, setDeleteCameraModalOpen] = useState(false);
  const [cameraToDelete, setCameraToDelete] = useState<{
    id: number;
    name: string;
    ip_address: string;
  } | null>(null);
  const [alertManagementModalOpen, setAlertManagementModalOpen] = useState(false);
  const [cameraForAlerts, setCameraForAlerts] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const paperStyle = {
    minHeight: "140px",
    display: "flex",
    flexDirection: "column",
  };

  // Handler functions for camera management
  const handleAddCamera = () => {
    setAddCameraModalOpen(true);
  };

  const handleEditCamera = async (cameraId: number) => {
    try {
      const result = await getCameraAction(cameraId);
      if (result.success) {
        setCameraToEdit({
          id: result.value.id,
          name: result.value.name,
          ip_address: result.value.ip_address,
          port: result.value.port,
          enabled_alerts: result.value.enabled_alerts
        });
        setEditCameraModalOpen(true);
      } else {
        console.error("Failed to fetch camera data:", result.error);
        // Fallback to using status data
        const camera = cameraStatus?.statuses.find(c => c.camera_id === cameraId);
        if (camera) {
          setCameraToEdit({
            id: camera.camera_id,
            name: camera.camera_name,
            ip_address: camera.camera_ip,
            port: camera.camera_port,
            enabled_alerts: [] // Empty array as fallback
          });
          setEditCameraModalOpen(true);
        }
      }
    } catch (error) {
      console.error("Error fetching camera data:", error);
      // Fallback to using status data
      const camera = cameraStatus?.statuses.find(c => c.camera_id === cameraId);
      if (camera) {
        setCameraToEdit({
          id: camera.camera_id,
          name: camera.camera_name,
          ip_address: camera.camera_ip,
          port: camera.camera_port,
          enabled_alerts: [] // Empty array as fallback
        });
        setEditCameraModalOpen(true);
      }
    }
  };

  const handleDeleteCamera = (cameraId: number) => {
    // Find the camera to delete
    const camera = cameraStatus?.statuses.find(c => c.camera_id === cameraId);
    if (camera) {
      setCameraToDelete({
        id: camera.camera_id,
        name: camera.camera_name,
        ip_address: camera.camera_ip
      });
      setDeleteCameraModalOpen(true);
    }
  };

  const handleManageAlerts = (cameraId: number) => {
    // Find the camera for alert management
    const camera = cameraStatus?.statuses.find(c => c.camera_id === cameraId);
    if (camera) {
      setCameraForAlerts({
        id: camera.camera_id,
        name: camera.camera_name
      });
      setAlertManagementModalOpen(true);
    }
  };

  const handleCameraAdded = async () => {
    // Use the refresh function passed as prop, fallback to reload if not available
    if (onRefreshCameras) {
      await onRefreshCameras();
    } else if (onRefreshData) {
      await onRefreshData();
    } else {
      window.location.reload();
    }
  };

  const handleCameraDeleted = async () => {
    // Use the refresh function passed as prop, fallback to reload if not available
    if (onRefreshCameras) {
      await onRefreshCameras();
    } else if (onRefreshData) {
      await onRefreshData();
    } else {
      window.location.reload();
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteCameraModalOpen(false);
    setCameraToDelete(null);
  };

  const handleCloseEditModal = () => {
    setEditCameraModalOpen(false);
    setCameraToEdit(null);
  };

  const handleCloseAlertModal = () => {
    setAlertManagementModalOpen(false);
    setCameraForAlerts(null);
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
                <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"} >Battery Voltage</Typography>
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
        <CamerasCard 
          deviceStatus={metrics.device_status}
          cameraStatus={cameraStatus}
          publicIp={metrics.host_status.public_ip}
          onAddCamera={handleAddCamera}
          onEditCamera={handleEditCamera}
          onDeleteCamera={handleDeleteCamera}
          onManageAlerts={handleManageAlerts}
          showActions={true}
        />
        
        <ComputerCard 
          deviceStatus={metrics.device_status}
          hostStatus={metrics.host_status}
          showActions={true}
        />
      </Grid>

      {/* Add Camera Modal */}
      <AddCameraModal
        open={addCameraModalOpen}
        onClose={() => setAddCameraModalOpen(false)}
        onSuccess={handleCameraAdded}
      />

      {/* Edit Camera Modal */}
      <EditCameraModal
        open={editCameraModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleCameraAdded}
        camera={cameraToEdit}
      />

      <DeleteCameraModal
        open={deleteCameraModalOpen}
        onClose={handleCloseDeleteModal}
        onSuccess={handleCameraDeleted}
        camera={cameraToDelete}
      />

      {/* Alert Management Modal */}
      <AlertManagementModal
        open={alertManagementModalOpen}
        onClose={handleCloseAlertModal}
        cameraId={cameraForAlerts?.id || 0}
        cameraName={cameraForAlerts?.name || ''}
      />
    </Container>
  );
}