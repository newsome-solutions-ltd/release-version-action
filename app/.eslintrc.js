module.exports = {
    "env": {
        "commonjs": true,
        "es2021": true,
        "jest/globals": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": [
            "error",
            {
              "maxArgs": 2
            }
          ]
    },
    "plugins": ["jest"]
}
