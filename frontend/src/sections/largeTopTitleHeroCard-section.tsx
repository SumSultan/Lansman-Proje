import React from "react";
import { useInView } from "react-intersection-observer";

interface LargeTopTitleHeroCardSectionProps {
  title: string;
  subTitle: string;
  buttonText: string;
  buttonUrl: string;
  media: string;
}

const LargeTopTitleHeroCardSection: React.FC<
  LargeTopTitleHeroCardSectionProps
> = ({ title, subTitle, buttonText, buttonUrl, media }) => {
  // Medya URL ve dosya türünü ayırt etme
  const mediaUrl = `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${media}`;
  const mediaType = media.split(".").pop()?.toLowerCase();

  // Intersection Observer kullanarak görünürlüğü kontrol etme
  const { ref, inView } = useInView({
    triggerOnce: false, // Her seferinde tetikle
    threshold: 0.2, // Kartın %20'si görünür olduğunda tetikle
  });

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
      className={`w-[1050px] h-[650px] mx-auto relative overflow-hidden transition-all duration-1000 ease-in-out transform ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } hover:scale-105 hover:shadow-lg`}
      style={{
        backgroundColor: "#ffffff", // Arka plan rengi (isteğe bağlı)
      }}
    >
      {/* Medya görseli veya videosu */}
      <div
        style={{
          width: "100%", // Sabit genişlik
          height: "100%", // Sabit yükseklik
          position: "absolute", // Üst üste binen içerikler için absolute konumlandırma
          top: 0, // Sabit pozisyon
          left: 0, // Sabit pozisyon
          zIndex: 0, // Arka planda kalması için z-index değeri
        }}
      >
        {renderMedia()}
      </div>

      {/* Başlık, Alt Başlık ve Buton */}
      <div
        style={{
          zIndex: 1, // Üstte kalması için z-index değeri
          textAlign: "center",
          color: "white", // Metin rengi
          position: "relative", // Medyanın üzerinde tutmak için relative konumlandırma
          width: "100%", // İçeriğin genişliği tam olarak ayarlandı
          display: "flex", // Flexbox kullanımı
          flexDirection: "column", // Dikey yerleştirme
          justifyContent: "flex-start", // Kartın üst kısmında hizalanacak
          alignItems: "center", // Yatay olarak ortalanacak
          paddingTop: "50px", // Yukarıdan biraz boşluk bırakıyoruz
        }}
      >
        <h2
          style={{
            color: "white",
            fontFamily: "'Roboto', sans-serif",
            fontSize: "45px",
            fontWeight: "bold",
            marginBottom: "10px", // Başlık ve alt başlık arasında biraz boşluk
          }}
        >
          {title}
        </h2>

        <h3
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 700,
            fontSize: "25px",
            lineHeight: "35px",
            marginBottom: "30px", // Alt başlık ve buton arasında boşluk
          }}
        >
          {subTitle}
        </h3>

        {/* Buton */}
        <a
          href={buttonUrl}
          className="inline-block w-[120px] h-[50px] px-8 py-2 border-2 border-white text-white text-center no-underline rounded-xl font-sans text-[18px] transition-colors duration-300 ease-in-out hover:bg-transparent hover:text-[#666666] hover:border-[#666666]"
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
};

export default LargeTopTitleHeroCardSection;
