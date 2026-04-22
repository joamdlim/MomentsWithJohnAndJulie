"use client";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { CornerAccent } from "@/components/CornerAccent";
import { MapPin, CalendarDays, Camera, Plus, FolderOpen } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

/* ─── Shared animation ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.6, ease: "easeOut" },
  }),
};

/* ─── Shared divider ─────────────────────────────────────────── */
function GoldDivider({ width = "55%" }: { width?: string }) {
  return (
    <div
      style={{
        height: 1,
        width,
        background:
          "linear-gradient(to right, transparent, #C9A96E, transparent)",
        margin: "0 auto",
      }}
    />
  );
}

/* ─── Section header ─────────────────────────────────────────── */
function SectionHeader({
  tag,
  title,
}: {
  tag: string;
  title: string;
}) {
  return (
    <div style={{ textAlign: "center", padding: "clamp(48px,10vw,64px) 24px 28px", maxWidth: 800, margin: "0 auto" }}>
      <h2
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "clamp(34px,9vw,44px)",
          fontWeight: 400,
          color: "#B65D37",
          marginBottom: 8,
          display: "inline-block",
        }}
      >
        {title}
      </h2>
      <div style={{ width: 60, height: 1.2, background: "#E8D5C8", margin: "0 auto 12px" }} />
      <p
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontStyle: "italic",
          fontSize: "clamp(14px,3.8vw,16px)",
          color: "#9B7B6E",
        }}
      >
        Join us for our special day
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 — HOME (Invitation)
═══════════════════════════════════════════════════════════════ */
function HomeSection() {
  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Invitation content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding:
            "clamp(56px,13vw,76px) clamp(18px,6vw,32px) clamp(44px,10vw,60px)",
        }}
      >
        {/* Together with our parents */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ marginBottom: "clamp(12px,4vw,18px)" }}
        >
          <p
            style={{
              fontFamily: "Cormorant SC, serif",
              fontSize: "clamp(9.5px,2.4vw,11.5px)",
              letterSpacing: "0.42em",
              color: "#9B7B6E",
              textTransform: "uppercase",
            }}
          >
            TOGETHER WITH OUR PARENTS
          </p>
        </motion.div>

        {/* Parents Names Grid */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(16px,5vw,32px)",
            marginBottom: "clamp(18px,5vw,26px)",
            width: "100%",
            maxWidth: 600,
          }}
        >
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{
              fontFamily: "Cormorant SC, serif",
              fontSize: "clamp(10px,2.6vw,11.5px)",
              letterSpacing: "0.12em",
              color: "#B65D37",
              lineHeight: 1.6,
            }}>
              MARIA THERESA D. LIM<br />
              FELIPE D. LIM †
            </p>
          </div>

          <div style={{ 
            fontFamily: "Cormorant Garamond, serif", 
            fontSize: "clamp(24px,7vw,32px)", 
            fontStyle: "italic",
            color: "#B65D37",
            marginTop: -4,
            opacity: 0.9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            &amp;
          </div>

          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{
              fontFamily: "Cormorant SC, serif",
              fontSize: "clamp(10px,2.6vw,11.5px)",
              letterSpacing: "0.12em",
              color: "#B65D37",
              lineHeight: 1.6,
            }}>
              MELANIE G. EDPAN<br />
              GIL D. EDPAN †
            </p>
          </div>
        </motion.div>

        {/* we, */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontStyle: "italic",
            fontSize: "clamp(12.5px,3.2vw,14.5px)",
            color: "#9B7B6E",
            letterSpacing: "0.08em",
            marginBottom: 2,
          }}
        >
          we,
        </motion.p>

        {/* John Kristoffer */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(36px,9.5vw,50px)",
            fontWeight: 400,
            color: "#B65D37",
            lineHeight: 1.05,
          }}
        >
          John Kristoffer
        </motion.div>

        {/* & */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontStyle: "italic",
            fontSize: "clamp(26px,7vw,36px)",
            color: "#B65D37",
            lineHeight: 1.2,
          }}
        >
          &amp;
        </motion.div>

        {/* Julie Andrea */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(36px,9.5vw,50px)",
            fontWeight: 400,
            color: "#B65D37",
            lineHeight: 1.05,
            marginBottom: "clamp(14px,4vw,20px)",
          }}
        >
          Julie Andrea
        </motion.div>

        {/* Tagline */}
        <motion.p
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontStyle: "italic",
            fontSize: "clamp(13px,3.4vw,15.5px)",
            color: "#9B7B6E",
            lineHeight: 1.7,
            marginBottom: "clamp(18px,5vw,26px)",
            maxWidth: "82%",
          }}
        >
          with full hearts, joyfully invite you to our wedding.
        </motion.p>

        <GoldDivider />

        {/* Date row */}
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(14px,4.5vw,24px)",
            marginTop: "clamp(18px,5vw,24px)",
            marginBottom: 2,
            width: "100%",
          }}
        >
          <span
            style={{
              fontFamily: "Cormorant SC, serif",
              fontSize: "clamp(9px,2.4vw,11px)",
              letterSpacing: "0.2em",
              color: "#9B7B6E",
            }}
          >
            SATURDAY
          </span>
          <span
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(58px,15vw,72px)",
              fontWeight: 300,
              color: "#B65D37",
              lineHeight: 1,
            }}
          >
            16
          </span>
          <span
            style={{
              fontFamily: "Cormorant SC, serif",
              fontSize: "clamp(9px,2.4vw,11px)",
              letterSpacing: "0.2em",
              color: "#9B7B6E",
            }}
          >
            2:00 PM
          </span>
        </motion.div>

        <motion.p
          custom={7}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: "Cormorant SC, serif",
            fontSize: "clamp(9px,2.4vw,11px)",
            letterSpacing: "0.28em",
            color: "#9B7B6E",
            marginBottom: "clamp(16px,4.5vw,22px)",
          }}
        >
          MAY · 2026
        </motion.p>

        <GoldDivider />

        {/* Ceremony */}
        <motion.div
          custom={8}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ marginTop: "clamp(18px,5vw,24px)", marginBottom: "clamp(14px,4vw,20px)" }}
        >
          <p
            style={{
              fontFamily: "Cormorant SC, serif",
              fontSize: "clamp(9.5px,2.6vw,12px)",
              letterSpacing: "0.2em",
              color: "#B65D37",
              fontWeight: 600,
              marginBottom: 5,
            }}
          >
            SACRED HEART OF JESUS PARISH
          </p>
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontStyle: "italic",
              fontSize: "clamp(13px,3.4vw,15px)",
              color: "#9B7B6E",
            }}
          >
            Obrero, Davao City
          </p>
        </motion.div>

        {/* Reception */}
        <motion.div
          custom={9}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontStyle: "italic",
              fontSize: "clamp(13px,3.4vw,15px)",
              color: "#9B7B6E",
              marginBottom: 5,
            }}
          >
            reception to follow at
          </p>
          <p
            style={{
              fontFamily: "Cormorant SC, serif",
              fontSize: "clamp(18px,5vw,23px)",
              letterSpacing: "0.2em",
              color: "#5C3D2E",
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            CASA MAYOR
          </p>
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontStyle: "italic",
              fontSize: "clamp(13px,3.4vw,15px)",
              color: "#9B7B6E",
            }}
          >
            Juna Subd., Davao City
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2 — DETAILS (Event)
═══════════════════════════════════════════════════════════════ */
interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  mapUrl: string;
  calendarUrl: string;
}
function TripleCorner({ position = "tl" }: { position?: "tl" | "br" }) {
  const isTl = position === "tl";
  const styles = isTl ? { top: 12, left: 12 } : { bottom: 12, right: 12, transform: "rotate(180deg)" };
  return (
    <div style={{ position: "absolute", ...styles, width: 34, height: 34 }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 0.8, background: "#C9A96E", opacity: 0.7 }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: 0.8, height: "100%", background: "#C9A96E", opacity: 0.7 }} />
      
      <div style={{ position: "absolute", top: 4, left: 4, width: "70%", height: 0.5, background: "#C9A96E", opacity: 0.4 }} />
      <div style={{ position: "absolute", top: 4, left: 4, width: 0.5, height: "70%", background: "#C9A96E", opacity: 0.4 }} />

      <div style={{ position: "absolute", top: 8, left: 8, width: "40%", height: 0.3, background: "#C9A96E", opacity: 0.2 }} />
      <div style={{ position: "absolute", top: 8, left: 8, width: 0.3, height: "40%", background: "#C9A96E", opacity: 0.2 }} />
    </div>
  );
}

function EventCard({ title, date, time, location, address }: Partial<EventCardProps>) {
  return (
    <div
      className="wedding-card"
      style={{ 
        margin: "0 auto", 
        padding: "clamp(48px,12vw,64px) clamp(24px,6vw,32px)", 
        position: "relative", 
        maxWidth: 500,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 10px 40px rgba(182,93,55,0.06)",
        background: "#fff",
      }}
    >
      <TripleCorner position="tl" />
      <TripleCorner position="br" />
      
      <h3
        style={{
          textAlign: "center",
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "clamp(28px,7.5vw,36px)",
          color: "#B65D37",
          marginBottom: 24,
          fontWeight: 400,
        }}
      >
        {title}
      </h3>

      {[
        { label: "DATE", value: date },
        { label: "TIME", value: time },
        { label: "LOCATION", value: location },
      ].map(({ label, value }) => (
        <div key={label} style={{ textAlign: "center", marginBottom: 18 }}>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "9px",
              letterSpacing: "0.22em",
              color: "#9B7B6E",
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(17px,4.5vw,20px)",
              color: "#B65D37",
              fontWeight: 400,
            }}
          >
            {value}
          </p>
        </div>
      ))}

      <p
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "14px",
          color: "#9B7B6E",
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        {address}
      </p>
    </div>
  );
}

function DetailsSection() {
  const CEREMONY_CAL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=John+%26+Julie+Wedding+Ceremony&dates=20260516T060000Z/20260516T070000Z&location=Sacred+Heart+of+Jesus+Parish,+Obrero,+Davao+City`;
  const RECEPTION_CAL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=John+%26+Julie+Wedding+Reception&dates=20260516T080000Z/20260516T120000Z&location=Casa+Mayor,+Juna+Subd,+Davao+City`;
  return (
    <section
      id="details"
      style={{ paddingBottom: "clamp(24px,6vw,36px)", position: "relative", zIndex: 1 }}
    >
      <SectionHeader tag="LJM — EDPAN" title="Event Details" />
      <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", padding: "0 24px" }}>
        <EventCard
          title="Ceremony"
          date="May 16, 2026"
          time="2:00 PM"
          location="Sacred Heart of Jesus Parish"
          address="Obrero, Davao City"
          mapUrl="https://www.google.com/maps/search/?api=1&query=Sacred+Heart+of+Jesus+Parish+Obrero+Davao+City"
          calendarUrl={CEREMONY_CAL}
        />
        <EventCard
          title="Reception"
          date="May 16, 2026"
          time="To Follow"
          location="Casa Mayor"
          address="Juna Subd., Davao City"
          mapUrl="https://www.google.com/maps/search/?api=1&query=Casa+Mayor+Juna+Subd+Davao+City"
          calendarUrl={RECEPTION_CAL}
        />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3 — MEMORIES (Photos)
═══════════════════════════════════════════════════════════════ */
type Album = {
  id: string;
  name: string;
  photos: string[];
};

function MemoriesSection() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showCaptureOptions, setShowCaptureOptions] = useState(false);
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputGalleryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    import("@/app/actions/photos").then(({ getAlbums }) => {
      getAlbums().then(data => {
        setAlbums(data);
      });
    });
  }, []);

  useEffect(() => {
    if (zoomedPhoto || showCaptureOptions) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [zoomedPhoto, showCaptureOptions]);

  const activeAlbum = albums.find(a => a.id === activeAlbumId);

  const handleCreateFolder = async () => {
    const name = window.prompt("Enter folder name:");
    if (name && name.trim()) {
      const { createAlbumAction, getAlbums } = await import("@/app/actions/photos");
      const res = await createAlbumAction(name);
      if (res.success) {
        const data = await getAlbums();
        setAlbums(data);
      } else {
        alert("Error creating folder");
      }
    }
  };

  const handleCaptureMoment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && activeAlbumId) {
      setUploading(true);
      try {
        const file = files[0];
        const { uploadPhotoServerAction } = await import("@/app/actions/upload");
        const formData = new FormData();
        formData.append("file", file);
        
        const res = await uploadPhotoServerAction(formData, activeAlbumId);
        if (res.success) {
          const { getAlbums } = await import("@/app/actions/photos");
          const data = await getAlbums();
          setAlbums(data);
        } else {
          alert("Failed to upload: " + res.error);
        }
      } catch (err: any) {
        alert("Upload error: " + err.message);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <section
      id="memories"
      style={{ 
        paddingBottom: "clamp(24px,6vw,36px)", 
        position: "relative", 
        zIndex: (showCaptureOptions || zoomedPhoto) ? 999 : 1 
      }}
    >
      <SectionHeader tag="LJM — EDPAN" title={activeAlbum ? activeAlbum.name : "Memories"} />

      <AnimatePresence mode="wait">
        {!activeAlbumId ? (
          <motion.div
            key="album-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Folder Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                padding: "0 clamp(16px,5vw,24px) 24px",
                maxWidth: 900,
                margin: "0 auto",
              }}
            >
              {albums.map((album) => (
                <motion.div
                  key={album.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveAlbumId(album.id)}
                  style={{
                    position: "relative",
                    padding: "24px 16px",
                    background: "#fff",
                    borderRadius: 18,
                    textAlign: "center",
                    cursor: "pointer",
                    boxShadow: "0 8px 30px rgba(182,93,55,0.06)",
                    border: "1px solid rgba(232,213,200,0.4)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete folder "${album.name}" and all its photos?`)) {
                        const { deleteAlbumAction } = await import("@/app/actions/photos");
                        const res = await deleteAlbumAction(album.id);
                        if (res.success) {
                          setAlbums(albums.filter(a => a.id !== album.id));
                        } else {
                          alert(res.error);
                        }
                      }
                    }}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "rgba(182,93,55,0.06)",
                      border: "none",
                      borderRadius: "50%",
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#B65D37",
                      zIndex: 2,
                    }}
                  >
                    ×
                  </button>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: "#FDF7F2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                    }}
                  >
                    <FolderOpen size={24} color="#B65D37" strokeWidth={1.5} />
                  </div>
                  <p
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontSize: 16,
                      color: "#B65D37",
                      fontWeight: 500,
                      marginBottom: 4,
                    }}
                  >
                    {album.name}
                  </p>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#9B7B6E" }}>
                    {album.photos.length} photos
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Main Action Button */}
            <div style={{ padding: "0 24px", maxWidth: 600, margin: "0 auto" }}>
              <motion.button
                onClick={handleCreateFolder}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "16px",
                  background: "#B65D37",
                  border: "none",
                  borderRadius: 16,
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: "pointer",
                  boxShadow: "0 8px 25px rgba(182,93,55,0.25)",
                }}
              >
                <FolderOpen size={18} strokeWidth={2} />
                Create a Folder
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="album-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ padding: "0 clamp(16px,5vw,24px)", maxWidth: 900, margin: "0 auto" }}
          >
            <button
              onClick={() => setActiveAlbumId(null)}
              style={{
                background: "transparent",
                border: "none",
                color: "#997A6C",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                marginBottom: 20,
              }}
            >
              ← Back to Folders
            </button>

            {/* Photo Grid (FIXED 2 COLUMNS) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 32,
              }}
            >
              {activeAlbum?.photos.map((photo, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    position: "relative",
                    aspectRatio: "1",
                    borderRadius: 14,
                    overflow: "hidden",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  }}
                >
                  <img 
                    src={photo} 
                    alt="Memory" 
                    style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "zoom-in" }} 
                    onClick={(e) => { e.stopPropagation(); setZoomedPhoto(photo); }}
                  />
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this photo?")) {
                        const { deletePhotoAction } = await import("@/app/actions/photos");
                        const res = await deletePhotoAction(photo);
                        if (res.success) {
                          setAlbums(albums.map(a => 
                            a.id === activeAlbumId 
                              ? { ...a, photos: a.photos.filter(p => p !== photo) } 
                              : a
                          ));
                        } else {
                          alert(res.error);
                        }
                      }
                    }}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "rgba(0,0,0,0.3)",
                      border: "none",
                      borderRadius: "50%",
                      width: 26,
                      height: 26,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#fff",
                      fontSize: 16,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </motion.div>
              ))}
              {activeAlbum?.photos.length === 0 && (
                <div style={{ gridColumn: "span 2", padding: "60px 0", textAlign: "center", color: "#9B7B6E", fontStyle: "italic" }}>
                  No photos yet. Start capturing!
                </div>
              )}
            </div>

            {/* Back to Capture Button */}
            <motion.button
              onClick={() => setShowCaptureOptions(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={uploading}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                padding: "18px", background: "#B65D37", border: "none", borderRadius: 16, color: "#fff",
                fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 600,
                cursor: uploading ? "wait" : "pointer", boxShadow: "0 8px 25px rgba(182,93,55,0.25)",
                opacity: uploading ? 0.7 : 1,
              }}
            >
              <Camera size={20} strokeWidth={2} />
              {uploading ? "Uploading safely to MinIO..." : "Capture the Moment"}
            </motion.button>

            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              accept="image/*" 
              capture="environment"
              onChange={handleFileChange} 
            />
            <input 
              type="file" 
              ref={fileInputGalleryRef} 
              style={{ display: "none" }} 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCaptureOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 400,
              display: "flex", alignItems: "flex-end", justifyContent: "center"
            }}
            onClick={() => setShowCaptureOptions(false)}
          >
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%", maxWidth: 450, background: "#f2f2f6", borderTopLeftRadius: 20, borderTopRightRadius: 20,
                padding: "20px 20px 48px", display: "flex", flexDirection: "column", gap: 12
              }}
            >
              <button
                onClick={() => { setShowCaptureOptions(false); fileInputRef.current?.click(); }}
                style={{
                  width: "100%", padding: "18px", background: "#fff", border: "none", borderRadius: 14,
                  fontSize: 18, color: "#007aff", fontWeight: 500, fontFamily: "Inter, sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
                }}
              >
                <Camera size={22} color="#007aff" /> Take Photo
              </button>
              <button
                onClick={() => { setShowCaptureOptions(false); fileInputGalleryRef.current?.click(); }}
                style={{
                  width: "100%", padding: "18px", background: "#fff", border: "none", borderRadius: 14,
                  fontSize: 18, color: "#007aff", fontWeight: 500, fontFamily: "Inter, sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
                }}
              >
                <ImageIcon size={22} color="#007aff" /> Photo Library
              </button>
              <div style={{ height: 6 }} />
              <button
                onClick={() => setShowCaptureOptions(false)}
                style={{
                  width: "100%", padding: "18px", background: "#fff", border: "none", borderRadius: 14,
                  fontSize: 18, color: "#ff3b30", fontWeight: 600, fontFamily: "Inter, sans-serif",
                  cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
                }}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zoomedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.92)",
              zIndex: 300,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
            onClick={() => setZoomedPhoto(null)}
          >
            <button
              onClick={() => setZoomedPhoto(null)}
              style={{
                position: "absolute",
                top: 24,
                right: 24,
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: 44,
                height: 44,
                cursor: "pointer",
                color: "#fff",
                fontSize: 26,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
            
            <img 
              src={zoomedPhoto} 
              alt="Zoomed Memory" 
              style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: 12, boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }} 
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  const res = await fetch(zoomedPhoto);
                  const blob = await res.blob();
                  const blobUrl = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = blobUrl;
                  a.download = `john-julie-memory-${Date.now()}.jpg`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(blobUrl);
                } catch (err) {
                  alert("Failed to save image.");
                }
              }}
              style={{
                marginTop: 32,
                padding: "16px 36px",
                background: "#B65D37",
                border: "none",
                borderRadius: 16,
                color: "#fff",
                fontFamily: "Inter, sans-serif",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 8px 30px rgba(182,93,55,0.4)"
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Save Photo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4 — ENTOURAGE
═══════════════════════════════════════════════════════════════ */
function EntTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "Cormorant SC, serif",
        fontSize: "clamp(9.5px,2.5vw,11px)",
        letterSpacing: "0.28em",
        color: "#B65D37",
        textAlign: "center",
        marginTop: "clamp(20px,5.5vw,28px)",
        marginBottom: 8,
      }}
    >
      {children}
    </p>
  );
}

function EntName({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "Cormorant Garamond, serif",
        fontSize: "clamp(13.5px,3.5vw,15.5px)",
        color: "#5C3D2E",
        textAlign: "center",
        lineHeight: 1.85,
      }}
    >
      {children}
    </p>
  );
}

function EntDivider() {
  return (
    <div
      style={{
        height: 1,
        width: "48%",
        background: "linear-gradient(to right, transparent, #C9A96E, transparent)",
        margin: "clamp(18px,5vw,24px) auto 0",
      }}
    />
  );
}

function EntourageSection() {
  return (
    <section
      id="entourage"
      style={{
        paddingBottom: "clamp(48px,12vw,72px)",
        position: "relative",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      <div style={{ position: "relative", zIndex: 1, padding: "0 clamp(16px,5vw,24px)", maxWidth: 1000, margin: "0 auto" }}>
        <SectionHeader tag="LJM — EDPAN" title="Entourage" />

        {/* Ring icon divider */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: -10, marginBottom: 4 }}>
          <div style={{ height: 1, width: 36, background: "#C9A96E" }} />
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="#C9A96E" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" stroke="#C9A96E" strokeWidth="1.2" />
          </svg>
          <div style={{ height: 1, width: 36, background: "#C9A96E" }} />
        </div>

        {/* Principal Sponsors */}
        <EntTitle>PRINCIPAL SPONSORS</EntTitle>
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", 
            gap: "12px 20px",
            justifyItems: "center"
          }}
        >
          <div>
            {["Joseph Jude Deyto","Andrew Jude Deyto","Freddie Lim","Santos Jr Alonzo","Cayetano Jr Iturralde","Wilmar Villanueva","Benjamin Estacio","Michael John Calistre"].map((n) => (
              <EntName key={n}>{n}</EntName>
            ))}
          </div>
          <div>
            {["Imelda Deyto","Mary Jean Deyto","Rosalie Lim","Yvonne Alonzo","Rosario Iturralde","Mycel Villanueva","Ramona Raquel Dela Cruz","Ma. Therese Corcilles"].map((n) => (
              <EntName key={n}>{n}</EntName>
            ))}
          </div>
        </div>

        <EntDivider />

        {/* Best Man & Maid of Honor */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
          <div>
            <EntTitle>BEST MAN</EntTitle>
            <EntName>Jade Benedict Lim</EntName>
          </div>
          <div>
            <EntTitle>MAID OF HONOR</EntTitle>
            <EntName>Mary Lou Morales</EntName>
          </div>
        </div>

        <EntDivider />

        {/* Groomsmen & Bridesmaids */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
          <div>
            <EntTitle>GROOMSMEN</EntTitle>
            {["Rex Jefferson Lim","Daniel Alonzo","Joash Miguel Lim","Carlo Enrico Iturralde","Eljohn Pascual"].map((n) => (
              <EntName key={n}>{n}</EntName>
            ))}
          </div>
          <div>
            <EntTitle>BRIDESMAIDS</EntTitle>
            {["Wynorrah Faye Duhan","Beverly Jane Bagobe","Hannah Laurea Bustaleño"].map((n) => (
              <EntName key={n}>{n}</EntName>
            ))}
            <EntTitle>JUNIOR BRIDESMAIDS</EntTitle>
            {["Zoe Marie Bustaleño","Chloie Jean Gelicame"].map((n) => (
              <EntName key={n}>{n}</EntName>
            ))}
          </div>
        </div>

        <EntDivider />

        {/* Candle / Veil / Cord */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 4px" }}>
          <div>
            <EntTitle>CANDLE</EntTitle>
            <EntName>Karl Niño Deyto</EntName>
            <EntName>Maeve Deyto</EntName>
          </div>
          <div>
            <EntTitle>VEIL</EntTitle>
            <EntName>Juanito Jr Bustaleño</EntName>
            <EntName>Nancy Bustaleño</EntName>
          </div>
          <div>
            <EntTitle>CORD</EntTitle>
            <EntName>Moises Jr Torrentira</EntName>
            <EntName>Aubrey Torrentira</EntName>
          </div>
        </div>

        <EntDivider />

        {/* Ring / Bible / Coin */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 4px" }}>
          <div>
            <EntTitle>RING</EntTitle>
            <EntName>Kody Michael Deyto</EntName>
          </div>
          <div>
            <EntTitle>BIBLE</EntTitle>
            <EntName>Dean Austin Moises Torrentira</EntName>
          </div>
          <div>
            <EntTitle>COIN</EntTitle>
            <EntName>John Martin Gelicame</EntName>
          </div>
        </div>

        <EntDivider />

        {/* Flower Girl */}
        <EntTitle>FLOWER GIRL</EntTitle>
        <EntName>Arya Moiselle Torrentira</EntName>
      </div>
    </section>
  );
}

/* ─── Background Design component ───────────────────────────── */
function WatercolorBg() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
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
      
      {/* Diagonal wash shape */}
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.18,
        }}
      >
        <path
          d="M1000,0 L1000,700 C800,500 400,900 0,700 L0,0 Z"
          fill="#F9EFE5"
        />
      </svg>

      {/* Re-introduced Soft Leaf Branch (Bottom Left) */}
      <div
        style={{
          position: "absolute",
          bottom: "-2%",
          left: "-2%",
          width: "clamp(250px, 45vw, 400px)",
          opacity: 0.35,
          filter: "blur(0.5px)",
        }}
      >
        <svg viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M30 380C60 340 120 280 150 220"
            stroke="rgba(182,93,55,0.12)"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          {[
            "M30 380C25 350 20 320 20 310C35 325 55 350 30 380Z",
            "M45 350C65 330 85 315 95 305C85 305 65 320 45 350Z",
            "M80 310C100 290 120 275 130 265C120 265 100 280 80 310Z",
            "M120 260C140 240 160 225 170 215C160 215 140 230 120 260Z",
            "M70 340C50 320 35 300 30 290C45 300 65 325 70 340Z",
            "M110 300C90 280 75 260 70 250C85 260 105 285 110 300Z",
          ].map((d, i) => (
            <path key={i} d={d} fill="rgba(182,93,55,0.12)" stroke="rgba(182,93,55,0.05)" strokeWidth="0.3" />
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT PAGE — Single scrollable layout
═══════════════════════════════════════════════════════════════ */
export default function MainPage() {
  const { scrollYProgress } = useScroll();
  
  // Subtle opacity shifts for sections as you scroll
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 1]);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <WatercolorBg />
      <motion.div style={{ position: "relative", zIndex: 1, opacity: sectionOpacity }}>
        <HomeSection />
        <DetailsSection />
        <MemoriesSection />
        <EntourageSection />
        <BottomNav />
      </motion.div>
    </div>
  );
}
