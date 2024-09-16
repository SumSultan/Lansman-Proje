import React from "react";
import { useInView } from "react-intersection-observer";

interface TwinTopTitleHeroCardSectionProps {
  rightMedia: string;
  rightTitle: string;
  rightSubTitle: string;
  rightButtonText: string;
  rightButtonUrl: string;
  leftMedia: string;
  leftTitle: string;
  leftSubTitle: string;
  leftButtonText: string;
  leftButtonUrl: string;
}

const TwinTopTitleHeroCardSection: React.FC<
  TwinTopTitleHeroCardSectionProps
> = ({
  rightMedia,
  rightTitle,
  rightSubTitle,
  rightButtonText,
  rightButtonUrl,
  leftMedia,
  leftTitle,
  leftSubTitle,
  leftButtonText,
  leftButtonUrl,
}) => {
  // Intersection Observer ile görünürlüğü kontrol et
  const { ref: leftRef, inView: leftInView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const { ref: rightRef, inView: rightInView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const renderMedia = (media: string) => {
    const mediaUrl = `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${media}`;
    const fileType = media.split(".").pop()?.toLowerCase();

    if (fileType === "mp4" || fileType === "webm" || fileType === "ogg") {
      return (
        <video
          src={mediaUrl}
          controls
          className="w-full h-[694px] object-cover"
        >
          Tarayıcınız video etiketini desteklemiyor.
        </video>
      );
    }

    return (
      <img
        src={mediaUrl}
        alt="Media"
        className="w-full h-[694px] object-cover"
      />
    );
  };

  // Gradyanı daha yumuşak ve siyahı azaltılmış hale getiriyoruz
  const gradientOverlayStyle = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
    background: `
      linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.7) 10%,    /* Daha az yoğun siyah */
        rgba(0, 0, 0, 0.5) 25%,    /* Hızla açılan siyah */
        rgba(0, 0, 0, 0.3) 40%,    /* Siyahın gri tonlarına geçişi */
        rgba(64, 64, 64, 0.2) 55%, /* Gri tonları */
        rgba(128, 128, 128, 0.1) 70%, /* Daha açık gri */
        rgba(192, 192, 192, 0.05) 85%, /* Neredeyse şeffaf gri */
        rgba(192, 192, 192, 0) 100%   /* Tamamen şeffaf */
      )
    `,
  };

  return (
    <div
      className="flex justify-between p-5 bg-white rounded-lg mb-5 w-full max-w-[1440px] mx-auto px-5 gap-x-5" // px-5 sağ-sol boşluk ve gap-x-5 arası boşluk
    >
      {/* Left Card */}
      <div
        ref={leftRef}
        className={`w-[48%] bg-[#DFE2E6] rounded-xl overflow-hidden relative transition-all duration-1300 ease-in-out transform ${
          leftInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        } h-[694px]`}
      >
        <div style={gradientOverlayStyle}></div> {/* Gradyan geçişi */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-white font-sans text-center z-10">
          <h3 className="text-[30px] font-bold mb-2 tracking-wider">
            {leftTitle}
          </h3>
          <p className="text-[16px] font-semibold mb-5">{leftSubTitle}</p>
          <a
            href={leftButtonUrl}
            className=" w-[120px] h-[50px] px-8 py-2 border-2 border-white text-white text-center no-underline rounded-xl font-sans text-[18px] transition-colors duration-300 ease-in-out hover:bg-transparent hover:text-[#666666] hover:border-[#666666] flex justify-center items-center"
          >
            {leftButtonText}
          </a>
        </div>
        {renderMedia(leftMedia)}
      </div>

      {/* Right Card */}
      <div
        ref={rightRef}
        className={`w-[48%] bg-[#DFE2E6] rounded-xl overflow-hidden relative transition-all duration-1300 ease-in-out transform ${
          rightInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        } h-[694px]`}
      >
        <div style={gradientOverlayStyle}></div> {/* Gradyan geçişi */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-white font-sans text-center z-10">
          <h3 className="text-[30px] font-bold mb-2 tracking-wider">
            {rightTitle}
          </h3>
          <p className="text-[16px] font-semibold mb-5">{rightSubTitle}</p>
          <a
            href={rightButtonUrl}
            className=" w-[120px] h-[50px] px-8 py-2 border-2 border-white text-white text-center no-underline rounded-xl font-sans text-[18px] transition-colors duration-300 ease-in-out hover:bg-transparent hover:text-[#666666] hover:border-[#666666] flex justify-center items-center"
          >
            {rightButtonText}
          </a>
        </div>
        {renderMedia(rightMedia)}
      </div>
    </div>
  );
};

export default TwinTopTitleHeroCardSection;
