// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - SERVICES PAGES
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, formatCurrency, formatRelativeTime } from '../../../lib/utils';

// =============================================================================
// SERVICES CATALOG PAGE
// =============================================================================

export const ServicesCatalogPage: React.FC = () => {
  const navigate = useNavigate();

  const serviceCategories = [
    {
      id: 'implementation',
      name: 'Implementation Services',
      icon: '🚀',
      services: [
        {
          id: 'quick-start',
          name: 'Quick Start',
          price: 15000,
          duration: '2 weeks',
          description: 'Basic setup and configuration',
        },
        {
          id: 'standard-impl',
          name: 'Standard Implementation',
          price: 45000,
          duration: '6 weeks',
          description: 'Full platform deployment with integrations',
        },
        {
          id: 'enterprise-impl',
          name: 'Enterprise Implementation',
          price: 120000,
          duration: '12 weeks',
          description: 'Complex multi-system deployment',
        },
      ],
    },
    {
      id: 'consulting',
      name: 'Consulting Services',
      icon: '💼',
      services: [
        {
          id: 'data-strategy',
          name: 'Data Strategy Workshop',
          price: 8000,
          duration: '2 days',
          description: 'Define your data roadmap',
        },
        {
          id: 'architecture-review',
          name: 'Architecture Review',
          price: 12000,
          duration: '1 week',
          description: 'Technical architecture assessment',
        },
        {
          id: 'governance-design',
          name: 'Governance Design',
          price: 25000,
          duration: '3 weeks',
          description: 'Data governance framework',
        },
      ],
    },
    {
      id: 'training',
      name: 'Training & Enablement',
      icon: '📚',
      services: [
        {
          id: 'admin-training',
          name: 'Administrator Training',
          price: 3000,
          duration: '1 day',
          description: 'Platform administration basics',
        },
        {
          id: 'analyst-training',
          name: 'Analyst Training',
          price: 2500,
          duration: '1 day',
          description: 'Analytics and reporting',
        },
        {
          id: 'developer-training',
          name: 'Developer Training',
          price: 5000,
          duration: '2 days',
          description: 'API and integrations',
        },
      ],
    },
    {
      id: 'custom',
      name: 'Custom Development',
      icon: '🛠️',
      services: [
        {
          id: 'custom-agent',
          name: 'Custom Agent Development',
          price: 35000,
          duration: '4 weeks',
          description: 'Build a custom AI agent',
        },
        {
          id: 'custom-integration',
          name: 'Custom Integration',
          price: 15000,
          duration: '2 weeks',
          description: 'Connect to any system',
        },
        {
          id: 'custom-workflow',
          name: 'Custom Workflow',
          price: 8000,
          duration: '1 week',
          description: 'Automated business process',
        },
      ],
    },
    {
      id: 'support',
      name: 'Support Services',
      icon: '🛟',
      services: [
        {
          id: 'premium-support',
          name: 'Premium Support',
          price: 4000,
          duration: '/month',
          description: '24/7 priority support',
        },
        {
          id: 'dedicated-csm',
          name: 'Dedicated CSM',
          price: 6000,
          duration: '/month',
          description: 'Named customer success manager',
        },
        {
          id: 'health-check',
          name: 'Quarterly Health Check',
          price: 5000,
          duration: '/quarter',
          description: 'Platform optimization review',
        },
      ],
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Services Catalog</h1>
          <p className="text-neutral-500">Professional services to accelerate your success</p>
        </div>
        <button
          onClick={() => navigate('/services/request')}
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Request Service
        </button>
      </div>

      <div className="space-y-8">
        {serviceCategories.map((category) => (
          <div key={category.id}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{category.icon}</span>
              <h2 className="text-xl font-semibold text-neutral-900">{category.name}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {category.services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl border border-neutral-200 p-6 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <h3 className="font-semibold text-neutral-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-neutral-500 mb-4">{service.description}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-neutral-900">
                        {formatCurrency(service.price)}
                      </p>
                      <p className="text-xs text-neutral-400">{service.duration}</p>
                    </div>
                    <button className="px-3 py-1.5 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// SERVICE REQUEST PAGE
// =============================================================================

export const ServiceRequestPage: React.FC = () => {
  const [formData, setFormData] = useState({
    serviceType: '',
    urgency: 'normal',
    description: '',
    preferredDate: '',
    additionalNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
          <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Request Submitted!</h1>
          <p className="text-neutral-600 mb-6">
            Your service request has been received. Our team will contact you within 24 hours.
          </p>
          <p className="text-sm text-neutral-500 mb-8">Reference: SR-2025-00123</p>
          <a href="/services" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Services
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Request a Service</h1>
      <p className="text-neutral-500 mb-8">
        Tell us about your needs and we'll get back to you shortly
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Service Type *
            </label>
            <select
              required
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a service...</option>
              <optgroup label="Implementation">
                <option value="quick-start">Quick Start</option>
                <option value="standard-impl">Standard Implementation</option>
                <option value="enterprise-impl">Enterprise Implementation</option>
              </optgroup>
              <optgroup label="Consulting">
                <option value="data-strategy">Data Strategy Workshop</option>
                <option value="architecture-review">Architecture Review</option>
                <option value="governance-design">Governance Design</option>
              </optgroup>
              <optgroup label="Training">
                <option value="admin-training">Administrator Training</option>
                <option value="analyst-training">Analyst Training</option>
                <option value="developer-training">Developer Training</option>
              </optgroup>
              <optgroup label="Custom Development">
                <option value="custom-agent">Custom Agent Development</option>
                <option value="custom-integration">Custom Integration</option>
                <option value="custom-workflow">Custom Workflow</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Urgency</label>
            <div className="flex gap-4">
              {['normal', 'high', 'critical'].map((level) => (
                <label key={level} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="urgency"
                    value={level}
                    checked={formData.urgency === level}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="text-primary-600"
                  />
                  <span className="capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your requirements..."
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Preferred Start Date
            </label>
            <input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Additional Notes
            </label>
            <textarea
              rows={3}
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              placeholder="Any other details..."
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

// =============================================================================
// MY SERVICE REQUESTS PAGE
// =============================================================================

export const MyServiceRequestsPage: React.FC = () => {
  const requests = [
    {
      id: 'SR-2025-00122',
      service: 'Custom Integration',
      status: 'in_progress',
      created: new Date(Date.now() - 604800000),
      assignee: 'John Smith',
    },
    {
      id: 'SR-2025-00098',
      service: 'Developer Training',
      status: 'scheduled',
      created: new Date(Date.now() - 1209600000),
      assignee: 'Sarah Chen',
      scheduledDate: 'Dec 15, 2025',
    },
    {
      id: 'SR-2025-00075',
      service: 'Architecture Review',
      status: 'completed',
      created: new Date(Date.now() - 2592000000),
      assignee: 'Mike Johnson',
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">My Service Requests</h1>
        <a
          href="/services/request"
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          + New Request
        </a>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Request ID
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Service
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Assignee
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Created
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-4">
                  <code className="text-sm text-primary-600">{req.id}</code>
                </td>
                <td className="px-4 py-4 font-medium text-neutral-900">{req.service}</td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      req.status === 'in_progress' && 'bg-warning-light text-warning-dark',
                      req.status === 'scheduled' && 'bg-info-light text-info-dark',
                      req.status === 'completed' && 'bg-success-light text-success-dark'
                    )}
                  >
                    {req.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4 text-neutral-600">{req.assignee}</td>
                <td className="px-4 py-4 text-sm text-neutral-500">
                  {formatRelativeTime(req.created)}
                </td>
                <td className="px-4 py-4 text-right">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =============================================================================
// SERVICES MANAGEMENT PAGE (Admin)
// =============================================================================

export const ServicesManagementPage: React.FC = () => {
  const allRequests = [
    {
      id: 'SR-2025-00123',
      client: 'Acme Corp',
      service: 'Enterprise Implementation',
      status: 'pending',
      priority: 'high',
      created: new Date(Date.now() - 3600000),
    },
    {
      id: 'SR-2025-00122',
      client: 'TechStart',
      service: 'Custom Integration',
      status: 'in_progress',
      priority: 'normal',
      created: new Date(Date.now() - 604800000),
    },
    {
      id: 'SR-2025-00121',
      client: 'GlobalCo',
      service: 'Premium Support',
      status: 'pending',
      priority: 'critical',
      created: new Date(Date.now() - 7200000),
    },
    {
      id: 'SR-2025-00120',
      client: 'FinanceFirst',
      service: 'Data Strategy Workshop',
      status: 'scheduled',
      priority: 'normal',
      created: new Date(Date.now() - 172800000),
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Services Management</h1>
        <div className="flex gap-2">
          <select className="h-10 px-3 border border-neutral-300 rounded-lg">
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Scheduled</option>
            <option>Completed</option>
          </select>
          <select className="h-10 px-3 border border-neutral-300 rounded-lg">
            <option>All Priority</option>
            <option>Critical</option>
            <option>High</option>
            <option>Normal</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Pending', value: 12, color: 'text-warning-main' },
          { label: 'In Progress', value: 8, color: 'text-info-main' },
          { label: 'Scheduled', value: 5, color: 'text-primary-600' },
          { label: 'Completed (30d)', value: 34, color: 'text-success-main' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Request
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Client
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Service
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Priority
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Created
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {allRequests.map((req) => (
              <tr key={req.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-4">
                  <code className="text-sm text-primary-600">{req.id}</code>
                </td>
                <td className="px-4 py-4 font-medium text-neutral-900">{req.client}</td>
                <td className="px-4 py-4 text-neutral-600">{req.service}</td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      req.priority === 'critical' && 'bg-error-light text-error-dark',
                      req.priority === 'high' && 'bg-warning-light text-warning-dark',
                      req.priority === 'normal' && 'bg-neutral-100 text-neutral-600'
                    )}
                  >
                    {req.priority}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      req.status === 'pending' && 'bg-warning-light text-warning-dark',
                      req.status === 'in_progress' && 'bg-info-light text-info-dark',
                      req.status === 'scheduled' && 'bg-primary-100 text-primary-700'
                    )}
                  >
                    {req.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-neutral-500">
                  {formatRelativeTime(req.created)}
                </td>
                <td className="px-4 py-4 text-right">
                  <button className="text-neutral-400 hover:text-neutral-600">•••</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesCatalogPage;
