// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import React from 'react';

type CourtroomLayoutProps = {
  result: { currentPhase?: string };
  setRecentDecisions: (value: unknown) => void;
  chatEndRef: React.RefObject<HTMLElement>;
};

const CourtroomLayout = ({ result, setRecentDecisions, chatEndRef }: CourtroomLayoutProps) => {
  // Courtroom layout implementation
  return (
    <div className="courtroom-layout bg-neutral-900 p-4 rounded-xl">
      {/* Judge Bench */}
      <div className="judge-bench mb-4 p-4 bg-gradient-to-r from-yellow-900/30 to-amber-900/30 rounded-xl border border-amber-700">
        <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
          <span>⚖️</span> Judge's Bench
        </h3>
        {/* Lead agent would appear here */}
      </div>
      
      <div className="flex gap-4">
        {/* Witness Stand */}
        <div className="witness-stand flex-1 p-4 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl border border-purple-700">
          <h4 className="text-md font-semibold text-purple-400 mb-2">👤 Witness Stand</h4>
          {/* Current speaker would appear here */}
        </div>
        
        {/* Jury Box */}
        <div className="jury-box w-1/3 p-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl border border-cyan-700">
          <h4 className="text-md font-semibold text-cyan-400 mb-2">👥 Jury Box</h4>
          <div className="grid grid-cols-3 gap-2">
            {/* Other agents would appear here */}
          </div>
        </div>
      </div>
      
      {/* Gallery */}
      <div className="gallery mt-4 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
        <h4 className="text-md font-semibold text-neutral-400 mb-2">👀 Gallery</h4>
        <p className="text-sm text-neutral-500">Observers: 5</p>
      </div>
      
      {/* Add the same user input as in chat mode */}
      {result.currentPhase !== 'completed' && (
        <div className="sticky bottom-0 bg-neutral-900/95 backdrop-blur-sm pt-3 pb-2 -mx-5 px-5 mt-4 border-t border-neutral-700/50">
          {/* ... same input form as chat mode ... */}
        </div>
      )}
    </div>
  );
};

export default CourtroomLayout;
