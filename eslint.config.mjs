import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    // Browser code, but allow guarded `process` checks (e.g. NODE_ENV) without no-undef.
    languageOptions: { globals: { ...globals.browser, process: "readonly" } },
  },
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: { ...globals.jest, ...globals.node, ...globals.browser },
    },
  },
  {
    files: ["webpack*.js", "webpack.*.js", "jest.config.js", "babel.config.js"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
];
