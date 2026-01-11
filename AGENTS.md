# AGENTS.md - Coding Guidelines for Little Mirai E-commerce Project

## Project Overview
This is a Next.js 16.1.1 e-commerce application for baby clothing, built with TypeScript, Tailwind CSS, and shadcn/ui components. It features a product catalog, shopping cart with React Context, and responsive design.

## Build/Lint/Test Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint for code linting
```

### Testing
**Note**: No test framework is currently configured. To add testing:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
# Then add test scripts to package.json
```

For running a single test (once configured):
```bash
npm test -- --testNamePattern="test name"
# or
npx jest --testNamePattern="test name"
```

## Code Style Guidelines

### TypeScript Usage
- **Strict TypeScript**: Always use TypeScript with strict mode enabled
- **Type Definitions**: Define interfaces for all component props, state, and data structures
- **Avoid `any`**: Use proper types; prefer union types over `any`
- **Generic Types**: Use generics for reusable components (e.g., `<T extends object>`)

### Component Structure
- **Functional Components**: Use function components with hooks
- **Naming**: PascalCase for components (e.g., `ProductCard`, `ShoppingCart`)
- **File Naming**: kebab-case for files (e.g., `product-modal.tsx`, `cart-context.tsx`)
- **Export**: Default export for components, named exports for utilities

### Imports and Organization
```typescript
// Group imports in this order:
import React from 'react'                    // React imports
import { useState } from 'react'

import { Button } from '@/components/ui/button'  // Third-party/UI libraries
import { ShoppingCart } from 'lucide-react'

import { useCart } from '@/context/CartContext'  // Local imports
import { babyProducts } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
```

### Styling with Tailwind CSS
- **Utility-First**: Use Tailwind classes for styling
- **Responsive Design**: Use responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- **Dark Mode**: Support dark mode with `dark:` prefixes
- **Custom Classes**: Define reusable classes in `globals.css` for complex styles
- **Consistent Spacing**: Use Tailwind spacing scale (e.g., `p-4`, `m-2`, `gap-3`)

### State Management
- **React Context**: Use for global state (e.g., cart, user auth)
- **Local State**: Use `useState` for component-specific state
- **Reducers**: Use `useReducer` for complex state logic
- **Effects**: Use `useEffect` for side effects; include cleanup

### Error Handling
- **Try-Catch**: Wrap async operations in try-catch blocks
- **User-Friendly Messages**: Display helpful error messages to users
- **Fallback UI**: Provide loading and error states
- **Console Logging**: Use console.error for debugging, remove in production

### Naming Conventions
- **Variables/Functions**: camelCase (e.g., `handleAddToCart`, `selectedSize`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_QUANTITY`)
- **Types/Interfaces**: PascalCase (e.g., `CartItem`, `ProductProps`)
- **Files/Directories**: kebab-case (e.g., `shopping-cart.tsx`, `product-details/`)

### React Best Practices
- **Hooks Rules**: Only call hooks at the top level, not in loops/conditions
- **Memoization**: Use `useMemo` for expensive computations, `useCallback` for functions
- **Key Props**: Always provide unique `key` props for list items
- **Accessibility**: Use semantic HTML, ARIA attributes, and screen reader support
- **Performance**: Lazy load components with `React.lazy()`, optimize images

### API and Data Handling
- **Data Fetching**: Use Next.js `fetch` in server components, or React Query/SWR for client
- **Type Safety**: Type all API responses and requests
- **Error Boundaries**: Wrap components that might throw errors
- **Loading States**: Show skeletons/loaders during data fetching

### File Organization
```
src/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── product/[id]/   # Dynamic product pages
├── components/         # Reusable components
│   ├── ui/            # shadcn/ui components
│   └── ProductModal.tsx
├── context/            # React contexts
├── lib/               # Utilities and data
│   ├── data.ts        # Product data
│   └── utils.ts       # Helper functions
└── hooks/             # Custom hooks (if any)
```

### Git Workflow
- **Branch Naming**: `feature/feature-name`, `fix/bug-name`, `refactor/component-name`
- **Commit Messages**: Use conventional commits (e.g., `feat: add shopping cart`, `fix: modal width issue`)
- **PR Reviews**: Require code review for all changes
- **Testing**: Ensure linting passes before committing

### Accessibility (a11y)
- **Semantic HTML**: Use proper headings, lists, buttons
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Screen Readers**: Add `aria-label`, `alt` text, and skip links
- **Color Contrast**: Maintain WCAG AA compliance
- **Focus Management**: Proper focus indicators and management

### Security Considerations
- **Input Validation**: Validate and sanitize all user inputs
- **XSS Prevention**: Use Next.js built-in protections
- **Secure Headers**: Configure appropriate security headers
- **API Security**: Use HTTPS, validate tokens, rate limiting

### Performance Optimization
- **Image Optimization**: Use Next.js `Image` component with proper sizing
- **Code Splitting**: Lazy load routes and heavy components
- **Bundle Analysis**: Monitor bundle size and optimize
- **Caching**: Implement appropriate caching strategies

### Documentation
- **Component Docs**: Add JSDoc comments for complex components
- **README Updates**: Keep README.md current with setup and usage instructions
- **Code Comments**: Comment complex logic, not obvious code
- **TypeScript Types**: Self-documenting with descriptive type names

## shadcn/ui Component Usage
- **Consistent Theming**: Use design tokens from `globals.css`
- **Override Classes**: Use `cn()` utility for conditional styling
- **Custom Variants**: Extend components with custom variants when needed
- **Accessibility**: shadcn components are built with a11y in mind

## Environment Variables
- **Naming**: `NEXT_PUBLIC_` for client-side, regular for server-side
- **Security**: Never commit secrets to version control
- **Documentation**: Document required environment variables

## Deployment
- **Vercel**: Optimized for Next.js deployment
- **Build Optimization**: Ensure production builds are optimized
- **CDN**: Use for static assets
- **Monitoring**: Set up error tracking and performance monitoring

Remember: Code should be maintainable, readable, and follow React/Next.js best practices. Prioritize user experience and performance in all implementations.