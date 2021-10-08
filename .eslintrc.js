module.exports = {
  extends: '@ethereumjs/eslint-config-defaults',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  env: {
    mocha: true,
  },
  rules: {
    'no-constant-condition': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
  },
  overrides: [
    {
      files: ['test/index.spec.ts'],
      rules: {
        'no-invalid-this': 'off',
        'no-prototype-builtins': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
      },
    },
  ],
}
