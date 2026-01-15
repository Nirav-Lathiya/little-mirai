# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-01-15

### Added
- **Excellent Framer Motion Animations**: Comprehensive animation system throughout the landing page
- **Hero Section Animations**: Staggered text reveals, floating baby icons (Baby, Sparkles, Heart), smooth entrance effects
- **Interactive Features Section**: Scroll-triggered card animations with playful hover effects and icon rotations
- **Product Grid Animations**: Staggered product card entrance, enhanced hover effects with image zoom and wishlist animations
- **Newsletter Section Animations**: Interactive form elements with focus animations and button hover effects
- **Performance-Optimized Animations**: Framer Motion with proper viewport detection and reduced motion support

### Enhanced
- **User Experience**: Smooth, kid-friendly animations that engage users without being overwhelming
- **Visual Appeal**: Floating background elements and playful motion design
- **Accessibility**: Respects user motion preferences and maintains keyboard navigation
- **Mobile Experience**: Optimized animations for touch devices and smaller screens

### Technical Improvements
- Framer Motion integration for smooth, hardware-accelerated animations
- Scroll-triggered animations using intersection observer
- Staggered animation sequences for visual hierarchy
- Hover and tap animations for interactive elements
- Performance monitoring and optimization

### Dependencies
- Added: `framer-motion` for advanced animations

## [0.1.0] - 2026-01-15

### Added
- Initial release of Little Mirai e-commerce site for baby clothing
- Complete Next.js 16.1.1 application with TypeScript
- Product catalog with baby clothing items (booties, bibs, socks, hats, jhablas)
- Shopping cart functionality with React Context
- Product filtering system with categories, sizes, age groups, and price ranges
- Mobile-responsive design with Tailwind CSS
- shadcn/ui components integration
- Dark mode support with next-themes
- Checkout page implementation
- Product modal with size and color selection
- Industry-standard UI patterns following ASOS, H&M, Zara designs

### Technical Features
- Responsive grid layout for product display
- Accordion-style filter sidebar (desktop) and slide-out sheet (mobile)
- Sorting options (newest, price, rating, popularity)
- Load more functionality for pagination
- Form validation and error handling
- Accessibility features with ARIA labels
- Performance optimizations with Next.js Image component

### Dependencies
- Next.js 16.1.1 with Turbopack
- React 19.2.3
- Tailwind CSS 4.0
- shadcn/ui components
- Radix UI primitives
- Lucide React icons
- TypeScript 5.0

### Development
- ESLint configuration
- TypeScript strict mode enabled
- Git versioning with semantic tags

[0.2.0]: https://github.com/Nirav-Lathiya/little-mirai/releases/tag/v0.2.0
[0.1.0]: https://github.com/Nirav-Lathiya/little-mirai/releases/tag/v0.1.0