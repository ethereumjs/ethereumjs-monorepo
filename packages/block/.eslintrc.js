module.exports = {
  extends: "@ethereumjs/eslint-config-defaults",
  ignorePatterns: ["test-build", "karma.conf.js"],
  rules: {
    "@typescript-eslint/no-unnecessary-condition": "off"
  }
}
