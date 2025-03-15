import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from 'eslint-plugin-import'


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      '**/.eslintrc.cjs',
      '**/.eslintrc.js',
      '**/eslint.config.mjs',
      '**/benchmarks',
      '**/coverage',
      '**/dist/*',
      '**/node_modules',
      '**/recipes/**',
      '**/rlp.cjs',
      '**/scripts/**',
      '**/typedoc.js',
      '**/typedoc.cjs',
      '**/vitest.config.ts',
      '**/vitest.config.browser.mts',
      '**/vitest.config.browser.ts',
      '**/vitest.config.unit.ts',
      '**/vitest.config.coverage.ts',
      '**/vitest.config.coverage.mts',
      '**/vite.*.ts',
      '**/ethereum-tests/**',
      '**/archive/**',
      '**/devnets/**',
      '**/eslint/**',
      '**/lint-staged.config.js',
      '**/tsconfig.lint.json',
      '**/package.json',
    ]
  },
  { files: ["**/*.{js,mjs,cjs,ts,cts,mts}"] },
  { languageOptions: { parser: tseslint.parser, parserOptions: { extraFileExtensions: ['.json'], sourceType: 'module', project: './config/tsconfig.lint.json' } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    rules: {
      'no-restricted-imports': ['error', 'ethereum-cryptography/utils'],
      'no-restricted-syntax': [
        'error',
        {
          selector: "ThrowStatement > NewExpression[callee.name='Error']",
          message: "Throwing default JS Errors is not allowed. Only throw `EthereumJSError` (see the util package)",
        }
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase', 'camelCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-redeclare': ['warn'], // TODO: This generates noise because we redeclare the former enums as types and constants
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/return-await': 'error',
      '@typescript-eslint/strict-boolean-expressions': ['error'],
      '@typescript-eslint/no-use-before-define': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off', // TODO: Decide if this is needed
      '@typescript-eslint/no-unused-expressions': 'off', // TODO: Decide if this is needed
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],
      '@typescript-eslint/ban-ts-comment': 'warn',  // TODO: We should clean up ts comments and replace with ts-expect-error
      '@typescript-eslint/no-empty-object-type': ['error', {
        allowInterfaces: 'with-single-extends',
        allowObjectTypes: 'always'
      }],
      eqeqeq: 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-dupe-class-members': 'off',
      'no-extra-semi': 'off',
      'no-redeclare': 'off',
      'no-unused-vars': 'off',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-const': 'error',
      'import/default': 'off',
      'import/export': 'error',
      'import/exports-last': 'off', // TODO: set to `warn` for fixing and then `error`
      'import/extensions': ['error','ignorePackages'],
      'import/first': 'error',
      'import/group-exports': 'off',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/no-absolute-path': 'error',
      'import/no-anonymous-default-export': 'error',
      'import/no-cycle': 'error', 
      'import/no-default-export': ['error'],
      'import/no-deprecated': 'off', // TODO: set to `warn` for fixing and then `error`
      'import/no-duplicates': 'error',
      'import/no-dynamic-require': 'off',
      'import/no-extraneous-dependencies': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-self-import': 'error',
      'import/no-unresolved': 'off',
      'import/no-unused-modules': 'error',
      'import/no-useless-path-segments': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'import/order': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.cjs','**/*.cts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    }
  },
  {

    files: ['**/test/**/*.ts',],
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['**/examples/**/*.ts', '**/examples/**/*.js', '**/examples/**/*.cjs', '**/benchmarks/*.ts'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-restricted-syntax': 'off'
    },
  },
  {
    files: ['packages/statemanager/src/**', 'packages/vm/src/**',],
    rules: {
      '@typescript-eslint/no-use-before-define': 'off',
      'no-invalid-this': 'off',
    },
  },
  {
    files: ['packages/devp2p/**'],
    rules: {
      'no-undef': 'off', // temporary until fixed: 'NodeJS' is not defined
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['packages/devp2p/src/ext/**'],
    rules: {
      'no-restricted-syntax': 'off'
    },
  },
  {
    files: ['packages/client/src/ext/**'],
    rules: {
      'no-restricted-syntax': 'off'
    },
  },
  {
    files: ['packages/wallet/**'],
    rules: {
      'no-prototype-builtins': 'warn',
      'no-restricted-syntax': 'off'
    },
  },
  {
    files: ['packages/rlp/**'],
    rules: {
      'no-restricted-syntax': 'off'
    },
  },


];