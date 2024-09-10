import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useInView } from "react-intersection-observer";
import "swiper/css";
import "swiper/css/pagination";

interface FullScreenCardItem {
  media: string;
  text: string;
  buttonText: string;
  buttonUrl: string;
  logoMedia: string;
}

interface FullScreenCardSectionProps {
  items: FullScreenCardItem[];
}

const FullScreenCardSection: React.FC<FullScreenCardSectionProps> = ({
  items,
}) => {
  const swiperRef = useRef<any>(null);

  // CSS stillerini doğrudan eklemek için useEffect kullanıyoruz
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      .fullscreen-swiper .swiper-slide {
        opacity: 0.3 !important;
        transition: opacity 0.3s ease !important;
      }
      .fullscreen-swiper .swiper-slide-active {
        opacity: 1 !important;
      }
      .fullscreen-swiper .swiper-slide-next, 
      .fullscreen-swiper .swiper-slide-prev {
        opacity: 0.3 !important;
      }

      /* Pagination noktalarının stilleri */
      .swiper-pagination-bullet {
        background-color: rgba(255, 255, 255, 0.5); /* Varsayılan renk */
        opacity: 1;
      }

      .swiper-pagination-bullet-active {
        background-color: white !important; /* Aktif olan nokta beyaz */
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Swiper görünürlüğü takip etmek için intersection observer kullanıyoruz
  const { ref, inView } = useInView({
    triggerOnce: false, // Her seferinde tetiklenmesi için triggerOnce false yapıldı
    threshold: 0.2, // Swiper'ın %20'si görünür olduğunda tetikle
  });

  // Swiper'a animasyon stili ekliyoruz
  const swiperStyle: React.CSSProperties = {
    opacity: 0,
    transform: "translateY(20px)",
    transition: "transform 1.3s ease, opacity 1.3s ease",
  };

  const visibleSwiperStyle: React.CSSProperties = {
    opacity: 1,
    transform: "translateY(0)",
  };

  const handleSlideClick = (event: React.MouseEvent) => {
    const slideWidth = event.currentTarget.clientWidth;
    const clickPosition = event.nativeEvent.offsetX;

    if (clickPosition > slideWidth / 2) {
      swiperRef.current?.slidePrev();
    } else {
      swiperRef.current?.slideNext();
    }
  };

  return (
    <div
      ref={ref}
      style={{
        margin: "40px 0", // Alttan ve üsten 40px margin eklendi
        ...swiperStyle,
        ...(inView ? visibleSwiperStyle : {}),
      }}
      className="relative w-full h-[750px] mx-auto"
    >
      <Swiper
        className="fullscreen-swiper"
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        speed={1300}
        slidesPerView={1.2}
        centeredSlides={true}
        spaceBetween={10}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index} onClick={(e) => handleSlideClick(e)}>
            <FullScreenCard {...item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

interface FullScreenCardProps extends FullScreenCardItem {}

const FullScreenCard: React.FC<FullScreenCardProps> = ({
  media,
  text,
  buttonText,
  buttonUrl,
  logoMedia,
}) => {
  const mediaUrl = `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${media}`;
  const logoMediaUrl = `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${logoMedia}`;

  return (
    <div className="relative w-[1250px] h-[750px] mx-auto">
      {/* Arka plan görseli */}
      <img
        src={mediaUrl}
        alt="Media"
        className="absolute inset-0 w-[1250px] h-[750px] object-cover"
      />

      {/* İçerik katmanı */}
      <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
        {/* Logo sağ alt köşede, sağdan %10 boşlukla hizalanmış */}
        {logoMediaUrl && (
          <img
            src={logoMediaUrl}
            alt="Logo"
            className="absolute bottom-[5%] right-[5%] max-h-[80px] object-contain"
          />
        )}

        {/* Yazı ve Buton - Sol alt köşeye hizalama */}
        <div className="absolute bottom-[5%] left-[5%] flex flex-row items-center space-x-4">
          {/* Buton */}
          <a
            href={buttonUrl}
            className="px-6 py-3 bg-[rgba(151, 9, 40, 0.3)] border-2 border-white rounded-2xl text-white hover:bg-transparent hover:text-[#666666] hover:border-[#666666] transition"
          >
            {buttonText}
          </a>

          {/* Yazı */}
          <p className="text-3xl font-semibold">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default FullScreenCardSection;
