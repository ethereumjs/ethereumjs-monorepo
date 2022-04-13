module.exports = {
  extends: '../../config/eslint.js',
  ignorePatterns: ['scripts', 'benchmarks', 'examples', 'karma.conf.js'],
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    'no-invalid-this': 'off',
    'no-restricted-syntax': 'off',
  },
}
