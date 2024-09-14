import React from "react";
import { useInView } from "react-intersection-observer";

interface TwinCardSectionProps {
  rightMedia: string;
  leftMedia: string;
}

const TwinCardSection: React.FC<TwinCardSectionProps> = ({
  rightMedia,
  leftMedia,
}) => {
  const rightMediaUrl = `${
    import.meta.env.VITE_AWS_S3_BUCKET_URL
  }/${rightMedia}`;
  const leftMediaUrl = `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${leftMedia}`;

  // Media türünü belirlemek için uzantıyı alıyoruz, eğer uzantı yoksa varsayılan olarak boş bir string atanıyor
  const rightMediaType = rightMedia.split(".").pop()?.toLowerCase() || "";
  const leftMediaType = leftMedia.split(".").pop()?.toLowerCase() || "";

  const { ref: leftRef, inView: leftInView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const { ref: rightRef, inView: rightInView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const renderMedia = (mediaUrl: string, mediaType: string) => {
    if (!mediaUrl || !mediaType) {
      return <div>Media yüklenemedi</div>;
    }

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
    } else {
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
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        marginBottom: "20px",
        width: "100%",
        height: "824px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "1240px",
        }}
      >
        {/* Sol Kart */}
        <div
          ref={leftRef}
          className={`w-[48%] bg-[#DFE2E6] rounded-xl overflow-hidden relative transition-all duration-1000 ease-in-out transform ${
            leftInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          } hover:scale-105 hover:shadow-lg h-[694px]`}
        >
          {renderMedia(leftMediaUrl, leftMediaType)}
        </div>

        {/* Sağ Kart */}
        <div
          ref={rightRef}
          className={`w-[48%] bg-[#DFE2E6] rounded-xl overflow-hidden relative transition-all duration-1000 ease-in-out transform ${
            rightInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          } hover:scale-105 hover:shadow-lg h-[694px]`}
        >
          {renderMedia(rightMediaUrl, rightMediaType)}
        </div>
      </div>
    </div>
  );
};

export default TwinCardSection;
