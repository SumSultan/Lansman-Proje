import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

interface AccordionItem {
  title: string;
  subTitle: string;
}

interface AccordionRightCardSectionProps {
  media: string;
  accordian: AccordionItem[];
}

const AccordionRightCardSection: React.FC<AccordionRightCardSectionProps> = ({
  media,
  accordian,
}) => {
  const mediaUrl = `${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${media}`;
  const fileType = media.split(".").pop()?.toLowerCase();

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [heights, setHeights] = useState<{ [key: number]: number }>({});
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    // Her accordion içeriği için height değerini ölçüyoruz
    const heights: { [key: number]: number } = {};
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        heights[index] = ref.scrollHeight;
      }
    });
    setHeights(heights);
  }, [accordian]);

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const animationStyle: React.CSSProperties = {
    transition: "transform 1.3s ease, opacity 1.3s ease",
    opacity: 0,
    transform: "translateY(20px)",
  };

  const visibleStyle: React.CSSProperties = {
    opacity: 1,
    transform: "translateY(0)",
  };

  return (
    <div
      ref={ref}
      style={{
        margin: "40px 0", // Alttan ve üsten 40px margin
        ...animationStyle,
        ...(inView ? visibleStyle : {}),
      }}
      className="flex justify-between bg-[#fafafa] rounded-[20px] shadow-lg h-[787px] w-[1400px] mx-auto ps-10"
    >
      {/* Sol kısım - Accordion */}
      <div className="w-[45%] h-full flex flex-col items-start justify-center mr-16 overflow-y-auto">
        {accordian.map((item, index) => (
          <div key={index} className="w-full">
            <div
              onClick={() => toggleAccordion(index)}
              className="mb-8 cursor-pointer w-full bg-transparent border-b border-gray-300"
            >
              <h3 className="text-[24px] font-semibold flex justify-between items-center text-gray-900">
                {item.title}
                <FaChevronDown
                  className={`transform transition-transform duration-200 text-[16px] text-gray-500 ${
                    openIndex === index ? "rotate-180" : "rotate-0"
                  }`}
                />
              </h3>
            </div>
            {/* Alt metin animasyonlu açılma */}
            <div
              ref={(el) => (contentRefs.current[index] = el)}
              style={{
                maxHeight: openIndex === index ? `${heights[index]}px` : "0px",
                transition: "max-height 0.5s ease",
                overflow: "hidden",
              }}
              className="mt-2 mb-8 text-[17px] text-gray-600 leading-relaxed break-words whitespace-normal"
            >
              {item.subTitle}
            </div>
          </div>
        ))}
      </div>

      {/* Sağ kısım - Medya */}
      <div className="w-[55%] h-[787px] flex-shrink-0 order-2">
        {fileType === "mp4" || fileType === "webm" ? (
          <video
            controls
            className="w-full h-full rounded-[15px] shadow-xl object-cover"
          >
            <source src={mediaUrl} type={`video/${fileType}`} />
          </video>
        ) : (
          <img
            src={mediaUrl}
            alt="Media"
            className="w-full h-full rounded-r-lg shadow-xl object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default AccordionRightCardSection;
