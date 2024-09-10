import React from "react";
import { useInView } from "react-intersection-observer";

interface TitleSectionProps {
  title: string;
}

const TitleSection: React.FC<TitleSectionProps> = ({ title }) => {
  const { ref, inView } = useInView({
    triggerOnce: false, // Her görünümde tetiklenir
    threshold: 0.2, // Kartın %20'si görünür olduğunda tetikle
  });

  return (
    <div
      ref={ref}
      className={`w-[1292px] h-[10px] bg-white rounded-[20px] flex justify-start items-center px-[30px] my-[92px] mx-auto transition-transform duration-1000 ease-out ${
        inView ? "translate-y-0 opacity-100" : "translate-y-[50%] opacity-0"
      }`}
    >
      <h2 className="text-black font-roboto text-[55px] font-normal m-0">
        {title}
      </h2>
    </div>
  );
};

export default TitleSection;
