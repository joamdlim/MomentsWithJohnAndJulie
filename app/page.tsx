"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MemoriesSection } from "@/components/MemoriesSection";
import { BottomNav } from "@/components/BottomNav";
import { AuthModal } from "@/components/AuthModal";
import { getCurrentUserAction, logoutAction } from "@/app/actions/auth";

function SplashContent() {
  const [showMain, setShowMain] = useState(false);
  const [user, setUser] = useState<{id: string, username: string} | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasCheckedUser, setHasCheckedUser] = useState(false);
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as "top" | "folders" | "mine") || "folders";

  useEffect(() => {
    getCurrentUserAction().then((u) => {
      setUser(u);
      setHasCheckedUser(true);
    });
  }, []);

  // Auto-popup: show modal on first visit (no tab param) when not logged in
  useEffect(() => {
    if (hasCheckedUser && !user && !searchParams.has("tab")) {
      // Small delay so the splash animation plays first
      const timer = setTimeout(() => {
        setIsAuthModalOpen(true);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [hasCheckedUser, user, searchParams]);

  const handleEnter = () => {
    setShowMain(true);
  };

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/";
  };

  // If there's already a tab param, skip splash
  useEffect(() => {
    if (searchParams.has("tab")) {
      setShowMain(true);
    }
  }, [searchParams]);

  return (
    <main style={{ background: "#F5EDE4", minHeight: "100vh" }}>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onAuthSuccess={() => { window.location.href = "/?tab=mine"; }} 
      />

      <AnimatePresence mode="wait">
        {!showMain ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#F5EDE4",
              overflow: "hidden",
            }}
          >
            {/* Responsive Background System */}
            <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
              {/* Photo Background (Mobile/Portrait only) */}
              <div className="splash-bg-photo" style={{ width: "100%", height: "100%", position: "relative" }}>
                <Image 
                  src="/bg/Splash screen-bg.jpg" 
                  alt="Background"
                  fill
                  priority
                  quality={100}
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              </div>

              {/* Watercolor Background (Desktop/Landscape Fallback) */}
              <div className="splash-bg-watercolor" style={{ position: "absolute", inset: 0, background: "#FFFDF9" }}>
                <div style={{
                  position: "absolute",
                  top: "-5%",
                  right: "-5%",
                  width: "90%",
                  height: "90%",
                  background: "radial-gradient(ellipse at top right, rgba(246,220,203,0.3) 0%, transparent 70%)",
                  filter: "blur(40px)",
                }} />
              </div>

              {/* Soft overlay (only active on mobile with the photo) */}
              <div className="splash-bg-overlay" style={{ 
                position: "absolute", 
                inset: 0, 
                background: "linear-gradient(to bottom, rgba(245, 237, 228, 0.4), rgba(245, 237, 228, 0.6))",
                backdropFilter: "blur(1px)"
              }} />
            </div>

            <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px" }}>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                style={{ fontFamily: "Cormorant SC, serif", fontSize: 11, letterSpacing: "0.4em", color: "#7A5442", marginBottom: 8 }}
              >
                WE INVITE YOU
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                style={{ fontFamily: "'Abramo', 'Great Vibes', cursive", fontSize: "clamp(48px, 12vw, 76px)", color: "#C25A20", lineHeight: 1.1 }}
              >
                John &amp; Julie
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                style={{ height: 1, width: 140, background: "linear-gradient(to right, transparent, #C9A96E, transparent)", margin: "16px auto" }}
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                style={{ fontFamily: "Cormorant SC, serif", fontSize: 14, letterSpacing: "0.3em", color: "#5C3D2E" }}
              >
                05 · 16 · 2026
              </motion.p>
            </div>

            <motion.button
              onClick={handleEnter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              style={{
                position: "absolute",
                bottom: 60,
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontFamily: "Cormorant SC, serif", fontSize: 11, letterSpacing: "0.4em", color: "#7A5442" }}>SCROLL</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ color: "#C9A96E" }}
              >
                ↓
              </motion.div>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <MemoriesSection 
              forcedTab={activeTab} 
              user={user}
              onLoginClick={() => setIsAuthModalOpen(true)}
            />
            <BottomNav 
              user={user} 
              onLoginClick={() => setIsAuthModalOpen(true)} 
              onLogoutClick={handleLogout} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function SplashPage() {
  return (
    <Suspense fallback={<div style={{ background: "#F5EDE4", minHeight: "100vh" }} />}>
      <SplashContent />
    </Suspense>
  );
}
