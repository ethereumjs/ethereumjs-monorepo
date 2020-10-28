module.exports = {
  extends: "@ethereumjs/eslint-config-defaults",
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.browser.json', './tsconfig.eslint.json']
  },
  rules: {
    // Many methods have been sketched in as stubs & their params trigger this.
    // Duplicates the (more tolerant) @typescript-eslint/no-unused-vars
    'no-unused-vars': 'off'
  },
  overrides: [
    {
      files: ['test/**/*.ts'],
      rules: {
        'implicit-dependencies/no-implicit': [
          'error',
          { peer: false, dev: true, optional: false },
        ],
      },
    },
  ],
}
