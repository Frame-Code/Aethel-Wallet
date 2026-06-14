// ============================================================
// Wallet Aethel — Configuracion ESLint compartida (monorepo)
// Aplica a: apps/web, apps/api, packages/shared-types
// ============================================================

module.exports = {
  root: true,

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },

  plugins: ['@typescript-eslint'],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier', // SIEMPRE al final: desactiva reglas que chocan con Prettier
  ],

  rules: {
    // --- TypeScript ---
    '@typescript-eslint/no-explicit-any': 'error',        // Prohibido usar 'any'
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }, // _var = ignorado intencionalmente
    ],
    '@typescript-eslint/explicit-function-return-type': 'off', // Demasiado verboso para React
    '@typescript-eslint/no-non-null-assertion': 'warn',    // Cuidado con el operador !

    // --- General ---
    'no-console': ['warn', { allow: ['warn', 'error'] }],  // Solo console.warn y console.error
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
  },

  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.next/',
    'coverage/',
    '*.config.js',
    '*.config.ts',
    'next.config.*',
    'tailwind.config.*',
    'postcss.config.*',
    'jest.config.*',
  ],
};
