import React, { useState, ChangeEvent } from "react";
import TitleSection from "../sections/title-section"; // TitleSection'u import ediyoruz

interface TitleFormProps {
  title: string;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TitleForm: React.FC<TitleFormProps> = ({ title, onTitleChange }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false); // Önizleme kontrolü için state

  return (
    <div className="flex flex-col space-y-6 p-4">
      <div className="flex flex-col">
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{ marginLeft: "3%", height: "16px", lineHeight: "15.62px" }}
        >
          Başlık
        </label>
        <input
          type="text"
          value={title}
          onChange={onTitleChange}
          placeholder="  Başlık Alanı"
          className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#667085] text-[16px] leading-[24px]"
          style={{ width: "423px", height: "50px", marginLeft: "3%" }}
        />
      </div>

      {/* Önizleme Butonu */}
      <div className="w-full mt-4">
        <button
          type="button"
          className="bg-[#970928] text-white py-2 px-4 rounded-md hover:bg-[#7a0620] transition transform duration-150 ease-in-out"
          style={{
            width: "100px",
            textAlign: "center",
            marginLeft: "3%",
          }}
          onClick={() => setIsPreviewOpen(!isPreviewOpen)} // Önizleme açılır/kapanır
        >
          Önizleme
        </button>
      </div>

      {/* TitleSection'un %50 küçültülmüş önizleme alanı */}
      {isPreviewOpen && (
        <div
          style={{
            transform: "scale(0.5)", // %50 küçültme
            transformOrigin: "top left", // Sol üstten küçült
            margin: "0 auto", // Ortalamak için
            width: "100%", // Orijinal genişliğin yarısı
            marginLeft: "30%",
          }}
          className="p-2 rounded-lg mt-6"
        >
          <TitleSection title={title} />
        </div>
      )}
    </div>
  );
};

export default TitleForm;
