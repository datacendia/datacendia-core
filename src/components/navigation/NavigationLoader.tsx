// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * NavigationLoader - Loading state for cross-service navigation
 * Shows a subtle loading indicator when navigating between services
 */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const NavigationLoader: React.FC = () => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath) {
      setIsNavigating(true);
      setPrevPath(location.pathname);
      
      // Hide after a short delay
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [location.pathname, prevPath]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-cyan-500 to-primary-500 z-[9999] origin-left"
        />
      )}
    </AnimatePresence>
  );
};

// Hook for programmatic navigation with loading state
export const useNavigateWithLoader = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigateWithLoader = async (
    navigateFn: () => void,
    delay: number = 100
  ) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    navigateFn();
    setTimeout(() => setIsLoading(false), 300);
  };

  return { isLoading, navigateWithLoader };
};

// Loading overlay for window.open cross-service navigation
export const CrossServiceLoadingOverlay: React.FC<{ 
  isOpen: boolean; 
  serviceName?: string;
  onClose: () => void;
}> = ({ isOpen, serviceName = 'service', onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-700"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <div>
                <p className="text-white font-medium">Opening {serviceName}...</p>
                <p className="text-slate-400 text-sm">Loading in new tab</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavigationLoader;
