module.exports = {
  extends: '../../config/eslint.js',
  ignorePatterns: ['scripts', 'benchmarks', 'examples', 'karma.conf.js'],
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    'no-invalid-this': 'off',
    'no-restricted-syntax': 'off',
    'no-unused-vars': ["error", { "argsIgnorePattern": "^_" }]
  },
  overrides: [
    {
      files: ['tests/**/*.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
