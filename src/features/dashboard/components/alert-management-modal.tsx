'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  ListItemIcon
} from '@mui/material'
import {
  Close as CloseIcon,
  Check as CheckIcon,
  FilterList as FilterIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
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
  ReportProblem,
  NotificationImportant,
  Error as ErrorIconType
} from '@mui/icons-material'
import { getCameraAlertsAction, type CameraAlertResponse } from '../actions/getCameraAlerts.action'
import { resolveAlertAction } from '../actions/resolveAlert.action'
import { getAlertTypesAction, type AlertType } from '../actions/getAlertTypes.action'

interface AlertManagementModalProps {
  open: boolean
  onClose: () => void
  cameraId: number
  cameraName: string
}

type FilterStatus = 'all' | 'active' | 'resolved'
type SeverityLevel = 'low' | 'medium' | 'high' | 'critical'

const severityColors = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
  critical: '#9c27b0'
}

const severityIcons = {
  low: InfoIcon,
  medium: WarningIcon,
  high: ErrorIcon,
  critical: ErrorIcon
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

export default function AlertManagementModal({
  open,
  onClose,
  cameraId,
  cameraName
}: AlertManagementModalProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  
  const [alerts, setAlerts] = useState<CameraAlertResponse[]>([])
  const [alertTypes, setAlertTypes] = useState<AlertType[]>([])
  const [loading, setLoading] = useState(false)
  const [resolving, setResolving] = useState<Set<number>>(new Set())
  const [error, setError] = useState<string | null>(null)
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [severityFilter, setSeverityFilter] = useState<string>('')

  // Estatísticas
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
    bySeverity: {} as Record<SeverityLevel, number>
  })

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        camera_id: cameraId,
        ...(statusFilter !== 'all' && { resolved: statusFilter === 'resolved' }),
        ...(typeFilter && { alert_type_code: typeFilter }),
        limit: 100
      }

      const result = await getCameraAlertsAction(params)
      
      if (result.success) {
        const filteredAlerts = result.value.alerts.filter((alert: CameraAlertResponse) => {
          if (severityFilter && alert.severity !== severityFilter) return false
          return true
        })
        
        setAlerts(filteredAlerts)
        
        // Calcular estatísticas
        const total = filteredAlerts.length
        const active = filteredAlerts.filter((a: CameraAlertResponse) => !a.resolved).length
        const resolved = filteredAlerts.filter((a: CameraAlertResponse) => a.resolved).length
        
        const bySeverity = filteredAlerts.reduce((acc: Record<SeverityLevel, number>, alert: CameraAlertResponse) => {
          acc[alert.severity as SeverityLevel] = (acc[alert.severity as SeverityLevel] || 0) + 1
          return acc
        }, {} as Record<SeverityLevel, number>)
        
        setStats({ total, active, resolved, bySeverity })
      } else {
        setError(result.error || 'Error at load alerts')
      }
    } catch (err) {
      setError('Error at load alerts')
      console.error('Error at load alerts:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAlertTypes = async () => {
    try {
      const result = await getAlertTypesAction()
      if (result.success) {
        setAlertTypes(result.value)
      }
    } catch (err) {
      console.error('Error at load alert types:', err)
    }
  }

  const handleResolveAlert = async (alertId: number) => {
    try {
      setResolving(prev => new Set(prev).add(alertId))
      
      const result = await resolveAlertAction(alertId)
      
      if (result.success) {
        // Atualizar o alerta localmente
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, resolved: true, resolved_at: new Date().toISOString() }
            : alert
        ))
        
        // Atualizar estatísticas
        setStats(prev => ({
          ...prev,
          active: prev.active - 1,
          resolved: prev.resolved + 1
        }))
      } else {
        setError(result.error || 'Error at resolve alert')
      }
    } catch (err) {
      setError('Error at resolve alert')
      console.error('Error at resolve alert:', err)
    } finally {
      setResolving(prev => {
        const newSet = new Set(prev)
        newSet.delete(alertId)
        return newSet
      })
    }
  }

  const getSeverityIcon = (severity: string) => {
    const IconComponent = severityIcons[severity as SeverityLevel] || InfoIcon
    return <IconComponent />
  }

  // Função para mapear nome do ícone para componente
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
      Error: ErrorIconType,
      ReportProblem,
      NotificationImportant,
    };
    
    return iconMap[iconName] || Warning;
  }

  // Função para renderizar item do select com ícone
  const renderAlertTypeMenuItem = (alertType: AlertType) => {
    const IconComponent = getIconComponent(alertType.icon)
    const iconColor = alertType.color || '#ff9800'
    
    return (
      <MenuItem key={alertType.id} value={alertType.code}>
        <Box display="flex" alignItems="center" gap={1} width="100%">
          <Box 
            display="flex" 
            alignItems="center" 
            sx={{ color: iconColor, minWidth: 24 }}
          >
            {React.createElement(IconComponent as any, { fontSize: 'small' })}
          </Box>
          <Typography>{alertType.name}</Typography>
        </Box>
      </MenuItem>
    )
  }

  // Função para renderizar o valor selecionado no select
  const renderSelectedAlertType = (value: string) => {
    if (!value) return 'All'
    
    const selectedType = alertTypes.find(type => type.code === value)
    if (!selectedType) return value
    
    const IconComponent = getIconComponent(selectedType.icon)
    const iconColor = selectedType.color || '#ff9800'
    
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Box 
          display="flex" 
          alignItems="center" 
          sx={{ color: iconColor, minWidth: 20 }}
        >
          {React.createElement(IconComponent as any, { fontSize: 'small' })}
        </Box>
        <Typography>{selectedType.name}</Typography>
      </Box>
    )
  }

  useEffect(() => {
    if (open) {
      fetchAlerts()
      fetchAlertTypes()
    }
  }, [open, cameraId, statusFilter, typeFilter])

  useEffect(() => {
    if (open) {
      fetchAlerts()
    }
  }, [severityFilter])

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: { 
          minHeight: isMobile ? '100vh' : '80vh',
          maxHeight: isMobile ? '100vh' : '90vh',
          m: isMobile ? 0 : 2
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant={isMobile ? "h6" : "h5"}>
              Alert Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Camera: {cameraName}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Estatísticas */}
        <Paper sx={{ p: isMobile ? 1.5 : 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Statistics
          </Typography>
          <Grid container spacing={isMobile ? 1 : 2}>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant={isMobile ? "h5" : "h4"} color="primary">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant={isMobile ? "h5" : "h4"} color="warning.main">
                  {stats.active}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant={isMobile ? "h5" : "h4"} color="success.main">
                  {stats.resolved}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Resolved
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom textAlign={isMobile ? "center" : "left"}>
                  By Severity
                </Typography>
                <Stack spacing={0.5} alignItems={isMobile ? "center" : "flex-start"}>
                  {Object.entries(stats.bySeverity).map(([severity, count]) => (
                    <Box key={severity} display="flex" alignItems="center" gap={1}>
                      <Box 
                        width={12} 
                        height={12} 
                        borderRadius="50%" 
                        bgcolor={severityColors[severity as SeverityLevel]}
                      />
                      <Typography variant="caption">
                        {severity}: {count}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Filtros */}
        <Paper sx={{ p: isMobile ? 1.5 : 2, mb: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <FilterIcon />
            <Typography variant="h6">
              Filters
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                  renderValue={(value) => renderSelectedAlertType(value as string)}
                >
                  <MenuItem value="">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ minWidth: 24 }} />
                      <Typography>All</Typography>
                    </Box>
                  </MenuItem>
                  {alertTypes.map((type) => renderAlertTypeMenuItem(type))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Severity</InputLabel>
                <Select
                  value={severityFilter}
                  label="Severity"
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Lista de Alertas */}
        <Paper sx={{ p: isMobile ? 1.5 : 2 }}>
          <Typography variant="h6" gutterBottom>
            Alerts ({alerts.length})
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : alerts.length === 0 ? (
            <Box textAlign="center" p={4}>
              <Typography color="text.secondary">
                No alerts found
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {alerts.map((alert) => (
                <Box key={alert.id}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: isMobile ? 1.5 : 2,
                      mb: 1.5,
                      bgcolor: alert.resolved ? 'action.hover' : 'background.paper',
                      border: 1,
                      borderColor: 'divider'
                    }}
                  >
                    <Stack 
                      direction={isMobile ? "column" : "row"} 
                      spacing={2} 
                      alignItems={isMobile ? "flex-start" : "center"}
                      width="100%"
                    >
                      {/* Ícone do Tipo de Alerta */}
                      <Box 
                        display="flex"
                        alignItems="center"
                        sx={{ minWidth: 24 }}
                      >
                        {(() => {
                          // Encontrar o tipo de alerta correspondente
                          const alertType = alertTypes.find(type => type.code === alert.alert_type_code)
                          const IconComponent = getIconComponent(alertType?.icon)
                          const iconColor = alertType?.color || severityColors[alert.severity as SeverityLevel]
                          
                          return React.createElement(IconComponent as any, { 
                            style: { 
                              fontSize: '1.5rem',
                              color: iconColor
                            }
                          })
                        })()}
                      </Box>
                      
                      {/* Conteúdo Principal */}
                      <Box flexGrow={1} width="100%">
                        <Stack direction={isMobile ? "column" : "row"} spacing={1} alignItems={isMobile ? "flex-start" : "center"} mb={1}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {alert.alert_type_name}
                          </Typography>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            <Chip
                              label={alert.severity}
                              size="small"
                              sx={{
                                bgcolor: severityColors[alert.severity as SeverityLevel],
                                color: 'white',
                                fontSize: '0.75rem'
                              }}
                            />
                            {alert.resolved && (
                              <Chip
                                icon={<CheckCircleIcon />}
                                label="Resolved"
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Stack>
                        
                        <Stack 
                          direction={isMobile ? "column" : "row"} 
                          spacing={isMobile ? 0.5 : 2}
                          alignItems={isMobile ? "flex-start" : "center"}
                        >
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <ScheduleIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              Triggered: {formatDate(alert.triggered_at)}
                            </Typography>
                          </Box>
                          {alert.resolved_at && (
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <CheckCircleIcon fontSize="small" color="success" />
                              <Typography variant="caption" color="text.secondary">
                                Resolved: {formatDate(alert.resolved_at)}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Box>

                      {/* Botão de Ação */}
                      {!alert.resolved && (
                        <Box 
                          sx={{ 
                            alignSelf: isMobile ? "flex-end" : "center", 
                            mt: isMobile ? 1 : 0,
                            width: isMobile ? "100%" : "auto"
                          }}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            fullWidth={isMobile}
                            startIcon={resolving.has(alert.id) ? <CircularProgress size={16} /> : <CheckIcon />}
                            onClick={() => handleResolveAlert(alert.id)}
                            disabled={resolving.has(alert.id)}
                          >
                            {resolving.has(alert.id) ? 'Resolving...' : 'Resolve'}
                          </Button>
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                </Box>
              ))}
            </List>
          )}
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
        <Button onClick={onClose} fullWidth={isMobile}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
} 