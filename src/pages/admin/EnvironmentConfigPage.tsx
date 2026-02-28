// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// ENVIRONMENT CONFIGURATION PAGE
// UI for editing .env file with validation and security
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';
import { deterministicFloat, deterministicInt } from '../../lib/deterministic';
import {
  Settings,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Info,
  Lock,
  Database,
  Zap,
  Shield,
  Mail,
  CreditCard,
  BarChart3,
  Loader2,
  FileText,
  Download,
  Upload,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface EnvVariable {
  key: string;
  value: string;
  category: string;
  description: string;
  required: boolean;
  sensitive: boolean;
  validation?: 'url' | 'email' | 'number' | 'boolean' | 'string';
}

interface EnvConfig {
  variables: EnvVariable[];
  lastModified?: Date;
  environment: 'development' | 'production' | 'staging';
}

// =============================================================================
// CONFIGURATION SCHEMA
// =============================================================================

const ENV_SCHEMA: Omit<EnvVariable, 'value'>[] = [
  // Application
  { key: 'NODE_ENV', category: 'Application', description: 'Environment mode', required: true, sensitive: false, validation: 'string' },
  { key: 'PORT', category: 'Application', description: 'Server port', required: true, sensitive: false, validation: 'number' },
  { key: 'LOG_LEVEL', category: 'Application', description: 'Logging level (error, warn, info, debug)', required: false, sensitive: false },
  
  // Database
  { key: 'DATABASE_URL', category: 'Database', description: 'PostgreSQL connection string', required: true, sensitive: true, validation: 'url' },
  { key: 'POSTGRES_USER', category: 'Database', description: 'PostgreSQL username', required: true, sensitive: false },
  { key: 'POSTGRES_PASSWORD', category: 'Database', description: 'PostgreSQL password', required: true, sensitive: true },
  { key: 'POSTGRES_DB', category: 'Database', description: 'PostgreSQL database name', required: true, sensitive: false },
  
  // Redis
  { key: 'REDIS_URL', category: 'Cache', description: 'Redis connection string', required: true, sensitive: true, validation: 'url' },
  { key: 'REDIS_PASSWORD', category: 'Cache', description: 'Redis password', required: true, sensitive: true },
  
  // Neo4j
  { key: 'NEO4J_URI', category: 'Graph Database', description: 'Neo4j connection URI', required: true, sensitive: false, validation: 'url' },
  { key: 'NEO4J_USER', category: 'Graph Database', description: 'Neo4j username', required: true, sensitive: false },
  { key: 'NEO4J_PASSWORD', category: 'Graph Database', description: 'Neo4j password', required: true, sensitive: true },
  
  // AI Models
  { key: 'OLLAMA_BASE_URL', category: 'AI Models', description: 'Ollama API base URL', required: false, sensitive: false, validation: 'url' },
  { key: 'OLLAMA_MODEL', category: 'AI Models', description: 'Default Ollama model', required: false, sensitive: false },
  { key: 'OPENAI_API_KEY', category: 'AI Models', description: 'OpenAI API key', required: false, sensitive: true },
  { key: 'OPENAI_MODEL', category: 'AI Models', description: 'OpenAI model name', required: false, sensitive: false },
  { key: 'ANTHROPIC_API_KEY', category: 'AI Models', description: 'Anthropic API key', required: false, sensitive: true },
  
  // Security
  { key: 'JWT_SECRET', category: 'Security', description: 'JWT signing secret (min 32 chars)', required: true, sensitive: true },
  { key: 'JWT_REFRESH_SECRET', category: 'Security', description: 'JWT refresh token secret', required: true, sensitive: true },
  { key: 'JWT_ACCESS_EXPIRY', category: 'Security', description: 'Access token expiry (e.g., 15m)', required: false, sensitive: false },
  { key: 'JWT_REFRESH_EXPIRY', category: 'Security', description: 'Refresh token expiry (e.g., 7d)', required: false, sensitive: false },
  { key: 'ENCRYPTION_KEY', category: 'Security', description: 'Data encryption key (32 chars)', required: true, sensitive: true },
  { key: 'CORS_ORIGIN', category: 'Security', description: 'Allowed CORS origins', required: false, sensitive: false },
  
  // Email
  { key: 'SENDGRID_API_KEY', category: 'Email', description: 'SendGrid API key', required: false, sensitive: true },
  { key: 'EMAIL_FROM', category: 'Email', description: 'From email address', required: false, sensitive: false, validation: 'email' },
  { key: 'SMTP_HOST', category: 'Email', description: 'SMTP server host', required: false, sensitive: false },
  { key: 'SMTP_PORT', category: 'Email', description: 'SMTP server port', required: false, sensitive: false, validation: 'number' },
  { key: 'SMTP_USER', category: 'Email', description: 'SMTP username', required: false, sensitive: false },
  { key: 'SMTP_PASSWORD', category: 'Email', description: 'SMTP password', required: false, sensitive: true },
  
  // Billing
  { key: 'STRIPE_SECRET_KEY', category: 'Billing', description: 'Stripe secret key', required: false, sensitive: true },
  { key: 'STRIPE_PUBLISHABLE_KEY', category: 'Billing', description: 'Stripe publishable key', required: false, sensitive: false },
  { key: 'STRIPE_WEBHOOK_SECRET', category: 'Billing', description: 'Stripe webhook secret', required: false, sensitive: true },
  
  // Monitoring
  { key: 'SENTRY_DSN', category: 'Monitoring', description: 'Sentry DSN for error tracking', required: false, sensitive: true },
  { key: 'DATADOG_API_KEY', category: 'Monitoring', description: 'Datadog API key', required: false, sensitive: true },
  
  // Feature Flags
  { key: 'ENABLE_DEMO_MODE', category: 'Features', description: 'Enable demo mode', required: false, sensitive: false, validation: 'boolean' },
  { key: 'ENABLE_OLLAMA', category: 'Features', description: 'Enable local AI models', required: false, sensitive: false, validation: 'boolean' },
  { key: 'ENABLE_OPENAI', category: 'Features', description: 'Enable OpenAI integration', required: false, sensitive: false, validation: 'boolean' },
  { key: 'ENABLE_BILLING', category: 'Features', description: 'Enable billing features', required: false, sensitive: false, validation: 'boolean' },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Application': <Settings className="w-5 h-5" />,
  'Database': <Database className="w-5 h-5" />,
  'Cache': <Zap className="w-5 h-5" />,
  'Graph Database': <Database className="w-5 h-5" />,
  'AI Models': <Zap className="w-5 h-5" />,
  'Security': <Shield className="w-5 h-5" />,
  'Email': <Mail className="w-5 h-5" />,
  'Billing': <CreditCard className="w-5 h-5" />,
  'Monitoring': <BarChart3 className="w-5 h-5" />,
  'Features': <Settings className="w-5 h-5" />,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function EnvironmentConfigPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<EnvConfig | null>(null);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/env-config');
      const data = (response.data as any).data;
      setConfig(data);
      
      // Initialize edited values
      const values: Record<string, string> = {};
      data.variables.forEach((v: EnvVariable) => {
        values[v.key] = v.value || '';
      });
      setEditedValues(values);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const validateValue = (key: string, value: string, validation?: string): string | null => {
    if (!validation) {return null;}
    
    switch (validation) {
      case 'url':
        try {
          new URL(value);
          return null;
        } catch {
          return 'Invalid URL format';
        }
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Invalid email format';
        }
        return null;
      case 'number':
        if (isNaN(Number(value))) {
          return 'Must be a number';
        }
        return null;
      case 'boolean':
        if (!['true', 'false', '1', '0'].includes(value.toLowerCase())) {
          return 'Must be true or false';
        }
        return null;
      default:
        return null;
    }
  };

  const handleValueChange = (key: string, value: string) => {
    setEditedValues({ ...editedValues, [key]: value });
    
    // Validate
    const schema = ENV_SCHEMA.find(s => s.key === key);
    if (schema?.validation) {
      const error = validateValue(key, value, schema.validation);
      if (error) {
        setValidationErrors({ ...validationErrors, [key]: error });
      } else {
        const newErrors = { ...validationErrors };
        delete newErrors[key];
        setValidationErrors(newErrors);
      }
    }
  };

  const handleSave = async () => {
    // Check for validation errors
    if (Object.keys(validationErrors).length > 0) {
      setError('Please fix validation errors before saving');
      return;
    }

    // Check required fields
    const missingRequired = ENV_SCHEMA
      .filter(s => s.required && !editedValues[s.key])
      .map(s => s.key);
    
    if (missingRequired.length > 0) {
      setError(`Missing required fields: ${missingRequired.join(', ')}`);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      await api.post('/admin/env-config', { variables: editedValues });
      setSuccess('Configuration saved successfully. Restart the server to apply changes.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const toggleSensitive = (key: string) => {
    setShowSensitive({ ...showSensitive, [key]: !showSensitive[key] });
  };

  const generateSecret = (length: number = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(deterministicFloat('environmentconfig-1') * chars.length));
    }
    return result;
  };

  const categories = ['All', ...Array.from(new Set(ENV_SCHEMA.map(s => s.category)))];
  const filteredSchema = selectedCategory === 'All' 
    ? ENV_SCHEMA 
    : ENV_SCHEMA.filter(s => s.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-8 h-8 text-blue-500" />
            Environment Configuration
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Configure environment variables for your deployment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadConfig}
            disabled={loading}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reload
          </button>
          <button
            onClick={handleSave}
            disabled={saving || Object.keys(validationErrors).length > 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{success}</span>
          </div>
        </div>
      )}

      {/* Warning Banner */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-900 dark:text-yellow-100">
            <p className="font-semibold mb-1">Security Warning</p>
            <p className="text-yellow-700 dark:text-yellow-300">
              Changes to environment variables require a server restart to take effect. 
              Sensitive values are encrypted in transit and at rest. Never share your .env file publicly.
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Configuration Form */}
      <div className="space-y-6">
        {categories.filter(c => c !== 'All' && (selectedCategory === 'All' || selectedCategory === c)).map((category) => {
          const categoryVars = ENV_SCHEMA.filter(s => s.category === category);
          if (categoryVars.length === 0) {return null;}

          return (
            <div key={category} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                {CATEGORY_ICONS[category]}
                {category}
              </h2>
              <div className="space-y-4">
                {categoryVars.map((schema) => (
                  <div key={schema.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {schema.key}
                        {schema.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {schema.sensitive && (
                        <button
                          onClick={() => toggleSensitive(schema.key)}
                          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
                        >
                          {showSensitive[schema.key] ? (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3" />
                              Show
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{schema.description}</p>
                    <div className="flex gap-2">
                      <input
                        type={schema.sensitive && !showSensitive[schema.key] ? 'password' : 'text'}
                        value={editedValues[schema.key] || ''}
                        onChange={(e) => handleValueChange(schema.key, e.target.value)}
                        placeholder={schema.required ? 'Required' : 'Optional'}
                        className={`flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          validationErrors[schema.key]
                            ? 'border-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {schema.sensitive && (
                        <button
                          onClick={() => handleValueChange(schema.key, generateSecret(schema.key.includes('JWT') ? 64 : 32))}
                          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                          title="Generate random secret"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {validationErrors[schema.key] && (
                      <p className="text-xs text-red-500">{validationErrors[schema.key]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
