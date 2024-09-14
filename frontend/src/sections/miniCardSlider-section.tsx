import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useInView } from "react-intersection-observer";

interface MiniCardSliderSectionProps {
  cards: {
    buttonText: string;
    text: string;
    logoMedia: string;
    buttonUrl: string;
    backgroundMedia: string;
  }[];
}

const MiniCardSliderSection: React.FC<MiniCardSliderSectionProps> = ({
  cards,
}) => {
  const swiperRef = useRef<any>(null);

  // Intersection Observer ile görünürlüğü kontrol etmek
  const { ref, inView } = useInView({
    triggerOnce: false, // Her seferinde tetikleme
    threshold: 0.2, // %20 göründüğünde animasyon tetiklenecek
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-in-out transform ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
      style={{
        padding: "0px", // Yukarıdan ve aşağıdan boşluğu kaldırmak için padding sıfırlandı
        width: "1900px",
        height: "250px",
        overflow: "hidden",
        margin: "0 auto",
        background: "transparent",
      }}
      onMouseEnter={() => {
        if (swiperRef.current) swiperRef.current.autoplay.stop();
      }}
      onMouseLeave={() => {
        if (swiperRef.current) swiperRef.current.autoplay.start();
      }}
    >
      <Swiper
        modules={[Autoplay]}
        spaceBetween={-200}
        slidesPerView={4}
        loop={true}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={2900}
        allowTouchMove={false}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {cards.map((card, index) => {
          const mediaUrl = `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${
            card.logoMedia
          }`;
          const mediaType = card.logoMedia.split(".").pop()?.toLowerCase();

          return (
            <SwiperSlide key={index}>
              <div
                style={{
                  width: "400px",
                  height: "230px",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundImage: `url(${
                    import.meta.env.VITE_AWS_S3_BUCKET_URL
                  }/${card.backgroundMedia})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="card-container"
              >
                {/* Resim veya video gösterimi */}
                {mediaType === "mp4" ||
                mediaType === "webm" ||
                mediaType === "ogg" ? (
                  <video
                    controls
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  >
                    <source src={mediaUrl} type={`video/${mediaType}`} />
                    Tarayıcınız video etiketini desteklemiyor.
                  </video>
                ) : (
                  <img
                    src={mediaUrl}
                    alt={`Logo Media ${index + 1}`}
                    className="logo-media"
                  />
                )}

                {/* Sol Alt Köşede Yazı */}
                <p className="card-text">{card.text}</p>

                {/* Ortada Buton */}
                <div className="overlay">
                  <button
                    className="listen-button"
                    onClick={() => {
                      if (card.buttonUrl) {
                        window.open(card.buttonUrl, "_blank");
                      }
                    }}
                  >
                    {card.buttonText}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* CSS Styles */}
      <style>{`
        .card-container {
          position: relative;
          overflow: hidden;
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
        }

        .swiper-slide {
          opacity: 1 !important;
        }

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
          background-color: rgba(0, 0, 0, 0.5);
        }

        .card-container:hover .overlay {
          opacity: 1;
        }

        .listen-button {
          padding: 10px 20px;
          background-color: transparent; /* Şeffaf arka plan */
          color: white; /* Yazı rengi beyaz */
          border-radius: 25px;
          border: 2px solid white; /* Beyaz çerçeve */
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease-in-out;
        }

        .listen-button:hover {
          transform: scale(1.1);
        }

        .card-text {
          position: absolute;
          bottom: 10px;
          left: 10px;
          font-size: 14px;
          color: white;
          z-index: 2; /* Yazıyı üst katmana taşıyoruz */
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
        }

        .overlay {
          z-index: 1; /* Overlay'in alt katmanda kalmasını sağlıyoruz */
        }

        .logo-media {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 50px; /* 2x2 rem'e denk gelen genişlik */
          height: 50px; /* 2x2 rem'e denk gelen yükseklik */
          object-fit: contain;
          z-index: 2; /* Logoyu üst katmana taşıyoruz */
        }
      `}</style>
    </div>
  );
};

export default MiniCardSliderSection;
