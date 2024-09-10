import React, { useState, useEffect, ChangeEvent, useRef } from "react"; // useRef'i buraya ekledim
import axios from "axios";

interface AccordionRightCardFormProps {
  media: string;
  accordian: { title: string; subTitle: string }[];
  onMediaChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onAddAccordianItem: () => void;
  onRemoveAccordianItem: (index: number) => void;
  onAccordianTitleChange: (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => void;
  onAccordianSubTitleChange: (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => void;
}

const AccordionRightCardForm: React.FC<AccordionRightCardFormProps> = ({
  media,
  accordian,
  onMediaChange,
  onAddAccordianItem,
  onRemoveAccordianItem,
  onAccordianTitleChange,
  onAccordianSubTitleChange,
}) => {
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const apiUrl = import.meta.env.VITE_BE_URL;

  useEffect(() => {
    const fetchMediaList = async () => {
      try {
        const response = await axios.get(`${apiUrl}/media/list`);
        const mediaNames = response.data.map((media: any) => media.Key);
        setMediaList(mediaNames);
      } catch (error) {
        console.error("Medya listesi alınamadı:", error);
      }
    };

    fetchMediaList();
  }, []);

  // Modal dışında tıklanırsa kapatmayı sağlayan fonksiyon
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  // Medya önizleme fonksiyonu
  const renderFilePreview = (file: string) => {
    const fileType = file.split(".").pop()?.toLowerCase();
    const previewStyle = "w-full h-32 object-cover mb-2";

    switch (fileType) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
      case "svg":
      case "webp":
      case "avif":
        return (
          <img
            src={`${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${file}`}
            alt={file}
            className={previewStyle}
          />
        );
      case "mp4":
      case "webm":
      case "ogg":
      case "avi":
      case "mov":
      case "mkv":
        return (
          <video controls className={previewStyle}>
            <source
              src={`${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${file}`}
              type={`video/${fileType}`}
            />
            Tarayıcınız bu videoyu oynatmayı desteklemiyor.
          </video>
        );
      default:
        return (
          <p className="text-center">
            Desteklenmeyen dosya formatı: {fileType}
          </p>
        );
    }
  };

  // Medya seçimi yapıldıktan sonra media state'ini güncelleyen fonksiyon
  const handleMediaSelect = (selectedMedia: string) => {
    onMediaChange({
      target: { value: selectedMedia },
    } as ChangeEvent<HTMLSelectElement>);
    setIsModalOpen(false); // Modalı kapatıyoruz
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="p-4 border rounded-lg"
        style={{
          width: "426px",
          maxHeight: "500px",
          overflowY: "auto",
          backgroundColor: "rgba(16, 24, 40, 0.05)",
          borderRadius: "8px",
        }}
      >
        {/* Medya Alanı */}
        <div className="flex flex-col mb-4">
          <label
            className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
            style={{ width: "413px", height: "16px", lineHeight: "15.62px" }}
          >
            Medya
          </label>
          <input
            type="text"
            readOnly
            value={media || "Media Seç"} // Başlangıç ismini buraya ekledim
            onClick={() => setIsModalOpen(true)} // Modalı açan buton
            className="block text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
            style={{
              width: "396px", // Genişlik (396px)
              height: "50px", // Yükseklik (50px)
              padding: "10px 16px", // İç boşluklar (Padding)
              borderRadius: "8px", // Kenar yuvarlama
              outline: "none", // Mavi çerçeveyi kaldırmak için
            }}
          />
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div
              ref={modalRef}
              className="bg-white rounded-lg p-4 w-3/4 max-h-full overflow-y-auto relative"
            >
              <button
                type="button"
                className="absolute top-2 right-2 text-[#970928] bg-white rounded-full p-2 hover:bg-gray-100 transition transform duration-150 ease-in-out"
                onClick={() => setIsModalOpen(false)} // Kapatma butonu eklendi
              >
                X
              </button>
              <h3 className="text-lg font-semibold mb-4">Medya Seç</h3>
              <div className="grid grid-cols-4 gap-4">
                {mediaList.map((mediaItem, index) => (
                  <div
                    key={index}
                    onClick={() => handleMediaSelect(mediaItem)}
                    className="cursor-pointer"
                  >
                    {renderFilePreview(mediaItem)}
                    <p className="text-center text-sm truncate">{mediaItem}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-4 w-full bg-[#970928] text-white py-2 px-4 rounded-md hover:bg-[#7a0620] transition transform duration-150 ease-in-out"
                onClick={() => setIsModalOpen(false)}
              >
                Kapat
              </button>
            </div>
          </div>
        )}

        {/* Accordion Bölümleri */}
        {accordian.map((section, index) => (
          <div
            key={index}
            className="mb-4 p-4 bg-[#DFE2E6] border border-[#D1D5DB] rounded-lg"
            style={{
              width: "301px",
              borderRadius: "10px",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className="text-lg font-semibold"
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#7A8699",
                }}
              >
                Accordion Bölüm {index + 1}
              </h3>
              <button
                onClick={() => onRemoveAccordianItem(index)}
                className="text-[#6B7280] hover:text-[#374151] text-xl"
              >
                ×
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-[#1F2937] mb-1">
                Başlık
              </label>
              <input
                type="text"
                value={section.title}
                onChange={(e) => onAccordianTitleChange(index, e)}
                placeholder="Input"
                className="block w-full p-3 border border-[#D1D5DB] rounded-lg shadow-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-[#1F2937] mb-1">
                Alt Başlık
              </label>
              <input
                type="text"
                value={section.subTitle}
                onChange={(e) => onAccordianSubTitleChange(index, e)}
                placeholder="Input"
                className="block w-full p-3 border border-[#D1D5DB] rounded-lg shadow-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />
            </div>
          </div>
        ))}

        <div className="flex items-center">
          <button
            onClick={onAddAccordianItem}
            className="bg-[#FCFCFC] text-[#353642] border border-[#D6D6D6] rounded-lg shadow-xs focus:outline-none"
            style={{
              width: "184px", // Genişlik
              height: "40px", // Yükseklik
              padding: "10px 16px", // İçerik iç boşlukları
              borderRadius: "8px", // Kenar yuvarlama
              border: "1px solid #D6D6D6", // Sınır rengi
              boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)", // Gölge efekti
              fontFamily: "Poppins", // Yazı tipi
              fontSize: "14px", // Yazı boyutu
              color: "#101828", // Yazı rengi
              textAlign: "left", // Sol hizalama
            }}
          >
            Accordion Bölüm Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccordionRightCardForm;
