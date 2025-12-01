# CardStack Component

An interactive card stack component that allows users to swipe through cards by tapping/clicking instead of traditional swiping gestures.

## Features

- Click/tap to advance through cards
- Smooth animations with left/right swipe effects
- Stacked card layout with depth perception
- Navigation buttons for previous/next cards
- Responsive design for mobile and desktop

## Usage

```tsx
import CardStack from '../components/CardStack';

<CardStack />
```

## Styling

The component uses Bricolage Grotesque font for headers and maintains consistent styling with the rest of the application. Card images are displayed with a subtle gradient overlay for better text readability.

## Customization

To modify the cards, edit the `cards` array in `CardStack.tsx`:

```tsx
const cards: Card[] = [
  {
    id: 1,
    image: '/path/to/image.png',
    title: 'Card Title',
    description: 'Card description text',
  },
  // Add more cards...
];
```
