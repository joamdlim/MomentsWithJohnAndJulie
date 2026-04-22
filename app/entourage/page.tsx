"use client";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.55, ease: "easeOut" },
  }),
};

function SectionTitle({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <motion.p
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      style={{
        fontFamily: "Cormorant SC, serif",
        fontSize: 11,
        letterSpacing: "0.28em",
        color: "#B65D37",
        textAlign: "center",
        marginBottom: 10,
        marginTop: 28,
      }}
    >
      {children}
    </motion.p>
  );
}

function Name({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <motion.p
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      style={{
        fontFamily: "Cormorant Garamond, serif",
        fontSize: 15,
        color: "#5C3D2E",
        textAlign: "center",
        lineHeight: 1.9,
      }}
    >
      {children}
    </motion.p>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 1,
        width: "50%",
        background: "linear-gradient(to right, transparent, #C9A96E, transparent)",
        margin: "20px auto 0",
      }}
    />
  );
}

export default function EntouragePage() {
  return (
    <>
      <div
        className="page-content"
        style={{
          background: "#FDFAF6",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top-left floral accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 110,
            height: 110,
            backgroundImage: "url('/bg/Floral-bg.png')",
            backgroundSize: "300px auto",
            backgroundPosition: "top left",
            backgroundRepeat: "no-repeat",
            opacity: 0.7,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1, padding: "52px 24px 40px" }}>
          {/* Header couple tag */}
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              fontFamily: "Cormorant SC, serif",
              fontSize: 10,
              letterSpacing: "0.32em",
              color: "#9B7B6E",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            LJM — EDPAN
          </motion.p>

          {/* Title */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 46,
              fontWeight: 400,
              color: "#5C3D2E",
              textAlign: "center",
              lineHeight: 1.1,
              marginBottom: 6,
            }}
          >
            Entourage
          </motion.h1>

          {/* Decorative divider with ring icon */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div style={{ height: 1, width: 40, background: "#C9A96E" }} />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" stroke="#C9A96E" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" stroke="#C9A96E" strokeWidth="1.2" />
            </svg>
            <div style={{ height: 1, width: 40, background: "#C9A96E" }} />
          </motion.div>

          {/* ── PRINCIPAL SPONSORS ── */}
          <SectionTitle index={3}>PRINCIPAL SPONSORS</SectionTitle>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
            <div>
              {[
                "Joseph Jude Deyto",
                "Andrew Jude Deyto",
                "Freddie Lim",
                "Santos Jr Alonzo",
                "Cayetano Jr Iturralde",
                "Wilmar Villanueva",
                "Benjamin Estacio",
                "Michael John Calistre",
              ].map((name, i) => (
                <Name key={name} index={4 + i}>{name}</Name>
              ))}
            </div>
            <div>
              {[
                "Imelda Deyto",
                "Mary Jean Deyto",
                "Rosalie Lim",
                "Yvonne Alonzo",
                "Rosario Iturralde",
                "Mycel Villanueva",
                "Ramona Raquel Dela Cruz",
                "Ma. Therese Corcilles",
              ].map((name, i) => (
                <Name key={name} index={4 + i}>{name}</Name>
              ))}
            </div>
          </div>

          <Divider />

          {/* ── BEST MAN & MAID OF HONOR ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
            <div>
              <SectionTitle index={13}>BEST MAN</SectionTitle>
              <Name index={14}>Jade Benedict Lim</Name>
            </div>
            <div>
              <SectionTitle index={13}>MAID OF HONOR</SectionTitle>
              <Name index={14}>Mary Lou Morales</Name>
            </div>
          </div>

          <Divider />

          {/* ── GROOMSMEN & BRIDESMAIDS ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
            <div>
              <SectionTitle index={15}>GROOMSMEN</SectionTitle>
              {[
                "Rex Jefferson Lim",
                "Daniel Alonzo",
                "Joash Miguel Lim",
                "Carlo Enrico Iturralde",
                "Eljohn Pascual",
              ].map((name, i) => (
                <Name key={name} index={16 + i}>{name}</Name>
              ))}
            </div>
            <div>
              <SectionTitle index={15}>BRIDESMAIDS</SectionTitle>
              {[
                "Wynorrah Faye Duhan",
                "Beverly Jane Bagobe",
                "Hannah Laurea Bustaleño",
              ].map((name, i) => (
                <Name key={name} index={16 + i}>{name}</Name>
              ))}

              <SectionTitle index={19}>JUNIOR BRIDESMAIDS</SectionTitle>
              {[
                "Zoe Marie Bustaleño",
                "Chloie Jean Gelicame",
              ].map((name, i) => (
                <Name key={name} index={20 + i}>{name}</Name>
              ))}
            </div>
          </div>

          <Divider />

          {/* ── CANDLE / VEIL / CORD ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 4px" }}>
            <div>
              <SectionTitle index={22}>CANDLE</SectionTitle>
              <Name index={23}>Karl Niño Deyto</Name>
              <Name index={23}>Maeve Deyto</Name>
            </div>
            <div>
              <SectionTitle index={22}>VEIL</SectionTitle>
              <Name index={23}>Juanito Jr Bustaleño</Name>
              <Name index={23}>Nancy Bustaleño</Name>
            </div>
            <div>
              <SectionTitle index={22}>CORD</SectionTitle>
              <Name index={23}>Moises Jr Torrentira</Name>
              <Name index={23}>Aubrey Torrentira</Name>
            </div>
          </div>

          <Divider />

          {/* ── RING / BIBLE / COIN ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 4px" }}>
            <div>
              <SectionTitle index={25}>RING</SectionTitle>
              <Name index={26}>Kody Michael Deyto</Name>
            </div>
            <div>
              <SectionTitle index={25}>BIBLE</SectionTitle>
              <Name index={26}>Dean Austin Moises Torrentira</Name>
            </div>
            <div>
              <SectionTitle index={25}>COIN</SectionTitle>
              <Name index={26}>John Martin Gelicame</Name>
            </div>
          </div>

          <Divider />

          {/* ── FLOWER GIRL ── */}
          <SectionTitle index={28}>FLOWER GIRL</SectionTitle>
          <Name index={29}>Arya Moiselle Torrentira</Name>

          <div style={{ height: 20 }} />
        </div>
      </div>

      <BottomNav />
    </>
  );
}
