import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      // react.configs.flat.recommended pulls in jsx-uses-vars, which is
      // what teaches no-unused-vars that <motion.div> in JSX is a real
      // reference to the `motion` import — without it, every component
      // used only via JSX (not a direct function call) was a false
      // positive "unused variable".
      react.configs.flat.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // React 19 + the new JSX transform means React doesn't need to be
      // in scope, and prop-types aren't used in this codebase.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
])
