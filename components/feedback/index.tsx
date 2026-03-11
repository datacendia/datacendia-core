// Community stub — enterprise implementation in datacendia-components
import React from 'react';
export const ToastProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;
export const useToast = () => ({
  toast: (_msg: string, _opts?: any) => {},
  success: (_msg: string) => {},
  error: (_msg: string) => {},
  dismiss: () => {},
});
