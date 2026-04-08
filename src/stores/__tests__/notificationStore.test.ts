/**
 * Tests for src/stores/notificationStore.ts
 * Covers: notifications, preferences, muting, quiet hours, selectors
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock browser globals before store import
const mockWindow: any = {
  Notification: { permission: 'denied', requestPermission: vi.fn() },
};
vi.stubGlobal('window', mockWindow);
vi.stubGlobal('Notification', class MockNotification { 
  static permission = 'denied';
  static requestPermission = vi.fn();
  constructor(_title: string, _options?: any) {}
});

import { useNotificationStore } from '../notificationStore';
import type { Notification, NotificationType } from '../notificationStore';

// Mock fetch
global.fetch = vi.fn();

describe('useNotificationStore', () => {
  beforeEach(() => {
    // Reset store state
    useNotificationStore.setState({
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
    });
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useNotificationStore.getState();
      expect(state.notifications).toEqual([]);
      expect(state.unreadCount).toBe(0);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isConnected).toBe(false);
    });
  });

  describe('setNotifications', () => {
    it('should set notifications and calculate unread count', () => {
      const notifications: Notification[] = [
        { id: '1', type: 'alert', priority: 'high', title: 'Alert', message: 'Test', read: false, archived: false, createdAt: new Date() },
        { id: '2', type: 'system', priority: 'low', title: 'System', message: 'Info', read: true, archived: false, createdAt: new Date() },
        { id: '3', type: 'decision', priority: 'medium', title: 'Decision', message: 'Review', read: false, archived: false, createdAt: new Date() },
      ];

      useNotificationStore.getState().setNotifications(notifications);
      const state = useNotificationStore.getState();

      expect(state.notifications).toHaveLength(3);
      expect(state.unreadCount).toBe(2);
    });
  });

  describe('addNotification', () => {
    it('should add a new notification', () => {
      useNotificationStore.getState().addNotification({
        type: 'alert',
        priority: 'high',
        title: 'New Alert',
        message: 'Something happened',
      });

      const state = useNotificationStore.getState();
      expect(state.notifications).toHaveLength(1);
      expect(state.unreadCount).toBe(1);
      expect(state.notifications[0].read).toBe(false);
      expect(state.notifications[0].archived).toBe(false);
    });

    it('should prepend new notifications (most recent first)', () => {
      useNotificationStore.getState().addNotification({
        type: 'alert',
        priority: 'high',
        title: 'First',
        message: 'First notification',
      });
      useNotificationStore.getState().addNotification({
        type: 'system',
        priority: 'low',
        title: 'Second',
        message: 'Second notification',
      });

      const state = useNotificationStore.getState();
      expect(state.notifications[0].title).toBe('Second');
      expect(state.notifications[1].title).toBe('First');
    });

    it('should not add muted notification types', () => {
      useNotificationStore.getState().setPreferences({
        mutedTypes: ['system'] as NotificationType[],
      });

      useNotificationStore.getState().addNotification({
        type: 'system',
        priority: 'low',
        title: 'Muted',
        message: 'Should be ignored',
      });

      expect(useNotificationStore.getState().notifications).toHaveLength(0);
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', () => {
      useNotificationStore.getState().addNotification({
        type: 'alert',
        priority: 'high',
        title: 'Test',
        message: 'Read me',
      });

      const notifId = useNotificationStore.getState().notifications[0].id;
      useNotificationStore.getState().markAsRead(notifId);

      const state = useNotificationStore.getState();
      expect(state.notifications[0].read).toBe(true);
      expect(state.notifications[0].readAt).toBeDefined();
      expect(state.unreadCount).toBe(0);
    });

    it('should not change count when already read', () => {
      useNotificationStore.setState({
        notifications: [
          { id: '1', type: 'alert', priority: 'high', title: 'Test', message: '', read: true, archived: false, createdAt: new Date() },
        ],
        unreadCount: 0,
      });

      useNotificationStore.getState().markAsRead('1');
      expect(useNotificationStore.getState().unreadCount).toBe(0);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', () => {
      useNotificationStore.getState().addNotification({ type: 'alert', priority: 'high', title: '1', message: '' });
      useNotificationStore.getState().addNotification({ type: 'alert', priority: 'high', title: '2', message: '' });
      useNotificationStore.getState().addNotification({ type: 'alert', priority: 'high', title: '3', message: '' });

      expect(useNotificationStore.getState().unreadCount).toBe(3);

      useNotificationStore.getState().markAllAsRead();
      const state = useNotificationStore.getState();

      expect(state.unreadCount).toBe(0);
      state.notifications.forEach(n => {
        expect(n.read).toBe(true);
        expect(n.readAt).toBeDefined();
      });
    });
  });

  describe('archiveNotification', () => {
    it('should archive a notification', () => {
      useNotificationStore.getState().addNotification({ type: 'alert', priority: 'high', title: 'Test', message: '' });
      const notifId = useNotificationStore.getState().notifications[0].id;

      useNotificationStore.getState().archiveNotification(notifId);
      expect(useNotificationStore.getState().notifications[0].archived).toBe(true);
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification and update unread count', () => {
      useNotificationStore.getState().addNotification({ type: 'alert', priority: 'high', title: 'Test', message: '' });
      const notifId = useNotificationStore.getState().notifications[0].id;

      useNotificationStore.getState().deleteNotification(notifId);
      expect(useNotificationStore.getState().notifications).toHaveLength(0);
      expect(useNotificationStore.getState().unreadCount).toBe(0);
    });

    it('should not change unread count when deleting read notification', () => {
      useNotificationStore.getState().addNotification({ type: 'alert', priority: 'high', title: 'Test', message: '' });
      const notifId = useNotificationStore.getState().notifications[0].id;
      useNotificationStore.getState().markAsRead(notifId);

      useNotificationStore.getState().deleteNotification(notifId);
      expect(useNotificationStore.getState().unreadCount).toBe(0);
    });
  });

  describe('clearAll', () => {
    it('should clear all notifications', () => {
      useNotificationStore.getState().addNotification({ type: 'alert', priority: 'high', title: '1', message: '' });
      useNotificationStore.getState().addNotification({ type: 'alert', priority: 'high', title: '2', message: '' });

      useNotificationStore.getState().clearAll();
      expect(useNotificationStore.getState().notifications).toHaveLength(0);
      expect(useNotificationStore.getState().unreadCount).toBe(0);
    });
  });

  describe('preferences', () => {
    it('should update preferences', () => {
      useNotificationStore.getState().setPreferences({
        enableSound: false,
        enableDesktop: false,
      });

      const prefs = useNotificationStore.getState().preferences;
      expect(prefs.enableSound).toBe(false);
      expect(prefs.enableDesktop).toBe(false);
      expect(prefs.enableEmail).toBe(true); // unchanged
    });

    it('should mute a type', () => {
      useNotificationStore.getState().muteType('system');
      expect(useNotificationStore.getState().preferences.mutedTypes).toContain('system');
    });

    it('should not duplicate muted types', () => {
      useNotificationStore.getState().muteType('system');
      useNotificationStore.getState().muteType('system');
      expect(useNotificationStore.getState().preferences.mutedTypes).toHaveLength(1);
    });

    it('should unmute a type', () => {
      useNotificationStore.getState().muteType('system');
      useNotificationStore.getState().unmuteType('system');
      expect(useNotificationStore.getState().preferences.mutedTypes).not.toContain('system');
    });
  });

  describe('connection state', () => {
    it('should set connected state', () => {
      useNotificationStore.getState().setConnected(true);
      expect(useNotificationStore.getState().isConnected).toBe(true);
    });

    it('should set loading state', () => {
      useNotificationStore.getState().setLoading(true);
      expect(useNotificationStore.getState().isLoading).toBe(true);
    });

    it('should set error state', () => {
      useNotificationStore.getState().setError('Connection failed');
      expect(useNotificationStore.getState().error).toBe('Connection failed');
    });
  });

  describe('selectors', () => {
    it('selectUnreadNotifications should filter unread non-archived', async () => {
      const { selectUnreadNotifications } = await import('../notificationStore');

      useNotificationStore.setState({
        notifications: [
          { id: '1', type: 'alert', priority: 'high', title: 'Unread', message: '', read: false, archived: false, createdAt: new Date() },
          { id: '2', type: 'alert', priority: 'high', title: 'Read', message: '', read: true, archived: false, createdAt: new Date() },
          { id: '3', type: 'alert', priority: 'high', title: 'Archived', message: '', read: false, archived: true, createdAt: new Date() },
        ],
        unreadCount: 2,
      });

      const unread = selectUnreadNotifications(useNotificationStore.getState());
      expect(unread).toHaveLength(1);
      expect(unread[0].title).toBe('Unread');
    });

    it('selectCriticalNotifications should filter critical unread', async () => {
      const { selectCriticalNotifications } = await import('../notificationStore');

      useNotificationStore.setState({
        notifications: [
          { id: '1', type: 'alert', priority: 'critical', title: 'Critical', message: '', read: false, archived: false, createdAt: new Date() },
          { id: '2', type: 'alert', priority: 'high', title: 'High', message: '', read: false, archived: false, createdAt: new Date() },
          { id: '3', type: 'alert', priority: 'critical', title: 'Read Critical', message: '', read: true, archived: false, createdAt: new Date() },
        ],
        unreadCount: 2,
      });

      const critical = selectCriticalNotifications(useNotificationStore.getState());
      expect(critical).toHaveLength(1);
      expect(critical[0].title).toBe('Critical');
    });
  });
});
