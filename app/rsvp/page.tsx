"use client";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { CornerAccent } from "@/components/CornerAccent";
import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

type AttendingStatus = "yes" | "no" | "";
type FoodPref = "no-restriction" | "vegetarian" | "vegan" | "gluten-free" | "halal" | "";

export default function RSVPPage() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<AttendingStatus>("");
  const [foodPref, setFoodPref] = useState<FoodPref>("");
  const [message, setMessage] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !attending || !foodPref) return;
    setLoading(true);
    // Phase 1 — simulate submit; Phase 2 will POST to Firebase
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <div
        className="page-content"
        style={{
          background: "linear-gradient(180deg, #F9EFE5 0%, #FFFDF9 30%, #FFFDF9 100%)",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {/* Background blobs */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.16) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ textAlign: "center", paddingTop: 52, paddingBottom: 28 }}
        >
          <h1
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 38,
              fontWeight: 500,
              color: "#2C1810",
              fontStyle: "italic",
              marginBottom: 8,
            }}
          >
            RSVP
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              color: "#9B7B6E",
            }}
          >
            Kindly respond by April 30, 2026
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            /* Success state */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ margin: "0 20px", textAlign: "center" }}
            >
              <div className="wedding-card" style={{ padding: "48px 32px", position: "relative" }}>
                <CornerAccent position="tl" />
                <CornerAccent position="tr" />
                <CornerAccent position="bl" />
                <CornerAccent position="br" />
                <CheckCircle size={52} color="#B65D37" strokeWidth={1.5} style={{ marginBottom: 16 }} />
                <h2
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: 30,
                    color: "#2C1810",
                    fontStyle: "italic",
                    marginBottom: 12,
                  }}
                >
                  Thank You!
                </h2>
                <p
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: 18,
                    color: "#B65D37",
                    marginBottom: 8,
                    fontStyle: "italic",
                  }}
                >
                  {name}
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13.5,
                    color: "#9B7B6E",
                    lineHeight: 1.65,
                  }}
                >
                  {attending === "yes"
                    ? "We are so excited to celebrate with you! See you on May 16, 2026. 🎉"
                    : "We will miss you, but thank you for letting us know. You will be in our hearts!"}
                </p>

                <div
                  style={{
                    marginTop: 28,
                    padding: "14px",
                    background: "#FFFDF9",
                    border: "1px solid #F0E8E0",
                    borderRadius: 12,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Cormorant SC, serif",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      color: "#9B7B6E",
                      marginBottom: 4,
                    }}
                  >
                    JOHN & JULIE — 05.16.26
                  </p>
                  <p
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontStyle: "italic",
                      fontSize: 15,
                      color: "#B65D37",
                    }}
                  >
                    with love &amp; gratitude
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Form */
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ margin: "0 20px 24px" }}
            >
              <div className="wedding-card" style={{ padding: "28px 24px", position: "relative" }}>
                <CornerAccent position="tl" />
                <CornerAccent position="br" />

                {/* Name field */}
                <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
                  <label style={labelStyle}>Full Name</label>
                  <input
                    id="rsvp-name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#B65D37";
                      e.target.style.boxShadow = "0 0 0 3px rgba(182,93,55,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#E8D5C8";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </motion.div>

                {/* Guest count */}
                <motion.div
                  custom={2}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  style={{ marginTop: 20 }}
                >
                  <label style={labelStyle}>Number of Guests</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setGuestCount(n)}
                        style={{
                          flex: 1,
                          padding: "10px 0",
                          border: `1.5px solid ${guestCount === n ? "#B65D37" : "#E8D5C8"}`,
                          borderRadius: 10,
                          background: guestCount === n ? "#B65D37" : "transparent",
                          color: guestCount === n ? "#fff" : "#9B7B6E",
                          fontFamily: "Cormorant Garamond, serif",
                          fontSize: 18,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Attending */}
                <motion.div
                  custom={3}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  style={{ marginTop: 20 }}
                >
                  <label style={labelStyle}>Will you be attending?</label>
                  <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    {(["yes", "no"] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        id={`rsvp-attending-${val}`}
                        onClick={() => setAttending(val)}
                        style={{
                          flex: 1,
                          padding: "12px",
                          border: `1.5px solid ${attending === val ? "#B65D37" : "#E8D5C8"}`,
                          borderRadius: 12,
                          background: attending === val ? "#B65D37" : "transparent",
                          color: attending === val ? "#fff" : "#9B7B6E",
                          fontFamily: "Inter, sans-serif",
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {val === "yes" ? "✓ Joyfully Accept" : "✗ Regretfully Decline"}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Food preference */}
                <motion.div
                  custom={4}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  style={{ marginTop: 20 }}
                >
                  <label style={labelStyle}>Dietary Preference</label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                      marginTop: 8,
                    }}
                  >
                    {[
                      { value: "no-restriction", label: "No Restriction" },
                      { value: "vegetarian", label: "Vegetarian" },
                      { value: "vegan", label: "Vegan" },
                      { value: "gluten-free", label: "Gluten-Free" },
                      { value: "halal", label: "Halal" },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        id={`rsvp-food-${value}`}
                        onClick={() => setFoodPref(value as FoodPref)}
                        style={{
                          padding: "10px 12px",
                          border: `1.5px solid ${foodPref === value ? "#B65D37" : "#E8D5C8"}`,
                          borderRadius: 10,
                          background:
                            foodPref === value ? "rgba(182,93,55,0.08)" : "transparent",
                          color: foodPref === value ? "#B65D37" : "#9B7B6E",
                          fontFamily: "Inter, sans-serif",
                          fontSize: 13,
                          fontWeight: foodPref === value ? 600 : 400,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          textAlign: "left",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Message */}
                <motion.div
                  custom={5}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  style={{ marginTop: 20 }}
                >
                  <label style={labelStyle}>Message to the Couple (Optional)</label>
                  <textarea
                    id="rsvp-message"
                    placeholder="Share your warm wishes..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    style={{
                      ...inputStyle,
                      resize: "none",
                      height: "auto",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#B65D37";
                      e.target.style.boxShadow = "0 0 0 3px rgba(182,93,55,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#E8D5C8";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </motion.div>

                {/* Submit */}
                <motion.div
                  custom={6}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  style={{ marginTop: 24 }}
                >
                  <motion.button
                    id="rsvp-submit-btn"
                    type="submit"
                    disabled={!name || !attending || !foodPref || loading}
                    whileHover={
                      name && attending && foodPref ? { scale: 1.02 } : {}
                    }
                    whileTap={
                      name && attending && foodPref ? { scale: 0.98 } : {}
                    }
                    style={{
                      width: "100%",
                      padding: "15px",
                      background:
                        name && attending && foodPref
                          ? "#B65D37"
                          : "#E8D5C8",
                      border: "none",
                      borderRadius: 14,
                      color:
                        name && attending && foodPref ? "#fff" : "#9B7B6E",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 15,
                      fontWeight: 600,
                      cursor:
                        name && attending && foodPref
                          ? "pointer"
                          : "not-allowed",
                      transition: "all 0.3s ease",
                      boxShadow:
                        name && attending && foodPref
                          ? "0 6px 20px rgba(182,93,55,0.3)"
                          : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                        Sending...
                      </>
                    ) : (
                      "Send RSVP"
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <BottomNav />
    </>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "Cormorant SC, serif",
  fontSize: 11,
  letterSpacing: "0.2em",
  color: "#9B7B6E",
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  border: "1.5px solid #E8D5C8",
  borderRadius: 12,
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  color: "#2C1810",
  background: "#FFFDF9",
  outline: "none",
  transition: "all 0.2s ease",
};
