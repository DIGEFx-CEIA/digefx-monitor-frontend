"use client";

import { CameraAlt, Edit, Delete, NotificationsActive } from "@mui/icons-material";
import { 
  Grid2 as Grid, 
  IconButton, 
  Link, 
  Typography, 
  useMediaQuery, 
  useTheme,
  Chip,
  Box,
  Tooltip,
  Switch,
  FormControlLabel
} from "@mui/material";
import { useState } from "react";
import { CameraStatus } from "../models/metric";
import { toggleCameraActiveAction } from "../actions/toggleCameraActive.action";

interface CameraItemProps {
  camera: CameraStatus;
  publicIp: string;
  onEdit?: (cameraId: number) => void;
  onDelete?: (cameraId: number) => void;
  onManageAlerts?: (cameraId: number) => void;
  onCameraUpdated?: () => void;
  showActions?: boolean;
}

export function CameraItem({ 
  camera, 
  publicIp, 
  onEdit, 
  onDelete, 
  onManageAlerts,
  onCameraUpdated,
  showActions = false 
}: CameraItemProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = () => {
    onEdit?.(camera.camera_id);
  };

  const handleDelete = () => {
    onDelete?.(camera.camera_id);
  };

  const handleManageAlerts = () => {
    onManageAlerts?.(camera.camera_id);
  };

  const handleToggleActive = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdating) return;
    
    const newActiveStatus = event.target.checked;
    setIsUpdating(true);
    
    try {
      await toggleCameraActiveAction(camera.camera_id, newActiveStatus);
      // Refresh the camera data
      onCameraUpdated?.();
    } catch (error) {
      console.error("Failed to toggle camera status:", error);
      // Optionally show a toast/notification here
    } finally {
      setIsUpdating(false);
    }
  };

  const formatResponseTime = (responseTime?: number) => {
    if (!responseTime) return null;
    return responseTime < 1000 ? `${responseTime}ms` : `${(responseTime / 1000).toFixed(1)}s`;
  };

  return (
    <Box
      sx={{ 
        width: '100%',
        minHeight: 48,
        borderRadius: 1,
        padding: 1,
        display: 'flex',
        alignItems: 'center',
        opacity: camera.is_active ? 1 : 0.5,
        '&:hover': showActions ? {
          backgroundColor: 'action.hover',
        } : undefined
      }}
    >
      {/* Camera Icon & Link */}
      <Box display="flex" alignItems="center" mr={2}>
        {camera.is_connected && camera.is_active ? (
          <Link 
            href={`http://${publicIp}:5000/#camera_${camera.camera_id}`} 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <CameraAlt color="success" />
          </Link>
        ) : (
          <CameraAlt color={camera.is_active ? "error" : "disabled"} />
        )}
      </Box>

      {/* Camera Info */}
      <Box sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle2" component="div">
            {camera.camera_name}
          </Typography>
          {!camera.is_active && (
            <Chip 
              label="Inactive" 
              size="small" 
              color="default"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">
            {camera.camera_ip}:{camera.camera_port}
          </Typography>
          {camera.response_time_ms && camera.is_active && (
            <Chip 
              label={formatResponseTime(camera.response_time_ms)} 
              size="small" 
              color={camera.response_time_ms < 500 ? "success" : "warning"}
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
        </Box>
      </Box>

      {/* Active Toggle Switch */}
      {showActions && (
        <Box display="flex" alignItems="center" mr={1}>
          <Tooltip title={camera.is_active ? "Click to deactivate" : "Click to activate"} arrow>
            <FormControlLabel
              control={
                <Switch
                  checked={camera.is_active}
                  onChange={handleToggleActive}
                  disabled={isUpdating}
                  size="small"
                  color="success"
                />
              }
              label=""
              sx={{ margin: 0 }}
            />
          </Tooltip>
        </Box>
      )}

      {/* Action Buttons */}
      {showActions && (
        <Box display="flex" alignItems="center" gap={0.5}>
          <Tooltip title="Edit Camera" arrow>
            <IconButton
              size="small"
              onClick={handleEdit}
              sx={{ 
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText'
                }
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Manage Alerts" arrow>
            <IconButton
              size="small"
              onClick={handleManageAlerts}
              sx={{ 
                color: 'warning.main',
                '&:hover': {
                  backgroundColor: 'warning.main',
                  color: 'warning.contrastText'
                }
              }}
            >
              <NotificationsActive fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Delete Camera" arrow>
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{ 
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.main',
                  color: 'error.contrastText'
                }
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
} 