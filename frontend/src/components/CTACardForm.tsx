import React, { ChangeEvent } from "react";

// Props interface'i tanımlıyoruz
interface CTACardFormProps {
  title: string;
  buttonText: string;
  buttonUrl: string;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onButtonTextChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onButtonUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Bileşeni güncelliyoruz
const CTACardForm: React.FC<CTACardFormProps> = ({
  title,
  buttonText,
  buttonUrl,
  onTitleChange,
  onButtonTextChange,
  onButtonUrlChange,
}) => {
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
            width: "423px", // Genişlik 423px yapıldı
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
            width: "423px", // Genişlik 423px yapıldı
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
            width: "423px", // Genişlik 423px yapıldı
            marginLeft: "3%",
            height: "50px",
            borderRadius: "8px",
            padding: "10px 16px",
            borderTop: "1px solid #D9D9D9",
            outline: "none",
          }}
        />
      </div>
    </div>
  );
};

export default CTACardForm;
