"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const { height } = useDimensions(containerRef);

  // Close menu when clicking outside (but not on toggle button)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(target)
      ) {
        onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <motion.div
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
      className={styles.mobileMenu}
    >
      <motion.div className={styles.background} variants={sidebarVariants} />
      <Navigation onItemClick={onToggle} />
      <MenuToggle toggle={onToggle} isOpen={isOpen} toggleButtonRef={toggleButtonRef} />
    </motion.div>
  );
}

const navVariants: Variants = {
  open: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const Navigation = ({ onItemClick }: { onItemClick: () => void }) => {
  const menuItems = [
    { label: "Features", href: "#features" },
    { label: "Workspaces", href: "#workspaces" },
    { label: "Membership", href: "#membership" },
    { label: "Community", href: "#community" },
  ];

  return (
    <motion.ul className={styles.list} variants={navVariants}>
      {menuItems.map((item, i) => (
        <MenuItem key={i} item={item} onItemClick={onItemClick} />
      ))}
      <motion.li variants={itemVariants} className={styles.ctaItem}>
        <a href="/booking">
          <button className={styles.ctaButton} onClick={onItemClick}>
            Book a Space
          </button>
        </a>
      </motion.li>
    </motion.ul>
  );
};

const itemVariants: Variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const MenuItem = ({
  item,
  onItemClick,
}: {
  item: { label: string; href: string };
  onItemClick: () => void;
}) => {
  return (
    <motion.li
      className={styles.listItem}
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <a href={item.href} onClick={onItemClick}>
        {item.label}
      </a>
    </motion.li>
  );
};

const sidebarVariants: Variants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at calc(100% - 40px) 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(0px at calc(100% - 40px) 40px)",
    transition: {
      delay: 0.2,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

interface PathProps {
  d?: string;
  variants: Variants;
  transition?: { duration: number };
}

const Path = (props: PathProps) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

const MenuToggle = ({
  toggle,
  isOpen,
  toggleButtonRef,
}: {
  toggle: () => void;
  isOpen: boolean;
  toggleButtonRef: React.RefObject<HTMLButtonElement>;
}) => (
  <button
    ref={toggleButtonRef}
    className={styles.toggleButton}
    onClick={toggle}
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);

// Hook to measure dimensions
const useDimensions = (ref: React.RefObject<HTMLDivElement | null>) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
};
