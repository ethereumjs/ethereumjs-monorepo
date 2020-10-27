module.exports = {
  extends: '@ethereumjs/eslint-config-defaults',
  parserOptions: {
    project: ['./tsconfig.json']
  },
  rules: {
    '@typescript-eslint/no-floating-promises': 'off',
    'no-redeclare': 'off'
  }
}
