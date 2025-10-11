const { defineConfig } = require("eslint/config");
const globals = require("globals");
const jestPlugin = require("eslint-plugin-jest");
const js = require("@eslint/js");

module.exports = defineConfig([
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.commonjs,
        ...globals.node,
        ...jestPlugin.environments.globals.globals,
      },
    },

    plugins: {
      jest: {
        name: "jest",
        rules: jestPlugin.rules,
      },
    },

    rules: {
      "jest/no-disabled-tests": "off",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": ["error", { maxArgs: 2 }],
    },
  },
]);
