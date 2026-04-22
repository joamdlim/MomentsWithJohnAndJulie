"use client";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { CornerAccent } from "@/components/CornerAccent";
import { Camera, Plus, FolderOpen, Image } from "lucide-react";
import { useState, useRef } from "react";
import { getPresignedUrl } from "@/app/actions/upload";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

import { useEffect } from "react";

export default function PhotosPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [albums, setAlbums] = useState<any[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("general");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    import("@/app/actions/photos").then(({ getAlbums }) => {
      getAlbums().then(data => {
        const fallback = data.length > 0 ? data : [{ id: "general", name: "General Photos", count: 0, color: "#F2E8E0" }];
        setAlbums(fallback);
        setSelectedAlbumId(fallback[0].id);
      });
    });
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      const { uploadPhotoServerAction } = await import("@/app/actions/upload");
      
      const formData = new FormData();
      formData.append("file", file);
      
      const result = await uploadPhotoServerAction(formData, selectedAlbumId);

      if (result.success) {
        alert("Photo uploaded successfully!");
        setShowUploadModal(false);
        window.location.reload();
      } else {
        alert("Failed to upload photo: " + result.error);
      }
    } catch (err: any) {
      console.error(err);
      alert("Error during upload: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
            Photo Gallery
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              color: "#9B7B6E",
            }}
          >
            Share your favorite moments
          </p>
        </motion.div>

        {/* Album Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            padding: "0 20px 20px",
          }}
        >
          {albums.map((album, i) => (
            <motion.div
              key={album.id}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="wedding-card"
                style={{
                  padding: "20px 16px 16px",
                  position: "relative",
                  cursor: "pointer",
                  minHeight: 140,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <CornerAccent position="tl" size={30} />
                <CornerAccent position="br" size={30} />

                {/* Folder icon */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: album.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <FolderOpen
                    size={26}
                    color={i < 2 ? "#B65D37" : "#C9A96E"}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Name */}
                <p
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: 14,
                    color: "#B65D37",
                    textAlign: "center",
                    fontWeight: 500,
                    lineHeight: 1.3,
                    marginBottom: 4,
                  }}
                >
                  {album.name}
                </p>

                {/* Count */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: "#9B7B6E",
                  }}
                >
                  <Image size={11} strokeWidth={1.5} />
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 11,
                      color: "#9B7B6E",
                    }}
                  >
                    {album.count}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Capture Moment + Plus buttons */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            display: "flex",
            gap: 12,
            padding: "4px 20px 24px",
          }}
        >
          <motion.button
            id="capture-moment-btn"
            onClick={() => setShowUploadModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "15px 20px",
              background: "#B65D37",
              border: "none",
              borderRadius: 14,
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(182,93,55,0.3)",
              letterSpacing: "0.02em",
            }}
          >
            <Camera size={18} strokeWidth={2} />
            Capture Moment
          </motion.button>

          <motion.button
            id="new-album-btn"
            onClick={async () => {
              const name = prompt("Enter album name:");
              if (!name) return;
              const { createAlbumAction } = await import("@/app/actions/photos");
              const res = await createAlbumAction(name);
              if (res.success) {
                alert("Album created!");
                window.location.reload();
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 52,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#B65D37",
              border: "none",
              borderRadius: 14,
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(182,93,55,0.3)",
              flexShrink: 0,
            }}
          >
            <Plus size={22} strokeWidth={2.5} />
          </motion.button>
        </motion.div>

        {/* Upload Modal Placeholder (Phase 1 UI) */}
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(44, 24, 16, 0.5)",
              zIndex: 200,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 430,
                background: "#fff",
                borderRadius: "24px 24px 0 0",
                padding: "28px 28px 48px",
                position: "relative",
              }}
            >
              {/* Pull handle */}
              <div
                style={{
                  width: 36,
                  height: 4,
                  background: "#E8D5C8",
                  borderRadius: 2,
                  margin: "0 auto 20px",
                }}
              />

              <h3
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: 26,
                  color: "#2C1810",
                  textAlign: "center",
                  marginBottom: 8,
                  fontStyle: "italic",
                }}
              >
                Share a Moment
              </h3>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  color: "#9B7B6E",
                  textAlign: "center",
                  marginBottom: 16,
                  lineHeight: 1.5,
                }}
              >
                Upload your favorite photo from our special day
              </p>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, color: "#2C1810", marginBottom: 6, fontWeight: 500 }}>
                  Choose Album:
                </label>
                <select 
                  value={selectedAlbumId}
                  onChange={(e) => setSelectedAlbumId(e.target.value)}
                  style={{ 
                    width: "100%", padding: "12px", 
                    borderRadius: 10, border: "1px solid #E8D5C8", 
                    background: "#FFFDF9", color: "#2C1810",
                    fontFamily: "Inter, sans-serif", fontSize: 14
                  }}
                >
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              {/* Upload area */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: "none" }} 
                accept="image/*"
              />
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                style={{
                  border: "2px dashed #E8D5C8",
                  borderRadius: 16,
                  padding: "36px 24px",
                  textAlign: "center",
                  background: "#FFFDF9",
                  cursor: uploading ? "wait" : "pointer",
                  marginBottom: 20,
                  opacity: uploading ? 0.6 : 1,
                }}
              >
                <Camera size={36} color="#C9A96E" strokeWidth={1.5} />
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    color: "#9B7B6E",
                    marginTop: 12,
                  }}
                >
                  {uploading ? "Uploading..." : "Tap to choose a photo"}
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 11,
                    color: "#C9A96E",
                    marginTop: 4,
                  }}
                >
                  {uploading ? "Please wait a moment" : "Directly uploads to MinIO"}
                </p>
              </div>

              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#B65D37",
                  border: "none",
                  borderRadius: 12,
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </>
  );
}
