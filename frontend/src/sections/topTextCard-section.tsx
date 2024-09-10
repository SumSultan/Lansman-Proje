import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface TopTextCardSectionProps {
  text: string;
  media: string;
}

const TopTextCardSection: React.FC<TopTextCardSectionProps> = ({
  text,
  media,
}) => {
  const mediaUrl = `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${media}`;
  const mediaType = media.split(".").pop()?.toLowerCase();

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const sectionStyle: React.CSSProperties = {
    backgroundColor: "#fafafa",
    textAlign: "center",
    borderRadius: "15px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    width: "1040px",
    height: "635px",
    margin: "50px auto", // Hem üstten hem alttan 50px margin
    transition: "transform 1.3s ease, box-shadow 1.3s ease, opacity 1.3s ease",
    opacity: 0,
    transform: "translateY(20px)",
  };

  const visibleStyle: React.CSSProperties = {
    opacity: 1,
    transform: "translateY(0)",
  };

  const hoverStyle: React.CSSProperties = {
    transform: "scale(1.05) translateY(-10px)",
    boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.2)",
  };

  useEffect(() => {
    const element = document.querySelector(".top-text") as HTMLElement;
    if (element) {
      element.style.marginBottom = "40px"; // Bileşen yüklendiğinde margin uygulansın
    }
  }, []);

  return (
    <div
      ref={ref}
      style={{
        ...sectionStyle,
        ...(inView ? visibleStyle : {}),
      }}
      onMouseEnter={(e) => {
        const element = e.currentTarget as HTMLElement;
        Object.assign(element.style, hoverStyle);
      }}
      onMouseLeave={(e) => {
        const element = e.currentTarget as HTMLElement;
        element.style.transform = inView ? "translateY(0)" : "translateY(20px)";
        element.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
      }}
    >
      <p
        className="top-text"
        style={{
          color: "#000000",
          fontFamily: "Display Medium/Font",
          fontSize: "40px",
          fontWeight: 450,
          lineHeight: "42px",
          textAlign: "center",
          textShadow: "0px 4px 4px rgba(0, 0, 0, 0)",
          marginBottom: "50px",
          width: "800px",
          margin: "0 auto",
        }}
      >
        {text}
      </p>

      {mediaType === "mp4" || mediaType === "webm" || mediaType === "ogg" ? (
        <video
          controls
          style={{
            width: "1040px",
            height: "400px",
            objectFit: "cover",
            borderRadius: "0 0 15px 15px",
          }}
        >
          <source src={mediaUrl} type={`video/${mediaType}`} />
          Tarayıcınız video etiketini desteklemiyor.
        </video>
      ) : (
        <img
          src={mediaUrl}
          alt="Media"
          style={{
            width: "1040px",
            height: "400px",
            objectFit: "cover",
            borderRadius: "0 0 15px 15px",
          }}
        />
      )}
    </div>
  );
};

export default TopTextCardSection;
