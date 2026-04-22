"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SplashPage() {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(() => router.push("/home"), 700);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{
            position: "relative",
            width: "100%",
            minHeight: "100vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#F5EDE4",
          }}
        >
          {/* Watercolor Background (consistency with home) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              background: "#FFFDF9",
              overflow: "hidden",
            }}
          >
            {/* Soft Watercolor washes */}
            <div
              style={{
                position: "absolute",
                top: "-5%",
                right: "-5%",
                width: "90%",
                height: "90%",
                background: "radial-gradient(ellipse at top right, rgba(246,220,203,0.25) 0%, transparent 60%)",
                filter: "blur(40px)",
              }}
            />
            
            {/* Re-introduced Soft Leaf Branch (Bottom Left) */}
            <div
              style={{
                position: "absolute",
                bottom: "-2%",
                left: "-2%",
                width: "clamp(250px, 45vw, 400px)",
                opacity: 0.3,
                filter: "blur(0.5px)",
              }}
            >
              <svg viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M30 380C60 340 120 280 150 220"
                  stroke="rgba(182,93,55,0.1)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
                {[
                  "M30 380C25 350 20 320 20 310C35 325 55 350 30 380Z",
                  "M45 350C65 330 85 315 95 305C85 305 65 320 45 350Z",
                  "M80 310C100 290 120 275 130 265C120 265 100 280 80 310Z",
                  "M70 340C50 320 35 300 30 290C45 300 65 325 70 340Z",
                ].map((d, i) => (
                  <path key={i} d={d} fill="rgba(182,93,55,0.1)" stroke="rgba(182,93,55,0.05)" strokeWidth="0.3" />
                ))}
              </svg>
            </div>
          </div>

          {/* Subtle top vignette so text reads clearly */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(245,237,228,0.38) 0%, rgba(245,237,228,0.10) 40%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Centered text block */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              textAlign: "center",
              padding: "0 24px",
              marginTop: "-40px",
            }}
          >
            {/* WE INVITE YOU */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{
                fontFamily: "Cormorant SC, serif",
                fontSize: 11,
                letterSpacing: "0.38em",
                color: "#7A5442",
                marginBottom: 4,
              }}
            >
              WE INVITE YOU
            </motion.p>

            {/* John & Julie — script */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 1, ease: "easeOut" }}
              style={{
                fontFamily: "'Abramo', 'Great Vibes', cursive",
                fontSize: 76,
                color: "#C25A20",
                lineHeight: 1.05,
              }}
            >
              John &amp; Julie
            </motion.div>

            {/* Thin divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              style={{
                height: 1,
                width: 120,
                background: "linear-gradient(to right, transparent, #C9A96E, transparent)",
                margin: "6px 0",
              }}
            />

            {/* 05 · 16 · 2026 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              style={{
                fontFamily: "Cormorant SC, serif",
                fontSize: 14,
                letterSpacing: "0.3em",
                color: "#5C3D2E",
              }}
            >
              05 · 16 · 2026
            </motion.p>

            {/* Davao City, Philippines */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.7 }}
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontStyle: "italic",
                fontSize: 14,
                color: "#7A5442",
                marginTop: 2,
              }}
            >
              Davao City, Philippines
            </motion.p>
          </div>

          {/* SCROLL button at bottom */}
          <motion.button
            id="splash-enter-btn"
            onClick={handleEnter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: "absolute",
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                fontFamily: "Cormorant SC, serif",
                fontSize: 11,
                letterSpacing: "0.38em",
                color: "#7A5442",
              }}
            >
              SCROLL
            </span>
            {/* Animated chevron */}
            <motion.svg
              width="18"
              height="10"
              viewBox="0 0 18 10"
              fill="none"
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            >
              <path
                d="M1 1L9 9L17 1"
                stroke="#C9A96E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
