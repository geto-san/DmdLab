import { createContext } from 'react';

// Split into its own file (rather than living in ThemeContext.jsx or
// useTheme.js) so neither of those files mixes a component export with a
// non-component export — Vite's fast refresh only reliably hot-reloads
// files that export exclusively components.
export const ThemeContext = createContext();
