import React, { useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface ReelsCardItem {
  media: string;
  title: string;
  subTitle: string;
}

interface ReelsCardSliderSectionProps {
  items: ReelsCardItem[];
}

const ReelsCardSliderSection: React.FC<ReelsCardSliderSectionProps> = ({
  items,
}) => {
  const [selectedItem, setSelectedItem] = useState<ReelsCardItem | null>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const openModal = (item: ReelsCardItem) => {
    setSelectedItem(item);
  };

  const renderMedia = (mediaUrl: string, style?: React.CSSProperties) => {
    const fileType = mediaUrl.split(".").pop()?.toLowerCase();

    if (fileType === "mp4" || fileType === "webm" || fileType === "ogg") {
      return (
        <video
          src={mediaUrl}
          controls
          style={{
            ...style,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            zIndex: 0,
          }}
        >
          Tarayıcınız video etiketini desteklemiyor.
        </video>
      );
    }

    return <img src={mediaUrl} alt="Media" style={style || imageStyle} />;
  };

  const sliderStyle: React.CSSProperties = {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    scrollBehavior: "smooth",
    width: "100%",
    height: "850px",
    alignItems: "center",
  };

  const itemStyle: React.CSSProperties = {
    flex: "0 0 auto",
    position: "relative",
    width: "400px",
    height: "700px",
    borderRadius: "20px",
    overflow: "hidden",
    backgroundColor: "#f3f3f3",
    transition: "transform 1.3s ease, box-shadow 1.3s ease, opacity 1.3s ease",
    opacity: 0,
    transform: "translateY(20px)",
  };

  const itemVisibleStyle: React.CSSProperties = {
    opacity: 1,
    transform: "translateY(0)",
  };

  const itemHoverStyle: React.CSSProperties = {
    transform: "scale(1.05) translateY(-10px)",
    boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.2)",
  };

  const imageStyle: React.CSSProperties = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  };

  const textOverlayStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    color: "white",
    fontFamily: "DM Sans, sans-serif",
    textAlign: "center",
    zIndex: 1,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "5px",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "16px",
  };

  // Tam ekran için modalContentStyle ayarı
  const modalContentStyle: React.CSSProperties = {
    position: "relative",
    width: "100vw", // Ekran genişliği
    height: "100vh", // Ekran yüksekliği
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Taşma olmasın
  };

  // Tam ekran media için stil
  const modalImageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "contain", // Görseli tam olarak sığdır
    borderRadius: "20px",
  };

  // Çarpı butonuna hover efekti için stil
  const closeButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "40px",
    height: "40px",
    backgroundColor: "transparent",
    border: "2px solid white",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "24px",
    transition: "all 0.3s ease",
  };

  const buttonHoverStyle: React.CSSProperties = isButtonHovered
    ? {
        backgroundColor: "transparent",
        color: "#666666",
        border: "2px solid #666666",
      }
    : {};

  return (
    <>
      <div style={sliderStyle}>
        {items.map((item, index) => {
          const { ref, inView } = useInView({
            triggerOnce: false,
            threshold: 0.2,
          });

          return (
            <div
              key={index}
              ref={ref}
              style={{
                ...itemStyle,
                ...(inView ? itemVisibleStyle : {}),
              }}
              onMouseEnter={(e) => {
                const element = e.currentTarget as HTMLElement;
                Object.assign(element.style, itemHoverStyle);
              }}
              onMouseLeave={(e) => {
                const element = e.currentTarget as HTMLElement;
                element.style.transform = inView
                  ? "translateY(0)"
                  : "translateY(20px)";
                element.style.boxShadow = "";
              }}
              onClick={() => openModal(item)}
            >
              {renderMedia(
                `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${item.media}`
              )}
              <div style={textOverlayStyle}>
                <h3 style={titleStyle}>{item.title}</h3>
                <p style={subtitleStyle}>{item.subTitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          >
            <motion.div style={modalContentStyle}>
              {/* Close Button */}
              <motion.button
                onClick={closeModal}
                style={{ ...closeButtonStyle, ...buttonHoverStyle }}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                <FaTimes className={`text-xl ${isButtonHovered ? "text-[#666666]" : "text-white"}`} />
              </motion.button>

              {/* Render Selected Item Media */}
              {renderMedia(
                `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${selectedItem.media}`,
                modalImageStyle
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReelsCardSliderSection;