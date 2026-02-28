// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// FRONTEND NOTIFICATION SERVICE
// Client-side notification API and state management
// =============================================================================

import { api } from '@/lib/api';

export type NotificationType =
  | 'DELIBERATION_STARTED'
  | 'DELIBERATION_COMPLETE'
  | 'DECISION_MADE'
  | 'DISSENT_FILED'
  | 'APPROVAL_REQUIRED'
  | 'APPROVAL_GRANTED'
  | 'APPROVAL_DENIED'
  | 'ALERT_TRIGGERED'
  | 'SYSTEM_ANNOUNCEMENT'
  | 'SECURITY_ALERT'
  | 'MFA_ENABLED'
  | 'MFA_DISABLED';

export interface Notification {
  id: string;
  user_id: string;
  organization_id: string;
  type: NotificationType;
  channel: string;
  title: string;
  message: string;
  link: string | null;
  metadata: Record<string, unknown>;
  read: boolean;
  read_at: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  push: boolean;
  slack: boolean;
  teams: boolean;
  webhook: boolean;
  webhookUrl?: string;
  slackChannel?: string;
  teamsChannel?: string;
}

class NotificationServiceClient {
  private baseUrl = '/notifications';

  /**
   * Get all notifications
   */
  async getAll(options: { limit?: number; offset?: number; unread?: boolean } = {}): Promise<Notification[]> {
    const params = new URLSearchParams();
    if (options.limit) {params.append('limit', options.limit.toString());}
    if (options.offset) {params.append('offset', options.offset.toString());}
    if (options.unread) {params.append('unread', 'true');}

    const response = await api.get<any>(`${this.baseUrl}?${params.toString()}`);
    return response.data || [];
  }

  /**
   * Get unread notifications
   */
  async getUnread(limit: number = 50): Promise<Notification[]> {
    return this.getAll({ unread: true, limit });
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get<any>(`${this.baseUrl}/unread-count`);
    return response.data?.count || 0;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    const response = await api.post(`${this.baseUrl}/${notificationId}/read`);
    return response.success;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<boolean> {
    const response = await api.post(`${this.baseUrl}/read-all`);
    return response.success;
  }

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<NotificationPreferences> {
    const response = await api.get<any>(`${this.baseUrl}/preferences`);
    return response.data || {
      email: true,
      inApp: true,
      push: false,
      slack: false,
      teams: false,
      webhook: false,
    };
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<boolean> {
    const response = await api.put(`${this.baseUrl}/preferences`, preferences);
    return response.success;
  }

  /**
   * Get notification icon based on type
   */
  getIcon(type: NotificationType): string {
    const icons: Record<NotificationType, string> = {
      DELIBERATION_STARTED: '🧠',
      DELIBERATION_COMPLETE: '✅',
      DECISION_MADE: '⚖️',
      DISSENT_FILED: '🚨',
      APPROVAL_REQUIRED: '📋',
      APPROVAL_GRANTED: '✔️',
      APPROVAL_DENIED: '❌',
      ALERT_TRIGGERED: '🔔',
      SYSTEM_ANNOUNCEMENT: '📢',
      SECURITY_ALERT: '🛡️',
      MFA_ENABLED: '🔐',
      MFA_DISABLED: '🔓',
    };
    return icons[type] || '📩';
  }

  /**
   * Get notification color based on type
   */
  getColor(type: NotificationType): string {
    const colors: Record<NotificationType, string> = {
      DELIBERATION_STARTED: 'text-blue-500',
      DELIBERATION_COMPLETE: 'text-green-500',
      DECISION_MADE: 'text-purple-500',
      DISSENT_FILED: 'text-red-500',
      APPROVAL_REQUIRED: 'text-yellow-500',
      APPROVAL_GRANTED: 'text-green-500',
      APPROVAL_DENIED: 'text-red-500',
      ALERT_TRIGGERED: 'text-orange-500',
      SYSTEM_ANNOUNCEMENT: 'text-blue-500',
      SECURITY_ALERT: 'text-red-600',
      MFA_ENABLED: 'text-green-600',
      MFA_DISABLED: 'text-yellow-600',
    };
    return colors[type] || 'text-gray-500';
  }

  /**
   * Format notification time
   */
  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {return 'Just now';}
    if (minutes < 60) {return `${minutes}m ago`;}
    if (hours < 24) {return `${hours}h ago`;}
    if (days < 7) {return `${days}d ago`;}
    return date.toLocaleDateString();
  }
}

export const notificationService = new NotificationServiceClient();
