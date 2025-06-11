'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Paper,
  Chip,
  Grid,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Terminal as TerminalIcon,
  PlayArrow as ExecuteIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  Security as SecurityIcon,
  Computer as ComputerIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkIcon,
  FolderOpen as FolderIcon
} from '@mui/icons-material'
import { executeCommandAction, CommandRequest, CommandResponse } from '../actions/executeCommand.action'
import { getAvailableCommandsAction, AvailableCommandsResponse } from '../actions/getAvailableCommands.action'

interface TerminalOutput {
  id: string
  command: string
  output: string
  error?: string
  timestamp: Date
  executionTime: number
  success: boolean
  fullCommand: string
}

interface TerminalInterfaceProps {
  open: boolean
  onClose: () => void
}

export default function TerminalInterface({ open, onClose }: TerminalInterfaceProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const [availableCommands, setAvailableCommands] = useState<AvailableCommandsResponse | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCommand, setSelectedCommand] = useState('')
  const [commandArgs, setCommandArgs] = useState('')
  const [outputs, setOutputs] = useState<TerminalOutput[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCommands, setLoadingCommands] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Helper function to scroll to bottom
  const scrollToBottom = () => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
      // Also scroll the last child into view as fallback
      const lastChild = outputRef.current.lastElementChild
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
    }
  }

  useEffect(() => {
    if (open) {
      fetchAvailableCommands()
    }
  }, [open])

  useEffect(() => {
    // Auto scroll to bottom
    if (outputRef.current && outputs.length > 0) {
      // Use setTimeout to ensure DOM is updated before scrolling
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }
  }, [outputs])

  const fetchAvailableCommands = async () => {
    setLoadingCommands(true)
    setError(null)
    
    try {
      const result = await getAvailableCommandsAction()
      
      if (result.success) {
        setAvailableCommands(result.value)
      } else {
        setError(result.error)
      }
    } catch (error) {
      console.error('Error loading commands:', error)
      setError('Error loading available commands')
    } finally {
      setLoadingCommands(false)
    }
  }

  const executeCommand = async () => {
    if (!selectedCategory || !selectedCommand) return

    setLoading(true)
    setError(null)
    
    try {
      const request: CommandRequest = {
        category: selectedCategory,
        command: selectedCommand,
        args: commandArgs.split(' ').filter(arg => arg.trim())
      }
      
      const result = await executeCommandAction(request)
      
      if (result.success) {
        const newOutput: TerminalOutput = {
          id: Date.now().toString(),
          command: `${selectedCategory}:${selectedCommand} ${commandArgs}`.trim(),
          output: result.value.output,
          error: result.value.error,
          timestamp: new Date(),
          executionTime: result.value.execution_time,
          success: result.value.success,
          fullCommand: result.value.command_executed
        }

        setOutputs(prev => [...prev, newOutput])
        setCommandArgs('')
        
        // Force scroll to bottom after adding new output
        setTimeout(() => {
          scrollToBottom()
        }, 150)
      } else {
        setError(result.error)
      }
    } catch (error) {
      console.error('Error executing command:', error)
      setError('Error executing command')
    } finally {
      setLoading(false)
    }
  }

  const clearOutput = () => {
    setOutputs([])
  }

  const handleClose = () => {
    setSelectedCategory('')
    setSelectedCommand('')
    setCommandArgs('')
    setOutputs([])
    setError(null)
    onClose()
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'docker': return <StorageIcon />
      case 'system': return <ComputerIcon />
      case 'network': return <NetworkIcon />
      case 'files': return <FolderIcon />
      default: return <TerminalIcon />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'docker': return 'primary'
      case 'system': return 'secondary'
      case 'network': return 'success'
      case 'files': return 'warning'
      default: return 'default'
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: { 
          minHeight: isMobile ? '100vh' : '85vh',
          maxHeight: isMobile ? '100vh' : '90vh',
          m: isMobile ? 0 : 2
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <TerminalIcon color="primary" />
            <Box>
              <Typography variant={isMobile ? "h6" : "h5"}>
                Secure Terminal
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Controlled access to host system
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: isMobile ? 1 : 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Security Information */}
        {availableCommands?.security_info && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.900', border: 1, borderColor: 'grey.700' }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <SecurityIcon sx={{ color: 'success.main' }} />
              <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                Security Settings
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: 'grey.400' }}>Timeout</Typography>
                <Typography variant="body2" sx={{ color: 'grey.100' }}>{availableCommands.security_info.timeout}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: 'grey.400' }}>Directory</Typography>
                <Typography variant="body2" sx={{ color: 'grey.100' }}>{availableCommands.security_info.working_directory}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: 'grey.400' }}>Shell</Typography>
                <Typography variant="body2" sx={{ color: 'grey.100' }}>
                  {availableCommands.security_info.shell_disabled ? 'Disabled' : 'Enabled'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: 'grey.400' }}>Total Commands</Typography>
                <Typography variant="body2" sx={{ color: 'grey.100' }}>{availableCommands.total_commands}</Typography>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Grid container spacing={2} sx={{ height: isMobile ? 'auto' : '60vh' }}>
          {/* Commands Panel */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 2, height: isMobile ? 'auto' : '100%', overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Available Commands
              </Typography>
              
              {loadingCommands ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : availableCommands ? (
                Object.entries(availableCommands.categories).map(([category, commands]) => (
                  <Accordion key={category} defaultExpanded={category === 'docker'}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getCategoryIcon(category)}
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          {category}
                        </Typography>
                        <Chip 
                          label={Object.keys(commands).length} 
                          size="small" 
                          color={getCategoryColor(category) as any}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {Object.keys(commands).map((command) => (
                          <ListItem key={command} disablePadding>
                            <ListItemButton
                              selected={selectedCategory === category && selectedCommand === command}
                              onClick={() => {
                                setSelectedCategory(category)
                                setSelectedCommand(command)
                              }}
                            >
                              <ListItemText 
                                primary={command}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No commands available
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Terminal Output */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 2, height: isMobile ? '70vh' : '100%', display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Terminal</Typography>
                <Button
                  startIcon={<ClearIcon />}
                  onClick={clearOutput}
                  size="small"
                  disabled={outputs.length === 0}
                >
                  Clear
                </Button>
              </Box>

              {/* Command Input */}
              <Box display="flex" gap={1} mb={2}>
                <TextField
                  label="Arguments"
                  value={commandArgs}
                  onChange={(e) => setCommandArgs(e.target.value)}
                  size="small"
                  disabled={!selectedCommand || loading}
                  placeholder="command arguments..."
                  sx={{ flexGrow: 1 }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      executeCommand()
                    }
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={16} /> : <ExecuteIcon />}
                  onClick={executeCommand}
                  disabled={!selectedCommand || loading}
                  size="small"
                >
                  {loading ? 'Executing...' : 'Execute'}
                </Button>
              </Box>

              {selectedCommand && (
                <Box mb={2} display="flex" gap={1} flexWrap="wrap">
                  <Chip 
                    label={selectedCategory}
                    color={getCategoryColor(selectedCategory) as any}
                    size="small"
                  />
                  <Chip 
                    label={selectedCommand}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              )}

              {/* Output Area */}
              <Paper
                variant="outlined"
                ref={outputRef}
                sx={{
                  flexGrow: 1,
                  p: 2,
                  overflow: 'auto',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  fontSize: '0.875rem',
                  bgcolor: 'grey.900',
                  color: 'grey.100',
                  minHeight: '300px'
                }}
              >
                {outputs.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <TerminalIcon sx={{ fontSize: 48, color: 'grey.600', mb: 2 }} />
                    <Typography color="grey.500">
                      Select a command and execute to see output...
                    </Typography>
                  </Box>
                ) : (
                  outputs.map((output) => (
                    <Box key={output.id} mb={3}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography
                          sx={{
                            color: output.success ? 'success.light' : 'error.light',
                            fontWeight: 'bold',
                            fontFamily: 'inherit'
                          }}
                        >
                          $ {output.fullCommand}
                        </Typography>
                        <Box display="flex" gap={1}>
                          <Chip
                            label={`${output.executionTime.toFixed(2)}s`}
                            size="small"
                            variant="outlined"
                            sx={{ color: 'grey.400', borderColor: 'grey.600' }}
                          />
                          <Typography variant="caption" color="grey.400">
                            {output.timestamp.toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {output.output && (
                        <Box 
                          component="pre" 
                          sx={{ 
                            whiteSpace: 'pre-wrap', 
                            m: 0, 
                            mb: 1,
                            color: 'grey.100',
                            fontFamily: 'inherit'
                          }}
                        >
                          {output.output}
                        </Box>
                      )}
                      
                      {output.error && (
                        <Box 
                          component="pre" 
                          sx={{ 
                            color: 'error.light', 
                            whiteSpace: 'pre-wrap', 
                            m: 0,
                            fontFamily: 'inherit'
                          }}
                        >
                          {output.error}
                        </Box>
                      )}
                      
                      <Divider sx={{ borderColor: 'grey.700' }} />
                    </Box>
                  ))
                )}
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
        <Button onClick={handleClose} fullWidth={isMobile}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
} 