# Mobile Menu Component

An animated hamburger menu for mobile devices using Framer Motion.

## Features

- Smooth circular reveal animation
- Staggered menu item animations
- Animated hamburger icon (transforms to X when open)
- Click outside to close
- Prevents body scroll when open
- Responsive (only visible on screens ≤768px)

## Usage

```tsx
import MobileMenu from '@/components/MobileMenu';

const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

<MobileMenu 
  isOpen={isMobileMenuOpen} 
  onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
/>
```

## Customization

Edit `MobileMenu.module.css` to customize:
- Background gradient colors
- Menu width
- Animation timing
- Button position
- Link styles

Edit `MobileMenu.tsx` to customize:
- Menu items (in the `Navigation` component)
- Animation variants
- Click behavior
