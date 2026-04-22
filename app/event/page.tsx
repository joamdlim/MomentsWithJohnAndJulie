"use client";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { CornerAccent } from "@/components/CornerAccent";
import { MapPin, CalendarDays } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.14, duration: 0.6, ease: "easeOut" },
  }),
};

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  mapUrl: string;
  calendarUrl: string;
  index: number;
}

function EventCard({
  title,
  date,
  time,
  location,
  address,
  mapUrl,
  calendarUrl,
  index,
}: EventCardProps) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      style={{ margin: "0 20px 20px" }}
    >
      <div
        className="wedding-card"
        style={{ padding: "28px 28px 24px", position: "relative" }}
      >
        <CornerAccent position="tl" />
        <CornerAccent position="br" />

        {/* Title */}
        <h2
          style={{
            textAlign: "center",
            fontFamily: "Cormorant Garamond, serif",
            fontSize: 34,
            fontWeight: 500,
            color: "#B65D37",
            fontStyle: "italic",
            marginBottom: 24,
          }}
        >
          {title}
        </h2>

        {/* Date */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <p
            style={{
              fontFamily: "Cormorant SC, serif",
              fontSize: 10,
              letterSpacing: "0.28em",
              color: "#9B7B6E",
              marginBottom: 4,
            }}
          >
            DATE
          </p>
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 20,
              color: "#B65D37",
              fontWeight: 500,
            }}
          >
            {date}
          </p>
        </div>

        {/* Time */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <p
            style={{
              fontFamily: "Cormorant SC, serif",
              fontSize: 10,
              letterSpacing: "0.28em",
              color: "#9B7B6E",
              marginBottom: 4,
            }}
          >
            TIME
          </p>
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 26,
              color: "#2C1810",
              fontWeight: 400,
            }}
          >
            {time}
          </p>
        </div>

        {/* Location */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <p
            style={{
              fontFamily: "Cormorant SC, serif",
              fontSize: 10,
              letterSpacing: "0.28em",
              color: "#9B7B6E",
              marginBottom: 4,
            }}
          >
            LOCATION
          </p>
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 20,
              color: "#B65D37",
              fontWeight: 500,
            }}
          >
            {location}
          </p>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              color: "#9B7B6E",
              marginTop: 2,
            }}
          >
            {address}
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "linear-gradient(to right, transparent, #E8D5C8, transparent)",
            marginBottom: 20,
          }}
        />

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            id={`map-btn-${title.toLowerCase()}`}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "11px 8px",
              border: "1.5px solid #B65D37",
              borderRadius: 10,
              textDecoration: "none",
              color: "#B65D37",
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              transition: "all 0.2s ease",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#B65D37";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#B65D37";
            }}
          >
            <MapPin size={15} strokeWidth={2} />
            Open Map
          </a>
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            id={`cal-btn-${title.toLowerCase()}`}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "11px 8px",
              border: "1.5px solid #B65D37",
              borderRadius: 10,
              textDecoration: "none",
              color: "#B65D37",
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              transition: "all 0.2s ease",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#B65D37";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#B65D37";
            }}
          >
            <CalendarDays size={15} strokeWidth={2} />
            Add to Calendar
          </a>
        </div>
      </div>
    </motion.div>
  );
}

const CEREMONY_CALENDAR = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=John+%26+Julie+Wedding+Ceremony&dates=20260516T160000/20260516T170000&details=Ceremony+at+St.+Mary%27s+Chapel&location=123+Garden+Lane,+Sonoma,+CA`;
const RECEPTION_CALENDAR = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=John+%26+Julie+Wedding+Reception&dates=20260516T180000/20260516T230000&details=Reception+at+Vineyard+Estate&location=456+Winery+Road,+Sonoma,+CA`;

export default function EventPage() {
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
            Event Details
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              color: "#9B7B6E",
            }}
          >
            Join us for our special day
          </p>
        </motion.div>

        {/* Ceremony */}
        <EventCard
          title="Ceremony"
          date="May 16, 2026"
          time="4:00 PM"
          location="St. Mary's Chapel"
          address="123 Garden Lane, Sonoma, CA"
          mapUrl="https://www.google.com/maps/search/?api=1&query=123+Garden+Lane+Sonoma+CA"
          calendarUrl={CEREMONY_CALENDAR}
          index={1}
        />

        {/* Reception */}
        <EventCard
          title="Reception"
          date="May 16, 2026"
          time="6:00 PM"
          location="Vineyard Estate"
          address="456 Winery Road, Sonoma, CA"
          mapUrl="https://www.google.com/maps/search/?api=1&query=456+Winery+Road+Sonoma+CA"
          calendarUrl={RECEPTION_CALENDAR}
          index={2}
        />
      </div>

      <BottomNav />
    </>
  );
}
