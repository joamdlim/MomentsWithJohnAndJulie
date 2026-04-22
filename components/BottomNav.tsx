"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Calendar, Camera, Users } from "lucide-react";

const tabs = [
  { id: "home",      label: "HOME",      icon: Home },
  { id: "details",   label: "DETAILS",   icon: Calendar },
  { id: "memories",  label: "MEMORIES",  icon: Camera },
  { id: "entourage", label: "ENTOURAGE", icon: Users },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function BottomNav() {
  const [active, setActive] = useState<TabId>("home");
  const locked = useRef(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (locked.current) return;
      const mid = window.scrollY + window.innerHeight * 0.45;
      const order: TabId[] = ["entourage", "memories", "details", "home"];
      for (const id of order) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: TabId) => {
    if (pathname !== "/home") {
      router.push("/home");
      return;
    }
    locked.current = true;
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => { locked.current = false; }, 1200);
  };

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 32px)",
        maxWidth: 400,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderRadius: 50,
        display: "flex",
        alignItems: "center",
        height: 62,
        zIndex: 100,
        boxShadow:
          "0 8px 36px rgba(182,93,55,0.16), 0 2px 10px rgba(0,0,0,0.07)",
        padding: "0 8px",
        gap: 2,
      }}
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            id={`nav-${id}`}
            onClick={() => scrollTo(id)}
            style={{
              display: "flex",
              flexDirection: isActive ? "row" : "column",
              alignItems: "center",
              justifyContent: "center",
              gap: isActive ? 6 : 3,
              background: isActive ? "#B65D37" : "transparent",
              border: "none",
              borderRadius: 50,
              padding: isActive ? "10px 18px" : "8px 4px",
              cursor: "pointer",
              height: 46,
              /* Active tab takes its natural size; inactive tabs share remaining space */
              flex: isActive ? "0 0 auto" : 1,
              transition:
                "background 0.3s ease, padding 0.3s ease, gap 0.3s ease",
              whiteSpace: "nowrap",
              WebkitTapHighlightColor: "transparent",
              outline: "none",
            }}
          >
            <Icon
              size={isActive ? 17 : 20}
              strokeWidth={isActive ? 2.2 : 1.6}
              color={isActive ? "#fff" : "#9B7B6E"}
            />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: isActive ? 11 : 9,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#fff" : "#9B7B6E",
                letterSpacing: "0.07em",
                lineHeight: 1,
                marginTop: isActive ? 0 : 1,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
