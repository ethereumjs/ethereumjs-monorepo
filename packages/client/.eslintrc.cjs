module.exports = {
  extends: '../../config/eslint.cjs',
  parserOptions: {
    project: ['./tsconfig.lint.json'],
  },
  overrides: [
    {
      files: ['bin/**.ts', 'test/sim/**.ts', 'examples/**/*.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
