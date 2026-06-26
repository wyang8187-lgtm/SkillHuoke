import nextTs from 'eslint-config-next/typescript';
import nextVitals from 'eslint-config-next/core-web-vitals';
import { defineConfig, globalIgnores } from 'eslint/config';

const syntaxRules = [
  {
    selector: 'JSXOpeningElement[name.name="head"]',
    message: 'Do not use a raw head tag. Prefer Next.js metadata and supported resource APIs.',
  },
];

const nextConfigRestrictedSyntaxRules = [
  {
    selector: 'Property[key.name=/^(root|outputFileTracingRoot)$/] > Literal[value=/^\\//]',
    message: 'Do not use a hard-coded absolute path in next.config. Use path.resolve, import.meta.dirname, or process.cwd().',
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'import/no-cycle': ['error', { ignoreExternal: true }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'react/no-unescaped-entities': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'no-restricted-syntax': ['error', ...syntaxRules],
    },
  },
  {
    files: ['next.config.ts'],
    rules: {
      'no-restricted-syntax': ['error', ...nextConfigRestrictedSyntaxRules],
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'server.js',
    'dist/**',
    'scripts/**/*.js',
  ]),
]);

export default eslintConfig;
