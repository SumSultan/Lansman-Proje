import React, { useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface ReelsBottomCardItem {
  media: string;
  title: string;
  subTitle: string;
  buttonText: string;
  buttonUrl: string;
}

interface ReelsBottomCardSectionProps {
  items: ReelsBottomCardItem[];
}

const ReelsBottomCardSection: React.FC<ReelsBottomCardSectionProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<ReelsBottomCardItem | null>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  // Modal close function
  const closeModal = () => {
    setSelectedItem(null);
  };

  // Modal open function
  const openModal = (item: ReelsBottomCardItem) => {
    setSelectedItem(item);
  };

  // Media rendering function
  const renderMedia = (mediaUrl: string, style?: React.CSSProperties) => {
    console.log("Media URL: ", mediaUrl);  // Log the media URL for debugging

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
          Your browser does not support the video tag.
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
    bottom: "70px", // Updated to leave space for the button
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

  const buttonStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px 20px",
    backgroundColor: "transparent",  // Transparent background
    color: "#fff",                    // White text
    border: "2px solid white",         // White border
    borderRadius: "8px",
    cursor: "pointer",
    textDecoration: "none",
    zIndex: 1,
    transition: "all 0.3s ease",       // Smooth transition on hover
  };

  // Hover effect with color #666666
  const buttonHoverStyle: React.CSSProperties = isButtonHovered
    ? {
        backgroundColor: "transparent",    // Keep background transparent
        color: "#666666",                  // Change text color to #666666
        border: "2px solid #666666",       // Change border color to #666666
      }
    : {};

  const modalContentStyle: React.CSSProperties = {
    position: "relative",
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  };

  const modalImageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: "20px",
  };

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

  return (
    <>
      {/* Slider Section */}
      <div style={sliderStyle}>
        {items.map((item, index) => {
          // Log the entire item for debugging purposes
          console.log("Item: ", item);

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
              {/* Media Render */}
              {renderMedia(
                `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${item.media}`
              )}

              {/* Text and Subtitle Overlay */}
              <div style={textOverlayStyle}>
                <h3 style={titleStyle}>{item.title}</h3>
                <p style={subtitleStyle}>{item.subTitle}</p>
              </div>

              {/* Button */}
              <a
                href={item.buttonUrl}
                style={{
                  ...buttonStyle,
                  ...(isButtonHovered ? buttonHoverStyle : {}),
                }}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                {item.buttonText}
              </a>
            </div>
          );
        })}
      </div>

      {/* Modal Section */}
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
              <motion.button
                onClick={closeModal}
                style={{ ...closeButtonStyle, ...buttonHoverStyle }}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                <FaTimes
                  className={`text-xl ${
                    isButtonHovered ? "text-[#666666]" : "text-white"
                  }`}
                />
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

export default ReelsBottomCardSection;
