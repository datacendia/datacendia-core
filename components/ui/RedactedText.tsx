// Community stub — enterprise implementation in datacendia-components
import React from 'react';
export const RedactedText: React.FC<any> = ({ children }) => <>{children}</>;
export const RedactedCode: React.FC<any> = ({ children }) => <>{children}</>;
export const RedactionProvider: React.FC<any> = ({ children }) => <>{children}</>;
export const RedactionToggle: React.FC<any> = () => null;
export const useRedaction = () => ({ isRedacted: false, toggle: () => {} });
