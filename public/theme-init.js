// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// Applies the stored theme before the first paint. index.html starts dark (the
// default); without this, a visitor who chose light, or "system" on a light
// OS, would see a dark flash until ThemeContext mounts. Mirrors ThemeContext:
// key 'datacendia-theme', default 'dark'. An external file, not an inline
// script, so a strict Content-Security-Policy can allow it as 'self'.
(function () {
  try {
    var theme = localStorage.getItem('datacendia-theme') || 'dark';
    if (theme === 'system') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme === 'light' ? 'light' : 'dark');
  } catch (e) {
    // Storage is blocked: keep the dark default from the markup.
  }
})();
