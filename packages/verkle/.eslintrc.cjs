module.exports = {
  extends: '../../config/eslint.cjs',
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.benchmarks.json'],
  },
  ignorePatterns: ['src/rust-verkle-wasm/rust_verkle_wasm.js', '**/vendor/*.js'],
  overrides: [
    {
      files: ['benchmarks/*.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
