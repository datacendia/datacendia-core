// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Plug,
  Database,
  Cloud,
  MessageSquare,
  BarChart,
  Shield,
  Workflow,
  Code,
} from 'lucide-react';

export const IntegrationsPage: React.FC = () => {
  const integrationCategories = [
    {
      category: 'Data Sources',
      icon: Database,
      integrations: [
        { name: 'PostgreSQL', description: 'Primary relational database', status: 'native' },
        { name: 'Snowflake', description: 'Cloud data warehouse', status: 'available' },
        { name: 'BigQuery', description: 'Google analytics warehouse', status: 'available' },
        { name: 'Databricks', description: 'Lakehouse platform', status: 'available' },
        { name: 'MongoDB', description: 'Document database', status: 'available' },
        { name: 'SQL Server', description: 'Microsoft database', status: 'available' },
      ],
    },
    {
      category: 'Business Intelligence',
      icon: BarChart,
      integrations: [
        { name: 'Tableau', description: 'Visualization platform', status: 'available' },
        { name: 'Power BI', description: 'Microsoft BI', status: 'available' },
        { name: 'Looker', description: 'Google BI', status: 'available' },
        { name: 'Metabase', description: 'Open source BI', status: 'available' },
      ],
    },
    {
      category: 'Communication',
      icon: MessageSquare,
      integrations: [
        { name: 'Slack', description: 'Team messaging', status: 'available' },
        { name: 'Microsoft Teams', description: 'Enterprise chat', status: 'available' },
        { name: 'Email (SMTP)', description: 'Email notifications', status: 'native' },
        { name: 'Webhooks', description: 'Custom integrations', status: 'native' },
      ],
    },
    {
      category: 'Identity & Security',
      icon: Shield,
      integrations: [
        { name: 'Active Directory', description: 'LDAP/Kerberos auth', status: 'native' },
        { name: 'Okta', description: 'Identity management', status: 'available' },
        { name: 'Azure AD', description: 'Microsoft identity', status: 'available' },
        { name: 'Ping Identity', description: 'Enterprise SSO', status: 'available' },
        { name: 'Keycloak', description: 'Open source IdP', status: 'native' },
      ],
    },
    {
      category: 'Workflow & Automation',
      icon: Workflow,
      integrations: [
        { name: 'Zapier', description: 'No-code automation', status: 'available' },
        { name: 'n8n', description: 'Self-hosted workflows', status: 'available' },
        { name: 'Airflow', description: 'Data pipelines', status: 'available' },
        { name: 'REST API', description: 'Custom integrations', status: 'native' },
      ],
    },
    {
      category: 'Cloud Platforms',
      icon: Cloud,
      integrations: [
        { name: 'AWS', description: 'Amazon Web Services', status: 'available' },
        { name: 'Azure', description: 'Microsoft Cloud', status: 'available' },
        { name: 'GCP', description: 'Google Cloud', status: 'available' },
        { name: 'On-Premise', description: 'Your infrastructure', status: 'native' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">Datacendia</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/product" className="text-neutral-600 hover:text-neutral-900">
              Product
            </Link>
            <Link to="/docs" className="text-neutral-600 hover:text-neutral-900">
              Docs
            </Link>
            <Link to="/contact" className="text-neutral-600 hover:text-neutral-900">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Plug className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
          <h1 className="text-3xl font-bold mb-4">Integrations</h1>
          <p className="text-neutral-400">
            Connect Datacendia to your existing tools and infrastructure.
          </p>
        </div>
      </section>

      {/* Integration Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {integrationCategories.map((category, index) => (
              <div key={index}>
                <div className="flex items-center gap-3 mb-6">
                  <category.icon className="w-6 h-6 text-neutral-700" />
                  <h2 className="text-xl font-semibold">{category.category}</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.integrations.map((integration, intIndex) => (
                    <div
                      key={intIndex}
                      className="bg-white rounded-lg p-4 border border-neutral-200 flex items-center gap-4"
                    >
                      <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                        <Code className="w-5 h-5 text-neutral-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{integration.name}</span>
                          <span
                            className={`px-2 py-0.5 text-xs rounded ${
                              integration.status === 'native'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {integration.status === 'native' ? 'Native' : 'Available'}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500">{integration.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Integration */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Need a Custom Integration?</h2>
          <p className="text-neutral-600 mb-6">
            Our API supports custom integrations. Contact us to discuss your requirements.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/docs"
              className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
            >
              View API Docs
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
            >
              Request Integration
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-100 py-8 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Datacendia, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default IntegrationsPage;
