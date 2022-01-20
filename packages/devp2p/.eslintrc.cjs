module.exports = {
  extends: '../../config/eslint.cjs',
  parserOptions: {
    project: ['./tsconfig.json']
  },
  rules: {
    '@typescript-eslint/no-floating-promises': 'off',
    'no-redeclare': 'off',
    'no-undef': 'off' // temporary until fixed: 'NodeJS' is not defined
  }
}
