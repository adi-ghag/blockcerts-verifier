# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run start` - Start development server with hot reload, style compilation, and mock server at http://localhost:8081/demo/
- `npm run styles:compile` - Compile SASS files to TypeScript components
- `npm run styles:compile:watch` - Watch mode for SASS compilation

### Building
- `npm run build` - Build production bundle to `dist/` directory
- `npm run build:sanitizer` - Build the XSS sanitizer overlay

### Testing
- `npm run test` - Run all tests (alias for test:application)
- `npm run test:application` - Run unit tests with Vitest
- `npm run test:application:watch` - Run unit tests in watch mode
- `npm run test:e2e` - Run end-to-end tests with Web Test Runner
- `npm run test:coverage` - Run tests with coverage report

### Linting
- `npm run lint` - Run both TypeScript and style linting
- `npm run lint:ts` - Run ESLint on TypeScript files
- `npm run lint:styles` - Run Stylelint on SCSS files

## Architecture

This is a Polymer 3/LitElement web component for verifying blockchain certificates (Blockcerts). The architecture follows a Redux pattern with TypeScript.

### Key Components

**Main Entry Point:** `src/blockcerts-verifier/index.ts` - Exports the main component
**Core Component:** `src/blockcerts-verifier/BlockcertsVerifier.ts` - Main LitElement component with three display modes (card, full, fullscreen)

### State Management
- **Redux Store:** `src/store/index.ts` - Configured with thunk middleware and optional logging
- **Reducers:** `src/reducers/index.ts` - Central reducer handling certificate loading, verification, and UI state
- **Actions:** `src/actions/` - Redux actions for certificate operations and verification workflow

### Component Structure (Atomic Design Pattern)
- **Atoms:** Basic UI elements (buttons, inputs, error messages)
- **Molecules:** Combined atoms (verification steps, modals, metadata)
- **Organisms:** Complex components (certificate displays, action menus, full certificate views)

### Key Architecture Patterns

**SCSS to TypeScript:** SASS files are compiled to TypeScript CSS-in-JS modules that can be imported and used in components.

**Domain Composition:** `src/domain/compose.ts` creates a proxy-enhanced service container for dependency injection.

**Container Pattern:** Components often have Container counterparts that connect to the Redux store.

**Verification Engine:** Uses `@adityaghag/cert-verifier-js` library for blockchain certificate verification.

### Important Directories
- `src/components/` - UI components organized by atomic design principles
- `src/constants/` - Application constants (themes, display modes, verification statuses)
- `src/helpers/` - Utility functions
- `src/i18n/` - Internationalization files
- `src/selectors/` - Redux state selectors
- `src/shared-styles/` - SCSS shared styles following ITCSS methodology

### API Configuration
The component accepts various props through attributes or properties, including custom blockchain explorer APIs via the `explorerAPIs` property.

### Sanitization
The project includes a custom XSS sanitizer overlay built on the `xss` library located in `sanitizer/` for protecting against malicious certificate content.