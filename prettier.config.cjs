/** @type {import("prettier").Config} */
module.exports = {
  arrowParens: "always",
  printWidth: 100,
  singleQuote: false,
  jsxSingleQuote: false,
  bracketSpacing: false,
  semi: true,
  trailingComma: "all",
  tabWidth: 2,
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  tailwindConfig: "./packages/config/tailwind/index.ts",
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@echo-webkom/(.*)$",
    "",
    "^@/(.*)$",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
};
