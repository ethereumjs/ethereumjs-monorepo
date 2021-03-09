module.exports = {
  extends: '@ethereumjs/eslint-config-defaults',
  ignorePatterns: ['examples', 'karma.conf.js', 'test-build'],
  rules: {
    '@typescript-eslint/no-unnecessary-condition': 'off',
    'no-dupe-class-members': 'off',
  },
}
