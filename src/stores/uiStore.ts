// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * UI Store - Global UI state management
 *
 * Manages sidebar, modals, toasts, command palette, and other UI state.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// =============================================================================
// TYPES
// =============================================================================

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Modal {
  id: string;
  component: string;
  props?: Record<string, unknown>;
  onClose?: () => void;
}

export interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Command Palette
  commandPaletteOpen: boolean;

  // Search
  globalSearchOpen: boolean;
  globalSearchQuery: string;

  // Modals
  activeModals: Modal[];

  // Toasts
  toasts: Toast[];

  // Loading States
  globalLoading: boolean;
  loadingMessage: string | null;

  // Panels
  rightPanelOpen: boolean;
  rightPanelContent: string | null;

  // Page State
  pageTitle: string;
  breadcrumbs: Array<{ label: string; path?: string }>;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;

  setGlobalSearchOpen: (open: boolean) => void;
  setGlobalSearchQuery: (query: string) => void;

  openModal: (modal: Omit<Modal, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;

  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  setGlobalLoading: (loading: boolean, message?: string) => void;

  setRightPanel: (open: boolean, content?: string) => void;

  setPageTitle: (title: string) => void;
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; path?: string }>) => void;
}

// =============================================================================
// HELPERS
// =============================================================================

let toastCounter = 0;
let modalCounter = 0;

function generateToastId(): string {
  return `toast-${++toastCounter}-${Date.now()}`;
}

function generateModalId(): string {
  return `modal-${++modalCounter}-${Date.now()}`;
}

// =============================================================================
// STORE
// =============================================================================

export const useUIStore = create<UIState>()(
  immer((set, get) => ({
    // Initial State
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

    // Sidebar Actions
    toggleSidebar: () =>
      set((state) => {
        state.sidebarOpen = !state.sidebarOpen;
      }),

    setSidebarOpen: (open) =>
      set((state) => {
        state.sidebarOpen = open;
      }),

    setSidebarCollapsed: (collapsed) =>
      set((state) => {
        state.sidebarCollapsed = collapsed;
      }),

    // Command Palette Actions
    toggleCommandPalette: () =>
      set((state) => {
        state.commandPaletteOpen = !state.commandPaletteOpen;
      }),

    setCommandPaletteOpen: (open) =>
      set((state) => {
        state.commandPaletteOpen = open;
      }),

    // Search Actions
    setGlobalSearchOpen: (open) =>
      set((state) => {
        state.globalSearchOpen = open;
        if (!open) {
          state.globalSearchQuery = '';
        }
      }),

    setGlobalSearchQuery: (query) =>
      set((state) => {
        state.globalSearchQuery = query;
      }),

    // Modal Actions
    openModal: (modal) => {
      const id = generateModalId();
      set((state) => {
        state.activeModals.push({ ...modal, id });
      });
      return id;
    },

    closeModal: (id) =>
      set((state) => {
        const modal = state.activeModals.find((m: Modal) => m.id === id);
        if (modal?.onClose) {
          modal.onClose();
        }
        state.activeModals = state.activeModals.filter((m: Modal) => m.id !== id);
      }),

    closeAllModals: () =>
      set((state) => {
        state.activeModals.forEach((modal: Modal) => {
          if (modal.onClose) {
            modal.onClose();
          }
        });
        state.activeModals = [];
      }),

    // Toast Actions
    addToast: (toast) => {
      const id = generateToastId();
      const duration = toast.duration ?? 5000;

      set((state) => {
        state.toasts.push({ ...toast, id });
      });

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          get().removeToast(id);
        }, duration);
      }

      return id;
    },

    removeToast: (id) =>
      set((state) => {
        state.toasts = state.toasts.filter((t: Toast) => t.id !== id);
      }),

    clearToasts: () =>
      set((state) => {
        state.toasts = [];
      }),

    // Loading Actions
    setGlobalLoading: (loading, message) =>
      set((state) => {
        state.globalLoading = loading;
        state.loadingMessage = loading ? (message ?? null) : null;
      }),

    // Right Panel Actions
    setRightPanel: (open, content) =>
      set((state) => {
        state.rightPanelOpen = open;
        state.rightPanelContent = open ? (content ?? null) : null;
      }),

    // Page Actions
    setPageTitle: (title) =>
      set((state) => {
        state.pageTitle = title;
        document.title = `${title} | Datacendia`;
      }),

    setBreadcrumbs: (breadcrumbs) =>
      set((state) => {
        state.breadcrumbs = breadcrumbs;
      }),
  }))
);

// =============================================================================
// CONVENIENCE HOOKS
// =============================================================================

export function useToast() {
  const addToast = useUIStore((state) => state.addToast);
  const removeToast = useUIStore((state) => state.removeToast);

  return {
    success: (title: string, message?: string) => addToast({ type: 'success', title, ...(message !== undefined && { message }) }),
    error: (title: string, message?: string) => addToast({ type: 'error', title, ...(message !== undefined && { message }) }),
    warning: (title: string, message?: string) => addToast({ type: 'warning', title, ...(message !== undefined && { message }) }),
    info: (title: string, message?: string) => addToast({ type: 'info', title, ...(message !== undefined && { message }) }),
    remove: removeToast,
  };
}

// =============================================================================
// SELECTORS
// =============================================================================

export const selectSidebarOpen = (state: UIState) => state.sidebarOpen;
export const selectCommandPaletteOpen = (state: UIState) => state.commandPaletteOpen;
export const selectToasts = (state: UIState) => state.toasts;
export const selectGlobalLoading = (state: UIState) => state.globalLoading;
