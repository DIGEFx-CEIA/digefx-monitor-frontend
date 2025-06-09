"use client";

import { CameraAlt, Edit, Delete, MoreVert } from "@mui/icons-material";
import { 
  Grid2 as Grid, 
  IconButton, 
  Link, 
  Menu, 
  MenuItem, 
  Typography, 
  useMediaQuery, 
  useTheme,
  Chip,
  Box
} from "@mui/material";
import { useState } from "react";
import { CameraStatus } from "../models/metric";

interface CameraItemProps {
  camera: CameraStatus;
  publicIp: string;
  onEdit?: (cameraId: number) => void;
  onDelete?: (cameraId: number) => void;
  showActions?: boolean;
}

export function CameraItem({ 
  camera, 
  publicIp, 
  onEdit, 
  onDelete, 
  showActions = false 
}: CameraItemProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(camera.camera_id);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(camera.camera_id);
    handleMenuClose();
  };

  const formatResponseTime = (responseTime?: number) => {
    if (!responseTime) return null;
    return responseTime < 1000 ? `${responseTime}ms` : `${(responseTime / 1000).toFixed(1)}s`;
  };

  return (
    <Grid 
      key={camera.camera_id} 
      size={isMobile ? 12 : 6} 
      direction="row" 
      justifyItems="center" 
      display="flex" 
      alignItems="center"
      sx={{ 
        minHeight: 48,
        borderRadius: 1,
        padding: 0.5,
        '&:hover': showActions ? {
          backgroundColor: 'action.hover',
        } : undefined
      }}
    >
      <Box display="flex" alignItems="center" flexGrow={1}>
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
        
        <Box sx={{ ml: 1, flexGrow: 1 }}>
          <Typography variant="subtitle2" component="div">
            {camera.camera_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {camera.camera_ip}:{camera.camera_port}
          </Typography>
          {camera.response_time_ms && (
            <Chip 
              label={formatResponseTime(camera.response_time_ms)} 
              size="small" 
              color={camera.response_time_ms < 500 ? "success" : "warning"}
              sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
            />
          )}
        </Box>
      </Box>

      {showActions && (
        <IconButton
          size="small"
          onClick={handleMenuOpen}
          sx={{ ml: 1 }}
        >
          <MoreVert />
        </IconButton>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Remove
        </MenuItem>
      </Menu>
    </Grid>
  );
} 