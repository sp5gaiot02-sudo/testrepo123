# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Stack & Conventions

- **Hard constraint: vanilla HTML, CSS, and JavaScript only.** No frameworks or libraries (React, Vue, Svelte, jQuery, etc.) and no build step (no bundlers, transpilers, compilers, or npm build tooling such as Webpack, Vite, Babel, or TypeScript compilation).
- Write plain `.html`, `.css`, and `.js` files that run directly in the browser with no compilation or packaging step.
- Do not add `package.json`-driven build scripts, module bundlers, or framework dependencies to this project.

## Working conventions

- Before implementing any non-trivial feature, ask clarifying questions about scope, edge cases, and constraints first — don't propose a plan until you've asked.
