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
  showActions?: boolean;
}

export function CamerasCard({
  deviceStatus,
  cameraStatus,
  publicIp,
  onAddCamera,
  onEditCamera,
  onDeleteCamera,
  showActions = false
}: CamerasCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const paperStyle = {
    minHeight: "140px",
    display: "flex",
    flexDirection: "column",
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
        <Grid container spacing={2}
          sx={{
            alignItems: "flex-start",
            flexGrow: 1
          }} p={2}>
          <Grid size={9} display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <Typography variant={isMobile ? "h4" : "h3"}>Cameras</Typography>
            <Typography variant="h6" color={deviceStatus?.relay1_status === "On" ? "primary" : "error"}>
              {deviceStatus?.relay1_status ?? "Off"}
            </Typography>
            <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"}>
              Power Timer: {convertMinutesToHoursMinutes(deviceStatus?.relay1_time ?? 0)}
            </Typography>
          </Grid>
          <Grid size={3} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
            <Image
              src={deviceStatus?.relay1_status === "On" ? "/camera-on.png" : "/camera-off.png"}
              width={isMobile ? 80 : 110}
              height={isMobile ? 80 : 110}
              alt="Camera"
            />
          </Grid>
        </Grid>

        {/* Cameras List Section */}
        <Grid container spacing={2} p={2}>
          <Grid size={12}>
            {/* Camera Management Header */}
            {showActions && (
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color="text.secondary">
                  Cameras ({cameraStatus.total_count})
                </Typography>
              </Box>
            )}

            <Grid container spacing={1}>
              {cameraStatus.statuses.length === 0 ? (
                <Grid size={12}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    py={4}
                    sx={{ opacity: 0.6 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No cameras configured
                    </Typography>
                    {showActions && (
                      <Button
                        variant="text"
                        startIcon={<Add />}
                        size="small"
                        onClick={onAddCamera}
                        sx={{ mt: 1 }}
                      >
                        Add first camera
                      </Button>
                    )}
                  </Box>
                </Grid>
              ) : (
                cameraStatus.statuses.map((camera) => (
                  <CameraItem
                    key={camera.camera_id}
                    camera={camera}
                    publicIp={publicIp}
                    onEdit={onEditCamera}
                    onDelete={onDeleteCamera}
                    showActions={showActions}
                  />
                ))
              )}
            </Grid>
          </Grid>

          {/* Actions Section */}
          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              {showActions && (
              <Button
                variant="contained"
                startIcon={<Add />}
                size="small"
                onClick={onAddCamera}
                >
                  Add Camera
                </Button>
              )}
              <Link href={`http://${publicIp}:5000`} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outlined"
                  startIcon={<VideoSettings />}
                  size={isMobile ? "small" : "medium"}
                >
                  Acess Frigate
                </Button>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
} 