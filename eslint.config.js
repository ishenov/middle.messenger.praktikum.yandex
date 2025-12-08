import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        XMLHttpRequest: 'readonly',
        URL: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      import: importPlugin,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/ban-ts-comment': [
        'off',
        {
          'ts-expect-error': false,
          'ts-ignore': false,
          'ts-nocheck': false,
          'ts-check': false,
        },
      ],

      'import/no-unresolved': 'off',
      'import/no-duplicates': 'error',
      'import/no-unused-modules': 'warn',

      // General rules
      'no-undef': 'off',
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'prefer-promise-reject-errors': 'error',
      'require-await': 'off',
      'no-return-await': 'error',
      'no-throw-literal': 'error',
      'prefer-named-capture-group': 'error',
      'no-useless-catch': 'error',
      'no-useless-return': 'error',
      'prefer-destructuring': ['error', { object: true, array: false }],
      'no-param-reassign': 'error',
      'no-underscore-dangle': 'off',
      'camelcase': 'off',
      'no-magic-numbers': ['warn', { ignore: [-1, 0, 1, 2] }],
      'complexity': ['warn', 10],
      'max-depth': ['warn', 4],
      'max-lines': ['warn', 300],
      'max-lines-per-function': ['warn', 50],
      'max-params': ['warn', 4],
      'max-statements': ['warn', 20],
    },
  },

  {
    ignores: [
      'dist/',
      'node_modules/',
      '*.js',
      '*.cjs',
      '*.hbs',
      '*.hbs?raw',
    ],
  },
];
