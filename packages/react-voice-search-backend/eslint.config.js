import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.node,
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
      },
    },
  },
  {
    files: ["packages/react-voice-search-backend/**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.node,
        process: "readonly", // explicitly add process
        require: "readonly", // explicitly add require
        module: "readonly", // explicitly add module
        __dirname: "readonly",
        __filename: "readonly",
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "script", // or "module" if you use ES modules
      },
    },
  },
]);
