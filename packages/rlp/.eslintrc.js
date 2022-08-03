module.exports = {
  extends: '../../config/eslint.js',
  env: {
    mocha: true,
  },
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
  },
}
