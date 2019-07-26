module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true,
        "jest": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "eqeqeq": "error",
        "indent": ["error", 2],
        "linebreak-style": ["error", "unix"],
        "no-trailing-spaces": "error",
        "object-curly-spacing": ["error", "always"],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "no-console": 0
    }
};