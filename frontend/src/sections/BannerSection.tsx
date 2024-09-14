import React from "react";
import { useInView } from "react-intersection-observer";

interface BannerSectionProps {
  buttonText: string;
  buttonUrl: string;
  media: string;
}

const BannerSection: React.FC<BannerSectionProps> = ({
  buttonText,
  buttonUrl,
  media,
}) => {
  // Medya URL ve dosya türünü ayırt etme
  const mediaUrl = `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${media}`;
  const mediaType = media.split(".").pop()?.toLowerCase();

  // Intersection Observer kullanarak görünürlüğü kontrol etme
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  // Kartın başlangıç stili (animasyon öncesi)
  const sectionStyle: React.CSSProperties = {
    width: "1270px",
    maxWidth: "100%",
    height: "300px",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    opacity: 0,
    transform: "translateY(20px)", // Aşağıda başlar
    transition: "transform 1.3s ease, opacity 1.3s ease", // Geçiş efektleri
  };

  // Kartın görünür olduğunda uygulanacak stili
  const visibleStyle: React.CSSProperties = {
    opacity: 1,
    transform: "translateY(0)", // Yukarı doğru hareket
  };

  const renderMedia = () => {
    if (mediaType === "mp4" || mediaType === "webm" || mediaType === "ogg") {
      return (
        <video
          controls
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        >
          <source src={mediaUrl} type={`video/${mediaType}`} />
          Tarayıcınız video etiketini desteklemiyor.
        </video>
      );
    }
    return (
      <img
        src={mediaUrl}
        alt="Media"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
    );
  };

  return (
    <div
      ref={ref}
      className="flex justify-center items-center w-full"
      style={{ height: "auto", padding: "0" }} // height: 100vh kaldırıldı, padding: 0 yapıldı
    >
      <div
        // Kartın inView görünürlük animasyonu
        style={{
          ...sectionStyle,
          ...(inView ? visibleStyle : {}),
        }}
        className="group"
      >
        {/* Medya görseli veya videosu */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        >
          {renderMedia()}
        </div>

        {/* Buton */}
        <div className="overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <button
            className="listen-button"
            onClick={() => {
              if (buttonUrl) {
                window.open(buttonUrl, "_blank");
              }
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>

      {/* CSS Styles */}
      <style>{`
        /* Kart hover'da buton animasyonu */
        .overlay {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
          background-color: rgba(0, 0, 0, 0.5); /* Buton arka planı */
        }

        /* Hover olduğunda buton görünür olacak */
        .group:hover .overlay {
          opacity: 1;
        }

        /* Butonun stili */
        .listen-button {
          padding: 10px 20px;
          background-color: transparent; /* Şeffaf arka plan */
          color: white; /* Yazı rengi beyaz */
          border-radius: 8px; /* Daha sivri köşeler için radius değeri azaltıldı */
          border: 2px solid white; /* Beyaz çerçeve */
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease-in-out;
        }

        /* Buton hover sırasında büyür */
        .listen-button:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default BannerSection;
