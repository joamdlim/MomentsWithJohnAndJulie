"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Lock, Loader2 } from "lucide-react";
import { registerAction, loginAction } from "@/app/actions/auth";

export function AuthModal({ isOpen, onClose, onAuthSuccess }: { isOpen: boolean, onClose: () => void, onAuthSuccess: () => void }) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(44, 24, 16, 0.4)", backdropFilter: "blur(4px)" }}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 400,
              background: "#FFFDF9",
              borderRadius: 24,
              padding: "32px 24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              textAlign: "center"
            }}
          >
            <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#9B7B6E", cursor: "pointer" }}>
              <X size={20} />
            </button>

            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, color: "#2C1810", marginBottom: 8 }}>
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p style={{ color: "#7A5E51", fontSize: 14, marginBottom: 24 }}>
              {isLogin ? "Login to manage your bouquet" : "Register to start your own bouquet"}
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ position: "relative" }}>
                <User size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9B7B6E" }} />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{ width: "100%", padding: "12px 12px 12px 40px", borderRadius: 12, border: "1.5px solid #E8D5C8", background: "#FFF", outline: "none", fontSize: 14 }}
                />
              </div>

              <div style={{ position: "relative" }}>
                <Lock size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9B7B6E" }} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: "100%", padding: "12px 12px 12px 40px", borderRadius: 12, border: "1.5px solid #E8D5C8", background: "#FFF", outline: "none", fontSize: 14 }}
                />
              </div>

              {error && <p style={{ color: "#B65D37", fontSize: 12, marginTop: -8 }}>{error}</p>}

              <button
                disabled={loading}
                style={{
                  background: "#B65D37", color: "#FFF", border: "none", borderRadius: 12,
                  padding: "14px", fontSize: 16, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  marginTop: 8, transition: "all 0.2s ease"
                }}
              >
                {loading && <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />}
                {isLogin ? "Login" : "Register"}
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#E8D5C8" }} />
              <span style={{ padding: "0 12px", color: "#9B7B6E", fontSize: 13, fontFamily: "Inter, sans-serif" }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: "#E8D5C8" }} />
            </div>

            <button
              onClick={() => window.location.href = '/api/auth/google'}
              style={{
                width: "100%",
                background: "#FFF",
                border: "1.5px solid #E8D5C8",
                borderRadius: 12,
                padding: "12px",
                fontSize: 15,
                fontWeight: 500,
                color: "#2C1810",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#FAFAFA")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#FFF")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>

            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: "none", border: "none", color: "#B65D37", fontSize: 13, marginTop: 20, cursor: "pointer", textDecoration: "underline" }}
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </motion.div>
          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}
