// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Notification Store - Real-time notifications and alerts
 *
 * Manages system notifications, alerts, and real-time updates.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// =============================================================================
// TYPES
// =============================================================================

export type NotificationType =
  | 'alert'
  | 'decision'
  | 'deliberation'
  | 'workflow'
  | 'system'
  | 'mention'
  | 'approval';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  read: boolean;
  archived: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  readAt?: Date;
}

export interface NotificationPreferences {
  enableSound: boolean;
  enableDesktop: boolean;
  enableEmail: boolean;
  mutedTypes: NotificationType[];
  quietHoursStart?: string; // HH:mm format
  quietHoursEnd?: string;
}

export interface NotificationState {
  // State
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  // Preferences
  preferences: NotificationPreferences;

  // Connection
  isConnected: boolean;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (
    notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'archived'>
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;

  fetchNotifications: (limit?: number) => Promise<void>;

  setPreferences: (preferences: Partial<NotificationPreferences>) => void;
  muteType: (type: NotificationType) => void;
  unmuteType: (type: NotificationType) => void;

  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// =============================================================================
// HELPERS
// =============================================================================

let notificationCounter = 0;

function generateNotificationId(): string {
  return `notif-${++notificationCounter}-${Date.now()}`;
}

function playNotificationSound() {
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch {
    // Ignore audio errors
  }
}

function showDesktopNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
    });
  }
}

function isQuietHours(start?: string, end?: string): boolean {
  if (!start || !end) {return false;}

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    return currentTime >= startMinutes && currentTime <= endMinutes;
  } else {
    return currentTime >= startMinutes || currentTime <= endMinutes;
  }
}

// =============================================================================
// API HELPERS
// =============================================================================

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

async function notificationApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('datacendia-auth')
    ? JSON.parse(localStorage.getItem('datacendia-auth')!).state?.token
    : null;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

// =============================================================================
// STORE
// =============================================================================

export const useNotificationStore = create<NotificationState>()(
  persist(
    immer((set, get) => ({
      // Initial State
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      preferences: {
        enableSound: true,
        enableDesktop: true,
        enableEmail: true,
        mutedTypes: [],
      },
      isConnected: false,

      // Notification Actions
      setNotifications: (notifications) =>
        set((state) => {
          state.notifications = notifications;
          state.unreadCount = notifications.filter((n: Notification) => !n.read).length;
        }),

      addNotification: (notification) => {
        const { preferences } = get();

        // Check if type is muted
        if (preferences.mutedTypes.includes(notification.type)) {
          return;
        }

        // Check quiet hours
        const inQuietHours = isQuietHours(preferences.quietHoursStart, preferences.quietHoursEnd);

        const newNotification: Notification = {
          ...notification,
          id: generateNotificationId(),
          read: false,
          archived: false,
          createdAt: new Date(),
        };

        set((state) => {
          state.notifications.unshift(newNotification);
          state.unreadCount += 1;
        });

        // Play sound and show desktop notification if not in quiet hours
        if (!inQuietHours) {
          if (preferences.enableSound) {
            playNotificationSound();
          }
          if (preferences.enableDesktop) {
            showDesktopNotification(notification.title, notification.message);
          }
        }
      },

      markAsRead: (id) =>
        set((state) => {
          const notification = state.notifications.find((n: Notification) => n.id === id);
          if (notification && !notification.read) {
            notification.read = true;
            notification.readAt = new Date();
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }),

      markAllAsRead: () =>
        set((state) => {
          const now = new Date();
          state.notifications.forEach((n: Notification) => {
            if (!n.read) {
              n.read = true;
              n.readAt = now;
            }
          });
          state.unreadCount = 0;
        }),

      archiveNotification: (id) =>
        set((state) => {
          const notification = state.notifications.find((n: Notification) => n.id === id);
          if (notification) {
            notification.archived = true;
          }
        }),

      deleteNotification: (id) =>
        set((state) => {
          const index = state.notifications.findIndex((n: Notification) => n.id === id);
          if (index !== -1) {
            const notification = state.notifications[index];
            if (!notification.read) {
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
            state.notifications.splice(index, 1);
          }
        }),

      clearAll: () =>
        set((state) => {
          state.notifications = [];
          state.unreadCount = 0;
        }),

      fetchNotifications: async (limit = 50) => {
        set((state) => {
          state.isLoading = true;
        });

        try {
          const response = await notificationApi<{ notifications: Notification[] }>(
            `/alerts?limit=${limit}`
          );

          set((state) => {
            state.notifications = response.notifications;
            state.unreadCount = response.notifications.filter((n: Notification) => !n.read).length;
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Failed to fetch notifications';
            state.isLoading = false;
          });
        }
      },

      // Preference Actions
      setPreferences: (preferences) =>
        set((state) => {
          Object.assign(state.preferences, preferences);
        }),

      muteType: (type) =>
        set((state) => {
          if (!state.preferences.mutedTypes.includes(type)) {
            state.preferences.mutedTypes.push(type);
          }
        }),

      unmuteType: (type) =>
        set((state) => {
          state.preferences.mutedTypes = state.preferences.mutedTypes.filter(
            (t: NotificationType) => t !== type
          );
        }),

      // Connection Actions
      setConnected: (connected) =>
        set((state) => {
          state.isConnected = connected;
        }),

      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading;
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
        }),
    })),
    {
      name: 'datacendia-notifications',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        preferences: state.preferences,
      }),
    }
  )
);

// =============================================================================
// SELECTORS
// =============================================================================

export const selectNotifications = (state: NotificationState) => state.notifications;
export const selectUnreadCount = (state: NotificationState) => state.unreadCount;
export const selectUnreadNotifications = (state: NotificationState) =>
  state.notifications.filter((n) => !n.read && !n.archived);
export const selectCriticalNotifications = (state: NotificationState) =>
  state.notifications.filter((n) => n.priority === 'critical' && !n.read);
