module.exports = {
  extends: "../../config/eslint.js",
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  env: {
    es2020: true,
    mocha: true,
  },
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
  },
}
