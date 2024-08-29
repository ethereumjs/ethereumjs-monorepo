module.exports = {
    extends: '../../config/eslint.cjs',
    parserOptions: {
      project: ['./tsconfig.lint.json'],
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