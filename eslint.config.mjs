import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Static export output — Next emits to ./dist (see next.config.ts).
    "dist/**",
    // Legacy Vite codebase kept for reference; excluded from tsconfig too.
    "backup-vite/**",
    // Git worktrees created during development — not part of the project.
    ".worktrees/**",
  ]),
]);

export default eslintConfig;
