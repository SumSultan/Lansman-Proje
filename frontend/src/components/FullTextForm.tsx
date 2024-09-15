import React, { useState, ChangeEvent } from "react";
import FullTextSection from "../sections/fullText-section"; // FullTextSection'u import et

interface FullTextFormProps {
  text: string;
  onTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const FullTextForm: React.FC<FullTextFormProps> = ({ text, onTextChange }) => {
  const [charCount, setCharCount] = useState<number>(text.length); // Karakter sayacı
  const [error, setError] = useState<string>(""); // Hata mesajı için state
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false); // Önizleme kontrolü için state

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;

    if (newText.length <= 450) {
      setError(""); // Hata mesajını temizliyoruz
      onTextChange(e); // onTextChange propunu çağırıyoruz
      setCharCount(newText.length); // Karakter sayacını güncelliyoruz
    } else {
      setError("Karakter sınırını aştınız!"); // Hata mesajı
    }
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
          value={text.slice(0, 450)} // Karakter sınırını burada zorunlu kılıyoruz
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
        <div style={{ marginTop: "4px" }}>
          {error && (
            <p
              className="text-red-500 text-xs mt-1"
              // marginLeft stilini kaldırdık
            >
              {error}
            </p> // Hata mesajı yazı alanının hemen altında
          )}
          <div style={{marginRight:"61.7%"}}
            className="text-right text-sm text-gray-500 mt-1"
            // marginLeft stilini kaldırdık
          >
            {charCount}/450 {/* Karakter sayacını gösteriyoruz */}
            
          </div>
        </div>
      </div>

      {/* Önizleme Butonu */}
      <button
        type="button"
        className="bg-[#970928] text-white py-2 px-4 rounded-md hover:bg-[#7a0620] transition transform duration-150 ease-in-out"
        style={{
          width: "100px", // Önizleme butonunun genişliği
          marginLeft: "3%", // Buton soldan %3 uzaklıkta
          textAlign: "center", // Metni ortalıyoruz
        }}
        onClick={() => setIsPreviewOpen(!isPreviewOpen)} // Önizleme butonuna basılınca tetiklenen işlev
      >
        Önizleme
      </button>

      {/* FullTextSection'ın %50 küçültülmüş önizleme alanı */}
      {isPreviewOpen && (
        <div
          style={{
            transform: "scale(0.5)", // %50 küçültme
            transformOrigin: "top left", // Sol üstten küçült
            margin: "0 auto", // Ortalamak için
            width: "100%", // Orijinal genişliğin yarısı
            height: "150px", // Yüksekliği içerikle beraber ayarlayalım
            marginLeft: "25%",
          }}
          className="p-2 rounded-lg mt-6"
        >
          <FullTextSection text={text} />
        </div>
      )}
    </div>
  );
};

export default FullTextForm;
