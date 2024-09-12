import React, { useState, ChangeEvent } from "react";

interface FullTextFormProps {
  text: string;
  onTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const FullTextForm: React.FC<FullTextFormProps> = ({ text, onTextChange }) => {
  const [charCount, setCharCount] = useState<number>(text.length); // Karakter sayacı
  const [error, setError] = useState<string>(""); // Hata mesajı için state

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= 450) {
      setError(""); // Hata mesajını temizliyoruz
      onTextChange(e); // OnTextChange propunu çağırıyoruz
    } else {
      setError("Karakter sınırını aştınız!"); // Hata mesajı
    }
    setCharCount(newText.length); // Karakter sayacını güncelliyoruz
  };

  return (
    <div className="flex flex-col space-y-6 p-4">
      <div className="flex flex-col" style={{ marginLeft: "3%" }}>
        {/* Soldan %3 boşluk */}
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{ width: "418px", height: "16px", lineHeight: "15.62px" }} // Label ölçüleri
        >
          Yazı
        </label>
        <textarea
          value={text}
          onChange={handleTextChange} // Karakter sınırı kontrolü ile handleTextChange fonksiyonu bağlıyoruz
          placeholder="  Yazı Alanı" // Placeholder başında iki boşluk eklendi
          className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#667085] placeholder:text-[#667085] placeholder:font-[16px] placeholder:leading-[24px]"
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
        {/* Hata mesajı ve karakter sayacı */}
        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p> // Hata mesajı
        )}
        <div className="text-right text-sm text-gray-500 mt-1">
          {charCount}/450 {/* Karakter sayacını gösteriyoruz */}
        </div>
      </div>
    </div>
  );
};

export default FullTextForm;