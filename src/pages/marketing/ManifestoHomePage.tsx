// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - THE MANIFESTO HOMEPAGE
// The page that closes $100M deals.
// =============================================================================

import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { api } from '@/lib/api/client';

// Request Access Modal
const RequestAccessModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [formspreeState, formspreeSubmit] = useForm('xvzbvpev');
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    organization: '',
    concern: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Primary: Formspree (email notification via @formspree/react)
    await formspreeSubmit(e);

    // Secondary: Backend (database persistence)
    api.post('/api/v1/marketing-leads', {
      ...formData,
      source: 'manifesto',
    }).catch((err) => console.error('[ManifestoHomePage] Backend failed:', err));
  };

  if (!isOpen) {return null;}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
      <div className="relative w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-gray-500 hover:text-white text-sm tracking-widest"
        >
          CLOSE
        </button>

        {formspreeState.succeeded ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border border-red-900/50 rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="w-3 h-3 bg-red-900 rounded-full" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4 tracking-wide">Access Requested</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
              Your inquiry has been received. If approved, you will be contacted within 48 hours to
              schedule a secure demonstration.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="_subject" value={`Manifesto Request: ${formData.organization}`} />
            <input type="hidden" name="source" value="manifesto" />
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent border-b border-gray-800 focus:border-red-900/50 text-white py-4 px-0 text-lg outline-none transition-colors placeholder:text-gray-600"
              />
              <ValidationError prefix="Name" field="name" errors={formspreeState.errors} className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <input
                type="text"
                name="title"
                placeholder="Title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-transparent border-b border-gray-800 focus:border-red-900/50 text-white py-4 px-0 text-lg outline-none transition-colors placeholder:text-gray-600"
              />
              <ValidationError prefix="Title" field="title" errors={formspreeState.errors} className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <input
                type="text"
                name="organization"
                placeholder="Organization"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full bg-transparent border-b border-gray-800 focus:border-red-900/50 text-white py-4 px-0 text-lg outline-none transition-colors placeholder:text-gray-600"
              />
              <ValidationError prefix="Organization" field="organization" errors={formspreeState.errors} className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <textarea
                name="message"
                placeholder="What keeps you up at night?"
                required
                rows={3}
                value={formData.concern}
                onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                className="w-full bg-transparent border-b border-gray-800 focus:border-red-900/50 text-white py-4 px-0 text-lg outline-none transition-colors placeholder:text-gray-600 resize-none"
              />
              <ValidationError prefix="Message" field="message" errors={formspreeState.errors} className="text-red-500 text-xs mt-1" />
            </div>
            <div className="pt-8">
              <button
                type="submit"
                disabled={formspreeState.submitting}
                className="w-full py-4 border border-red-900/50 text-white hover:bg-red-900/10 transition-colors text-sm tracking-widest disabled:opacity-50"
              >
                {formspreeState.submitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const ManifestoHomePage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Main Content - Centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Brand */}
          <h1 className="text-3xl md:text-5xl font-extralight tracking-[0.3em] text-white mb-2">
            DATACENDIA
          </h1>
          <p className="text-xs tracking-[0.4em] text-gray-600 uppercase mb-16 md:mb-24">
            The Sovereign Intelligence Platform
          </p>

          {/* The Manifesto */}
          <div className="space-y-8 md:space-y-12 text-left md:text-center">
            {/* Opening */}
            <p className="text-lg md:text-xl lg:text-2xl font-light text-gray-300 leading-relaxed">
              Modern enterprises have surrendered their minds.
            </p>

            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
              They've traded ownership for convenience, and now they're tenants in their own house.
            </p>

            {/* The Crescendo */}
            <div className="space-y-3 text-sm md:text-base text-gray-500">
              <p>They have data. They don't have understanding.</p>
              <p>They have dashboards. They don't have direction.</p>
              <p>They have AI. They don't have agency.</p>
              <p>They have predictions. They don't have power.</p>
              <p>They have tools. They don't have truth.</p>
            </div>

            {/* The Mission */}
            <p className="text-xl md:text-2xl lg:text-3xl font-light text-white leading-relaxed pt-4">
              Datacendia exists to return the mind to its rightful owner.
            </p>

            {/* The Beliefs */}
            <div className="pt-8 md:pt-12 border-t border-gray-900">
              <p className="text-xs tracking-[0.3em] text-gray-600 uppercase mb-8">We Believe</p>
              <ol className="space-y-4 text-sm md:text-base text-gray-400 text-left max-w-xl mx-auto">
                <li className="flex gap-4">
                  <span className="text-red-900 font-mono">1.</span>
                  <span>
                    Your intelligence should live on your infrastructure, under your control.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="text-red-900 font-mono">2.</span>
                  <span>Decisions made by machines should be explainable to humans.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-red-900 font-mono">3.</span>
                  <span>
                    Disagreement is not disloyalty — it is the immune system of good judgment.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="text-red-900 font-mono">4.</span>
                  <span>The past is not a black box — it is a teacher, if you can replay it.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-red-900 font-mono">5.</span>
                  <span>Transparency is not a feature. It is the foundation.</span>
                </li>
              </ol>
            </div>

            {/* The Destiny */}
            <p className="text-lg md:text-xl text-gray-300 pt-8 md:pt-12 italic">
              The future belongs to those who can see it —
              <br />
              <span className="text-white not-italic">
                and refuse to rent it from someone else.
              </span>
            </p>
          </div>

          {/* Single CTA */}
          <div className="pt-16 md:pt-24">
            <button
              onClick={() => setShowModal(true)}
              className="group px-8 md:px-12 py-4 md:py-5 border border-red-900/50 hover:border-red-900 bg-black hover:bg-red-900/10 transition-all duration-500"
            >
              <span className="text-sm md:text-base tracking-[0.2em] text-gray-300 group-hover:text-white transition-colors">
                Request the Sovereign OS Bible
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer - Minimal */}
      <footer className="py-8 px-6 text-center">
        <p className="text-[10px] md:text-xs text-gray-700 tracking-widest">
          For organizations that cannot afford to be tenants.
        </p>
        <div className="mt-4 text-[10px] text-gray-800">
          © {new Date().getFullYear()} Datacendia
        </div>
      </footer>

      {/* Request Access Modal */}
      <RequestAccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default ManifestoHomePage;
