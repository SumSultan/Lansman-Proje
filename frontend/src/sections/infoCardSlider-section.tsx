import React, { useRef } from "react";
import { useInView } from "react-intersection-observer";

interface InfoCardItem {
  icon: string;
  title: string;
  subtitle: string;
}

interface InfoCardSliderSectionProps {
  items: InfoCardItem[];
}

const InfoCardSliderSection: React.FC<InfoCardSliderSectionProps> = ({
  items,
}) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Intersection Observer ile görünürlüğü takip ediyoruz
  const { ref, inView } = useInView({
    triggerOnce: false, // Her seferinde tetiklenir
    threshold: 0.2, // %20 göründüğünde animasyonu tetikler
  });

  return (
    <div
      ref={ref}
      className={`relative max-w-[1600px] mx-auto h-auto transition-all duration-1000 ease-in-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      {/* Kartlar yukarı kayma animasyonu yapıyor */}
      <div
        ref={sliderRef}
        className="flex gap-7 overflow-x-auto custom-scrollbar h-full items-center"
      >
        {items.map((item, index) => {
          const fileType = item.icon.split(".").pop()?.toLowerCase();
          const iconUrl = `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${
            item.icon
          }`;

          return (
            <div
              key={index}
              className={`flex-none w-[350px] h-[280px] text-left bg-white rounded-lg p-4 border border-[#fafafa] transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-lg ${
                inView
                  ? "opacity-100 translate-y-0 animate-fadeIn"
                  : "opacity-0 translate-y-5"
              }`}
            >
              {/* Video veya Görsel */}
              {fileType === "mp4" ||
              fileType === "webm" ||
              fileType === "ogg" ? (
                <video
                  controls
                  className="w-[110px] h-[110px] mb-4 rounded-lg object-cover"
                >
                  <source src={iconUrl} type={`video/${fileType}`} />
                  Tarayıcınız video etiketini desteklemiyor.
                </video>
              ) : (
                <img
                  src={iconUrl}
                  alt={`Icon ${index + 1}`}
                  className="w-[100px] h-[100px] mb-4 rounded-lg object-cover"
                />
              )}

              <h3 className="text-black font-roboto font-bold text-lg mb-2 leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-700 font-roboto text-base leading-relaxed">
                {item.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* CSS for Hiding Scrollbar */}
      <style>
        {`
          .custom-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }

          .custom-scrollbar::-webkit-scrollbar {
            display: none;  /* Chrome, Safari and Opera */
          }

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

export default InfoCardSliderSection;
