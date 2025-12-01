'use client';

import { useState } from 'react';
import styles from './CardStack.module.css';

interface Card {
  id: number;
  image: string;
  title: string;
  description: string;
}

const cards: Card[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    title: 'Start Your Free Trial',
    description: 'Experience 7 days of unlimited access to our workspace and community',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    title: 'Take a Tour',
    description: 'Visit our space and see how we can help you build without limits',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80',
    title: 'Join the Community',
    description: 'Connect with fellow innovators and grow your network',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    title: 'Book a Workspace',
    description: 'Reserve your spot in our collaborative environment',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
    title: 'Modern Workspace',
    description: 'State-of-the-art facilities designed for productivity',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    title: 'Collaborative Environment',
    description: 'Work alongside innovators and creators',
  },
];

export default function CardStack() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const handleSwipe = (swipeDirection: 'left' | 'right') => {
    setDirection(swipeDirection);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
      setDirection(null);
    }, 300);
  };

  const visibleCards = [
    cards[currentIndex],
    cards[(currentIndex + 1) % cards.length],
    cards[(currentIndex + 2) % cards.length],
  ];

  const getCardTransform = (index: number) => {
    if (index === 0) {
      return 'translateY(0px) scale(1) rotate(0deg)';
    } else if (index === 1) {
      return 'translateY(15px) scale(0.95) rotate(-3deg)';
    } else if (index === 2) {
      return 'translateY(30px) scale(0.9) rotate(3deg)';
    }
    return 'translateY(0px) scale(1)';
  };

  return (
    <div className={styles.container}>
      <div className={styles.stackWrapper}>
        {visibleCards.map((card, index) => (
          <div
            key={`${card.id}-${currentIndex}-${index}`}
            className={`${styles.card} ${
              index === 0 ? styles.topCard : ''
            } ${
              index === 0 && direction === 'left' ? styles.swipeLeft : ''
            } ${
              index === 0 && direction === 'right' ? styles.swipeRight : ''
            }`}
            style={{
              zIndex: visibleCards.length - index,
              transform: getCardTransform(index),
            }}
            onClick={() => index === 0 && handleSwipe('right')}
          >
            <div className={styles.cardImage}>
              <img src={card.image} alt={card.title} />
            </div>
            <div className={styles.cardContent}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
