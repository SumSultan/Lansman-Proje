import React, { useState } from "react";
import { FaExpandAlt, FaTimes } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion"; // Framer Motion importları

interface LargePopupCardSectionProps {
  media: string;
}

const LargePopupCardSection: React.FC<LargePopupCardSectionProps> = ({
  media,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false); // Buton hover durumu

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const mediaUrl = `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${media}`;
  const fileType = media.split(".").pop()?.toLowerCase();

  // Tam ekran modunu açma/kapatma işlevi
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Modal için animasyonlar
  const modalVariants = {
    hidden: { opacity: 0, scale: 1.0 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.0 },
  };

  // Şeffaf ve hover efektli buton stili
  const buttonStyle: React.CSSProperties = {
    position: "absolute",
    width: "40px",
    height: "40px",
    backgroundColor: "transparent", // Başlangıçta şeffaf
    border: "2px solid white", // Dış kenarlar beyaz
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "24px",
    transition: "all 0.3s ease", // Geçiş efekti
  };

  // Buton hover durumu için stil
  const buttonHoverStyle: React.CSSProperties = isButtonHovered
    ? {
        backgroundColor: "transparent", // İç kısım şeffaf
        color: "#666666", // İkonun rengi #666666 gri
        border: "2px solid #666666", // Çerçeve rengi gri
      }
    : {
        backgroundColor: "transparent", // Başlangıçta şeffaf kalması
        color: "white", // Başlangıçta ikon beyaz
        border: "2px solid white", // Başlangıçta çerçeve beyaz
      };

  return (
    <>
      {/* Video veya görsel oynatma */}
      <div
        ref={ref}
        className={`relative w-[1050px] h-[650px] bg-white rounded-2xl shadow-md p-0 mt-[50px] mb-[50px] mx-auto overflow-hidden transition-all duration-1000 ease-in-out ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        {fileType === "mp4" || fileType === "webm" || fileType === "ogg" ? (
          <video
            muted
            autoPlay
            loop
            className="w-full h-full object-cover rounded-2xl"
            onClick={toggleFullScreen}
          >
            <source src={mediaUrl} type={`video/${fileType}`} />
            Tarayıcınız video etiketini desteklemiyor.
          </video>
        ) : (
          <img
            src={mediaUrl}
            alt="Popup Media"
            onClick={toggleFullScreen}
            className="cursor-pointer w-full h-full object-cover rounded-2xl"
          />
        )}

        {/* Sağ alt köşedeki tam ekran butonu */}
        {!isFullScreen && (
          <button
            onClick={toggleFullScreen}
            onMouseEnter={() => setIsButtonHovered(true)} // Hover giriş
            onMouseLeave={() => setIsButtonHovered(false)} // Hover çıkış
            style={{ ...buttonStyle, ...buttonHoverStyle }} // Stil birleştirildi
            className="absolute bottom-5 right-5 z-10"
          >
            <FaExpandAlt
              className={isButtonHovered ? "text-[#666666]" : "text-white"}
            />
          </button>
        )}
      </div>

      {/* Tam ekran modal popup */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.5 }} // Animasyon süresi
            className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex justify-center items-center z-50"
          >
            <div className="relative w-full h-full flex justify-center items-center">
              {fileType === "mp4" ||
              fileType === "webm" ||
              fileType === "ogg" ? (
                <video
                  controls
                  className="max-w-full max-h-full object-contain rounded-2xl"
                >
                  <source src={mediaUrl} type={`video/${fileType}`} />
                  Tarayıcınız video etiketini desteklemiyor.
                </video>
              ) : (
                <img
                  src={mediaUrl}
                  alt="Full Screen Popup Media"
                  className="max-w-full max-h-full object-contain rounded-2xl"
                />
              )}

              {/* Çarpı butonu - Yüklenen görselin sağ üst köşesine konumlandırıldı */}
              <button
                onClick={toggleFullScreen}
                onMouseEnter={() => setIsButtonHovered(true)} // Hover giriş
                onMouseLeave={() => setIsButtonHovered(false)} // Hover çıkış
                style={{ ...buttonStyle, ...buttonHoverStyle }}
                className="absolute top-2 right-2 z-50" // Sağ üst köşe konumu
              >
                <FaTimes
                  className={isButtonHovered ? "text-[#666666]" : "text-white"}
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LargePopupCardSection;
