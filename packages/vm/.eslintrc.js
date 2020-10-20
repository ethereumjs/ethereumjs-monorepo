module.exports = {
  extends: "@ethereumjs/eslint-config-defaults",
  ignorePatterns: ["tests", "scripts", "examples", "karma.conf.js"],
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    'no-async-promise-executor': 'off',
    'no-invalid-this': 'off',
    'no-restricted-syntax': 'off',
    'no-undef': 'off',
  }
}
