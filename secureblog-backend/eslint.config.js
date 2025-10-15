const globals = require("globals");
const js = require("@eslint/js");
const jest = require("eslint-plugin-jest");

module.exports = [
  // 1. Apply recommended ESLint rules
  js.configs.recommended,

  // 2. Configure Node.js and Jest globals
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },

  // 3. Apply Jest plugin rules
  jest.configs["flat/recommended"],

  // 4. Custom rules and overrides
  {
    rules: {
      "no-unused-vars": "warn",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
    },
  },

  // 5. Ignore patterns
  {
    ignores: [
      "node_modules/",
      "coverage/",
      "ssl/",
      "dist/"
    ],
  },
];