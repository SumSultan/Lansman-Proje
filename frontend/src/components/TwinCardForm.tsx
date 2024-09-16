import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import axios from "axios";
import TwinCardSection from "../sections/twinCard-section"; // TwinCardSection'u import ediyoruz

interface TwinCardFormProps {
  rightMedia: string;
  leftMedia: string;
  onRightMediaChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onLeftMediaChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const TwinCardForm: React.FC<TwinCardFormProps> = ({
  rightMedia,
  leftMedia,
  onRightMediaChange,
  onLeftMediaChange,
}) => {
  const [mediaList, setMediaList] = useState<
    { key: string; launchName: string }[]
  >([]);
  const [isRightModalOpen, setIsRightModalOpen] = useState<boolean>(false);
  const [isLeftModalOpen, setIsLeftModalOpen] = useState<boolean>(false);
  const [rightSearchTerm, setRightSearchTerm] = useState<string>(""); // Sağ medya için arama
  const [leftSearchTerm, setLeftSearchTerm] = useState<string>(""); // Sol medya için arama
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false); // Önizleme kontrolü için state
  const modalRef = useRef<HTMLDivElement>(null);

  const apiUrl = import.meta.env.VITE_BE_URL;

  useEffect(() => {
    const fetchMediaList = async () => {
      try {
        const response = await axios.get(`${apiUrl}/media/list`);
        const mediaNames = response.data.map((media: any) => ({
          key: media.Key,
          launchName: media.launchName || "",
        }));
        setMediaList(mediaNames);
      } catch (error) {
        console.error("Medya listesi alınamadı:", error);
      }
    };

    fetchMediaList();
  }, []);

  // Modal dışında tıklanırsa kapatma işlevi
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsRightModalOpen(false);
        setIsLeftModalOpen(false);
      }
    };

    if (isRightModalOpen || isLeftModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isRightModalOpen, isLeftModalOpen]);

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

  // Sağ medya seçimi
  const handleRightMediaSelect = (selectedMedia: string) => {
    onRightMediaChange({
      target: { value: selectedMedia },
    } as ChangeEvent<HTMLSelectElement>);
    setIsRightModalOpen(false); // Modalı kapatıyoruz
  };

  // Sol medya seçimi
  const handleLeftMediaSelect = (selectedMedia: string) => {
    onLeftMediaChange({
      target: { value: selectedMedia },
    } as ChangeEvent<HTMLSelectElement>);
    setIsLeftModalOpen(false); // Modalı kapatıyoruz
  };

  // Sağ medya için filtreleme
  const filteredRightMediaList = mediaList.filter(
    (mediaItem) =>
      mediaItem.key.toLowerCase().includes(rightSearchTerm.toLowerCase()) ||
      mediaItem.launchName.toLowerCase().includes(rightSearchTerm.toLowerCase())
  );

  // Sol medya için filtreleme
  const filteredLeftMediaList = mediaList.filter(
    (mediaItem) =>
      mediaItem.key.toLowerCase().includes(leftSearchTerm.toLowerCase()) ||
      mediaItem.launchName.toLowerCase().includes(leftSearchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-6 p-4">
      {/* Sağ Medya */}
      <div className="flex flex-col">
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{ marginLeft: "3%", height: "16px", lineHeight: "15.62px" }}
        >
          Sağ Medya
        </label>
        <input
          type="text"
          readOnly
          value={rightMedia || "  Medya Seç"}
          onClick={() => setIsRightModalOpen(true)}
          className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#667085] text-[16px] leading-[24px]"
          style={{ width: "423px", height: "50px", marginLeft: "3%" }}
        />
        {/* Yıldız işaretli medya ölçüsü */}
        <p style={{ color: "#667085", fontSize: "12px", marginLeft: "3%" }}>
          <span style={{ color: "red" }}>*</span>440x700(px)
        </p>
      </div>

      {/* Sol Medya */}
      <div className="flex flex-col">
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{ marginLeft: "3%", height: "16px", lineHeight: "15.62px" }}
        >
          Sol Medya
        </label>
        <input
          type="text"
          readOnly
          value={leftMedia || "  Medya Seç"}
          onClick={() => setIsLeftModalOpen(true)}
          className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#667085] text-[16px] leading-[24px]"
          style={{ width: "423px", height: "50px", marginLeft: "3%" }}
        />
        {/* Yıldız işaretli medya ölçüsü */}
        <p style={{ color: "#667085", fontSize: "12px", marginLeft: "3%" }}>
          <span style={{ color: "red" }}>*</span>440x700(px)
        </p>
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

      {/* TwinCardSection'un %50 küçültülmüş önizleme alanı */}
      {isPreviewOpen && (
        <div
          style={{
            transform: "scale(0.5)", // %50 küçültme
            transformOrigin: "top left", // Sol üstten küçült
            margin: "0 auto", // Ortalamak için
            width: "100%", // Orijinal genişliğin yarısı
            height: "350px",
            marginLeft: "27%",
          }}
          className="p-2 rounded-lg mt-6"
        >
          <TwinCardSection rightMedia={rightMedia} leftMedia={leftMedia} />
        </div>
      )}

      {/* Sağ Medya Modal */}
      {isRightModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-4 w-3/4 max-h-full overflow-y-auto relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-[#970928] bg-white rounded-full p-2 hover:bg-gray-100 transition transform duration-150 ease-in-out"
              onClick={() => setIsRightModalOpen(false)}
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-4">Sağ Medya Seç</h3>
            <input
              type="text"
              placeholder="Medya adı veya lansman adına göre arama"
              value={rightSearchTerm}
              onChange={(e) => setRightSearchTerm(e.target.value)}
              className="border border-gray-500 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-gray-500 text-sm font-medium text-gray-700 mb-4"
              style={{ width: "300px", height: "40px" }}
            />
            <div className="grid grid-cols-4 gap-4">
              {filteredRightMediaList.map((mediaItem, index) => (
                <div
                  key={index}
                  onClick={() => handleRightMediaSelect(mediaItem.key)}
                  className="cursor-pointer"
                >
                  {renderFilePreview(mediaItem.key)}
                  <p className="text-center text-sm truncate">
                    {mediaItem.key}
                  </p>
                  <p className="text-center text-sm truncate">
                    {mediaItem.launchName}
                  </p>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 w-full bg-[#970928] text-white py-2 px-4 rounded-md hover:bg-[#7a0620] transition transform duration-150 ease-in-out"
              onClick={() => setIsRightModalOpen(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Sol Medya Modal */}
      {isLeftModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-4 w-3/4 max-h-full overflow-y-auto relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-[#970928] bg-white rounded-full p-2 hover:bg-gray-100 transition transform duration-150 ease-in-out"
              onClick={() => setIsLeftModalOpen(false)}
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-4">Sol Medya Seç</h3>
            <input
              type="text"
              placeholder="Medya adı veya lansman adına göre arama"
              value={leftSearchTerm}
              onChange={(e) => setLeftSearchTerm(e.target.value)}
              className="border border-gray-500 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-gray-500 text-sm font-medium text-gray-700 mb-4"
              style={{ width: "300px", height: "40px" }}
            />
            <div className="grid grid-cols-4 gap-4">
              {filteredLeftMediaList.map((mediaItem, index) => (
                <div
                  key={index}
                  onClick={() => handleLeftMediaSelect(mediaItem.key)}
                  className="cursor-pointer"
                >
                  {renderFilePreview(mediaItem.key)}
                  <p className="text-center text-sm truncate">
                    {mediaItem.key}
                  </p>
                  <p className="text-center text-sm truncate">
                    {mediaItem.launchName}
                  </p>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 w-full bg-[#970928] text-white py-2 px-4 rounded-md hover:bg-[#7a0620] transition transform duration-150 ease-in-out"
              onClick={() => setIsLeftModalOpen(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwinCardForm;