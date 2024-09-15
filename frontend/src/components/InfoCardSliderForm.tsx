import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import axios from "axios";
import InfoCardSliderSection from "../sections/infoCardSlider-section"; // InfoCardSliderSection'u import et

interface InfoCardSliderFormProps {
  items: {
    id: number;
    icon: string;
    title: string;
    subtitle: string;
  }[];
  onIconChange: (id: number, e: ChangeEvent<HTMLSelectElement>) => void;
  onTitleChange: (id: number, e: ChangeEvent<HTMLInputElement>) => void;
  onSubtitleChange: (id: number, e: ChangeEvent<HTMLInputElement>) => void;
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
}

const InfoCardSliderForm: React.FC<InfoCardSliderFormProps> = ({
  items,
  onIconChange,
  onTitleChange,
  onSubtitleChange,
  onAddItem,
  onRemoveItem,
}) => {
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null); // Seçilen item ID'si için state
  const [searchTerm, setSearchTerm] = useState<string>(""); // Arama çubuğu için state eklendi
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false); // Önizleme için state
  const modalRef = useRef<HTMLDivElement>(null); // useRef eklendi

  const apiUrl = import.meta.env.VITE_BE_URL;

  useEffect(() => {
    const fetchMediaList = async () => {
      try {
        const response = await axios.get(`${apiUrl}/media/list`);
        const mediaNames = response.data.map((media: any) => media.Key); // Uzantılarıyla birlikte tam medya isimlerini alıyoruz
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

  // renderFilePreview fonksiyonu
  const renderFilePreview = (file: string) => {
    const fileType = file.split(".").pop()?.toLowerCase();
    const previewStyle = "w-full h-32 object-cover mb-2";

    switch (fileType) {
      // Yaygın resim formatları
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

      // Yaygın video formatları
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

  // Medya seçimi yapıldıktan sonra icon state'ini güncelleyen fonksiyon
  const handleMediaSelect = (selectedMedia: string) => {
    if (selectedItemId !== null) {
      onIconChange(selectedItemId, {
        target: { value: selectedMedia },
      } as ChangeEvent<HTMLSelectElement>);
    }
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
        {items.map((item) => (
          <div
            key={item.id}
            className="mb-4 p-4 bg-[#DFE2E6] border border-[#D1D5DB] rounded-lg"
            style={{
              width: "301px",
              height: "336px",
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
                Info Card {item.id}
              </h3>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-[#6B7280] hover:text-[#374151] text-xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-[#1F2937] mb-1">Icon</label>
              <input
                type="text"
                readOnly
                value={item.icon || "Medya Seç"} // Başlangıçta "Medya Seç" yazısı olacak
                onClick={() => {
                  setIsModalOpen(true);
                  setSelectedItemId(item.id); // Seçilen item ID'sini kaydediyoruz
                }}
                className="block w-full p-3 border border-[#D1D5DB] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] text-[#4B5563]"
              />
              {/* Yıldız işaretli medya ölçüsü ekleniyor */}
              <p
                style={{ color: "#667085", fontSize: "12px", marginTop: "4px" }}
              >
                <span style={{ color: "red" }}>*</span>100x100(px)
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-[#1F2937] mb-1">
                Başlık
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => onTitleChange(item.id, e)}
                placeholder="Başlık Alanı"
                className="block w-full p-3 border border-[#D1D5DB] rounded-lg shadow-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-[#1F2937] mb-1">
                Alt Başlık
              </label>
              <input
                type="text"
                value={item.subtitle}
                onChange={(e) => onSubtitleChange(item.id, e)} // id parametresi ile birlikte çağırıyoruz
                placeholder="Alt Başlık Alanı"
                className="block w-full p-3 border border-[#D1D5DB] rounded-lg shadow-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />
            </div>
          </div>
        ))}

        <div className="flex items-center">
          <button
            onClick={onAddItem}
            className="bg-[#FCFCFC] text-[#353642] border border-[#D6D6D6] rounded-lg shadow-xs focus:outline-none"
            style={{
              width: "138px",
              height: "40px",
              padding: "10px 16px",
              borderRadius: "8px",
              boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Poppins",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                color: "#353642",
              }}
            >
              Info Card Ekle
            </span>
          </button>
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
      </div>

      {/* Önizleme Butonu */}
      <div className="w-full mt-4">
        <button
          type="button"
          className="bg-[#970928] text-white py-2 px-4 rounded-md hover:bg-[#7a0620] transition transform duration-150 ease-in-out"
          style={{
            width: "100px",
            textAlign: "center",
            marginLeft: "4.3%",
          }}
          onClick={() => setIsPreviewOpen(!isPreviewOpen)} // Önizleme butonuna basılınca açılıp kapanıyor
        >
          Önizleme
        </button>
      </div>

      {/* InfoCardSliderSection'ın %50 küçültülmüş önizleme alanı */}
      {isPreviewOpen && (
        <div
          style={{
            transform: "scale(0.5)", // %50 küçültme
            transformOrigin: "top left", // Sol üstten küçült
            margin: "0 auto", // Ortalamak için
            width: "100%", // Orijinal genişliğin yarısı
            height: "150px",
            marginLeft: "25%",
          }}
          className="p-2 rounded-lg mt-6"
        >
          <InfoCardSliderSection items={items} />
        </div>
      )}
    </div>
  );
};

export default InfoCardSliderForm;
