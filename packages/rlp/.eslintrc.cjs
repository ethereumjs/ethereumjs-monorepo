module.exports = {
  extends: '../../config/eslint.cjs',
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
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
