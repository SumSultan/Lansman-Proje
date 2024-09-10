import React from "react";
import { useInView } from "react-intersection-observer";

interface LeftTextCardSectionProps {
  text: string;
  media: string;
}

const LeftTextCardSection: React.FC<LeftTextCardSectionProps> = ({
  text,
  media,
}) => {
  const mediaUrl = `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${media}`;
  const mediaType = media.split(".").pop()?.toLowerCase();

  // Intersection observer ile görünürlüğü takip ediyoruz
  const { ref, inView } = useInView({
    triggerOnce: false, // Her seferinde tetiklenmesini sağlar
    threshold: 0.2, // Kartın %20'si görünür olduğunda tetikle
  });

  // Kartın başlangıç stili (görünmeden önceki durum)
  const cardStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0", // İç boşlukları sıfırlıyoruz
    backgroundColor: "#fafafa",
    borderRadius: "15px",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
    marginBottom: "50px", // Alt boşluk 50px
    marginTop: "50px", // Üst boşluk 50px yapıldı
    width: "1040px", // Sabit genişlik
    height: "600px", // Sabit yükseklik
    margin: "0 auto", // Kartı ortalıyoruz
    border: "1px solid #e0e0e0",
    transition: "transform 1.3s ease, box-shadow 1.3s ease, opacity 1.3s ease", // Geçiş efekti
    opacity: 0, // Başlangıçta görünmez
    transform: "translateY(20px)", // Başlangıçta aşağıda
  };

  // Kart görünür olduğunda uygulanacak stil
  const visibleStyle: React.CSSProperties = {
    opacity: 1,
    transform: "translateY(0)", // Yukarı doğru hareket eder
  };

  // Hover stili (kart üzerine gelindiğinde büyütme ve gölge ekleme)
  const hoverStyle: React.CSSProperties = {
    transform: "scale(1.05) translateY(-10px)", // Hafif büyüme ve yukarı kayma
    boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.2)", // Daha belirgin gölge
  };

  return (
    <div
      ref={ref}
      style={{
        ...cardStyle,
        ...(inView ? visibleStyle : {}), // Kart görünür olduğunda stil değişir
      }}
      onMouseEnter={(e) => {
        const element = e.currentTarget as HTMLElement;
        Object.assign(element.style, hoverStyle); // Hover olduğunda büyüme ve gölge
      }}
      onMouseLeave={(e) => {
        const element = e.currentTarget as HTMLElement;
        element.style.transform = inView ? "translateY(0)" : "translateY(20px)"; // Hover sonrası geri dönüş
        element.style.boxShadow = "0px 8px 16px rgba(0, 0, 0, 0.1)"; // Gölge eski haline döner
      }}
    >
      {/* Soldaki yazı */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center", // Yazıyı ortalıyoruz
          textAlign: "center",
          width: "540px", // Geriye kalan genişlik (1040 - 500)
          height: "100%", // Yükseklik sabit
          padding: "20px", // Biraz iç boşluk
          wordWrap: "break-word",
        }}
      >
        <p
          style={{
            color: "#333333",
            fontFamily: "'Roboto', sans-serif",
            fontSize: "40px", // TopTextCardSection'deki font boyutuna göre ayarlandı
            fontWeight: 450, // TopTextCardSection'deki font ağırlığına göre ayarlandı
            lineHeight: "42px", // Satır yüksekliği de aynı yapıldı
            textShadow: "0px 4px 4px rgba(0, 0, 0, 0)", // Yazıya gölge efekti
            marginBottom: "40px",
            width: "100%", // Metin genişliği yüzdeye göre
          }}
        >
          {text}
        </p>
      </div>

      {/* Sağdaki fotoğraf veya video */}
      {mediaType === "mp4" || mediaType === "webm" || mediaType === "ogg" ? (
        <video
          controls
          style={{
            width: "500px", // Sabit genişlik
            height: "600px", // Sabit yükseklik
            borderRadius: "0 15px 15px 0", // Sağ taraf köşeleri yuvarlatıldı
            objectFit: "cover", // Video'nun taşmasını engellemek için
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s ease", // Geçiş efekti
          }}
        >
          <source src={mediaUrl} type={`video/${mediaType}`} />
          Tarayıcınız video etiketini desteklemiyor.
        </video>
      ) : (
        <img
          src={mediaUrl}
          alt="Left Media"
          style={{
            width: "500px", // Sabit genişlik
            height: "600px", // Sabit yükseklik
            borderRadius: "0 15px 15px 0", // Sağ taraf köşeleri yuvarlatıldı
            objectFit: "cover", // Görselin taşmasını engellemek için
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s ease", // Geçiş efekti
          }}
        />
      )}
    </div>
  );
};

export default LeftTextCardSection;
