module.exports = {
  extends: '../../config/eslint.js',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  overrides: [
    {
      files: ['test/index.spec.ts'],
      rules: {
        'github/array-foreach': 'warn',
        'no-prototype-builtins': 'warn',
      },
    },
  ],
}
