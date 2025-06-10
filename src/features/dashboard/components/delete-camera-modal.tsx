"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Warning, Delete } from '@mui/icons-material';
import { deleteCameraAction } from '../actions/deleteCamera.action';

interface DeleteCameraModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  camera: {
    id: number;
    name: string;
    ip_address: string;
  } | null;
}

export function DeleteCameraModal({ open, onClose, onSuccess, camera }: DeleteCameraModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!camera) return;

    setLoading(true);
    setError(null);

    try {
      const result = await deleteCameraAction(camera.id);

      if (result.success) {
        onSuccess();
        handleClose();
      } else {
        setError(result.error);
      }
    } catch (err: unknown) {
      console.error("Error deleting camera:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Warning color="error" sx={{ fontSize: 28 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Delete Camera
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete this camera? This action cannot be undone.
        </Typography>

        {camera && (
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              mb: 2
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Camera Details:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Name:</strong> {camera.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>IP Address:</strong> {camera.ip_address}
            </Typography>
          </Box>
        )}

        <Typography variant="body2" color="text.secondary">
          All associated alerts and monitoring data for this camera will also be removed.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleDelete}
          disabled={loading || !camera}
          variant="contained"
          color="error"
          startIcon={loading ? <CircularProgress size={16} /> : <Delete />}
        >
          {loading ? "Deleting..." : "Delete Camera"}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 