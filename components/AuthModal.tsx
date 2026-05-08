"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Lock, Loader2 } from "lucide-react";
import { registerAction, loginAction } from "@/app/actions/auth";

export function AuthModal({ isOpen, onClose, onAuthSuccess }: { isOpen: boolean, onClose: () => void, onAuthSuccess: () => void }) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = isLogin 
        ? await loginAction(username, password)
        : await registerAction(username, password);
        
      if (res.success) {
        onAuthSuccess();
        onClose();
      } else {
        setError(res.error || "An error occurred");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowEmailForm(false);
    setUsername("");
    setPassword("");
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          {/* Blurred backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{ position: "absolute", inset: 0, background: "rgba(44, 24, 16, 0.35)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 380,
              background: "#FFFFFF",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 8px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {/* Header bar */}
            <div style={{
              background: "linear-gradient(135deg, #FAF0EA 0%, #FFF8F4 100%)",
              padding: "20px 24px 18px",
              borderBottom: "1px solid #F0E4DC",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              {/* Google G logo */}
              <svg width="22" height="22" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#2C1810", margin: 0, lineHeight: 1.3 }}>Sign in to John & Julie</p>
                <p style={{ fontSize: 12, color: "#7A5E51", margin: 0, lineHeight: 1.3 }}>Share your beautiful memories 🌸</p>
              </div>
              <button
                onClick={handleClose}
                style={{ marginLeft: "auto", background: "none", border: "none", color: "#9B7B6E", cursor: "pointer", padding: 4, borderRadius: 8, display: "flex" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "24px 24px 28px" }}>
              {!showEmailForm ? (
                <>
                  {/* Primary Google button */}
                  <button
                    id="google-signin-btn"
                    onClick={() => window.location.href = '/api/auth/google'}
                    style={{
                      width: "100%",
                      background: "#4285F4",
                      border: "none",
                      borderRadius: 12,
                      padding: "14px 16px",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#FFF",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      transition: "all 0.2s ease",
                      boxShadow: "0 4px 14px rgba(66,133,244,0.4)",
                      letterSpacing: "0.01em",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#3367D6";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(66,133,244,0.5)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "#4285F4";
                      e.currentTarget.style.boxShadow = "0 4px 14px rgba(66,133,244,0.4)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" opacity="0.9"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" opacity="0.8"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" opacity="0.85"/>
                    </svg>
                    Continue with Google
                  </button>

                  <p style={{ fontSize: 11, color: "#9B7B6E", textAlign: "center", margin: "14px 0 0", lineHeight: 1.5 }}>
                    By continuing, Google will share your name, email address, and profile picture with this site.
                  </p>

                  {/* Divider */}
                  <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
                    <div style={{ flex: 1, height: 1, background: "#F0E4DC" }} />
                    <span style={{ padding: "0 12px", color: "#B8A09A", fontSize: 12 }}>or use username</span>
                    <div style={{ flex: 1, height: 1, background: "#F0E4DC" }} />
                  </div>

                  {/* Secondary username button */}
                  <button
                    onClick={() => setShowEmailForm(true)}
                    style={{
                      width: "100%",
                      background: "#FFF",
                      border: "1.5px solid #E8D5C8",
                      borderRadius: 12,
                      padding: "12px 16px",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#5C3D2E",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = "#FAF0EA"; e.currentTarget.style.borderColor = "#C9A96E"; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = "#FFF"; e.currentTarget.style.borderColor = "#E8D5C8"; }}
                  >
                    Login / Register with username
                  </button>
                </>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="email-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={() => { setShowEmailForm(false); setError(null); }}
                      style={{ background: "none", border: "none", color: "#9B7B6E", fontSize: 13, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", gap: 6, padding: 0 }}
                    >
                      ← Back
                    </button>

                    <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#2C1810", marginBottom: 4, fontWeight: 600 }}>
                      {isLogin ? "Welcome back" : "Create account"}
                    </h3>
                    <p style={{ color: "#7A5E51", fontSize: 13, marginBottom: 20 }}>
                      {isLogin ? "Login to manage your bouquet" : "Register to start your own bouquet"}
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ position: "relative" }}>
                        <User size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#9B7B6E" }} />
                        <input
                          type="text"
                          placeholder="Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          style={{ width: "100%", padding: "12px 12px 12px 38px", borderRadius: 10, border: "1.5px solid #E8D5C8", background: "#FFF", outline: "none", fontSize: 14, color: "#2C1810", boxSizing: "border-box" }}
                          onFocus={(e) => e.currentTarget.style.borderColor = "#C9A96E"}
                          onBlur={(e) => e.currentTarget.style.borderColor = "#E8D5C8"}
                        />
                      </div>

                      <div style={{ position: "relative" }}>
                        <Lock size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#9B7B6E" }} />
                        <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          style={{ width: "100%", padding: "12px 12px 12px 38px", borderRadius: 10, border: "1.5px solid #E8D5C8", background: "#FFF", outline: "none", fontSize: 14, color: "#2C1810", boxSizing: "border-box" }}
                          onFocus={(e) => e.currentTarget.style.borderColor = "#C9A96E"}
                          onBlur={(e) => e.currentTarget.style.borderColor = "#E8D5C8"}
                        />
                      </div>

                      {error && <p style={{ color: "#B65D37", fontSize: 12, margin: 0 }}>{error}</p>}

                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          background: "#B65D37", color: "#FFF", border: "none", borderRadius: 10,
                          padding: "13px", fontSize: 15, fontWeight: 600, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                          marginTop: 4, transition: "all 0.2s ease", boxShadow: "0 4px 14px rgba(182,93,55,0.3)",
                        }}
                      >
                        {loading && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                        {isLogin ? "Login" : "Register"}
                      </button>
                    </form>

                    <button
                      onClick={() => { setIsLogin(!isLogin); setError(null); }}
                      style={{ background: "none", border: "none", color: "#B65D37", fontSize: 13, marginTop: 16, cursor: "pointer", width: "100%", textAlign: "center" }}
                    >
                      {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                    </button>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>

          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}
