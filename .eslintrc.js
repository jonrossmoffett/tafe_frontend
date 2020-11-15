module.exports = {
    "settings": {
      "import/resolver": "webpack"
    },
    parserOptions: {
      parser: "babel-eslint"
    },
    extends: [
      "eslint:recommended",
      "plugin:vue/recommended"
    ],
    "env": {
      "browser": true,
      "node": true
    },
    rules: {}
  }