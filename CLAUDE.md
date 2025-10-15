# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blockcerts Verifier is a standalone universal Web Component for viewing and verifying Blockcerts credentials. Built with Polymer 3 and LitElement, it provides a complete solution for certificate verification on blockchain networks.

## Build and Development Commands

### Development
```bash
npm run start
```
Starts the development server at http://localhost:8081/demo/ with live reload, SASS compilation in watch mode, and the mock server for testing.

### Building
```bash
npm run build              # Production build (outputs to dist/)
npm run build:sanitizer    # Build the XSS sanitizer
```

### Testing
```bash
npm test                   # Run application tests (alias for test:application)
npm run test:application   # Run vitest unit tests
npm run test:application:watch  # Run tests in watch mode
npm run test:e2e           # Run end-to-end tests with Web Test Runner
npm run test:coverage      # Generate coverage report
```

**Important**: Application tests require the mock server to be running. Use `npm run start` or `npm run start:mock-server` before running tests.

### Running a Single Test
```bash
npx vitest run test/application/path/to/test.spec.ts
```

### Linting
```bash
npm run lint               # Run all linters
npm run lint:ts            # Lint TypeScript files
npm run lint:styles        # Lint SCSS files
```

### Styles
```bash
npm run styles:compile              # Compile SCSS to JS
npm run styles:compile:watch        # Compile SCSS in watch mode
```

## Architecture

### State Management (Redux)

The application uses Redux with a custom architecture inspired by React patterns:

- **Store**: Single source of truth (`src/store/`)
- **Actions**: Pure action creators (`src/actions/`)
- **Reducers**: Pure state modification functions (`src/reducers/`)
- **Selectors**: State reading functions (`src/selectors/`)

### Component Architecture

The codebase follows the **Container/Component** pattern (see ADR-003):

1. **Component**: Pure presentational component that receives props
2. **Container**: Wrapper that connects the component to Redux store
3. **Connector**: Custom implementation that maps state/dispatch to props

Example structure:
```
components/
  atoms/MyComponent/
    MyComponent.ts        # Pure component
    MyComponentContainer.ts  # Redux connection
```

Components are organized using Atomic Design:
- **atoms/**: Basic building blocks (buttons, inputs, etc.)
- **molecules/**: Simple component groups
- **organisms/**: Complex component compositions

### Domain Layer

The **domain layer** (`src/domain/`) handles all business logic and external communication, isolated from state and view concerns (see ADR-004):

- Organized by concern (e.g., `certificates/`, `events/`)
- Each concern has `useCases/` for business operations
- Domain methods are called as: `domain.concern.usecase()`
- All domain use cases must be tested

### CSS Architecture

Following ITCSS methodology with component-scoped styles (see ADR-002):

- Component styles: `src/components/**/[component-name].scss`
- Shared styles: `src/shared-styles/` (organized by ITCSS layers)
- SCSS files are transpiled to importable JS modules via `wc-sass-render`

To use shared styles in a component:
```scss
@import '../../../shared-styles/objects.text';
```

**Note**: The SASS watcher doesn't observe shared-styles changes; manually recompile consumer stylesheets when needed.

### TypeScript Configuration

- Base path: `src/`
- Target: ES6
- Module: ESNext
- Decorators enabled for Polymer/LitElement

## Key Patterns

### Creating a Connected Component

**For pure function components:**
```typescript
// Component
const MyComponent = ({ onAction = () => {} } = {}) => {
  return html`<button on-click='${onAction}'>Click</button>`;
};

// Container
import connector from '../../../store/connector';
import { myAction } from '../../../actions/myAction';

const mapDispatchToProps = { onAction: myAction };
const MyComponentContainer = connector(MyComponent, { mapDispatchToProps });
export { MyComponentContainer };
```

**For class components (LitElement):**
```typescript
// Component
class MyComponent extends LitElement {
  static get properties() {
    return { onClick: Function };
  }
  _render(_props) {
    return html`<button on-click='${_props.onClick}'>Click</button>`;
  }
}
window.customElements.define('my-component-raw', MyComponent);

// Wrapper function
function MyComponentWrapper(props) {
  return html`<my-component-raw onClick='${props.onClick}'></my-component-raw>`;
}
export { MyComponentWrapper as MyComponent };

// Container
const mapDispatchToProps = { onClick: myAction };
const MyComponentContainer = connector(MyComponent, { mapDispatchToProps });
```

### Mapping State to Props
```typescript
import connector from '../../../store/connector';
import { getMyState } from '../../../selectors/myState';

const mapStateToProps = (state) => ({
  myProp: getMyState(state)
});

const MyComponentContainer = connector(MyComponent, { mapStateToProps });
```

## Sanitizer

The sanitizer protects against XSS attacks in certificates. To modify:

1. Edit `sanitizer/index.js`
2. Whitelist CSS properties in `whiteListedCssProperties`
3. Run `npm run build:sanitizer` to regenerate `sanitizer.js`
4. Use `npm run build:sanitizer -- -w` for watch mode

## Test Structure

- **Application tests**: `test/application/` - Unit tests using Vitest
- **E2E tests**: `test/e2e/` - Integration tests with Web Test Runner
- **Fixtures**: `test/fixtures/` - Test certificates
- **Mock server**: `test/mock-server/` - Express server for development

## Custom Blockchain Explorers

Pass custom blockchain explorer configuration via the `explorerAPIs` property (not attribute):

```javascript
const explorer = {
  parsingFunction: function() { /* ... */ },
  serviceURL: 'your-explorer-service.url',
  priority: 0 | 1
};

document.addEventListener('DOMContentLoaded', () => {
  const bv = document.querySelector('blockcerts-verifier');
  bv.explorerAPIs = [explorer];
});
```

## Event API

The component emits events on the `window` object:
- `certificate-load`: When a certificate is loaded
- `certificate-verify`: When verification starts
- `certificate-share`: When a social share link is clicked

See `demo/events.html` for implementation examples.

## Important Notes

- Node version: >=20.0.0 (see `.nvmrc`)
- Main entry point: `src/blockcerts-verifier/index.ts`
- Built output: `dist/main.js`
- The component is published as `@blockcerts/blockcerts-verifier`
- Semantic release is configured for automated versioning
