"use client";

import { DeviceThermostat, Memory, Public, SdStorage, Settings, Wifi, Terminal } from "@mui/icons-material";
import { 
  Button, 
  Grid2 as Grid, 
  Paper, 
  Typography, 
  useMediaQuery, 
  useTheme,
  Box,
  Divider
} from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import { DeviceMetric, HostMetric } from "../models/metric";
import TerminalInterface from "../../terminal/components/terminal-interface";

interface ComputerCardProps {
  deviceStatus: DeviceMetric;
  hostStatus: HostMetric;
  onSetup?: () => void;
  showActions?: boolean;
}

export function ComputerCard({ 
  deviceStatus, 
  hostStatus, 
  onSetup,
  showActions = false
}: ComputerCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [terminalOpen, setTerminalOpen] = useState(false);

  type StatusColor = "success" | "warning" | "error";

  const paperStyle = {
    minHeight: "400px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
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

  const metrics = [
    {
      icon: <Memory color={getStatusColor(hostStatus.cpu_usage, "cpu")} />,
      label: "CPU",
      value: `${hostStatus.cpu_usage.toFixed(1)}%`,
      color: getStatusColor(hostStatus.cpu_usage, "cpu")
    },
    {
      icon: <Memory color={getStatusColor(hostStatus.ram_usage, "ram")} />,
      label: "RAM",
      value: `${hostStatus.ram_usage.toFixed(1)}%`,
      color: getStatusColor(hostStatus.ram_usage, "ram")
    },
    {
      icon: <SdStorage color={getStatusColor(hostStatus.disk_usage, "disk")} />,
      label: "DISK",
      value: `${hostStatus.disk_usage.toFixed(1)}%`,
      color: getStatusColor(hostStatus.disk_usage, "disk")
    },
    {
      icon: <DeviceThermostat color={getStatusColor(hostStatus.temperature, "temperature")} />,
      label: "Temp",
      value: `${hostStatus.temperature.toFixed(1)} ºC`,
      color: getStatusColor(hostStatus.temperature, "temperature")
    },
    {
      icon: <Wifi color="success" />,
      label: "Local IP",
      value: hostStatus.host_ip,
      color: "success" as StatusColor
    },
    {
      icon: <Public color={hostStatus.online ? "success" : "error"} />,
      label: "Public IP",
      value: hostStatus.online ? hostStatus.public_ip : "Offline",
      color: hostStatus.online ? "success" as StatusColor : "error" as StatusColor
    }
  ];

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
              <Typography variant={isMobile ? "h4" : "h3"}>Computer</Typography>
              <Typography variant="h6" color={deviceStatus?.relay2_status === "On" ? "primary" : "error"}>
                {deviceStatus?.relay2_status ?? "Off"}
              </Typography>
              <Typography variant="subtitle1" textAlign={"center"} fontWeight={"bold"}>
                Power Timer: {convertMinutesToHoursMinutes(deviceStatus?.relay2_time ?? 0)}
              </Typography>
            </Grid>
            <Grid size={4} alignSelf={"center"} display={"flex"} justifyContent={"center"}>
              <Image 
                src={deviceStatus?.relay2_status === "On" ? "/pc-on.png" : "/pc-off.png"} 
                width={isMobile ? 80 : 110} 
                height={isMobile ? 80 : 110} 
                alt="Computer" 
              />
            </Grid>
          </Grid>
        </Box>

        {/* Metrics Section */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Grid container spacing={2} p={2} sx={{ flexGrow: 1 }}>
            <Grid size={12} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Metrics Header */}
              {showActions && (
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" color="text.secondary">
                    System Metrics
                  </Typography>
                </Box>
              )}

              {/* Metrics Grid */}
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Grid container spacing={2}>
                  {metrics.map((metric, index) => (
                    <Grid key={index} size={isMobile ? 6 : 4} direction="row" justifyItems="center" display="flex" alignItems="center">
                      <Box display="flex" alignItems="center" sx={{ 
                        minHeight: 40,
                        borderRadius: 1,
                        padding: 0.5,
                        width: '100%'
                      }}>
                        {metric.icon}
                        <Typography variant="subtitle2" sx={{ ml: 1, flexGrow: 1 }}>
                          {metric.label}: {metric.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              
              {/* Actions Section */}
              <Box sx={{ mt: 'auto' }}>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="flex-end" gap={1}>
                  <Button 
                    variant="outlined" 
                    startIcon={<Terminal />} 
                    size={isMobile ? "small" : "medium"}
                    onClick={() => setTerminalOpen(true)}
                    color="primary"
                  >
                    Terminal
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Settings />} 
                    size={isMobile ? "small" : "medium"}
                    onClick={onSetup}
                  >
                    Setup
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Terminal Interface */}
      <TerminalInterface 
        open={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />
    </Grid>
  );
} 