import React from "react";
import { useInView } from "react-intersection-observer";

interface LargeCardSectionProps {
  media: string;
  url: string;
}

const LargeCardSection: React.FC<LargeCardSectionProps> = ({ media, url }) => {
  const { ref, inView } = useInView({
    triggerOnce: false, // Her seferinde tetikle
    threshold: 0.2, // Kartın %20'si görünür olduğunda tetikle
  });

  const mediaUrl = `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${media}`;
  const fileType = media.split(".").pop()?.toLowerCase(); // Dosya uzantısını al

  return (
    <div
      ref={ref}
      className={`relative w-[1050px] h-[650px] rounded-2xl left-1/2 transform -translate-x-1/2 shadow-lg flex items-center justify-center overflow-hidden bg-transparent mt-10 mb-10 transition-all duration-1000 ease-in-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } hover:scale-105 hover:shadow-lg`} // Yukarıdan ve aşağıdan 40px margin eklendi
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-full"
      >
        {fileType === "mp4" || fileType === "webm" || fileType === "ogg" ? (
          <video
            controls
            className="w-full h-full object-cover rounded-2xl animate-fadeIn transition-transform duration-500 ease-in-out"
          >
            <source src={mediaUrl} type={`video/${fileType}`} />
            Tarayıcınız video etiketini desteklemiyor.
          </video>
        ) : (
          <img
            src={mediaUrl}
            alt="Large Card Media"
            className="w-full h-full object-cover rounded-2xl animate-fadeIn transition-transform duration-500 ease-in-out"
          />
        )}
      </a>

      {/* Tailwind CSS ile Animasyon */}
      <style>
        {`
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: scale(0.9); /* Biraz küçültme */
            }
            50% {
              opacity: 0.5;
              transform: scale(1.05); /* Biraz büyütme */
            }
            100% {
              opacity: 1;
              transform: scale(1); /* Normal boyuta dön */
            }
          }
        `}
      </style>
    </div>
  );
};

export default LargeCardSection;
