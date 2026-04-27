import { motion } from "framer-motion";
import { Camera, Heart } from "lucide-react";
import Image from "next/image";

interface PolaroidBouquetProps {
  id: string;
  name: string;
  photoCount: number;
  thumbnailUrl?: string;
  creatorName?: string;
  votes: number;
  rank?: number;
  isOwner?: boolean;
  onClick: () => void;
  onVote?: () => void;
  onDelete?: () => void;
  isExpanded?: boolean;
}

export function PolaroidBouquet({
  id,
  name,
  photoCount,
  thumbnailUrl,
  creatorName = "Anonymous",
  votes,
  rank,
  isOwner,
  onClick,
  onVote,
  onDelete,
  isExpanded = false
}: PolaroidBouquetProps) {
  
  // Create 5 cards for the bouquet effect
  const cards = Array.from({ length: 5 });
  
  // If expanded, the spread is wider and moved up
  const rotations = isExpanded 
    ? [-40, -20, 0, 20, 40] 
    : [-25, -12, 0, 12, 25];
    
  const yOffsets = isExpanded
    ? [20, 5, 0, 5, 20]
    : [10, 2, 0, 2, 10];
    
  const xOffsets = isExpanded
    ? [-60, -30, 0, 30, 60]
    : [-20, -10, 0, 10, 20];

  return (
    <motion.div
      whileHover={!isExpanded ? { scale: 1.05 } : {}}
      whileTap={!isExpanded ? { scale: 0.95 } : {}}
      onClick={!isExpanded ? onClick : undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: !isExpanded ? "pointer" : "default",
        position: "relative",
        padding: "20px 10px",
        width: "100%",
        maxWidth: 200,
        margin: "0 auto",
      }}
    >
      {/* Delete button for owners */}
      {isOwner && onDelete && !isExpanded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: "rgba(182,93,55,0.1)",
            border: "none",
            borderRadius: "50%",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#B65D37",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          ×
        </button>
      )}

      {/* Rank indicator for top tab */}
      {rank && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: rank === 1 ? "#F4D068" : rank === 2 ? "#A6BCA0" : rank === 3 ? "#E5B097" : "#E8D5C8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: "bold",
          fontSize: 18,
          color: rank <= 3 ? "#2C1810" : "#5C3D2E",
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          {rank}
        </div>
      )}

      {/* The Cards */}
      <div style={{ position: "relative", width: 100, height: 120, zIndex: 2 }}>
        {cards.map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              rotate: rotations[i],
              y: yOffsets[i],
              x: xOffsets[i],
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "#FFF",
              borderRadius: 8,
              boxShadow: i === 2 
                ? "0 4px 12px rgba(0,0,0,0.15)" 
                : "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.04)",
              transformOrigin: "bottom center",
              zIndex: i === 2 ? 5 : i < 2 ? i : 4 - i,
              padding: 6,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Inner photo area */}
            <div style={{
              flex: 1,
              background: i === 2 && thumbnailUrl ? `url(${thumbnailUrl}) center/cover` : "#FDF7F2",
              borderRadius: 4,
              overflow: "hidden",
            }}>
               {i === 2 && !thumbnailUrl && (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
                     <Camera size={24} color="#C9A96E" />
                  </div>
               )}
            </div>
            {/* Polaroid caption space */}
            <div style={{
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {i === 2 && (
                <span style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontStyle: "italic",
                  fontSize: 12,
                  color: "#B65D37",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "90%"
                }}>
                  {name.length > 10 && !isExpanded ? name.substring(0, 8) + '...' : name}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* The Stem */}
      <div style={{
        width: 6,
        height: isExpanded ? 60 : 40,
        background: "#4A6B4E", // Dark green stem
        borderRadius: 3,
        marginTop: -10, // overlap with cards
        zIndex: 1,
        transition: "height 0.3s ease"
      }} />

      {/* Details */}
      <div style={{ marginTop: 12, textAlign: "center", width: "100%" }}>
        <h3 style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: 18,
          fontWeight: 600,
          color: "#2C1810",
          marginBottom: 4,
        }}>
          {name}
        </h3>
        
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          fontFamily: "Inter, sans-serif",
          fontSize: 12,
          color: "#7A5E51",
        }}>
          <span>by {creatorName}</span>
          <span>·</span>
          <span>{photoCount}</span>
          <Camera size={12} />
        </div>

        {/* Voting section */}
        {onVote && (
          <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVote();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(182,93,55,0.08)",
                border: "none",
                borderRadius: 12,
                padding: "4px 10px",
                cursor: "pointer",
                color: "#B65D37",
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              <Heart size={14} fill={votes > 0 ? "#B65D37" : "none"} />
              {votes}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
