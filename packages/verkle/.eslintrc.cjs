module.exports = {
  extends: '../../config/eslint.cjs',
  parserOptions: {
    project: ['./tsconfig.lint.json'],
  },
  ignorePatterns: ['src/rust-verkle-wasm/rust_verkle_wasm.js', '**/vendor/*.js'],
  overrides: [
    {
      files: ['benchmarks/*.ts', 'examples/*.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
