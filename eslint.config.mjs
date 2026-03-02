import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    rules: {
      // Keep core hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Downgrade new React 19 strict rules to warnings — these flag
      // existing working patterns (e.g. setState in effects for browser-only
      // initialisation, sub-components defined inside closures).
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/immutability": "warn",

      // The old non-i18n redirect stubs under app/ use <a> tags intentionally
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  {
    ignores: ["scripts/"],
  },
];

export default config;
