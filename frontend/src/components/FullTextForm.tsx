import React, { ChangeEvent } from "react";

interface FullTextFormProps {
  text: string;
  onTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const FullTextForm: React.FC<FullTextFormProps> = ({ text, onTextChange }) => {
  return (
    <div className="flex flex-col space-y-6 p-4">
      <div className="flex flex-col" style={{ marginLeft: "3%" }}>
        {" "}
        {/* Soldan %3 boşluk */}
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{ width: "418px", height: "16px", lineHeight: "15.62px" }} // Label ölçüleri
        >
          Yazı
        </label>
        <textarea
          value={text}
          onChange={onTextChange}
          placeholder="  Yazı Alanı" // Placeholder başında iki boşluk eklendi
          className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#667085] placeholder:text-[#667085] placeholder:font-[16px] placeholder:leading-[24px]" // Medya Seç ile aynı stil
          style={{
            width: "418px", // Genişlik
            height: "80px", // Yükseklik
            padding: "12px", // İç boşluk
            borderRadius: "8px", // Kenar yuvarlama
            border: "1px solid #D9D9D9", // Kenar rengi ve kalınlığı
            backgroundColor: "#FFFFFF", // Arka plan rengi
            resize: "none", // Boyutlandırma devre dışı
            boxSizing: "border-box", // Padding ve border dahil edilerek hesaplanır
          }}
        />
      </div>
    </div>
  );
};

export default FullTextForm;
