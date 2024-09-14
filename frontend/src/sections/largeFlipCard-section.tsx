import React, { useState } from "react";
import { useInView } from "react-intersection-observer";

interface LargeFlipCardSectionProps {
  frontMedia: string;
  backMedia: string;
}

const LargeFlipCardSection: React.FC<LargeFlipCardSectionProps> = ({
  frontMedia,
  backMedia,
}) => {
  const frontMediaUrl = `${
    import.meta.env.VITE_AWS_S3_BUCKET_URL
  }/${frontMedia}`;
  const backMediaUrl = `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${backMedia}`;

  const [isFlipped, setIsFlipped] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const { ref: cardRef, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleButtonMouseEnter = () => {
    setIsButtonHovered(true);
  };

  const handleButtonMouseLeave = () => {
    setIsButtonHovered(false);
  };

  const renderMedia = (mediaUrl: string) => {
    const fileType = mediaUrl.split(".").pop()?.toLowerCase();

    if (fileType === "mp4" || fileType === "webm" || fileType === "ogg") {
      return (
        <video
          src={mediaUrl}
          controls
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        >
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

  const cardStyle: React.CSSProperties = {
    width: "1040px",
    height: "624px",
    position: "relative",
    transformStyle: "preserve-3d",
    transition: "transform 0.8s ease-out",
    transform: isFlipped ? "rotateX(180deg)" : "rotateX(0deg)",
    zIndex: 1, // Kartın default olarak üstte olmaması için 1'e çekildi
  };

  const frontStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const buttonStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    width: "40px",
    height: "40px",
    backgroundColor: "transparent",
    border: "2px solid white",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "24px",
    transition: "all 0.3s ease",
    zIndex: 2, // Butonun ön planda kalmasını sağlıyoruz
  };

  const buttonHoverStyle: React.CSSProperties = isButtonHovered
    ? {
        backgroundColor: "#ffffff", 
        color: "#666666", 
        border: "2px solid #666666",
      }
    : {};

  const crossIconStyle: React.CSSProperties = {
    width: "16px",
    height: "16px",
    position: "relative",
    display: "block",
    backgroundColor: "transparent",
  };

  const crossLineStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "2px",
    backgroundColor: isButtonHovered ? "#666666" : "white",
    top: "50%",
    left: "0",
    transform: "rotate(45deg)",
    transformOrigin: "center",
  };

  const secondCrossLineStyle: React.CSSProperties = {
    ...crossLineStyle,
    transform: "rotate(-45deg)",
  };

  const cardWrapperStyle: React.CSSProperties = {
    perspective: "1000px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(10px)",
    transition: "opacity 1.3s ease, transform 1.3s ease",
    marginBottom: "40px", // Kartlar arasında yeterli boşluk bırakmak için
    zIndex: 0, // Kartın diğer elementlerin altına geçmesini sağlıyoruz
  };

  return (
    <div ref={cardRef} style={cardWrapperStyle}>
      <div style={cardStyle}>
        {/* Ön yüz */}
        <div style={frontStyle}>
          {renderMedia(frontMediaUrl)}

          <button
            onClick={handleFlip}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
            style={{ ...buttonStyle, ...buttonHoverStyle }}
          >
            <span style={crossIconStyle}>
              <span
                style={{
                  ...crossLineStyle,
                  transform: "rotate(90deg)",
                }}
              ></span>
              <span
                style={{
                  ...crossLineStyle,
                  transform: "rotate(0deg)",
                }}
              ></span>
            </span>
          </button>
        </div>

        {/* Arka yüz */}
        <div
          style={{
            ...frontStyle,
            transform: "rotateX(180deg)",
          }}
        >
          {renderMedia(backMediaUrl)}

          <button
            onClick={handleFlip}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
            style={{ ...buttonStyle, ...buttonHoverStyle }}
          >
            <span style={crossIconStyle}>
              <span style={crossLineStyle}></span>
              <span style={secondCrossLineStyle}></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LargeFlipCardSection;
