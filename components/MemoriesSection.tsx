"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PolaroidBouquet } from "./PolaroidBouquet";
import { Trophy, Heart, FolderOpen, Camera, Image as ImageIcon } from "lucide-react";
import { getAlbums, getAlbumPhotos, createAlbumAction, deleteAlbumAction, deletePhotoAction, voteAlbumAction, updateAlbumCoverAction } from "@/app/actions/photos";
import { uploadPhotoServerAction, uploadCoverServerAction } from "@/app/actions/upload";
import { getCurrentUserAction } from "@/app/actions/auth";
import imageCompression from "browser-image-compression";

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
                {!myAlbum ? (
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
                         <div key={photo.id} style={{ position: "relative", aspectRatio: "1", borderRadius: 12, overflow: "hidden", background: "#FFF", padding: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                           <div style={{ width: "100%", height: "100%", background: `url(${photo.url}) center/cover`, borderRadius: 6 }} />
                           
                           <button
                             onClick={() => handleSetAsCover(photo.url)}
                             style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: 12, padding: "4px 8px", fontSize: 10, fontWeight: 600, color: "#B65D37", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                           >
                             <ImageIcon size={12} /> Cover
                           </button>

                           <button
                             onClick={() => handleDeletePhoto(photo.id)}
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
                  <div key={photo.id} style={{ position: "relative", aspectRatio: "1", borderRadius: 12, overflow: "hidden", background: "#FFF", padding: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <div style={{ width: "100%", height: "100%", background: `url(${photo.url}) center/cover`, borderRadius: 6 }} />
                    
                    {/* Set Cover button overlay */}
                    {isAlbumOwner && (
                      <button
                        onClick={() => handleSetAsCover(photo.url)}
                        style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: 12, padding: "4px 8px", fontSize: 10, fontWeight: 600, color: "#B65D37", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                      >
                        <ImageIcon size={12} /> Cover
                      </button>
                    )}

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
          </motion.div>
        )}
      </AnimatePresence>

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
