module.exports = {
  extends: "@ethereumjs/eslint-config-defaults",
  ignorePatterns: ["scripts", "examples", "karma.conf.js"],
  rules: {
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-unnecessary-condition": "off",
    "no-invalid-this": "off",
    "no-restricted-syntax": "off",
    "no-console": "off" // supress the console.log warnings in ./tests/
  }
}
