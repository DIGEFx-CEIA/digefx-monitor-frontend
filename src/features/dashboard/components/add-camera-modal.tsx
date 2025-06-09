"use client";

import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid2 as Grid, 
  Box,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  OutlinedInput,
  SelectChangeEvent
} from "@mui/material";
import { useState, useEffect } from "react";
import { createCameraAction, CreateCameraData } from "../actions/createCamera.action";
import { getAlertTypesAction, AlertType } from "../actions/getAlertTypes.action";

interface AddCameraModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CameraFormData {
  name: string;
  ip_address: string;
  port: string;
  enabled_alerts: string[];
}

const initialFormData: CameraFormData = {
  name: "",
  ip_address: "",
  port: "80",
  enabled_alerts: []
};

export function AddCameraModal({ open, onClose, onSuccess }: AddCameraModalProps) {
  const [formData, setFormData] = useState<CameraFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [loadingAlertTypes, setLoadingAlertTypes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<CameraFormData>>({});
  const [alertTypes, setAlertTypes] = useState<AlertType[]>([]);

  // Load alert types when modal opens
  useEffect(() => {
    if (open) {
      loadAlertTypes();
    }
  }, [open]);

  const loadAlertTypes = async () => {
    setLoadingAlertTypes(true);
    try {
      const result = await getAlertTypesAction();
      if (result.success) {
        setAlertTypes(result.value.filter((type: AlertType) => type.is_active));
      } else {
        console.error("Failed to load alert types:", result.error);
      }
    } catch (error) {
      console.error("Error loading alert types:", error);
    } finally {
      setLoadingAlertTypes(false);
    }
  };

  const handleChange = (field: keyof CameraFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    handleChange('enabled_alerts', typeof value === 'string' ? value.split(',') : value);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CameraFormData> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Camera name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
    }

    // IP validation
    if (!formData.ip_address.trim()) {
      newErrors.ip_address = "IP address is required";
    } else {
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(formData.ip_address)) {
        newErrors.ip_address = "Invalid IP address format";
      }
    }

    // Port validation
    if (!formData.port.trim()) {
      newErrors.port = "Port is required";
    } else {
      const port = parseInt(formData.port);
      if (isNaN(port) || port < 1 || port > 65535) {
        newErrors.port = "Port must be between 1 and 65535";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const cameraData: CreateCameraData = {
        name: formData.name,
        ip_address: formData.ip_address,
        port: parseInt(formData.port),
        enabled_alerts: formData.enabled_alerts
      };

      const result = await createCameraAction(cameraData);

      if (result.success) {
        onSuccess();
        handleClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Error creating camera:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    setError(null);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          Add New Camera
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Configure a new camera for monitoring
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Camera Name */}
            <Grid size={12}>
              <TextField
                label="Camera Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name || "E.g. Main Camera, Entrance, Garage"}
                fullWidth
                disabled={loading}
                placeholder="Enter camera identifier name"
              />
            </Grid>

            {/* IP and Port */}
            <Grid size={8}>
              <TextField
                label="IP Address"
                value={formData.ip_address}
                onChange={(e) => handleChange('ip_address', e.target.value)}
                error={!!errors.ip_address}
                helperText={errors.ip_address || "E.g. 192.168.1.100"}
                fullWidth
                disabled={loading}
                placeholder="0.0.0.0"
              />
            </Grid>
            <Grid size={4}>
              <TextField
                label="Port"
                value={formData.port}
                onChange={(e) => handleChange('port', e.target.value)}
                error={!!errors.port}
                helperText={errors.port}
                fullWidth
                disabled={loading}
                type="number"
                inputProps={{ min: 1, max: 65535 }}
              />
            </Grid>

            {/* Alert Types - Multiple Select */}
            <Grid size={12}>
              <FormControl fullWidth disabled={loading || loadingAlertTypes}>
                <InputLabel id="alert-types-label">Alert Types (Optional)</InputLabel>
                <Select
                  labelId="alert-types-label"
                  multiple
                  value={formData.enabled_alerts}
                  onChange={handleSelectChange}
                  input={<OutlinedInput label="Alert Types (Optional)" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const alertType = alertTypes.find(type => type.code === value);
                        return (
                          <Chip 
                            key={value} 
                            label={alertType?.name || value}
                            size="small"
                            sx={{ 
                              backgroundColor: '#1976d2',
                              color: 'white',
                              fontSize: '0.75rem'
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {loadingAlertTypes ? (
                    <MenuItem disabled>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      Loading alert types...
                    </MenuItem>
                  ) : (
                    alertTypes.map((alertType) => (
                      <MenuItem key={alertType.code} value={alertType.code}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: '#1976d2',
                              mr: 1,
                              flexShrink: 0
                            }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {alertType.name}
                            </Typography>
                            {alertType.description && (
                              <Typography variant="caption" color="text.secondary">
                                {alertType.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1.5 }}>
                  Select alert types to enable for this camera (leave empty to configure later)
                </Typography>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
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
          onClick={handleSubmit} 
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          {loading ? "Adding..." : "Add Camera"}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 