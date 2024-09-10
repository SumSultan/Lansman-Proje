import React from "react";
import { useInView } from "react-intersection-observer";

interface FullTextSectionProps {
  text: string;
}

const FullTextSection: React.FC<FullTextSectionProps> = ({ text }) => {
  // Intersection observer ile görünürlüğü takip ediyoruz
  const { ref, inView } = useInView({
    triggerOnce: false, // Her seferinde tetikle
    threshold: 0.2, // Kartın %20'si görünür olduğunda tetikle
  });

  // Başlangıç stili
  const sectionStyle: React.CSSProperties = {
    maxWidth: "990px", // Genişlik
    minHeight: "300px", // Minimum Yükseklik
    backgroundColor: "#ffffff", // Arka plan rengi
    borderRadius: "20px", // Kenar yuvarlaklığı
    display: "flex", // Flex düzeni ile içerikleri hizala
    justifyContent: "center", // İçerikleri yatayda ortala
    padding: "20px",
    alignItems: "center", // İçerikleri dikeyde ortala
    textAlign: "center", // Metin hizalaması ortalı
    marginTop: "5px", // Üst marjin 10px
    marginBottom: "5px", // Alt marjin 10px
    marginLeft: "auto", // Ortalanmış hizalama
    marginRight: "auto", // Ortalanmış hizalama
    transition: "transform 1.3s ease, box-shadow 1.3s ease, opacity 1.3s ease", // Geçiş efektleri
    opacity: 0, // Başlangıçta görünmez
    transform: "translateY(20px)", // Başlangıçta aşağıda
  };

  // Kart görünür olduğunda uygulanacak stil
  const visibleStyle: React.CSSProperties = {
    opacity: 1,
    transform: "translateY(0)", // Yukarı doğru hareket
  };

  return (
    <div
      ref={ref} // Bileşenin görünürlüğünü takip etmek için ref ekliyoruz
      style={{
        ...sectionStyle,
        ...(inView ? visibleStyle : {}), // Kart görünür olduğunda stil değişir
      }}
    >
      <p
        style={{
          color: "#000000", // Metin rengi siyah
          fontFamily: "M3/display/small, sans-serif", // Yazı tipi
          fontSize: "40px", // Font boyutu
          lineHeight: "1.5", // Satır yüksekliği
          maxWidth: "1000px", // Metin kutusu maksimum genişlik
          margin: "0 auto", // Yatayda ortalama
        }}
      >
        {text}
      </p>
    </div>
  );
};

export default FullTextSection;
