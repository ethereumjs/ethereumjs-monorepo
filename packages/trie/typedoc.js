module.exports = {
  extends: '../../config/typedoc.js',
  exclude: [
    "src/**/!(secure|checkpointTrie|baseTrie|walkController).ts",
    "test/**/*.ts"
  ],
}