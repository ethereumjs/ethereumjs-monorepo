module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'implicit-dependencies', 'prettier'],
  env: {
    es2020: true,
    node: true,
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    'prettier.config.js',
    'typedoc.js',
    'karma.conf.js',
  ],
  extends: ['typestrict', 'eslint:recommended'],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'implicit-dependencies/no-implicit': ['error', { peer: true, dev: true, optional: true }],
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase', 'camelCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-unnecessary-condition': 'off',
    'no-dupe-class-members': 'off',
    'no-extra-semi': 'off',
    'prettier/prettier': 'error',
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': ['error'],
    '@typescript-eslint/restrict-plus-operands': 'off',
  },
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
}
