"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "motion/react";

export const HeroScrollAnimation = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { scrollY } = useScroll();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const rotateX = useTransform(
    scrollY,
    [0, 400],
    [isMobile ? "15deg" : "20deg", "0deg"],
  );

  const scale = useTransform(scrollY, [0, 400], [isMobile ? 1.05 : 1.05, 1]);

  const translateY = useTransform(scrollY, [0, 400], [0, 0]);

  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="relative flex w-full items-center justify-center p-4 md:p-8 [perspective:1000px]">
      <motion.div
        style={{
          rotateX,
          scale,
          y: translateY,
          transformOrigin: "top center",
        }}
        className="w-full [transform-style:preserve-3d]"
      >
        {children}

        {/* Bottom Opacity Fade (overlay mask) */}
        <motion.div
          style={{ opacity }}
          className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-t from-[#F4F9F6] via-transparent to-transparent"
        />
      </motion.div>
    </div>
  );
};
