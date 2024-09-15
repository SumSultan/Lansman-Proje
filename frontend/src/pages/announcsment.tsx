import React from "react";

interface AnnouncementProps {
  message: string;
}

const Announcement: React.FC<AnnouncementProps> = ({ message }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "10px", // Sayfanın üstünden biraz boşluk bırak
        left: "50%",
        transform: "translateX(-50%)", // Ortaya hizala
        width: "40%", // Genişliği %80 yaparak daha küçük hale getir
        backgroundColor: "rgba(255, 255, 255, 0.7)", // Saydam beyaz arka plan
        color: "black",
        textAlign: "center",
        padding: "10px 20px",
        zIndex: 1000, // Sayfanın en üstünde kalması için yüksek z-index
        overflow: "hidden", // Taşan içeriği gizle
        whiteSpace: "nowrap", // Tek satırda göster
        borderRadius: "10px", // Kenarları yuvarlat
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Hafif gölge ekle
      }}
    >
      <div
        style={{
          display: "inline-block",
          animation: "scroll-left 10s linear infinite", // Kayan metin animasyonu
        }}
      >
        {message}
      </div>
      <style>
        {`
          @keyframes scroll-left {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Announcement;