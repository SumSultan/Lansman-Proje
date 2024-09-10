import React, { useEffect, useState } from "react";

interface HeaderSectionProps {
  title?: string;
  logoMedia?: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ title, logoMedia }) => {
  const logoMediaUrl = logoMedia
    ? `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${logoMedia}`
    : undefined;

  const [animate, setAnimate] = useState(false);
  const [hoverAnimate, setHoverAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true); // Bileşen yüklendiğinde animasyonu tetikler
  }, []);

  return (
    <div
      style={{
        width: "1439px",
        height: "100px",
        padding: "35px 0",
        backgroundColor: "#ffffff",
        textAlign: "center",
        borderRadius: "30px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: "25px",
        paddingRight: "35px",
        overflow: "hidden",
      }}
      // Hover sırasında hover animasyonunu başlatır
      onMouseEnter={() => setHoverAnimate(true)}
      onMouseLeave={() => setHoverAnimate(false)}
    >
      {/* Başlık (İlk açıldığında soldan sağa animasyon) */}
      <h2
        style={{
          color: "#000",
          fontFamily: "'Roboto', sans-serif",
          fontSize: "60px",
          fontWeight: "bold",
          margin: 0,
          transform: animate
            ? hoverAnimate
              ? "translateY(-10px)" // Hover sırasında yukarı sürüklenir
              : "translateX(0)" // İlk açılış animasyonu: soldan sağa gelir
            : "translateX(-150%)", // Başlangıçta dışarıda
          transition: hoverAnimate
            ? "transform 0.5s ease" // Hover sırasında yukarı-aşağı kayma
            : "transform 1.3s ease-in-out", // İlk açılış animasyonu süresi
        }}
      >
        {title}
      </h2>

      {/* Logo (İlk açıldığında sağdan sola animasyon) */}
      {logoMediaUrl && (
        <img
          src={logoMediaUrl}
          alt="Logo Media"
          style={{
            width: "400px",
            height: "400px",
            borderRadius: "10px",
            objectFit: "contain",
            overflow: "hidden",
            transform: animate
              ? hoverAnimate
                ? "translateY(-10px)" // Hover sırasında yukarı sürüklenir
                : "translateX(0)" // İlk açılış animasyonu: sağdan sola gelir
              : "translateX(150%)", // Başlangıçta dışarıda
            transition: hoverAnimate
              ? "transform 0.5s ease" // Hover sırasında yukarı-aşağı kayma
              : "transform 1.3s ease-in-out", // İlk açılış animasyonu süresi
          }}
        />
      )}
    </div>
  );
};

export default HeaderSection;
