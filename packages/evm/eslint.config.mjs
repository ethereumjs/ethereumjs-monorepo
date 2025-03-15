import rootConfig from '../../config/eslint.config.mjs'

export default [
  ...rootConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.lint.json'],
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-use-before-define': 'off',
      'no-invalid-this': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['test/util.ts', 'test/tester/**/*.ts', 'examples/**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]
