module.exports = {
  extends: '../../config/eslint.js',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  overrides: [
    {
      files: ['test/index.spec.ts'],
      rules: {
        '@typescript-eslint/no-invalid-this': 'off',
        'github/array-foreach': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        'no-prototype-builtins': 'off',
      },
    },
  ],
  env: {
    mocha: true,
  },
}
