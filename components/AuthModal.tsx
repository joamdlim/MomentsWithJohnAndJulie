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
