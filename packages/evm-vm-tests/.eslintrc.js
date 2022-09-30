module.exports = {
  extends: '../../config/eslint.js',
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    'no-invalid-this': 'off',
    'no-restricted-syntax': 'off',
  },
  overrides: [
    {
      files: ['tests/**/*.ts'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['./tests/retesteth/clients/ethereumjs/genesis/correctMiningReward.json'],
      rules: {
        'no-dupe-keys': 'off',
      },
    },
  ],
}
