'use client'

import { useState, useEffect } from 'react'
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
  Stack
} from '@mui/material'
import {
  Close as CloseIcon,
  Check as CheckIcon,
  FilterList as FilterIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
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
      sx={{ mt: 6 }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">
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
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="warning.main">
                  {stats.active}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  {stats.resolved}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Resolved
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  By Severity
                </Typography>
                <Stack spacing={0.5}>
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
        <Paper sx={{ p: 2, mb: 3 }}>
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
                >
                  <MenuItem value="">All</MenuItem>
                  {alertTypes.map((type) => (
                    <MenuItem key={type.id} value={type.code}>
                      {type.name}
                    </MenuItem>
                  ))}
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
        <Paper sx={{ p: 2 }}>
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
            <List>
              {alerts.map((alert) => (
                <Box key={alert.id}>
                  <ListItem
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: alert.resolved ? 'action.hover' : 'background.paper'
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2} width="100%">
                      <Box 
                        color={severityColors[alert.severity as SeverityLevel]}
                        display="flex"
                        alignItems="center"
                      >
                        {getSeverityIcon(alert.severity)}
                      </Box>
                      
                      <Box flexGrow={1}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {alert.alert_type_name}
                          </Typography>
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
                        
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          {alert.message}
                        </Typography>
                        
                        <Box display="flex" alignItems="center" gap={2}>
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
                        </Box>
                      </Box>

                      {!alert.resolved && (
                        <Box>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={resolving.has(alert.id) ? <CircularProgress size={16} /> : <CheckIcon />}
                            onClick={() => handleResolveAlert(alert.id)}
                            disabled={resolving.has(alert.id)}
                          >
                            {resolving.has(alert.id) ? 'Resolving...' : 'Resolve'}
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </Paper>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
} 