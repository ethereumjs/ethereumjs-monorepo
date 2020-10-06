module.exports = {
  extends: "@ethereumjs/eslint-config-defaults",
  ignorePatterns: ["tests", "scripts", "examples", "karma.conf.js"],
  rules: {
    'no-restricted-syntax': 'off',
    'no-invalid-this': 'off',
    'no-async-promise-executor': 'off',
    '@typescript-eslint/await-thenable': 'off'
  }
}
