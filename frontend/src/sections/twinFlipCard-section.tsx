import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface TwinFlipCardSectionProps {
  rightFrontMedia: string;
  rightBackMedia: string;
  leftFrontMedia: string;
  leftBackMedia: string;
  initialFlip?: boolean;
}

const TwinFlipCardSection: React.FC<TwinFlipCardSectionProps> = ({
  rightFrontMedia,
  rightBackMedia,
  leftFrontMedia,
  leftBackMedia,
  initialFlip = true,
}) => {
  const [isLeftFlipped, setIsLeftFlipped] = useState(false);
  const [isRightFlipped, setIsRightFlipped] = useState(false);
  const [isLoaded, setIsLoaded] = useState(!initialFlip);
  const [isLeftButtonHovered, setIsLeftButtonHovered] = useState(false); // Sol buton için hover durumu
  const [isRightButtonHovered, setIsRightButtonHovered] = useState(false); // Sağ buton için hover durumu

  const { ref: leftCardRef, inView: isLeftInView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const { ref: rightCardRef, inView: isRightInView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  useEffect(() => {
    if (initialFlip) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialFlip]);

  const handleLeftFlip = () => setIsLeftFlipped(!isLeftFlipped);
  const handleRightFlip = () => setIsRightFlipped(!isRightFlipped);

  const renderMedia = (media: string) => {
    const mediaUrl = `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${media}`;
    const fileType = media.split(".").pop()?.toLowerCase();

    if (fileType === "mp4" || fileType === "webm" || fileType === "ogg") {
      return (
        <video
          src={mediaUrl}
          controls
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        >
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

  const cardWrapperStyle = (isInView: boolean): React.CSSProperties => ({
    opacity: isInView ? 1 : 0,
    transform: isInView ? "translateY(0)" : "translateY(20px)",
    transition: "transform 1.3s ease, opacity 1.3s ease",
    width: "48%",
    perspective: "1000px",
  });

  const crossIconStyle: React.CSSProperties = {
    width: "16px",
    height: "16px",
    position: "relative",
    display: "block",
    backgroundColor: "transparent",
  };

  const crossLineStyle = (isHovered: boolean): React.CSSProperties => ({
    position: "absolute",
    width: "100%",
    height: "2px",
    backgroundColor: isHovered ? "#666666" : "white", // Hover olduğunda gri, normalde beyaz
    top: "50%",
    left: "0",
    transform: "rotate(45deg)",
    transformOrigin: "center",
  });

  const secondCrossLineStyle = (isHovered: boolean): React.CSSProperties => ({
    ...crossLineStyle(isHovered),
    transform: "rotate(-45deg)",
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        width: "100%",
        height: "750px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "1300px",
        }}
      >
        {/* Left Flip Card */}
        <div
          ref={leftCardRef}
          style={{
            ...cardWrapperStyle(isLeftInView),
            marginRight: "10px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              transformStyle: "preserve-3d",
              transition: "transform 0.8s ease-out",
              transform: isLeftFlipped
                ? "rotateY(180deg)"
                : isLoaded
                ? "rotateY(0deg)"
                : "rotateY(-90deg)",
            }}
          >
            {/* Front of Left Card */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                borderRadius: "8px",
              }}
            >
              {renderMedia(leftFrontMedia)}
              <button
                onClick={handleLeftFlip}
                onMouseEnter={() => setIsLeftButtonHovered(true)}
                onMouseLeave={() => setIsLeftButtonHovered(false)}
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "20px",
                  width: "40px",
                  height: "40px",
                  backgroundColor: isLeftButtonHovered
                    ? "transparent" // Şeffaf arka plan
                    : "transparent",
                  color: isLeftButtonHovered ? "#666666" : "white", // Gri renk hover'da
                  border: isLeftButtonHovered
                    ? "2px solid #666666" // Gri çerçeve hover'da
                    : "2px solid white",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: "24px",
                  transition: "all 0.3s ease",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  style={{ width: "20px", height: "20px" }}
                  fill={isLeftButtonHovered ? "#666666" : "white"} // Gri renk hover'da
                >
                  <path d="M17.25,8.5H11.5V2.75A.75.75,0,0,0,10.75,2h-1.5A.75.75,0,0,0,8.5,2.75V8.5H2.75A.75.75,0,0,0,2,9.25v1.5a.75.75,0,0,0,.75.75H8.5v5.75a.75.75,0,0,0,.75.75h1.5a.75.75,0,0,0,.75-.75V11.5h5.75a.75.75,0,0,0,.75-.75v-1.5A.75.75,0,0,0,17.25,8.5Z" />
                </svg>
              </button>
            </div>

            {/* Back of Left Card */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                borderRadius: "8px",
              }}
            >
              {renderMedia(leftBackMedia)}
              <button
                onClick={handleLeftFlip}
                onMouseEnter={() => setIsLeftButtonHovered(true)}
                onMouseLeave={() => setIsLeftButtonHovered(false)}
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "20px",
                  width: "40px",
                  height: "40px",
                  backgroundColor: isLeftButtonHovered
                    ? "transparent" // Şeffaf arka plan
                    : "transparent",
                  color: isLeftButtonHovered ? "#666666" : "white", // Gri renk hover'da
                  border: isLeftButtonHovered
                    ? "2px solid #666666" // Gri çerçeve hover'da
                    : "2px solid white",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <span style={crossIconStyle}>
                  <span style={crossLineStyle(isLeftButtonHovered)}></span>
                  <span
                    style={secondCrossLineStyle(isLeftButtonHovered)}
                  ></span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Flip Card */}
        <div
          ref={rightCardRef}
          style={{
            ...cardWrapperStyle(isRightInView),
            marginLeft: "10px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              transformStyle: "preserve-3d",
              transition: "transform 0.8s ease-out",
              transform: isRightFlipped
                ? "rotateY(180deg)"
                : isLoaded
                ? "rotateY(0deg)"
                : "rotateY(-90deg)",
            }}
          >
            {/* Front of Right Card */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                borderRadius: "8px",
              }}
            >
              {renderMedia(rightFrontMedia)}
              <button
                onClick={handleRightFlip}
                onMouseEnter={() => setIsRightButtonHovered(true)}
                onMouseLeave={() => setIsRightButtonHovered(false)}
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "20px",
                  width: "40px",
                  height: "40px",
                  backgroundColor: isRightButtonHovered
                    ? "transparent"
                    : "transparent",
                  color: isRightButtonHovered ? "#666666" : "white",
                  border: isRightButtonHovered
                    ? "2px solid #666666"
                    : "2px solid white",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: "24px",
                  transition: "all 0.3s ease",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  style={{ width: "20px", height: "20px" }}
                  fill={isRightButtonHovered ? "#666666" : "white"}
                >
                  <path d="M17.25,8.5H11.5V2.75A.75.75,0,0,0,10.75,2h-1.5A.75.75,0,0,0,8.5,2.75V8.5H2.75A.75.75,0,0,0,2,9.25v1.5a.75.75,0,0,0,.75.75H8.5v5.75a.75.75,0,0,0,.75.75h1.5a.75.75,0,0,0,.75-.75V11.5h5.75a.75.75,0,0,0,.75-.75v-1.5A.75.75,0,0,0,17.25,8.5Z" />
                </svg>
              </button>
            </div>

            {/* Back of Right Card */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                borderRadius: "8px",
              }}
            >
              {renderMedia(rightBackMedia)}
              <button
                onClick={handleRightFlip}
                onMouseEnter={() => setIsRightButtonHovered(true)}
                onMouseLeave={() => setIsRightButtonHovered(false)}
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "20px",
                  width: "40px",
                  height: "40px",
                  backgroundColor: isRightButtonHovered
                    ? "transparent"
                    : "transparent",
                  color: isRightButtonHovered ? "#666666" : "white",
                  border: isRightButtonHovered
                    ? "2px solid #666666"
                    : "2px solid white",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <span style={crossIconStyle}>
                  <span style={crossLineStyle(isRightButtonHovered)}></span>
                  <span
                    style={secondCrossLineStyle(isRightButtonHovered)}
                  ></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwinFlipCardSection;
