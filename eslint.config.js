import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier/flat'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist/', 'coverage/', '.playwright-cli/']),
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    extends: [js.configs.recommended],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommended],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['eslint.config.js', 'vite.config.ts', '.claude/hooks/*.mjs'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/game/**/*.ts'],
    rules: {
      'no-restricted-globals': [
        'error',
        'window',
        'document',
        'localStorage',
        'setInterval',
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react',
                'react/*',
                'react-dom',
                'react-dom/*',
                'zustand',
                'zustand/*',
                'howler',
                'node:*',
              ],
              message:
                'Game systems must run independently of UI, storage and platform APIs.',
            },
            {
              group: [
                '**/store/**',
                '**/ui/**',
                '**/art/**',
                '**/audio/**',
                '**/platform/**',
              ],
              message: 'Keep dependencies inside src/game.',
            },
          ],
        },
      ],
    },
  },
  prettier,
])
