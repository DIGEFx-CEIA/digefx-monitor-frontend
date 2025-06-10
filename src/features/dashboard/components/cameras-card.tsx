"use client";

import { Add, VideoSettings } from "@mui/icons-material";
import {
  Button,
  Grid2 as Grid,
  Link,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
  Divider
} from "@mui/material";
import Image from "next/image";
import { CameraStatusResponse, DeviceMetric } from "../models/metric";
import { CameraItem } from "./camera-item";

interface CamerasCardProps {
  deviceStatus: DeviceMetric;
  cameraStatus: CameraStatusResponse;
  publicIp: string;
  onAddCamera?: () => void;
  onEditCamera?: (cameraId: number) => void;
  onDeleteCamera?: (cameraId: number) => void;
  onManageAlerts?: (cameraId: number) => void;
  showActions?: boolean;
}

export function CamerasCard({
  deviceStatus,
  cameraStatus,
  publicIp,
  onAddCamera,
  onEditCamera,
  onDeleteCamera,
  onManageAlerts,
  showActions = false
}: CamerasCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const paperStyle = {
    minHeight: "400px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  };

  const convertMinutesToHoursMinutes = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <Grid size={{ xs: 12, md: 12, xl: 6 }}>
      <Paper elevation={8} sx={paperStyle}>
        {/* Header Section */}
        <Box sx={{ flexShrink: 0 }}>
          <Grid container spacing={2}
            sx={{
              alignItems: "flex-start",
              flexGrow: 1
            }} p={2}>
            <Grid size={8} display={"flex"} flexDirection={"column"} alignItems={"center"}>
              <Typography variant={isMobile ? "h4" : "h3"}>Cameras</Typography>
              <Typography variant="h6" color={deviceStatus?.relay1_status === "On" ? "primary" : "error"}>
                {deviceStatus?.relay1_status ?? "Off"}
              </Typography>
              <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"}>
                Power Timer: {convertMinutesToHoursMinutes(deviceStatus?.relay1_time ?? 0)}
              </Typography>
            </Grid>
            <Grid size={4} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
              <Image 
                src={deviceStatus?.relay1_status === "On" ? "/camera-on.png" : "/camera-off.png"} 
                width={isMobile ? 80 : 110} 
                height={isMobile ? 80 : 110} 
                alt="Cameras" 
              />
            </Grid>
          </Grid>
        </Box>

        {/* Cameras Section */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Grid container spacing={2} p={2} sx={{ flexGrow: 1 }}>
            <Grid size={12} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Camera Management Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" color="text.secondary">
                    Camera Management
                  </Typography>
                </Box>

              {/* Cameras List */}
              <Box sx={{ flexGrow: 1 }}>
                {cameraStatus.statuses.length > 0 ? (
                  <Grid container spacing={1}>
                    {cameraStatus.statuses.map((camera) => (
                      <Grid key={camera.camera_id} size={12}>
                        <CameraItem
                          camera={camera}
                          publicIp={publicIp}
                          onEdit={onEditCamera}
                          onDelete={onDeleteCamera}
                          onManageAlerts={onManageAlerts}
                          showActions={showActions}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ 
                      minHeight: 120,
                      textAlign: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    <VideoSettings sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      No cameras configured
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Actions Section */}
              <Box sx={{ mt: 'auto' }}>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  {showActions && (

                  <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Add />}
                  onClick={onAddCamera}
                  disabled={!onAddCamera}
                >
                  Add Camera
                </Button>)}
                    <Button
                      variant="outlined"
                      startIcon={<VideoSettings />}
                      size={isMobile ? "small" : "medium"}
                      component={Link}
                      href={`http://${publicIp}:5000`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Frigate
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  );
} 