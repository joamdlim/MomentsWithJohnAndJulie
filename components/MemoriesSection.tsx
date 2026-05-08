"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PolaroidBouquet } from "./PolaroidBouquet";
import { Trophy, Heart, FolderOpen, Camera, Image as ImageIcon, Download, X as XIcon, LogIn } from "lucide-react";
import { getAlbums, getAlbumPhotos, createAlbumAction, deleteAlbumAction, deletePhotoAction, voteAlbumAction, updateAlbumCoverAction } from "@/app/actions/photos";
import { uploadPhotoServerAction, uploadCoverServerAction } from "@/app/actions/upload";
import { getCurrentUserAction } from "@/app/actions/auth";
import imageCompression from "browser-image-compression";

// --- Lightbox Component ---
function PhotoLightbox({ url, onClose }: { url: string; onClose: () => void }) {
  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "memory.jpg";
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 3000,
          background: "rgba(20,10,5,0.75)",
          backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          style={{ position: "relative", maxWidth: "90vw", maxHeight: "85vh" }}
        >
          <img
            src={url}
            alt="Memory"
            style={{ maxWidth: "90vw", maxHeight: "80vh", borderRadius: 16, boxShadow: "0 24px 60px rgba(0,0,0,0.5)", display: "block", objectFit: "contain" }}
          />
          <button
            onClick={onClose}
            style={{ position: "absolute", top: -14, right: -14, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#FFF", backdropFilter: "blur(8px)" }}
          >
            <XIcon size={18} />
          </button>
          <button
            onClick={handleDownload}
            style={{ position: "absolute", bottom: -14, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 24, padding: "8px 20px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#FFF", fontSize: 13, fontWeight: 500, backdropFilter: "blur(8px)" }}
          >
            <Download size={15} /> Save photo
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// --- Main Section Component ---
export function MemoriesSection({ forcedTab, user, onLoginClick }: { forcedTab?: "top" | "folders" | "mine"; user?: { id: string; username: string } | null; onLoginClick?: () => void }) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
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
  const [myAlbumPhotos, setMyAlbumPhotos] = useState<any[]>([]);
  
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [captureSource, setCaptureSource] = useState<"environment" | "user" | undefined>(undefined);

  useEffect(() => {
    loadAlbums();
    getCurrentUserAction().then(setCurrentUser);
  }, []);

  const myAlbum = albums.find(a => a.isOwner);

  useEffect(() => {
    if (myAlbum) {
      getAlbumPhotos(myAlbum.id).then(setMyAlbumPhotos);
    }
  }, [myAlbum?.id]);

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
        if (myAlbum) {
          const photos = await getAlbumPhotos(myAlbum.id);
          setMyAlbumPhotos(photos);
        }
        loadAlbums();
      } else {
        alert(res.error);
      }
    }
  };

  const [newFolderName, setNewFolderName] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleSetAsCover = async (photoUrl: string) => {
    const targetId = activeAlbumId || myAlbum?.id;
    if (!targetId) return;
    try {
      const res = await updateAlbumCoverAction(targetId, photoUrl);
      if (res.success) {
        loadAlbums();
      } else {
        alert("Failed to update cover: " + res.error);
      }
    } catch (err: any) {
      alert("Error updating cover: " + err.message);
    }
  };

  const handleCreateFolder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newFolderName.trim()) return;

    setUploading(true);
    try {
      let coverUrl = undefined;
      if (coverFile) {
        // Compress the cover image
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
          initialQuality: 0.8
        };
        const compressedCover = await imageCompression(coverFile, options);
        
        const formData = new FormData();
        formData.append("file", compressedCover);
        const coverRes = await uploadCoverServerAction(formData);
        if (coverRes.success) {
          coverUrl = coverRes.url;
        } else {
          alert("Failed to upload cover: " + coverRes.error);
          return;
        }
      }

      const res = await createAlbumAction(newFolderName, coverUrl);
      if (res.success) {
        loadAlbums();
        setActiveTab("mine");
        setNewFolderName("");
        setCoverFile(null);
      } else {
        alert(res.error || "Could not create folder.");
      }
    } catch (err: any) {
      alert("Error creating folder: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverFile(e.target.files[0]);
    }
  };

  const triggerUpload = (source: "environment" | "user" | undefined) => {
    setCaptureSource(source);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const targetId = activeAlbumId || myAlbum?.id;
    if (files && files.length > 0 && targetId) {
      setUploading(true);
      try {
        const file = files[0];
        
        // Compress the polaroid photo
        const options = {
          maxSizeMB: 1.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          initialQuality: 0.8
        };
        const compressedFile = await imageCompression(file, options);
        
        const formData = new FormData();
        formData.append("file", compressedFile);
        
        const res = await uploadPhotoServerAction(formData, targetId);
        if (res.success) {
          const photos = await getAlbumPhotos(targetId);
          if (activeAlbumId) setActivePhotos(photos);
          if (targetId === myAlbum?.id) setMyAlbumPhotos(photos);
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
      
      {/* Hidden cover input */}
      <input 
        type="file"
        ref={coverInputRef}
        onChange={handleCoverChange}
        style={{ display: "none" }}
        accept="image/*"
      />



      {/* App Header Logo */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32, marginTop: 16 }}>
        <img src="/Logo.png" alt="J&J Logo" style={{ height: 100, objectFit: "contain" }} />
      </div>

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
                <div style={{ maxWidth: 400, margin: "0 auto" }}>
                  <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: "bold", fontSize: 22, color: "#2C1810", marginBottom: 16, textAlign: "left" }}>
                    Most loved bouquets
                  </h2>
                </div>
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
                      <div style={{ width: 48, height: 48, borderRadius: 8, background: (album.coverUrl || album.photos[0]) ? `url(${album.coverUrl || album.photos[0]}) center/cover` : "#FDF7F2" }} />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontWeight: 600, color: "#2C1810", marginBottom: 2 }}>{album.name}</h3>
                        <p style={{ fontSize: 12, color: "#7A5E51" }}>{album.count} photos</p>
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
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "48px 24px", maxWidth: 1000, margin: "0 auto" }}>
                  {albums.map((album) => (
                    <PolaroidBouquet
                      key={album.id}
                      id={album.id}
                      name={album.name}
                      creatorName={album.name}
                      photoCount={album.count}
                      thumbnailUrl={album.coverUrl || album.photos[0]}
                      votes={album.votes}
                      isOwner={album.isOwner}
                      hasVoted={album.hasVoted}
                      hideLikesCount={true}
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
                {/* Not logged in state */}
                {!user ? (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ maxWidth: 360, margin: "60px auto 0", textAlign: "center" }}
                  >
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🌸</div>
                    <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, color: "#2C1810", marginBottom: 10, fontWeight: 700 }}>
                      Your bouquet awaits
                    </h2>
                    <p style={{ color: "#7A5E51", fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
                      Sign in to create your own folder and share your precious memories from this special day.
                    </p>
                    <button
                      onClick={onLoginClick}
                      style={{
                        background: "#4285F4", color: "#FFF", border: "none", borderRadius: 16,
                        padding: "16px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer",
                        display: "inline-flex", alignItems: "center", gap: 10,
                        boxShadow: "0 6px 20px rgba(66,133,244,0.35)", transition: "all 0.2s",
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(66,133,244,0.45)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(66,133,244,0.35)"; }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" opacity="0.9"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" opacity="0.8"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" opacity="0.85"/>
                      </svg>
                      Sign in with Google
                    </button>
                    <p style={{ marginTop: 16, color: "#B8A09A", fontSize: 13 }}>
                      or use the login button below
                    </p>
                  </motion.div>
                ) : !myAlbum ? (
                  <div style={{ marginTop: 40, maxWidth: 400, margin: "40px auto 0" }}>
                    <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: "bold", color: "#2C1810", marginBottom: 4, display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                      Plant your bouquet 🌷
                    </h2>
                    <p style={{ color: "#7A5E51", fontSize: 14, marginBottom: 24, textAlign: "center" }}>
                      Create a folder to collect your Polaroids.
                    </p>
                    
                    <form onSubmit={handleCreateFolder} style={{ display: "flex", flexDirection: "column", gap: 16, background: "#FFFDF9", padding: 24, borderRadius: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                      <div style={{ display: "flex", gap: 16 }}>
                        {/* Cover Picker */}
                        <div 
                          onClick={() => coverInputRef.current?.click()}
                          style={{ 
                            width: 120, height: 120, borderRadius: 16, background: "#F4EEE8", border: "1px dashed #D6C8BB",
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer",
                            overflow: "hidden", position: "relative", flexShrink: 0
                          }}
                        >
                          {coverFile ? (
                            <img src={URL.createObjectURL(coverFile)} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <>
                              <ImageIcon size={24} color="#9B7B6E" style={{ marginBottom: 8 }} />
                              <span style={{ fontSize: 12, color: "#9B7B6E", textAlign: "center", padding: "0 8px", lineHeight: 1.2 }}>Tap to choose cover</span>
                            </>
                          )}
                        </div>

                        {/* Input */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <input
                            type="text"
                            placeholder="Folder name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            required
                            maxLength={15}
                            style={{ 
                              width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid #E8D5C8", 
                              background: "#FAF0EA", outline: "none", fontSize: 14, color: "#2C1810"
                            }}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={uploading}
                        style={{
                          background: "#B65D37", color: "#FFF", border: "none", borderRadius: 16,
                          padding: "16px", fontSize: 16, fontWeight: 600, cursor: "pointer", width: "100%",
                          marginTop: 8, boxShadow: "0 4px 14px rgba(182,93,55,0.3)"
                        }}
                      >
                        {uploading ? "Creating..." : "Create folder"}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div style={{ position: "relative", textAlign: "left" }}>
                     {/* Delete Folder Button at top right */}
                     <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                        <button 
                          onClick={() => handleDeleteAlbum(myAlbum.id)} 
                          style={{ color: "#B65D37", background: "none", border: "1px solid #B65D37", padding: "6px 12px", borderRadius: 16, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                        >
                           × Delete Folder
                        </button>
                     </div>
                     
                     {/* Header */}
                     <div style={{ marginBottom: 40 }}>
                        <PolaroidBouquet
                          id={myAlbum.id}
                          name={myAlbum.name}
                          creatorName={myAlbum.name}
                          photoCount={myAlbumPhotos.length}
                          thumbnailUrl={myAlbum.coverUrl || myAlbumPhotos[0]?.url}
                          votes={myAlbum.votes}
                          isExpanded={true}
                          onClick={() => {}}
                        />
                     </div>
                     
                     {/* Photo Grid */}
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-8">
                       {myAlbumPhotos.map((photo) => (
                         <div key={photo.id} style={{ position: "relative", aspectRatio: "1", borderRadius: 12, overflow: "hidden", background: "#FFF", padding: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", cursor: "pointer" }}>
                           <div
                             onClick={() => setLightboxUrl(photo.url)}
                             style={{ width: "100%", height: "100%", background: `url(${photo.url}) center/cover`, borderRadius: 6, transition: "transform 0.2s" }}
                             onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                             onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                           />
                           
                           <button
                             onClick={(e) => { e.stopPropagation(); handleSetAsCover(photo.url); }}
                             style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: 12, padding: "4px 8px", fontSize: 10, fontWeight: 600, color: "#B65D37", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                           >
                             <ImageIcon size={12} /> Cover
                           </button>

                           <button
                             onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo.id); }}
                             style={{ position: "absolute", top: 12, right: 12, background: "rgba(182,93,55,0.8)", border: "none", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#FFF" }}
                           >
                             ×
                           </button>
                         </div>
                       ))}
                     </div>
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
                 thumbnailUrl={albums.find(a => a.id === activeAlbumId)?.coverUrl || activePhotos[0]?.url}
                 votes={albums.find(a => a.id === activeAlbumId)?.votes || 0}
                 isExpanded={true}
                 onClick={() => {}}
               />
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {activePhotos.map((photo) => {
                const isAlbumOwner = albums.find(a => a.id === activeAlbumId)?.isOwner;
                const isMyPhoto = currentUser && (photo.userId === currentUser.id || isAlbumOwner);
                return (
                  <div key={photo.id} style={{ position: "relative", aspectRatio: "1", borderRadius: 12, overflow: "hidden", background: "#FFF", padding: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", cursor: "pointer" }}>
                    <div
                      onClick={() => setLightboxUrl(photo.url)}
                      style={{ width: "100%", height: "100%", background: `url(${photo.url}) center/cover`, borderRadius: 6, transition: "transform 0.2s" }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    
                    {/* Set Cover button overlay */}
                    {isAlbumOwner && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSetAsCover(photo.url); }}
                        style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: 12, padding: "4px 8px", fontSize: 10, fontWeight: 600, color: "#B65D37", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                      >
                        <ImageIcon size={12} /> Cover
                      </button>
                    )}

                    {/* Delete button overlay */}
                    {isMyPhoto && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo.id); }}
                        style={{ position: "absolute", top: 12, right: 12, background: "rgba(182,93,55,0.8)", border: "none", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#FFF" }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Lightbox */}
      {lightboxUrl && <PhotoLightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}

      {/* Add Photo Buttons */}
      {activeTab === "mine" && myAlbum && (
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
    </div>
  );
}
