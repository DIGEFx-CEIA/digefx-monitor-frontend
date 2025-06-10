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
  CircularProgress,
  Switch,
  FormControlLabel,
  Paper,
  Divider
} from "@mui/material";
import { useState, useEffect } from "react";
import { createCameraAction, CreateCameraData } from "../actions/createCamera.action";
import { getAlertTypesAction, AlertType } from "../actions/getAlertTypes.action";
// Icon imports for alert types
import {
  Construction,
  PanTool,
  AirlineSeatReclineNormal,
  SmokingRooms,
  PhoneAndroid,
  Warning,
  Security,
  LocalPolice,
  HealthAndSafety,
  Shield,
  Error,
  ReportProblem,
  NotificationImportant,
} from '@mui/icons-material';

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

// Helper function to get icon component from name
const getIconComponent = (iconName?: string) => {
  if (!iconName) return Warning;
  
  const iconMap: { [key: string]: React.ComponentType } = {
    Construction,
    FrontHand: PanTool,
    AirlineSeatReclineNormal,
    SmokingRooms,
    PhoneAndroid,
    Warning,
    Security,
    LocalPolice,
    HealthAndSafety,
    Gpp: Shield,
    Error,
    ReportProblem,
    NotificationImportant,
  };
  
  return iconMap[iconName] || Warning;
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

  const handleAlertToggle = (alertCode: string) => {
    const isCurrentlyEnabled = formData.enabled_alerts.includes(alertCode);
    const newEnabledAlerts = isCurrentlyEnabled
      ? formData.enabled_alerts.filter(code => code !== alertCode)
      : [...formData.enabled_alerts, alertCode];
    
    handleChange('enabled_alerts', newEnabledAlerts);
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
      maxWidth="md"
      fullWidth
      sx={{ mt: 4 }}
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
            {/* Camera Configuration Section */}
            <Grid size={12}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Camera Configuration
              </Typography>
              
              <Grid container spacing={3}>
                {/* Camera Name */}
                <Grid size={12}>
                  <TextField
                    label="Camera Name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name || "E.g. Driver Camera, Outside Camera, etc."}
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
              </Grid>
            </Grid>

            {/* Alert Types Section */}
            <Grid size={12}>
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Alert Configuration
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enable alerts that this camera should monitor. You can change these settings later.
              </Typography>

              {loadingAlertTypes ? (
                <Box display="flex" alignItems="center" justifyContent="center" py={4}>
                  <CircularProgress size={24} sx={{ mr: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Loading alert types...
                  </Typography>
                </Box>
              ) : alertTypes.length > 0 ? (
                <Box>
                  <Grid container spacing={2}>
                    {alertTypes.map((alertType) => {
                      const isEnabled = formData.enabled_alerts.includes(alertType.code);
                      
                      return (
                        <Grid key={alertType.code} size={{sm: 12, md: 6}} sx={{ width: '100%' }}>
                          <Paper 
                            elevation={2}
                            sx={{ 
                              p: 2,
                              border: '1px solid',
                              borderColor: isEnabled ? 'primary.main' : 'divider',
                              transition: 'all 0.2s ease-in-out',
                              cursor: 'pointer',
                              '&:hover': {
                                borderColor: isEnabled ? 'primary.dark' : 'text.secondary',
                                elevation: 4
                              }
                            }}
                            onClick={() => handleAlertToggle(alertType.code)}
                          >
                            <Box display="flex" alignItems="flex-start" gap={2}>
                              <Switch
                                checked={isEnabled}
                                onChange={() => handleAlertToggle(alertType.code)}
                                disabled={loading}
                                color="primary"
                                size="small"
                              />
                              <Box flex={1}>
                                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
                                  {(() => {
                                    const IconComponent = getIconComponent(alertType.icon);
                                    return (
                                      <IconComponent 
                                        sx={{ 
                                          fontSize: 18,
                                          color: isEnabled ? 'primary.main' : 'text.secondary'
                                        }} 
                                      />
                                    );
                                  })()}
                                  <Typography 
                                    variant="subtitle2" 
                                    sx={{ 
                                      fontWeight: 'bold',
                                      color: isEnabled ? 'primary.main' : 'text.primary'
                                    }}
                                  >
                                    {alertType.name}
                                  </Typography>
                                </Box>
                                {alertType.description && (
                                  <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    sx={{ 
                                      display: 'block',
                                      lineHeight: 1.3,
                                      ml: 3 // Indent description to align with text
                                    }}
                                  >
                                    {alertType.description}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                  
                  {formData.enabled_alerts.length > 0 && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary">
                        Selected alerts: {formData.enabled_alerts.length} of {alertTypes.length}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Paper 
                  elevation={0}
                  sx={{ 
                    py: 4,
                    textAlign: 'center',
                    border: '2px dashed',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No alert types available
                  </Typography>
                </Paper>
              )}
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