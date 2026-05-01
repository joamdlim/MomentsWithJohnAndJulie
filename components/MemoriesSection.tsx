"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PolaroidBouquet } from "./PolaroidBouquet";
import { Trophy, Heart, FolderOpen, Camera } from "lucide-react";
import { getAlbums, getAlbumPhotos, createAlbumAction, deleteAlbumAction, deletePhotoAction, voteAlbumAction } from "@/app/actions/photos";
import { uploadPhotoServerAction } from "@/app/actions/upload";
import { getCurrentUserAction } from "@/app/actions/auth";

// --- Main Section Component ---
export function MemoriesSection({ forcedTab }: { forcedTab?: "top" | "folders" | "mine" }) {
  const [activeTab, setActiveTab] = useState<"top" | "folders" | "mine">("folders");

  useEffect(() => {
    if (forcedTab) {
      setActiveTab(forcedTab);
      setActiveAlbumId(null); // Reset view when switching tabs
    }
  }, [forcedTab]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Expanded state
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [activePhotos, setActivePhotos] = useState<any[]>([]);
  
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [captureSource, setCaptureSource] = useState<"environment" | "user">("environment");

  useEffect(() => {
    loadAlbums();
    getCurrentUserAction().then(setCurrentUser);
  }, []);

  const loadAlbums = async () => {
    const data = await getAlbums();
    setAlbums(data);
  };

  const handleBouquetClick = async (albumId: string) => {
    setActiveAlbumId(albumId);
    const photos = await getAlbumPhotos(albumId);
    setActivePhotos(photos);
  };

  const handleVoteAlbum = async (albumId: string) => {
    await voteAlbumAction(albumId);
    loadAlbums();
  };
  
  const handleDeleteAlbum = async (albumId: string) => {
    if (window.confirm("Are you sure you want to delete your folder and all its photos?")) {
      const res = await deleteAlbumAction(albumId);
      if (res.success) {
        loadAlbums();
      } else {
        alert(res.error);
      }
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (window.confirm("Delete this photo?")) {
      const res = await deletePhotoAction(photoId);
      if (res.success) {
        if (activeAlbumId) {
          const photos = await getAlbumPhotos(activeAlbumId);
          setActivePhotos(photos);
        }
      } else {
        alert(res.error);
      }
    }
  };

  const handleCreateFolder = async () => {
    const name = window.prompt("Enter your name for the folder:");
    if (name && name.trim()) {
      const res = await createAlbumAction(name);
      if (res.success) {
        loadAlbums();
        setActiveTab("mine");
      } else {
        alert(res.error || "Could not create folder.");
      }
    }
  };

  const triggerUpload = (source: "environment" | "user" | undefined) => {
    setCaptureSource(source || "environment");
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && activeAlbumId) {
      setUploading(true);
      try {
        const file = files[0];
        const formData = new FormData();
        formData.append("file", file);
        
        const res = await uploadPhotoServerAction(formData, activeAlbumId);
        if (res.success) {
          const photos = await getAlbumPhotos(activeAlbumId);
          setActivePhotos(photos);
          loadAlbums();
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

  // Derived data
  const topAlbums = [...albums].sort((a, b) => b.votes - a.votes).slice(0, 5);
  const myAlbum = albums.find(a => a.isOwner);

  return (
    <div style={{
      background: "#FAF0EA",
      minHeight: "100vh",
      padding: "24px 16px 100px",
      fontFamily: "Inter, sans-serif"
    }}>
      
      {/* Hidden file input */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*"
        capture={captureSource}
      />



      <AnimatePresence mode="wait">
        {!activeAlbumId ? (
          <motion.div
            key={`tab-${activeTab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {activeTab === "top" && (
              <div>
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, color: "#2C1810", marginBottom: 24, textAlign: "center" }}>
                  Most loved bouquets
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400, margin: "0 auto" }}>
                  {topAlbums.map((album, idx) => (
                    <div key={album.id} style={{ display: "flex", alignItems: "center", background: "#FFF", borderRadius: 16, padding: "16px", gap: 16, boxShadow: "0 2px 12px rgba(182,93,55,0.06)" }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: idx === 0 ? "#F4D068" : idx === 1 ? "#A6BCA0" : idx === 2 ? "#E5B097" : "#E8D5C8",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "Cormorant Garamond, serif", fontWeight: "bold", fontSize: 18, color: idx <= 2 ? "#2C1810" : "#5C3D2E"
                      }}>
                        {idx + 1}
                      </div>
                      <div style={{ width: 48, height: 48, borderRadius: 8, background: album.photos[0] ? `url(${album.photos[0]}) center/cover` : "#FDF7F2" }} />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontWeight: 600, color: "#2C1810", marginBottom: 2 }}>{album.name}</h3>
                        <p style={{ fontSize: 12, color: "#7A5E51" }}>by {album.name} · {album.count} photos</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#B65D37", fontWeight: 600, fontSize: 14 }}>
                        <Heart size={16} fill={album.hasVoted ? "#B65D37" : "none"} />
                        {album.votes}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "folders" && (
              <div>
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, color: "#2C1810", marginBottom: 32, textAlign: "center" }}>
                  A garden of bouquets
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-4 max-w-4xl mx-auto">
                  {albums.map((album) => (
                    <PolaroidBouquet
                      key={album.id}
                      id={album.id}
                      name={album.name}
                      creatorName={album.name}
                      photoCount={album.count}
                      thumbnailUrl={album.photos[0]}
                      votes={album.votes}
                      isOwner={album.isOwner}
                      hasVoted={album.hasVoted}
                      onClick={() => handleBouquetClick(album.id)}
                      onVote={() => handleVoteAlbum(album.id)}
                      onDelete={() => handleDeleteAlbum(album.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "mine" && (
              <div style={{ textAlign: "center" }}>
                {!myAlbum ? (
                  <div style={{ marginTop: 60 }}>
                    <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, color: "#2C1810", marginBottom: 16 }}>
                      Start your own bouquet
                    </h2>
                    <p style={{ color: "#7A5E51", fontSize: 14, marginBottom: 32, maxWidth: 300, margin: "0 auto 32px" }}>
                      Create a folder to share your photos of our special day.
                    </p>
                    <button
                      onClick={handleCreateFolder}
                      style={{
                        background: "#B65D37", color: "#FFF", border: "none", borderRadius: 24,
                        padding: "14px 28px", fontSize: 16, fontWeight: 500, cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(182,93,55,0.3)"
                      }}
                    >
                      Start a new folder
                    </button>
                  </div>
                ) : (
                  <div>
                    <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 20, color: "#7A5E51", marginBottom: 40 }}>
                      tap your bouquet to bloom
                    </h2>
                    <PolaroidBouquet
                      id={myAlbum.id}
                      name={myAlbum.name}
                      creatorName={myAlbum.name}
                      photoCount={myAlbum.count}
                      thumbnailUrl={myAlbum.photos[0]}
                      votes={myAlbum.votes}
                      isOwner={true}
                      hasVoted={myAlbum.hasVoted}
                      onClick={() => handleBouquetClick(myAlbum.id)}
                      onDelete={() => handleDeleteAlbum(myAlbum.id)}
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="album-detail"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ position: "relative" }}
          >
            <button
              onClick={() => setActiveAlbumId(null)}
              style={{ background: "none", border: "none", color: "#7A5E51", fontSize: 14, cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}
            >
              ← Back
            </button>

            {/* Expanded Bouquet Header */}
            <div style={{ marginBottom: 40 }}>
               <PolaroidBouquet
                 id={activeAlbumId}
                 name={albums.find(a => a.id === activeAlbumId)?.name || ""}
                 creatorName={albums.find(a => a.id === activeAlbumId)?.name || ""}
                 photoCount={activePhotos.length}
                 thumbnailUrl={activePhotos[0]?.url}
                 votes={albums.find(a => a.id === activeAlbumId)?.votes || 0}
                 isExpanded={true}
                 onClick={() => {}}
               />
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {activePhotos.map((photo) => {
                const isMyPhoto = currentUser && (photo.userId === currentUser.id || albums.find(a => a.id === activeAlbumId)?.isOwner);
                return (
                  <div key={photo.id} style={{ position: "relative", aspectRatio: "1", borderRadius: 12, overflow: "hidden", background: "#FFF", padding: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <div style={{ width: "100%", height: "100%", background: `url(${photo.url}) center/cover`, borderRadius: 6 }} />
                    


                    {/* Delete button overlay */}
                    {isMyPhoto && (
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        style={{ position: "absolute", top: 12, right: 12, background: "rgba(182,93,55,0.8)", border: "none", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#FFF" }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Photo Buttons */}
            {activeTab === "mine" && (
              <div style={{ position: "fixed", bottom: 90, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 12, padding: "0 20px", zIndex: 50 }}>
                <button
                  onClick={() => triggerUpload("environment")}
                  disabled={uploading}
                  style={{ flex: 1, maxWidth: 160, padding: "14px", background: "#B65D37", color: "#FFF", border: "none", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", boxShadow: "0 4px 16px rgba(182,93,55,0.3)" }}
                >
                  <Camera size={18} />
                  {uploading ? "Uploading..." : "Camera"}
                </button>
                <button
                  onClick={() => triggerUpload(undefined)}
                  disabled={uploading}
                  style={{ flex: 1, maxWidth: 160, padding: "14px", background: "#FFF", color: "#B65D37", border: "1px solid #E8D5C8", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}
                >
                  <FolderOpen size={18} />
                  {uploading ? "Wait..." : "Gallery"}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
