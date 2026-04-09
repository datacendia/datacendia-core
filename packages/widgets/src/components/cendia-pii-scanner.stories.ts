import type { Meta, StoryObj } from '@storybook/web-components';
import './cendia-pii-scanner.js';
import type { CendiaPiiScanner } from './cendia-pii-scanner.js';

const meta: Meta<CendiaPiiScanner> = {
  title: 'Components/CendiaPiiScanner',
  component: 'cendia-pii-scanner',
  tags: ['autodocs'],
  argTypes: {
    apiUrl: { control: 'text', description: 'Base URL of the CendiaGateway API' },
    endpoint: { control: 'text', description: 'API endpoint path' },
    apiKey: { control: 'text', description: 'API key for authentication' },
    policy: { control: 'select', options: ['gdpr', 'hipaa', 'custom'], description: 'Redaction policy' },
    retryAttempts: { control: { type: 'number', min: 0, max: 10, step: 1 }, description: 'Number of retry attempts' },
    placeholder: { control: 'text', description: 'Textarea placeholder' },
    autoScanMs: { control: { type: 'number', min: 0, max: 5000, step: 100 }, description: 'Auto-scan debounce (ms)' },
    sampleText: { control: 'text', description: 'Pre-filled sample text' },
    realTime: { control: 'boolean', description: 'Enable real-time scanning with WebSocket updates' },
    theme: { control: 'select', options: ['dark', 'light'], description: 'Color theme' },
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'keyboard-navigation', enabled: true },
          { id: 'aria-labels', enabled: true },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<CendiaPiiScanner>;

export const Default: Story = {
  args: {
    theme: 'dark',
    placeholder: 'Paste or type text to scan for PII...',
  },
};

export const WithSample: Story = {
  args: {
    theme: 'dark',
    sampleText: 'Contact John Smith at john.smith@acme.com or 555-867-5309. His SSN is 123-45-6789 and credit card is 4111-1111-1111-1111.',
  },
};

export const GDPRPolicy: Story = {
  args: {
    theme: 'dark',
    policy: 'gdpr',
    sampleText: 'Contact John Smith at john.smith@acme.com or 555-867-5309. His SSN is 123-45-6789.',
  },
};

export const HIPPAPolicy: Story = {
  args: {
    theme: 'dark',
    policy: 'hipaa',
    sampleText: 'Patient John Smith DOB: 01/15/1985. Phone: 555-867-5309. SSN: 123-45-6789.',
  },
};

export const LightTheme: Story = {
  args: {
    theme: 'light',
    sampleText: 'Contact Jane Doe at jane.doe@company.com or 212-555-0123.',
  },
};

export const WithAPI: Story = {
  args: {
    apiUrl: 'https://app.datacendia.com/api/gateway',
    endpoint: '/scan',
    apiKey: 'demo-key',
    policy: 'gdpr',
    retryAttempts: 3,
    theme: 'dark',
  },
};

export const AutoScan: Story = {
  args: {
    theme: 'dark',
    autoScanMs: 500,
    sampleText: 'Test email: user@example.com',
  },
};

export const RealTime: Story = {
  args: {
    theme: 'dark',
    realTime: true,
    policy: 'gdpr',
  },
};
