module.exports = {
  extends: "@ethereumjs/eslint-config-defaults",
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.browser.json', './tsconfig.eslint.json']
  }
}
