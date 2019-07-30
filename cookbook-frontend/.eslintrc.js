module.exports = {
  "env": {
      "browser": true,
      "es6": true,
      "jest/globals": true,
      "cypress/globals": true
  },
  "extends": [
      "eslint:recommended",
      "plugin:react/recommended"
  ],
  "parserOptions": {
      "ecmaFeatures": {
          "jsx": true
      },
      "ecmaVersion": 2018,
      "sourceType": "module"
  },
  "plugins": [
      "react",
      "jest",
      "cypress"
  ],
  "rules": {
      "eqeqeq": "error",
      "indent": ["error", 2, {"SwitchCase": 1}],
      "linebreak-style": ["error", "unix"],
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "quotes": ["error","single"],
      "jsx-quotes": ["error", "prefer-double"],
      "semi": ["error","always"],
      "arrow-spacing": [
          "error", { "before": true, "after": true }
      ],
      "no-console": 0,
      "no-unused-vars": [
          "error", { "ignoreRestSiblings": true }
      ],
      "react/prop-types": 0
  }
};