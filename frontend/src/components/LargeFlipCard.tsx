import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import axios from "axios";
import LargeFlipCardSection from "../sections/largeFlipCard-section"; // Import the flip card section

interface LargeFlipCardFormProps {
  frontMedia: string;
  backMedia: string;
  onFrontMediaChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBackMediaChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const LargeFlipCardForm: React.FC<LargeFlipCardFormProps> = ({
  frontMedia,
  backMedia,
  onFrontMediaChange,
  onBackMediaChange,
}) => {
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state
  const [searchTerm, setSearchTerm] = useState<string>(""); // Arama çubuğu için state
  const [selectedMediaType, setSelectedMediaType] = useState<
    "front" | "back" | null
  >(null); // Ön ve arka medya tipi için state
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

  const filteredMediaList = mediaList.filter((mediaItem) =>
    mediaItem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMediaSelect = (selectedMedia: string) => {
    if (selectedMediaType === "front") {
      onFrontMediaChange({
        target: { value: selectedMedia },
      } as ChangeEvent<HTMLSelectElement>);
    } else if (selectedMediaType === "back") {
      onBackMediaChange({
        target: { value: selectedMedia },
      } as ChangeEvent<HTMLSelectElement>);
    }
    setIsModalOpen(false); // Modalı kapatıyoruz
  };

  return (
    <div className="flex flex-col space-y-6 p-4">
      {/* Ön Medya Alanı */}
      <div className="flex flex-col" style={{ marginLeft: "3%" }}>
        <label className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1">
          Ön Medya Alanı
        </label>
        <input
          type="text"
          readOnly
          value={frontMedia || "  Medya Seç"} // Başlangıçta "Medya Seç" yazısı olacak
          onClick={() => {
            setIsModalOpen(true);
            setSelectedMediaType("front");
          }}
          className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#667085] text-[16px] leading-[24px]"
          style={{ width: "423px", height: "50px" }}
        />
        <p style={{ color: "#667085", fontSize: "12px", marginTop: "4px" }}>
          <span style={{ color: "red" }}>*</span> max 960x630(px)
        </p>
      </div>

      {/* Arka Medya Alanı */}
      <div className="flex flex-col" style={{ marginLeft: "3%" }}>
        <label className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1">
          Arka Medya Alanı
        </label>
        <input
          type="text"
          readOnly
          value={backMedia || "  Medya Seç"}
          onClick={() => {
            setIsModalOpen(true);
            setSelectedMediaType("back");
          }}
          className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#667085] text-[16px] leading-[24px]"
          style={{ width: "423px", height: "50px" }}
        />
        <p style={{ color: "#667085", fontSize: "12px", marginTop: "4px" }}>
          <span style={{ color: "red" }}>*</span> max 960x630(px)
        </p>
      </div>

      <button
        type="button"
        className="bg-[#970928] text-white py-2 px-4 rounded-md hover:bg-[#7a0620] transition transform duration-150 ease-in-out"
        style={{
          width: "100px", // Önizleme butonunun genişliği
          marginLeft: "3%", // Buton soldan %3 uzaklıkta
          textAlign: "center", // Önizleme yazısını ortaladık
        }}
        onClick={() => setIsPreviewOpen(!isPreviewOpen)} // Önizleme butonu
      >
        Önizleme
      </button>

      {/* Medya Modalı */}
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

            {/* Arama çubuğu */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Medya adına göre ara"
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

      {/* LargeFlipCardSection'ın %50 küçültülmüş önizleme alanı */}
      {isPreviewOpen && (
        <div
          className="p-2 rounded-lg mt-2" // "p-2" ve "mt-2" ile boşluklar küçültüldü
          style={{
            transform: "scale(0.5)", // Scale down to 50%
            transformOrigin: "top left", // Anchor scaling from top left
            margin: "0 auto", // Center the preview
            height: "310px",
            marginLeft: "27%",
          }}
        >
          <LargeFlipCardSection frontMedia={frontMedia} backMedia={backMedia} />
        </div>
      )}
    </div>
  );
};

export default LargeFlipCardForm;
