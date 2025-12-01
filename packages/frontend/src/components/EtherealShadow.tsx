'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface EtherealShadowProps {
  children: ReactNode;
  className?: string;
}

export default function EtherealShadow({ children, className = '' }: EtherealShadowProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Animated shadow layers */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          boxShadow: [
            '0 0 60px 30px rgba(139, 92, 246, 0.3)',
            '0 0 80px 40px rgba(59, 130, 246, 0.3)',
            '0 0 60px 30px rgba(139, 92, 246, 0.3)',
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          borderRadius: '24px',
          filter: 'blur(40px)',
        }}
      />
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          boxShadow: [
            '0 0 80px 40px rgba(59, 130, 246, 0.2)',
            '0 0 100px 50px rgba(139, 92, 246, 0.2)',
            '0 0 80px 40px rgba(59, 130, 246, 0.2)',
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        style={{
          borderRadius: '24px',
          filter: 'blur(60px)',
        }}
      />
      {children}
    </div>
  );
}
