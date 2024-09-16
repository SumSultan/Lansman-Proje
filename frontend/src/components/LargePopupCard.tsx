import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import axios from "axios";
import LargePopupCardSection from "../sections/largePopupCard-section"; // Import section component

interface LargePopupCardFormProps {
  media: string;
  onMediaChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const LargePopupCardForm: React.FC<LargePopupCardFormProps> = ({
  media,
  onMediaChange,
}) => {
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state
  const [searchTerm, setSearchTerm] = useState<string>(""); // Arama çubuğu için state
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false); // State for preview toggle
  const modalRef = useRef<HTMLDivElement>(null); // useRef eklendi

  const apiUrl = import.meta.env.VITE_BE_URL;

  useEffect(() => {
    const fetchMediaList = async () => {
      try {
        const response = await axios.get(`${apiUrl}/media/list`);
        const mediaNames = response.data.map((media: any) => media.Key); // Uzantılarıyla birlikte tam medya ismini alıyoruz
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

  // Medya dosyalarının önizlemesi için fonksiyon
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

  // Medya ve lansman adına göre filtreleme işlemi
  const filteredMediaList = mediaList.filter((mediaItem) =>
    mediaItem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Medya seçildikten sonra media state'ini güncelleyen fonksiyon
  const handleMediaSelect = (selectedMedia: string) => {
    onMediaChange({
      target: { value: selectedMedia },
    } as ChangeEvent<HTMLSelectElement>);
    setIsModalOpen(false); // Modalı kapatıyoruz
  };

  return (
    <div
      className="flex flex-col space-y-6 p-4"
      style={{ paddingLeft: "4.5%" }}
    >
      {" "}
      {/* Sola doğru kaydırıldı */}
      <div className="flex flex-col">
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{
            width: "413px",
            height: "16px",
            lineHeight: "15.62px",
            textAlign: "left",
          }} // Başlığı sola hizala
        >
          Medya
        </label>
        <input
          type="text"
          readOnly
          value={media || "  Medya Seç"}
          onClick={() => setIsModalOpen(true)} // Modalı açıyoruz
          className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#667085] text-[16px] leading-[24px]"
          style={{
            width: "423px",
            height: "50px",
            paddingLeft: "10px",
            marginBottom: "4px",
          }} // Daha sola yakınlaştırıldı
        />
        <p style={{ color: "#667085", fontSize: "12px", marginTop: "4px" }}>
          <span style={{ color: "red" }}>*</span>960x630(px)
        </p>
      </div>
      <button
        type="button"
        onClick={() => setIsPreviewOpen(!isPreviewOpen)} // Toggle preview state
        className="bg-[#970928] text-white py-2 px-4 rounded-md hover:bg-[#7a0620] transition transform duration-150 ease-in-out"
        style={{
          width: "100px",
          textAlign: "center",
        }}
      >
        Önizleme
      </button>
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
              onClick={() => setIsModalOpen(false)} // Kapatma butonu
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-4">Medya Seç</h3>

            {/* Arama çubuğu eklendi */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Lansman Adına Göre Ara"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-500 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-gray-500 text-sm font-medium text-gray-700"
                style={{
                  width: "300px",
                  height: "40px",
                  boxShadow: "0 0 3px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {filteredMediaList.map((mediaItem, index) => (
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
      {/* Preview of LargePopupCardSection */}
      {isPreviewOpen && (
        <div
          style={{
            transform: "scale(0.5)", // Scale down to 50%
            transformOrigin: "top left", // Anchor scaling from top left
            margin: "0 auto", // Center the preview
            width: "525px", // Matching card width at 50% scale
            height: "375px", // Matching card height at 50% scale
            marginLeft: "23%",
          }}
          className="p-2 rounded-lg mt-6"
        >
          <LargePopupCardSection media={media} />
        </div>
      )}
    </div>
  );
};

export default LargePopupCardForm;