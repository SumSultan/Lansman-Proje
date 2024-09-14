import React, { useState, ChangeEvent } from "react";
import CTASection from "../sections/cta-section"; // CTASection'u import ediyoruz

interface CTACardFormProps {
  title: string;
  buttonText: string;
  buttonUrl: string;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onButtonTextChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onButtonUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CTACardForm: React.FC<CTACardFormProps> = ({
  title,
  buttonText,
  buttonUrl,
  onTitleChange,
  onButtonTextChange,
  onButtonUrlChange,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false); // Önizleme kontrolü için state

  return (
    <div className="flex flex-col space-y-6 p-4">
      <div className="flex flex-col">
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{
            marginLeft: "3%",
            height: "16px",
            lineHeight: "15.62px",
          }}
        >
          Başlık
        </label>
        <input
          type="text"
          value={title}
          onChange={onTitleChange}
          placeholder="Başlık Alanı"
          className="block text-gray-900 bg-white border border-gray-300 sm:text-sm"
          style={{
            width: "423px",
            marginLeft: "3%",
            height: "50px",
            borderRadius: "8px",
            padding: "10px 16px",
            borderTop: "1px solid #D9D9D9",
            outline: "none",
          }}
        />
      </div>
      <div className="flex flex-col">
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{
            marginLeft: "3%",
            height: "16px",
            lineHeight: "15.62px",
          }}
        >
          Buton
        </label>
        <input
          type="text"
          value={buttonText}
          onChange={onButtonTextChange}
          placeholder="Buton Adı"
          className="block text-gray-900 bg-white border border-gray-300 sm:text-sm"
          style={{
            width: "423px",
            marginLeft: "3%",
            height: "50px",
            borderRadius: "8px",
            padding: "10px 16px",
            borderTop: "1px solid #D9D9D9",
            outline: "none",
          }}
        />
      </div>
      <div className="flex flex-col">
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{
            marginLeft: "3%",
            height: "16px",
            lineHeight: "15.62px",
          }}
        >
          Buton Url
        </label>
        <input
          type="text"
          value={buttonUrl}
          onChange={onButtonUrlChange}
          placeholder="Buton Url Alanı"
          className="block text-gray-900 bg-white border border-gray-300 sm:text-sm"
          style={{
            width: "423px",
            marginLeft: "3%",
            height: "50px",
            borderRadius: "8px",
            padding: "10px 16px",
            borderTop: "1px solid #D9D9D9",
            outline: "none",
          }}
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

      {/* CTASection'un %50 küçültülmüş önizleme alanı */}
      {isPreviewOpen && (
        <div
          style={{
            transform: "scale(0.5)", // %50 küçültme
            transformOrigin: "top left", // Sol üstten küçült
            margin: "0 auto", // Ortalamak için
            width: "100%", // Orijinal genişliğin yarısı
          }}
          className="p-2 rounded-lg mt-6"
        >
          <CTASection
            title={title}
            buttonText={buttonText}
            buttonUrl={buttonUrl}
          />
        </div>
      )}
    </div>
  );
};

export default CTACardForm;
