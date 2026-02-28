// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaCommand™ Page
 * 
 * Vertical-specific AI command interface with natural language commands,
 * quick actions, and compliance-aware routing to Council agents.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Command,
  Terminal,
  Zap,
  Search,
  Clock,
  ChevronRight,
  Shield,
  Users,
  Building2,
  Scale,
  Heart,
  Landmark,
  ShieldCheck,
  Zap as BoltIcon,
  Factory,
  ShoppingCart,
  Radio,
  Plane,
  Pill,
  GraduationCap,
  Home,
  Film,
  Play,
  CheckCircle,
  AlertCircle,
  Loader2,
  History,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  commandService,
  VerticalId,
  VerticalSummary,
  VerticalConfig,
  QuickAction,
  CommandExecution,
  CommandSuggestion,
  CommandContext,
} from '@/services/CommandService';

const VERTICAL_ICONS: Record<VerticalId, React.ReactNode> = {
  financial: <Building2 className="h-5 w-5" />,
  legal: <Scale className="h-5 w-5" />,
  healthcare: <Heart className="h-5 w-5" />,
  government: <Landmark className="h-5 w-5" />,
  defense: <ShieldCheck className="h-5 w-5" />,
  energy: <BoltIcon className="h-5 w-5" />,
  insurance: <Shield className="h-5 w-5" />,
  manufacturing: <Factory className="h-5 w-5" />,
  retail: <ShoppingCart className="h-5 w-5" />,
  telecom: <Radio className="h-5 w-5" />,
  aerospace: <Plane className="h-5 w-5" />,
  pharma: <Pill className="h-5 w-5" />,
  education: <GraduationCap className="h-5 w-5" />,
  realestate: <Home className="h-5 w-5" />,
  media: <Film className="h-5 w-5" />,
};

const VERTICAL_COLORS: Record<VerticalId, string> = {
  financial: 'from-blue-500 to-cyan-500',
  legal: 'from-purple-500 to-pink-500',
  healthcare: 'from-red-500 to-rose-500',
  government: 'from-slate-500 to-gray-500',
  defense: 'from-green-600 to-emerald-600',
  energy: 'from-yellow-500 to-orange-500',
  insurance: 'from-indigo-500 to-violet-500',
  manufacturing: 'from-zinc-500 to-stone-500',
  retail: 'from-pink-500 to-fuchsia-500',
  telecom: 'from-teal-500 to-cyan-500',
  aerospace: 'from-sky-500 to-blue-500',
  pharma: 'from-lime-500 to-green-500',
  education: 'from-amber-500 to-yellow-500',
  realestate: 'from-orange-500 to-red-500',
  media: 'from-violet-500 to-purple-500',
};

export default function CommandPage() {
  const [verticals, setVerticals] = useState<VerticalSummary[]>([]);
  const [selectedVertical, setSelectedVertical] = useState<VerticalId | null>(null);
  const [verticalConfig, setVerticalConfig] = useState<VerticalConfig | null>(null);
  const [command, setCommand] = useState('');
  const [suggestions, setSuggestions] = useState<CommandSuggestion[]>([]);
  const [executions, setExecutions] = useState<CommandExecution[]>([]);
  const [currentExecution, setCurrentExecution] = useState<CommandExecution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadVerticals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedVertical) {
      loadVerticalConfig(selectedVertical);
      loadHistory(selectedVertical);
    }
  }, [selectedVertical]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadVerticals = async () => {
    try {
      const data = await commandService.getVerticals();
      setVerticals(data);
      if (data.length > 0 && !selectedVertical) {
        setSelectedVertical(data[0].id as VerticalId);
      }
    } catch (error) {
      console.error('Failed to load verticals:', error);
    }
  };

  const loadVerticalConfig = async (verticalId: VerticalId) => {
    try {
      const config = await commandService.getVerticalConfig(verticalId);
      setVerticalConfig(config);
    } catch (error) {
      console.error('Failed to load vertical config:', error);
    }
  };

  const loadHistory = async (verticalId: VerticalId) => {
    try {
      const history = await commandService.getHistory(verticalId, 10);
      setExecutions(history);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const getContext = useCallback((): CommandContext => ({
    verticalId: selectedVertical!,
    userId: 'current-user',
    organizationId: 'current-org',
    sessionId: `session-${Date.now()}`,
  }), [selectedVertical]);

  const handleCommandChange = async (value: string) => {
    setCommand(value);
    if (value.length >= 2 && selectedVertical) {
      try {
        const results = await commandService.getSuggestions(value, getContext());
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Failed to get suggestions:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const executeCommand = async (cmd: string) => {
    if (!selectedVertical || !cmd.trim()) {return;}

    setIsLoading(true);
    setCommand(cmd);
    setShowSuggestions(false);

    try {
      const execution = await commandService.executeCommand(cmd, getContext());
      setCurrentExecution(execution);
      setExecutions(prev => [execution, ...prev.slice(0, 9)]);
      setCommand('');
    } catch (error) {
      console.error('Failed to execute command:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    executeCommand(action.command);
  };

  const handleSuggestionClick = (suggestion: CommandSuggestion) => {
    executeCommand(suggestion.command);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && command.trim()) {
      executeCommand(command);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const groupedActions = verticalConfig?.quickActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, QuickAction[]>) || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
              <Terminal className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">CendiaCommand™</h1>
              <p className="text-muted-foreground">Vertical-Specific AI Command Interface</p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            {verticals.length} Verticals Available
          </Badge>
        </div>

        {/* Vertical Selector */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Command className="h-5 w-5" />
              Select Industry Vertical
            </CardTitle>
            <CardDescription>
              Choose your industry to access specialized commands and quick actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-2">
              {verticals.map((vertical) => (
                <Button
                  key={vertical.id}
                  variant={selectedVertical === vertical.id ? 'default' : 'outline'}
                  className={cn(
                    'h-auto py-3 px-4 flex flex-col items-center gap-2 transition-all',
                    selectedVertical === vertical.id && 
                      `bg-gradient-to-br ${VERTICAL_COLORS[vertical.id as VerticalId]} border-0`
                  )}
                  onClick={() => setSelectedVertical(vertical.id as VerticalId)}
                >
                  {VERTICAL_ICONS[vertical.id as VerticalId]}
                  <span className="text-xs font-medium truncate max-w-full">
                    {vertical.name}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedVertical && verticalConfig && (
          <>
            {/* Command Bar */}
            <Card className="relative overflow-visible">
              <CardContent className="pt-6">
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'p-2 rounded-lg bg-gradient-to-br text-white',
                      VERTICAL_COLORS[selectedVertical]
                    )}>
                      {VERTICAL_ICONS[selectedVertical]}
                    </div>
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        ref={inputRef}
                        value={command}
                        onChange={(e) => handleCommandChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                        placeholder={`Enter command for ${verticalConfig.name}...`}
                        className="pl-10 h-12 text-base"
                        disabled={isLoading}
                      />
                    </div>
                    <Button
                      onClick={() => executeCommand(command)}
                      disabled={!command.trim() || isLoading}
                      className={cn(
                        'h-12 px-6 bg-gradient-to-r',
                        VERTICAL_COLORS[selectedVertical]
                      )}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Execute
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Suggestions Dropdown */}
                  <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                      <motion.div
                        ref={suggestionsRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-popover border rounded-lg shadow-lg overflow-hidden"
                      >
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full px-4 py-3 text-left hover:bg-muted/50 flex items-center justify-between group"
                          >
                            <div>
                              <p className="font-medium">{suggestion.command}</p>
                              <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {suggestion.category}
                              </Badge>
                              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Context Info */}
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{verticalConfig.primaryAgents.slice(0, 3).join(', ')} agents</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>{verticalConfig.complianceFrameworks.length} frameworks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    <span>{verticalConfig.quickActions.length} quick actions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>
                      Pre-built commands for common {verticalConfig.name} tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue={Object.keys(groupedActions)[0]} className="w-full">
                      <TabsList className="mb-4 flex-wrap h-auto gap-1">
                        {Object.keys(groupedActions).map((category) => (
                          <TabsTrigger key={category} value={category} className="text-xs">
                            {category}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {Object.entries(groupedActions).map(([category, actions]) => (
                        <TabsContent key={category} value={category} className="mt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {actions.map((action) => (
                              <motion.button
                                key={action.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleQuickAction(action)}
                                className="p-4 rounded-lg border bg-card hover:bg-muted/50 text-left transition-colors"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-medium flex items-center gap-2">
                                      {action.label}
                                      {action.estimatedTime && (
                                        <Badge variant="outline" className="text-xs">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {action.estimatedTime}
                                        </Badge>
                                      )}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {action.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Users className="h-3 w-3" />
                                        {action.agentsInvolved.length}
                                      </div>
                                      {action.complianceFrameworks.length > 0 && (
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Shield className="h-3 w-3" />
                                          {action.complianceFrameworks.length}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Execution History & Current Result */}
              <div className="space-y-6">
                {/* Current Execution Result */}
                {currentExecution && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Latest Result
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate flex-1 mr-2">
                            {currentExecution.command}
                          </span>
                          <Badge
                            variant={currentExecution.status === 'completed' ? 'default' : 'secondary'}
                            className={cn(
                              currentExecution.status === 'completed' && 'bg-green-500'
                            )}
                          >
                            {currentExecution.status === 'completed' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : currentExecution.status === 'failed' ? (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            )}
                            {currentExecution.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Action: {currentExecution.intent.action}</p>
                          <p>Subject: {currentExecution.intent.subject}</p>
                          <p>Confidence: {(currentExecution.intent.confidence * 100).toFixed(0)}%</p>
                        </div>
                        {currentExecution.intent.suggestedAgents.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {currentExecution.intent.suggestedAgents.map((agent) => (
                              <Badge key={agent} variant="outline" className="text-xs">
                                {agent}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* History */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Recent Commands
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] overflow-y-auto">
                      {executions.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No commands yet</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {executions.map((exec) => (
                            <div
                              key={exec.id}
                              className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 cursor-pointer"
                              onClick={() => setCurrentExecution(exec)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium truncate flex-1 mr-2">
                                  {exec.command}
                                </span>
                                {exec.status === 'completed' ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : exec.status === 'failed' ? (
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                ) : (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(exec.startedAt).toLocaleTimeString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Compliance Frameworks */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Active Frameworks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {verticalConfig.complianceFrameworks.map((framework) => (
                        <Badge key={framework} variant="secondary" className="text-xs">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
