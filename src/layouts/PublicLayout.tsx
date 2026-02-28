// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - PUBLIC LAYOUT
// Shared layout for all public-facing pages with navigation and footer
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LanguageSwitcher } from '../components/i18n/LanguageSwitcher';
import { Logo } from '../components/brand';

// =============================================================================
// TYPES
// =============================================================================

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

const navItems: NavItem[] = [
  { label: 'Product', href: '/product' },
  {
    label: 'Industries',
    href: '/verticals',
    children: [
      { label: 'All Industries', href: '/verticals', description: 'Browse all 18 verticals' },
      {
        label: 'Healthcare',
        href: '/verticals/healthcare',
        description: 'Clinical decision intelligence',
      },
      {
        label: 'Financial Services',
        href: '/verticals/financial-services',
        description: 'Fraud & regulatory AI',
      },
      {
        label: 'Government & Legal',
        href: '/verticals/government-legal',
        description: 'Sovereign AI for policy',
      },
      { label: 'Insurance', href: '/verticals/insurance', description: 'Underwriting & claims' },
      {
        label: 'Pharmaceutical',
        href: '/verticals/pharmaceutical',
        description: 'Pipeline decisions',
      },
      { label: 'Sports', href: '/verticals/sports', description: 'Team & player analytics' },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Downloads', href: '/downloads' },
  {
    label: 'Company',
    href: '#',
    children: [
      { label: 'About Us', href: '/about', description: 'Learn about our mission' },
      { label: 'Manifesto', href: '/manifesto', description: 'Our guiding principles' },
      { label: 'Services', href: '/services', description: 'Professional services' },
      { label: 'Packages', href: '/packages', description: 'Solution bundles' },
    ],
  },
  {
    label: 'Resources',
    href: '#',
    children: [
      { label: 'Documentation', href: '/docs', description: 'Guides and API reference' },
      { label: 'Blog', href: '/blog', description: 'Latest updates' },
      { label: 'License', href: '/license', description: 'Licensing information' },
    ],
  },
];

const footerSections = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/product' },
      { label: 'Industries', href: '/verticals' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Downloads', href: '/downloads' },
      { label: 'Integrations', href: '/integrations' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Manifesto', href: '/manifesto' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api' },
      { label: 'Blog', href: '/blog' },
      { label: 'Community', href: '/community' },
      { label: 'Status', href: '/status' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'License', href: '/license' },
      { label: 'Security', href: '/security' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      return;
    }
    navigate(href);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center z-10 hover:opacity-90 transition-opacity">
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.children ? (
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === item.label ? null : item.label)
                      }
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                        isScrolled
                          ? 'text-neutral-700 hover:bg-neutral-100'
                          : 'text-neutral-800 hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        location.pathname === item.href
                          ? 'text-primary-600 bg-primary-50'
                          : isScrolled
                            ? 'text-neutral-700 hover:bg-neutral-100'
                            : 'text-neutral-800 hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </button>
                  )}

                  {/* Dropdown */}
                  {item.children && (
                    <div
                      className={`absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 transition-all ${
                        openDropdown === item.label
                          ? 'opacity-100 visible translate-y-0'
                          : 'opacity-0 invisible -translate-y-2'
                      }`}
                    >
                      {item.children.map((child) => (
                        <button
                          key={child.href}
                          onClick={() => handleNavClick(child.href)}
                          className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
                        >
                          <p className="font-medium text-neutral-900">{child.label}</p>
                          {child.description && (
                            <p className="text-sm text-neutral-500">{child.description}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <LanguageSwitcher variant="compact" />
              </div>
              <button
                onClick={() => navigate('/login')}
                className={`hidden sm:block px-4 py-2 rounded-lg font-medium transition-colors ${
                  isScrolled
                    ? 'text-neutral-700 hover:bg-neutral-100'
                    : 'text-neutral-800 hover:bg-white/10'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/demo')}
                className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25"
              >
                Request Demo
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-neutral-200 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-2">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === item.label ? null : item.label)
                        }
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-neutral-50"
                      >
                        <span className="font-medium text-neutral-900">{item.label}</span>
                        <svg
                          className={`w-5 h-5 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {openDropdown === item.label && (
                        <div className="pl-4 space-y-1">
                          {item.children.map((child) => (
                            <button
                              key={child.href}
                              onClick={() => handleNavClick(child.href)}
                              className="w-full px-4 py-2 text-left rounded-lg text-neutral-600 hover:bg-neutral-50"
                            >
                              {child.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className="w-full px-4 py-3 text-left rounded-lg font-medium text-neutral-900 hover:bg-neutral-50"
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
              <hr className="my-4 border-neutral-200" />
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-3 text-left rounded-lg font-medium text-neutral-900 hover:bg-neutral-50"
              >
                Sign In
              </button>
              <div className="px-4 pt-2">
                <LanguageSwitcher variant="flags" />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content - with padding for fixed header */}
      <main className="flex-1 pt-16 lg:pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Footer Top */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
                <span className="text-xl font-bold">Datacendia</span>
              </div>
              <p className="text-neutral-400 text-sm">Sovereign Enterprise Intelligence</p>
            </div>

            {/* Link Sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-neutral-400 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-sm">
              © {new Date().getFullYear()} Datacendia. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {/* Social Icons */}
              <a
                href="https://twitter.com/datacendia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com/datacendia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/datacendia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
