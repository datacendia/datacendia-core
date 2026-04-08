/**
 * Tests for src/stores/uiStore.ts
 * Covers: sidebar, modals, toasts, command palette, loading, right panel, page state
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock document for setPageTitle
vi.stubGlobal('document', { title: 'Datacendia' });

import { useUIStore } from '../uiStore';

describe('useUIStore', () => {
  beforeEach(() => {
    // Reset store state
    useUIStore.setState({
      sidebarOpen: true,
      sidebarCollapsed: false,
      commandPaletteOpen: false,
      globalSearchOpen: false,
      globalSearchQuery: '',
      activeModals: [],
      toasts: [],
      globalLoading: false,
      loadingMessage: null,
      rightPanelOpen: false,
      rightPanelContent: null,
      pageTitle: 'Datacendia',
      breadcrumbs: [],
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useUIStore.getState();
      expect(state.sidebarOpen).toBe(true);
      expect(state.sidebarCollapsed).toBe(false);
      expect(state.commandPaletteOpen).toBe(false);
      expect(state.globalSearchOpen).toBe(false);
      expect(state.globalSearchQuery).toBe('');
      expect(state.activeModals).toEqual([]);
      expect(state.toasts).toEqual([]);
      expect(state.globalLoading).toBe(false);
      expect(state.loadingMessage).toBeNull();
    });
  });

  describe('sidebar actions', () => {
    it('should toggle sidebar', () => {
      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().sidebarOpen).toBe(false);

      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().sidebarOpen).toBe(true);
    });

    it('should set sidebar open state', () => {
      useUIStore.getState().setSidebarOpen(false);
      expect(useUIStore.getState().sidebarOpen).toBe(false);

      useUIStore.getState().setSidebarOpen(true);
      expect(useUIStore.getState().sidebarOpen).toBe(true);
    });

    it('should set sidebar collapsed state', () => {
      useUIStore.getState().setSidebarCollapsed(true);
      expect(useUIStore.getState().sidebarCollapsed).toBe(true);
    });
  });

  describe('command palette actions', () => {
    it('should toggle command palette', () => {
      useUIStore.getState().toggleCommandPalette();
      expect(useUIStore.getState().commandPaletteOpen).toBe(true);

      useUIStore.getState().toggleCommandPalette();
      expect(useUIStore.getState().commandPaletteOpen).toBe(false);
    });

    it('should set command palette open state', () => {
      useUIStore.getState().setCommandPaletteOpen(true);
      expect(useUIStore.getState().commandPaletteOpen).toBe(true);
    });
  });

  describe('search actions', () => {
    it('should set global search open', () => {
      useUIStore.getState().setGlobalSearchOpen(true);
      expect(useUIStore.getState().globalSearchOpen).toBe(true);
    });

    it('should clear search query when closing', () => {
      useUIStore.getState().setGlobalSearchQuery('test query');
      useUIStore.getState().setGlobalSearchOpen(false);
      expect(useUIStore.getState().globalSearchQuery).toBe('');
    });

    it('should set search query', () => {
      useUIStore.getState().setGlobalSearchQuery('hello world');
      expect(useUIStore.getState().globalSearchQuery).toBe('hello world');
    });
  });

  describe('modal actions', () => {
    it('should open a modal and return id', () => {
      const id = useUIStore.getState().openModal({
        component: 'TestModal',
        props: { title: 'Test' },
      });

      expect(id).toBeDefined();
      expect(id).toContain('modal-');
      expect(useUIStore.getState().activeModals).toHaveLength(1);
      expect(useUIStore.getState().activeModals[0].component).toBe('TestModal');
    });

    it('should close a specific modal', () => {
      const id = useUIStore.getState().openModal({ component: 'Modal1' });
      useUIStore.getState().openModal({ component: 'Modal2' });

      useUIStore.getState().closeModal(id);
      expect(useUIStore.getState().activeModals).toHaveLength(1);
      expect(useUIStore.getState().activeModals[0].component).toBe('Modal2');
    });

    it('should call onClose callback when closing modal', () => {
      const onClose = vi.fn();
      const id = useUIStore.getState().openModal({
        component: 'TestModal',
        onClose,
      });

      useUIStore.getState().closeModal(id);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should close all modals', () => {
      const onClose1 = vi.fn();
      const onClose2 = vi.fn();
      useUIStore.getState().openModal({ component: 'Modal1', onClose: onClose1 });
      useUIStore.getState().openModal({ component: 'Modal2', onClose: onClose2 });

      useUIStore.getState().closeAllModals();
      expect(useUIStore.getState().activeModals).toHaveLength(0);
      expect(onClose1).toHaveBeenCalledTimes(1);
      expect(onClose2).toHaveBeenCalledTimes(1);
    });

    it('should support multiple modals stacked', () => {
      useUIStore.getState().openModal({ component: 'Modal1' });
      useUIStore.getState().openModal({ component: 'Modal2' });
      useUIStore.getState().openModal({ component: 'Modal3' });

      expect(useUIStore.getState().activeModals).toHaveLength(3);
    });
  });

  describe('toast actions', () => {
    it('should add a toast and return id', () => {
      const id = useUIStore.getState().addToast({
        type: 'success',
        title: 'Success!',
        message: 'Operation completed',
      });

      expect(id).toBeDefined();
      expect(id).toContain('toast-');
      expect(useUIStore.getState().toasts).toHaveLength(1);
    });

    it('should auto-remove toast after duration', () => {
      useUIStore.getState().addToast({
        type: 'info',
        title: 'Auto-remove',
        duration: 3000,
      });

      expect(useUIStore.getState().toasts).toHaveLength(1);

      vi.advanceTimersByTime(3000);
      expect(useUIStore.getState().toasts).toHaveLength(0);
    });

    it('should use default duration of 5000ms', () => {
      useUIStore.getState().addToast({
        type: 'info',
        title: 'Default duration',
      });

      vi.advanceTimersByTime(4999);
      expect(useUIStore.getState().toasts).toHaveLength(1);

      vi.advanceTimersByTime(1);
      expect(useUIStore.getState().toasts).toHaveLength(0);
    });

    it('should not auto-remove when duration is 0', () => {
      useUIStore.getState().addToast({
        type: 'error',
        title: 'Persistent',
        duration: 0,
      });

      vi.advanceTimersByTime(100000);
      expect(useUIStore.getState().toasts).toHaveLength(1);
    });

    it('should remove a specific toast', () => {
      const id1 = useUIStore.getState().addToast({ type: 'info', title: 'Toast 1', duration: 0 });
      useUIStore.getState().addToast({ type: 'info', title: 'Toast 2', duration: 0 });

      useUIStore.getState().removeToast(id1);
      expect(useUIStore.getState().toasts).toHaveLength(1);
      expect(useUIStore.getState().toasts[0].title).toBe('Toast 2');
    });

    it('should clear all toasts', () => {
      useUIStore.getState().addToast({ type: 'info', title: 'Toast 1', duration: 0 });
      useUIStore.getState().addToast({ type: 'info', title: 'Toast 2', duration: 0 });

      useUIStore.getState().clearToasts();
      expect(useUIStore.getState().toasts).toHaveLength(0);
    });
  });

  describe('loading actions', () => {
    it('should set global loading without message', () => {
      useUIStore.getState().setGlobalLoading(true);
      expect(useUIStore.getState().globalLoading).toBe(true);
      expect(useUIStore.getState().loadingMessage).toBeNull();
    });

    it('should set global loading with message', () => {
      useUIStore.getState().setGlobalLoading(true, 'Loading data...');
      expect(useUIStore.getState().globalLoading).toBe(true);
      expect(useUIStore.getState().loadingMessage).toBe('Loading data...');
    });

    it('should clear loading message when loading is false', () => {
      useUIStore.getState().setGlobalLoading(true, 'Loading...');
      useUIStore.getState().setGlobalLoading(false);
      expect(useUIStore.getState().globalLoading).toBe(false);
      expect(useUIStore.getState().loadingMessage).toBeNull();
    });
  });

  describe('right panel actions', () => {
    it('should open right panel with content', () => {
      useUIStore.getState().setRightPanel(true, 'details');
      expect(useUIStore.getState().rightPanelOpen).toBe(true);
      expect(useUIStore.getState().rightPanelContent).toBe('details');
    });

    it('should clear content when closing panel', () => {
      useUIStore.getState().setRightPanel(true, 'details');
      useUIStore.getState().setRightPanel(false);
      expect(useUIStore.getState().rightPanelOpen).toBe(false);
      expect(useUIStore.getState().rightPanelContent).toBeNull();
    });
  });

  describe('page state actions', () => {
    it('should set page title', () => {
      useUIStore.getState().setPageTitle('Council');
      expect(useUIStore.getState().pageTitle).toBe('Council');
    });

    it('should set breadcrumbs', () => {
      const breadcrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Settings' },
      ];
      useUIStore.getState().setBreadcrumbs(breadcrumbs);
      expect(useUIStore.getState().breadcrumbs).toEqual(breadcrumbs);
    });
  });

  describe('selectors', () => {
    it('selectSidebarOpen should return sidebar state', async () => {
      const { selectSidebarOpen } = await import('../uiStore');
      const state = useUIStore.getState();
      expect(selectSidebarOpen(state)).toBe(true);
    });

    it('selectCommandPaletteOpen should return command palette state', async () => {
      const { selectCommandPaletteOpen } = await import('../uiStore');
      useUIStore.getState().setCommandPaletteOpen(true);
      expect(selectCommandPaletteOpen(useUIStore.getState())).toBe(true);
    });

    it('selectToasts should return toasts array', async () => {
      const { selectToasts } = await import('../uiStore');
      useUIStore.getState().addToast({ type: 'info', title: 'Test', duration: 0 });
      expect(selectToasts(useUIStore.getState())).toHaveLength(1);
    });

    it('selectGlobalLoading should return loading state', async () => {
      const { selectGlobalLoading } = await import('../uiStore');
      useUIStore.getState().setGlobalLoading(true);
      expect(selectGlobalLoading(useUIStore.getState())).toBe(true);
    });
  });
});
