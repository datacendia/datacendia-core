// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// NOTIFICATION SERVICE (Community Edition — In-Memory)
// =============================================================================

import crypto from 'crypto';
import { BoundedMap } from '../utils/BoundedMap.js';
import { withFallback } from './_serviceProxy.js';

export type NotificationType = 'info' | 'warning' | 'error' | 'success' | 'deliberation' | 'decision';
export type NotificationChannel = 'in_app' | 'email' | 'webhook';

interface Notification {
  id: string;
  userId: string;
  organizationId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  channels: NotificationChannel[];
  read: boolean;
  createdAt: string;
}

const store = new BoundedMap<string, Notification>({ maxSize: 50000 });

export const notificationService: any = withFallback({
  async send(data: {
    userId: string;
    organizationId: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    channels: NotificationChannel[];
  }): Promise<Notification> {
    const notif: Notification = {
      id: crypto.randomUUID(),
      ...data,
      read: false,
      createdAt: new Date().toISOString(),
    };
    store.set(notif.id, notif);
    return notif;
  },

  async getForUser(userId: string, opts?: { unreadOnly?: boolean; limit?: number }): Promise<Notification[]> {
    let items = [...store.values()].filter(n => n.userId === userId);
    if (opts?.unreadOnly) items = items.filter(n => !n.read);
    items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return items.slice(0, opts?.limit || 50);
  },

  async markRead(ids: string[]): Promise<number> {
    let count = 0;
    for (const id of ids) {
      const n = store.get(id);
      if (n && !n.read) { n.read = true; count++; }
    }
    return count;
  },

  async markAllRead(userId: string): Promise<number> {
    let count = 0;
    for (const n of store.values()) {
      if (n.userId === userId && !n.read) { n.read = true; count++; }
    }
    return count;
  },

  async getUnreadCount(userId: string): Promise<number> {
    return [...store.values()].filter(n => n.userId === userId && !n.read).length;
  },
});
