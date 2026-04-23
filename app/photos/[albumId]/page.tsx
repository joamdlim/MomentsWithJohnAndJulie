"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, X, Images } from "lucide-react";
import { getAlbumPhotos } from "@/app/actions/photos";

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params.albumId as string;

  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const albumName =
    albumId === "general"
      ? "General Photos"
      : albumId.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  useEffect(() => {
    getAlbumPhotos(albumId).then((data) => {
      setPhotos(data);
      setLoading(false);
    });
  }, [albumId]);

  // How many photos are HIDDEN beyond the 6-cell grid
  const GRID_LIMIT = 6;
  const extraCount = Math.max(0, photos.length - GRID_LIMIT);
  // The 6 cells we actually render
  const gridPhotos = photos.slice(0, GRID_LIMIT);

  const openLightbox = (startIndex: number) => {
    setActiveIndex(startIndex);
    setLightboxOpen(true);
  };

  // Scroll lightbox to the correct photo when it opens
  useEffect(() => {
    if (!lightboxOpen || !scrollRef.current) return;
    const el = scrollRef.current;
    requestAnimationFrame(() => {
      el.scrollLeft = activeIndex * el.offsetWidth;
    });
  }, [lightboxOpen, activeIndex]);

  // Prevent body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  return (
    <>
      <div
        style={{
          background: "linear-gradient(180deg, #F9EFE5 0%, #FFFDF9 30%, #FFFDF9 100%)",
          minHeight: "100vh",
          paddingBottom: 100,
        }}
      >
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ display: "flex", alignItems: "center", padding: "52px 20px 24px", gap: 12 }}
        >
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => router.back()}
            style={{
              background: "rgba(182,93,55,0.10)",
              border: "none",
              cursor: "pointer",
              width: 36,
              height: 36,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={18} color="#B65D37" />
          </motion.button>

          <div>
            <h1
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 26,
                fontWeight: 500,
                color: "#2C1810",
                fontStyle: "italic",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {albumName}
            </h1>
            {!loading && (
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9B7B6E", margin: "2px 0 0" }}>
                {photos.length} {photos.length === 1 ? "photo" : "photos"}
              </p>
            )}
          </div>
        </motion.div>

        {/* ── Content ── */}
        {loading ? (
          <p style={{ textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 14, color: "#9B7B6E", padding: 40 }}>
            Loading photos…
          </p>
        ) : photos.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", padding: "60px 20px" }}
          >
            <Images size={48} color="#E8D5C8" strokeWidth={1} style={{ marginBottom: 14 }} />
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#B65D37", fontStyle: "italic" }}>
              No photos yet
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#9B7B6E", marginTop: 4 }}>
              Upload the first moment to this album.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            style={{ padding: "0 16px" }}
          >
            {/* ── 2-row × 3-column grid, max 6 cells ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(2, 1fr)",
                gap: 4,
              }}
            >
              {gridPhotos.map((url, i) => {
                const isLastCell = i === GRID_LIMIT - 1;
                const showOverlay = isLastCell && extraCount > 0;

                return (
                  <div
                    key={url}
                    onClick={() => openLightbox(i)}
                    style={{
                      position: "relative",
                      aspectRatio: "1 / 1",
                      overflow: "hidden",
                      cursor: "pointer",
                      background: "#E8D5C8",
                      borderRadius:
                        i === 0 ? "12px 0 0 0" :
                        i === 2 ? "0 12px 0 0" :
                        i === 3 ? "0 0 0 12px" :
                        i === 5 ? "0 0 12px 0" : "0",
                    }}
                  >
                    <img
                      src={url}
                      alt={`Photo ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />

                    {/* "+N" overlay on 6th cell when there are extra photos */}
                    {showOverlay && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(0, 0, 0, 0.58)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 28,
                            fontWeight: 700,
                            color: "#fff",
                            lineHeight: 1,
                          }}
                        >
                          +{extraCount}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tap hint */}
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                color: "#9B7B6E",
                textAlign: "center",
                marginTop: 12,
              }}
            >
              Tap a photo to view
            </p>
          </motion.div>
        )}
      </div>

      {/* ══ Lightbox ══ */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.96)",
              zIndex: 2000,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Top bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 2001,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "48px 20px 12px",
                background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)",
              }}
            >
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                {activeIndex + 1} / {photos.length}
              </span>
              <button
                onClick={() => setLightboxOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  cursor: "pointer",
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={16} color="#fff" />
              </button>
            </div>

            {/* Horizontal photo strip */}
            <div
              ref={scrollRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                const idx = Math.round(el.scrollLeft / el.offsetWidth);
                setActiveIndex(idx);
              }}
              style={{
                display: "flex",
                flex: 1,
                overflowX: "auto",
                overflowY: "hidden",
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch",
              } as React.CSSProperties}
            >
              {photos.map((url, i) => (
                <div
                  key={i}
                  style={{
                    minWidth: "100%",
                    height: "100%",
                    scrollSnapAlign: "start",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "72px 12px 32px",
                    boxSizing: "border-box",
                  }}
                >
                  <img
                    src={url}
                    alt={`Photo ${i + 1}`}
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 6 }}
                  />
                </div>
              ))}
            </div>

            {/* Dot indicators (≤ 20 photos) */}
            {photos.length <= 20 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 28,
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "center",
                  gap: 5,
                  pointerEvents: "none",
                }}
              >
                {photos.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === activeIndex ? 18 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i === activeIndex ? "#C9A96E" : "rgba(255,255,255,0.28)",
                      transition: "width 0.2s ease, background 0.2s ease",
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </>
  );
}
