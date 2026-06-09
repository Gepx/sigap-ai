"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";

export const ScrollFadeAnimation = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "end 5%"],
  });

  // Fade in as element enters the viewport from bottom, and fade out as it leaves from top
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  
  // Add a subtle scale effect for depth
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.95, 1, 1, 0.95]);

  return (
    <motion.div ref={ref} style={{ opacity, scale }}>
      {children}
    </motion.div>
  );
};
