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
  Tooltip
} from "@mui/material";
import { CameraStatus } from "../models/metric";

interface CameraItemProps {
  camera: CameraStatus;
  publicIp: string;
  onEdit?: (cameraId: number) => void;
  onDelete?: (cameraId: number) => void;
  onManageAlerts?: (cameraId: number) => void;
  showActions?: boolean;
}

export function CameraItem({ 
  camera, 
  publicIp, 
  onEdit, 
  onDelete, 
  onManageAlerts,
  showActions = false 
}: CameraItemProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleEdit = () => {
    onEdit?.(camera.camera_id);
  };

  const handleDelete = () => {
    onDelete?.(camera.camera_id);
  };

  const handleManageAlerts = () => {
    onManageAlerts?.(camera.camera_id);
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
        '&:hover': showActions ? {
          backgroundColor: 'action.hover',
        } : undefined
      }}
    >
      {/* Camera Icon & Link */}
      <Box display="flex" alignItems="center" mr={2}>
        {camera.is_connected ? (
          <Link 
            href={`http://${publicIp}:5000/#camera_${camera.camera_id}`} 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <CameraAlt color="success" />
          </Link>
        ) : (
          <CameraAlt color="error" />
        )}
      </Box>

      {/* Camera Info */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" component="div">
          {camera.camera_name}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">
            {camera.camera_ip}:{camera.camera_port}
          </Typography>
          {camera.response_time_ms && (
            <Chip 
              label={formatResponseTime(camera.response_time_ms)} 
              size="small" 
              color={camera.response_time_ms < 500 ? "success" : "warning"}
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
        </Box>
      </Box>

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