import React from "react";
import { useInView } from "react-intersection-observer";

interface CTASectionProps {
  title?: string;
  buttonText?: string;
  buttonUrl?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  buttonText,
  buttonUrl,
}) => {
  const { ref, inView } = useInView({
    triggerOnce: false, // Her seferinde tetikle
    threshold: 0.2, // Kartın %20'si görünür olduğunda tetikle
  });

  return (
    <div
      ref={ref}
      className={`w-[1400px] h-[124px] bg-white rounded-[20px] border-2 border-[#fafafa] flex justify-between items-center px-[50px] mx-auto transition-all duration-500 ease-in-out transform ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } hover:scale-105 hover:shadow-lg`}
    >
      <h2 className="text-gray-700 font-sans text-[48px] m-0">{title}</h2>{" "}
      {/* Başlık için gri renk */}
      <a
        href={buttonUrl}
        className="flex justify-center items-center w-[120px] h-[52px] border-2 border-[#fafafa] text-gray-700 no-underline rounded-[10px] bg-transparent font-sans text-[24px] transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg"
      >
        {buttonText}
      </a>
    </div>
  );
};

export default CTASection;
