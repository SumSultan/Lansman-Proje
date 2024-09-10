import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import axios from "axios";

interface ReelsCardSliderFormProps {
  items: {
    id: number;
    media: string;
    title: string;
    subTitle: string;
  }[];
  onMediaChange: (id: number, e: ChangeEvent<HTMLSelectElement>) => void;
  onTitleChange: (id: number, e: ChangeEvent<HTMLInputElement>) => void;
  onSubTitleChange: (id: number, e: ChangeEvent<HTMLInputElement>) => void;
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
}

const ReelsCardSliderForm: React.FC<ReelsCardSliderFormProps> = ({
  items,
  onMediaChange,
  onTitleChange,
  onSubTitleChange,
  onAddItem,
  onRemoveItem,
}) => {
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
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

  const handleMediaSelect = (selectedMedia: string) => {
    if (selectedItemId !== null) {
      onMediaChange(selectedItemId, {
        target: { value: selectedMedia },
      } as ChangeEvent<HTMLSelectElement>);
      setIsModalOpen(false);
    }
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
        {items.map((item) => (
          <div
            key={item.id}
            className="mb-4 p-4 bg-[#DFE2E6] border border-[#D1D5DB] rounded-lg"
            style={{
              width: "301px",
              borderRadius: "10px",
              marginBottom: "24px",
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
                Reels Card {item.id}
              </h3>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-[#6B7280] hover:text-[#374151] text-xl"
              >
                ×
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-[#1F2937] mb-1">
                Medya Alanı
              </label>
              <input
                type="text"
                readOnly
                value={item.media || "Medya Seç"}
                onClick={() => {
                  setSelectedItemId(item.id);
                  setIsModalOpen(true);
                }}
                className="block w-full p-3 border border-[#D1D5DB] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] text-[#4B5563]"
                style={{
                  height: "56px", // Input boyutu büyütüldü
                  borderRadius: "12px", // Kenar yuvarlama artırıldı
                  marginBottom: "16px",
                }}
              />
              <input
                type="text"
                value={item.title}
                onChange={(e) => onTitleChange(item.id, e)}
                placeholder="Başlık Alanı"
                className="block w-full p-3 border border-[#D1D5DB] rounded-lg shadow-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                style={{
                  marginBottom: "16px",
                  height: "56px", // Input boyutu büyütüldü
                  borderRadius: "12px", // Kenar yuvarlama artırıldı
                }}
              />

              <input
                type="text"
                value={item.subTitle}
                onChange={(e) => onSubTitleChange(item.id, e)}
                placeholder="Alt Başlık Alanı"
                className="block w-full p-3 border border-[#D1D5DB] rounded-lg shadow-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                style={{
                  height: "56px", // Input boyutu büyütüldü
                  borderRadius: "12px", // Kenar yuvarlama artırıldı
                }}
              />
            </div>
          </div>
        ))}

        <div className="flex items-center">
          <button
            onClick={onAddItem}
            className="bg-[#F3F4F6] text-[#1F2937] border border-[#D1D5DB] rounded-lg shadow-xs focus:outline-none hover:bg-[#E5E7EB] transition-transform duration-150 ease-in-out"
            style={{
              width: "130px", // Genişlik ayarlandı
              height: "48px", // Boyut büyütüldü
              padding: "12px 16px",
              borderRadius: "12px", // Kenar yuvarlama artırıldı
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <span
              style={{
                fontFamily: "Poppins",
                fontSize: "12px", // Daha küçük font
                fontWeight: 500,
                lineHeight: "16px",
              }}
            >
              Reels Card Ekle
            </span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-4 w-3/4 max-h-full overflow-y-auto relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-[#970928] bg-white rounded-full p-2 hover:bg-gray-100 transition transform duration-150 ease-in-out"
              onClick={() => setIsModalOpen(false)}
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
    </div>
  );
};

export default ReelsCardSliderForm;
