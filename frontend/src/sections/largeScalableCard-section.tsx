import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface LargeScalableSectionProps {
  media: string;
}

const LargeScalableSection: React.FC<LargeScalableSectionProps> = ({
  media,
}) => {
  const [scale, setScale] = useState(0.5); // Başlangıçta küçük olacak
  const [animate, setAnimate] = useState(false); // Açılış animasyonu kontrolü
  const { ref, entry } = useInView({
    threshold: Array.from({ length: 11 }, (_, i) => i / 10), // Görünme oranlarını dinler
  });

  useEffect(() => {
    // Bileşen yüklendiğinde animasyonu tetikle
    setAnimate(true);

    if (entry) {
      // Scroll bazlı ölçekleme
      const newScale = Math.min(1, 0.5 + entry.intersectionRatio * 0.8);
      setScale(newScale);
    }
  }, [entry]);

  // Dosya uzantısına göre dosya türünü belirle
  const fileType = media.split(".").pop()?.toLowerCase();

  return (
    <div
      ref={ref} // IntersectionObserver referansı
      className="w-full h-screen bg-cover bg-center overflow-hidden"
      style={{
        transform: animate ? `scale(${scale})` : "scale(0)", // İlk açılışta küçüklükten büyüme animasyonu
        opacity: animate ? 1 : 0, // Açılışta yavaşça görünür hale gelme
        transition: "transform 1s ease-out, opacity 1s ease-out", // Yumuşak geçiş
        width: "100vw", // Genişlik tam ekran olacak şekilde ayarlanır
        maxWidth: "100%", // Sayfa genişliğini aşmaması sağlanır
        height: "100vh", // Yükseklik de tam ekran olacak şekilde ayarlanır
        maxHeight: "100vh", // Yükseklik aşımı engellenir
        overflowX: "hidden", // Yatay taşmayı engelle
        boxSizing: "border-box", // İçerik genişliği hesaplamasını doğru yapar
      }}
    >
      {/* Dosya türüne göre video veya resim render et */}
      {fileType === "mp4" || fileType === "webm" || fileType === "ogg" ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover" // Video tam ekran doldurur ve sabit kalır
          style={{ objectFit: "cover" }}
        >
          <source
            src={`${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${media}`}
            type={`video/${fileType}`}
          />
          Tarayıcınız video etiketini desteklemiyor.
        </video>
      ) : (
        <img
          src={`${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${media}`}
          alt="Large Card Media"
          className="w-full h-full object-cover" // Görüntü tam ekran doldurur ve sabit kalır
          style={{ objectFit: "cover" }}
        />
      )}
    </div>
  );
};

export default LargeScalableSection;
