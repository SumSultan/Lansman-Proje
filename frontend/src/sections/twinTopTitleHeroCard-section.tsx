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

const TwinTopTitleHeroCardSection: React.FC<TwinTopTitleHeroCardSectionProps> = ({
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

  // Medya içeriğini render et
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
        rgba(0, 0, 0, 0.7) 10%,
        rgba(0, 0, 0, 0.5) 25%,
        rgba(0, 0, 0, 0.3) 40%,
        rgba(64, 64, 64, 0.2) 55%,
        rgba(128, 128, 128, 0.1) 70%,
        rgba(192, 192, 192, 0.05) 85%,
        rgba(192, 192, 192, 0) 100%
      )
    `,
  };

  // Kart yapısı
  const renderCard = (
    media: string,
    title: string,
    subTitle: string,
    buttonText: string,
    buttonUrl: string,
    ref: React.Ref<HTMLDivElement>,
    inView: boolean
  ) => (
    <div
      ref={ref}
      className={`w-[48%] bg-[#DFE2E6] rounded-xl overflow-hidden relative transition-all duration-1500 ease-in-out transform ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } h-[694px] flex flex-col justify-start items-center`} // İçeriği üstte hizalıyoruz
    >
      <div style={gradientOverlayStyle}></div> {/* Gradyan geçişi */}
      <div className="absolute top-0 left-0 right-0 z-10 flex flex-col justify-start items-center text-center p-8 text-white">
        <h3 className="text-[30px] font-bold mb-2 tracking-wider">{title}</h3>
        <p className="text-[16px] font-semibold mb-5">{subTitle}</p>
        <a
          href={buttonUrl}
          className="w-[120px] h-[50px] px-8 py-2 border-2 border-white text-white text-center no-underline rounded-xl font-sans text-[18px] transition-colors duration-300 ease-in-out hover:bg-transparent hover:text-[#666666] hover:border-[#666666] flex justify-center items-center"
        >
          {buttonText}
        </a>
      </div>
      {renderMedia(media)}
    </div>
  );

  return (
    <div className="flex justify-between p-5 bg-white rounded-lg mb-5 w-full max-w-[1440px] mx-auto px-5 gap-x-5">
      {/* Left Card */}
      {renderCard(
        leftMedia,
        leftTitle,
        leftSubTitle,
        leftButtonText,
        leftButtonUrl,
        leftRef,
        leftInView
      )}

      {/* Right Card */}
      {renderCard(
        rightMedia,
        rightTitle,
        rightSubTitle,
        rightButtonText,
        rightButtonUrl,
        rightRef,
        rightInView
      )}
    </div>
  );
};

export default TwinTopTitleHeroCardSection;
