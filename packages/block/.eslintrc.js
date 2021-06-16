module.exports = {
  extends: "../../config/eslint.js",
  ignorePatterns: ["test-build", "karma.conf.js"],
  rules: {
    "@typescript-eslint/no-unnecessary-condition": "off"
  }
}
