module.exports = {
  extends: '../../config/eslint.cjs',
  parserOptions: {
    project: ['./tsconfig.lint.json'],
  },
  rules: {
    'no-redeclare': 'off',
    'no-undef': 'off', // temporary until fixed: 'NodeJS' is not defined
  },
  overrides: [
    {
      files: ['examples/**/*'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
}
