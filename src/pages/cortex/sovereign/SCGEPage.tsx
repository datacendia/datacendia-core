// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SCGE - Synthetic Civic Governance Environment Page
 * 
 * Decision verification infrastructure for complex institutions.
 * Trust wind tunnel for governance decisions.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Science as ScienceIcon,
  Group as GroupIcon,
  Policy as PolicyIcon,
  Warning as WarningIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Verified as VerifiedIcon,
  Security as SecurityIcon,
  Balance as BalanceIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';

const API_BASE = '/api/v1/scge';

interface SimulationResult {
  resultId: string;
  summary: {
    totalEvents: number;
    totalDecisions: number;
    stressorsApplied: number;
    policiesEvaluated: number;
    outcomeVariance: number;
    trustDelta: number;
    equityScore: number;
    resilienceScore: number;
    complianceScore: number;
    criticalFindings: string[];
    recommendations: string[];
  };
  outcomes: {
    equityScore: number;
    trustDelta: number;
    outcomeVariance: number;
    biasIndicatorsCount: number;
  };
  replay: {
    bundleId: string;
    seed: number;
    expectedHash: string;
  };
}

interface GovernancePreset {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, number>;
}

interface EventScenario {
  id: string;
  name: string;
  description: string;
  eventCount: number;
}

interface Stressor {
  id: string;
  name: string;
  type: string;
  intensity: string;
  duration: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SCGEPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Configuration state
  const [populationSize, setPopulationSize] = useState(100000);
  const [accessVariance, setAccessVariance] = useState<string>('moderate');
  const [selectedScenario, setSelectedScenario] = useState<string>('scenario_infrastructure_crisis');
  const [stressorCount, setStressorCount] = useState(4);
  const [simulationDuration, setSimulationDuration] = useState(168);
  
  // Data state
  const [governancePresets, setGovernancePresets] = useState<GovernancePreset[]>([]);
  const [eventScenarios, setEventScenarios] = useState<EventScenario[]>([]);
  const [stressors, setStressors] = useState<Stressor[]>([]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [completedSimulations, setCompletedSimulations] = useState<SimulationResult[]>([]);

  // Governance sliders
  const [governanceParams, setGovernanceParams] = useState({
    centralization: 0.5,
    regulationIntensity: 0.5,
    privacyPriority: 0.5,
    securityPriority: 0.5,
    transparencyExpectation: 0.7,
    institutionalTrust: 0.7,
    enforcementStrictness: 0.5,
    discretionVsAutomation: 0.5,
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [presetsRes, scenariosRes, stressorsRes, simsRes] = await Promise.all([
          fetch(`${API_BASE}/governance/presets`),
          fetch(`${API_BASE}/events/scenarios`),
          fetch(`${API_BASE}/stressors`),
          fetch(`${API_BASE}/simulations`),
        ]);

        if (presetsRes.ok) {
          const data = await presetsRes.json();
          setGovernancePresets(data.presets || []);
        }

        if (scenariosRes.ok) {
          const data = await scenariosRes.json();
          setEventScenarios(data.scenarios || []);
        }

        if (stressorsRes.ok) {
          const data = await stressorsRes.json();
          setStressors(data.stressors || []);
        }

        if (simsRes.ok) {
          const data = await simsRes.json();
          setCompletedSimulations(data.completed?.simulations || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const applyPreset = useCallback((preset: GovernancePreset) => {
    setGovernanceParams({
      centralization: preset.parameters.centralization || 0.5,
      regulationIntensity: preset.parameters.regulation_intensity || 0.5,
      privacyPriority: preset.parameters.privacy_priority || 0.5,
      securityPriority: preset.parameters.security_priority || 0.5,
      transparencyExpectation: preset.parameters.transparency_expectation || 0.7,
      institutionalTrust: preset.parameters.institutional_trust || 0.7,
      enforcementStrictness: preset.parameters.enforcement_strictness || 0.5,
      discretionVsAutomation: preset.parameters.discretion_vs_automation || 0.5,
    });
  }, []);

  const runSimulation = async () => {
    try {
      setRunning(true);
      setError(null);

      const response = await fetch(`${API_BASE}/simulation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'SCGE Simulation',
          description: 'Synthetic civic governance simulation run',
          populationParams: {
            size: populationSize,
            accessVarianceLevel: accessVariance,
          },
          scenarioId: selectedScenario,
          stressorConfig: {
            count: stressorCount,
          },
          maxDuration: simulationDuration,
          seed: Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error('Simulation failed');
      }

      const result = await response.json();
      setSimulationResult(result);
      setActiveTab(2); // Switch to results tab
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setRunning(false);
    }
  };

  const downloadReplayBundle = () => {
    if (!simulationResult) {return;}
    
    const bundle = {
      simulationId: simulationResult.resultId,
      seed: simulationResult.replay.seed,
      expectedHash: simulationResult.replay.expectedHash,
      instructions: `
To replay this simulation:
1. POST to /api/v1/scge/simulation with seed: ${simulationResult.replay.seed}
2. Compare final hash with: ${simulationResult.replay.expectedHash}
3. If hashes match, simulation is deterministically verified
      `.trim(),
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scge-replay-${simulationResult.resultId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderMetricCard = (
    title: string,
    value: number,
    icon: React.ReactNode,
    color: 'success' | 'warning' | 'error' | 'info'
  ) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ color: `${color}.main`, mr: 1 }}>{icon}</Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: `${color}.main` }}>
          {(value * 100).toFixed(1)}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={value * 100}
          color={color}
          sx={{ mt: 1, height: 8, borderRadius: 4 }}
        />
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Synthetic Civic Governance Environment
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Decision verification infrastructure for complex institutions. 
          Stress-test governance decisions before they affect real people.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Overview */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <GroupIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5">{populationSize.toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary">
              Synthetic Population
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <PolicyIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h5">{eventScenarios.length}</Typography>
            <Typography variant="body2" color="text.secondary">
              Event Scenarios
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h5">{stressors.length}</Typography>
            <Typography variant="body2" color="text.secondary">
              Stressors Available
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <AssessmentIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h5">{completedSimulations.length}</Typography>
            <Typography variant="body2" color="text.secondary">
              Completed Simulations
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Configure" icon={<ScienceIcon />} iconPosition="start" />
          <Tab label="Governance" icon={<BalanceIcon />} iconPosition="start" />
          <Tab label="Results" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="History" icon={<TimelineIcon />} iconPosition="start" />
        </Tabs>

        {/* Configure Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={4}>
              {/* Population Configuration */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Synthetic Population
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Population Size: {populationSize.toLocaleString()}
                  </Typography>
                  <Slider
                    value={populationSize}
                    onChange={(_, v) => setPopulationSize(v as number)}
                    min={10000}
                    max={1000000}
                    step={10000}
                  />
                </Box>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Access Variance</InputLabel>
                  <Select
                    value={accessVariance}
                    onChange={(e) => setAccessVariance(e.target.value)}
                    label="Access Variance"
                  >
                    <MenuItem value="uniform">Uniform</MenuItem>
                    <MenuItem value="moderate">Moderate</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="extreme">Extreme</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Event Scenario */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Event Scenario
                </Typography>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Scenario</InputLabel>
                  <Select
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(e.target.value)}
                    label="Scenario"
                  >
                    {eventScenarios.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name} ({s.eventCount} events)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Stressor Count: {stressorCount}
                  </Typography>
                  <Slider
                    value={stressorCount}
                    onChange={(_, v) => setStressorCount(v as number)}
                    min={1}
                    max={12}
                    step={1}
                    marks
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Duration: {simulationDuration} hours
                  </Typography>
                  <Slider
                    value={simulationDuration}
                    onChange={(_, v) => setSimulationDuration(v as number)}
                    min={24}
                    max={720}
                    step={24}
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Run Button */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={running ? <CircularProgress size={20} color="inherit" /> : <PlayIcon />}
                onClick={runSimulation}
                disabled={running || loading}
                sx={{ minWidth: 200 }}
              >
                {running ? 'Running Simulation...' : 'Run Simulation'}
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Governance Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            {/* Presets */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Governance Presets
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {governancePresets.map((preset) => (
                <Grid item xs={12} sm={6} md={3} key={preset.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 4 },
                    }}
                    onClick={() => applyPreset(preset)}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {preset.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {preset.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Sliders */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Governance Parameters
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(governanceParams).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                  </Typography>
                  <Slider
                    value={value}
                    onChange={(_, v) =>
                      setGovernanceParams((prev) => ({ ...prev, [key]: v as number }))
                    }
                    min={0}
                    max={1}
                    step={0.05}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(v) => `${(v * 100).toFixed(0)}%`}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>

        {/* Results Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ p: 3 }}>
            {simulationResult ? (
              <>
                {/* Summary Metrics */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    {renderMetricCard(
                      'Equity Score',
                      simulationResult.outcomes.equityScore,
                      <BalanceIcon />,
                      simulationResult.outcomes.equityScore > 0.7 ? 'success' : 'warning'
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    {renderMetricCard(
                      'Resilience',
                      simulationResult.summary.resilienceScore,
                      <SecurityIcon />,
                      simulationResult.summary.resilienceScore > 0.6 ? 'success' : 'warning'
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    {renderMetricCard(
                      'Compliance',
                      simulationResult.summary.complianceScore,
                      <VerifiedIcon />,
                      simulationResult.summary.complianceScore > 0.8 ? 'success' : 'error'
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <SpeedIcon sx={{ color: 'info.main', mr: 1 }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Trust Delta
                          </Typography>
                        </Box>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 'bold',
                            color: simulationResult.outcomes.trustDelta >= 0 ? 'success.main' : 'error.main',
                          }}
                        >
                          {simulationResult.outcomes.trustDelta >= 0 ? '+' : ''}
                          {(simulationResult.outcomes.trustDelta * 100).toFixed(1)}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Summary Stats */}
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Simulation Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">
                        Total Events
                      </Typography>
                      <Typography variant="h5">{simulationResult.summary.totalEvents}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">
                        Total Decisions
                      </Typography>
                      <Typography variant="h5">{simulationResult.summary.totalDecisions}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">
                        Stressors Applied
                      </Typography>
                      <Typography variant="h5">{simulationResult.summary.stressorsApplied}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">
                        Bias Indicators
                      </Typography>
                      <Typography variant="h5">{simulationResult.outcomes.biasIndicatorsCount}</Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Critical Findings */}
                {simulationResult.summary.criticalFindings.length > 0 && (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Critical Findings
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {simulationResult.summary.criticalFindings.map((finding, i) => (
                        <li key={i}>{finding}</li>
                      ))}
                    </ul>
                  </Alert>
                )}

                {/* Recommendations */}
                {simulationResult.summary.recommendations.length > 0 && (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Recommendations
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {simulationResult.summary.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </Alert>
                )}

                {/* Replay Bundle */}
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6">Replay Bundle</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Deterministic verification: Seed {simulationResult.replay.seed}
                      </Typography>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                        Hash: {simulationResult.replay.expectedHash.substring(0, 32)}...
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={downloadReplayBundle}
                    >
                      Download Replay Bundle
                    </Button>
                  </Box>
                </Paper>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <ScienceIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No simulation results yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure and run a simulation to see results here
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 3 }}
                  onClick={() => setActiveTab(0)}
                >
                  Go to Configuration
                </Button>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* History Tab */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Completed Simulations
            </Typography>
            {completedSimulations.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Events</TableCell>
                      <TableCell>Decisions</TableCell>
                      <TableCell>Equity</TableCell>
                      <TableCell>Trust Delta</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {completedSimulations.map((sim: any) => (
                      <TableRow key={sim.id}>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {sim.id?.substring(0, 16) || 'N/A'}...
                          </Typography>
                        </TableCell>
                        <TableCell>{sim.summary?.totalEvents || 0}</TableCell>
                        <TableCell>{sim.summary?.totalDecisions || 0}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={`${((sim.summary?.equityScore || 0) * 100).toFixed(0)}%`}
                            color={(sim.summary?.equityScore || 0) > 0.7 ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={`${((sim.summary?.trustDelta || 0) * 100).toFixed(1)}%`}
                            color={(sim.summary?.trustDelta || 0) >= 0 ? 'success' : 'error'}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <AssessmentIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <TimelineIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No simulation history
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Run simulations to build your history
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>
      </Paper>

      {/* Important Notice */}
      <Alert severity="info" icon={<SecurityIcon />}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Synthetic Environment Disclaimer
        </Typography>
        <Typography variant="body2">
          This is a synthetic governance simulation environment. All populations are statistical
          abstractions, not representations of real people. Results are for system verification
          and stress-testing only, not for making real-world predictions about individuals or groups.
        </Typography>
      </Alert>
    </Box>
  );
}
