"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Trophy, Folder, CircleUser, LogIn, LogOut } from "lucide-react";

const tabs = [
  { id: "top",     label: "TOP",     icon: Trophy },
  { id: "folders", label: "FOLDERS", icon: Folder },
  { id: "mine",    label: "MINE",    icon: CircleUser },
] as const;

type TabId = (typeof tabs)[number]["id"];

interface BottomNavProps {
  user: { id: string; username: string } | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export function BottomNav({ user, onLoginClick, onLogoutClick }: BottomNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = (searchParams.get("tab") as TabId) || "folders";

  const setTab = (id: TabId) => {
    router.push(`/?tab=${id}`);
  };

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 32px)",
        maxWidth: 380,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderRadius: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        height: 64,
        zIndex: 100,
        boxShadow: "0 8px 36px rgba(182,93,55,0.16), 0 2px 10px rgba(0,0,0,0.07)",
        padding: "0 12px",
        gap: 8,
      }}
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              display: "flex",
              flexDirection: isActive ? "row" : "column",
              alignItems: "center",
              justifyContent: "center",
              gap: isActive ? 8 : 4,
              background: isActive ? "#B65D37" : "transparent",
              border: "none",
              borderRadius: 50,
              padding: isActive ? "10px 20px" : "8px 12px",
              cursor: "pointer",
              height: 48,
              flex: isActive ? "1 1 auto" : "0 1 auto",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              whiteSpace: "nowrap",
              WebkitTapHighlightColor: "transparent",
              outline: "none",
            }}
          >
            <Icon
              size={isActive ? 18 : 22}
              strokeWidth={isActive ? 2.5 : 1.8}
              color={isActive ? "#fff" : "#9B7B6E"}
            />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: isActive ? 12 : 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#fff" : "#9B7B6E",
                letterSpacing: "0.05em",
                lineHeight: 1,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}

      {/* Auth Button */}
      <button
        onClick={user ? onLogoutClick : onLoginClick}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          background: "transparent",
          border: "none",
          borderRadius: 50,
          padding: "8px 12px",
          cursor: "pointer",
          height: 48,
          flex: "0 1 auto",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          whiteSpace: "nowrap",
          WebkitTapHighlightColor: "transparent",
          outline: "none",
        }}
      >
        {user ? (
          <LogOut size={22} strokeWidth={1.8} color="#9B7B6E" />
        ) : (
          <LogIn size={22} strokeWidth={1.8} color="#9B7B6E" />
        )}
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 10,
            fontWeight: 400,
            color: "#9B7B6E",
            letterSpacing: "0.05em",
            lineHeight: 1,
          }}
        >
          {user ? "LOGOUT" : "LOGIN"}
        </span>
      </button>
    </nav>
  );
}
