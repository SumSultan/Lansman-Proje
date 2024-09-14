import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import axios from "axios";
import TwinFlipCardSection from "../sections/twinFlipCard-section";

interface TwinFlipCardFormProps {
  rightFrontMedia: string;
  rightBackMedia: string;
  leftFrontMedia: string;
  leftBackMedia: string;
  onRightFrontMediaChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onRightBackMediaChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onLeftFrontMediaChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onLeftBackMediaChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const TwinFlipCardForm: React.FC<TwinFlipCardFormProps> = ({
  rightFrontMedia,
  rightBackMedia,
  leftFrontMedia,
  leftBackMedia,
  onRightFrontMediaChange,
  onRightBackMediaChange,
  onLeftFrontMediaChange,
  onLeftBackMediaChange,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [mediaList, setMediaList] = useState<
    { key: string; launchName: string }[]
  >([]);
  const [rightFrontSearchTerm, setRightFrontSearchTerm] = useState<string>(""); // Sağ ön medya arama
  const [rightBackSearchTerm, setRightBackSearchTerm] = useState<string>(""); // Sağ arka medya arama
  const [leftFrontSearchTerm, setLeftFrontSearchTerm] = useState<string>(""); // Sol ön medya arama
  const [leftBackSearchTerm, setLeftBackSearchTerm] = useState<string>(""); // Sol arka medya arama
  const [isRightFrontModalOpen, setIsRightFrontModalOpen] =
    useState<boolean>(false);
  const [isRightBackModalOpen, setIsRightBackModalOpen] =
    useState<boolean>(false);
  const [isLeftFrontModalOpen, setIsLeftFrontModalOpen] =
    useState<boolean>(false);
  const [isLeftBackModalOpen, setIsLeftBackModalOpen] =
    useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const apiUrl = import.meta.env.VITE_BE_URL;

  useEffect(() => {
    const fetchMediaList = async () => {
      try {
        const response = await axios.get(`${apiUrl}/media/list`);
        const mediaNames = response.data.map((media: any) => ({
          key: media.Key,
          launchName: media.launchName || "", // Lansman adı
        }));
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
        setIsRightFrontModalOpen(false);
        setIsRightBackModalOpen(false);
        setIsLeftFrontModalOpen(false);
        setIsLeftBackModalOpen(false);
      }
    };

    if (
      isRightFrontModalOpen ||
      isRightBackModalOpen ||
      isLeftFrontModalOpen ||
      isLeftBackModalOpen
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isRightFrontModalOpen,
    isRightBackModalOpen,
    isLeftFrontModalOpen,
    isLeftBackModalOpen,
  ]);

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

  const handleRightFrontSelect = (selectedMedia: string) => {
    onRightFrontMediaChange({
      target: { value: selectedMedia },
    } as ChangeEvent<HTMLSelectElement>);
    setIsRightFrontModalOpen(false);
  };

  const handleRightBackSelect = (selectedMedia: string) => {
    onRightBackMediaChange({
      target: { value: selectedMedia },
    } as ChangeEvent<HTMLSelectElement>);
    setIsRightBackModalOpen(false);
  };

  const handleLeftFrontSelect = (selectedMedia: string) => {
    onLeftFrontMediaChange({
      target: { value: selectedMedia },
    } as ChangeEvent<HTMLSelectElement>);
    setIsLeftFrontModalOpen(false);
  };

  const handleLeftBackSelect = (selectedMedia: string) => {
    onLeftBackMediaChange({
      target: { value: selectedMedia },
    } as ChangeEvent<HTMLSelectElement>);
    setIsLeftBackModalOpen(false);
  };

  // Arama fonksiyonları
  const filteredRightFrontMediaList = mediaList.filter(
    (mediaItem) =>
      mediaItem.key
        .toLowerCase()
        .includes(rightFrontSearchTerm.toLowerCase()) ||
      mediaItem.launchName
        .toLowerCase()
        .includes(rightFrontSearchTerm.toLowerCase())
  );

  const filteredRightBackMediaList = mediaList.filter(
    (mediaItem) =>
      mediaItem.key.toLowerCase().includes(rightBackSearchTerm.toLowerCase()) ||
      mediaItem.launchName
        .toLowerCase()
        .includes(rightBackSearchTerm.toLowerCase())
  );

  const filteredLeftFrontMediaList = mediaList.filter(
    (mediaItem) =>
      mediaItem.key.toLowerCase().includes(leftFrontSearchTerm.toLowerCase()) ||
      mediaItem.launchName
        .toLowerCase()
        .includes(leftFrontSearchTerm.toLowerCase())
  );

  const filteredLeftBackMediaList = mediaList.filter(
    (mediaItem) =>
      mediaItem.key.toLowerCase().includes(leftBackSearchTerm.toLowerCase()) ||
      mediaItem.launchName
        .toLowerCase()
        .includes(leftBackSearchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      {/* Right Card */}
      <div className="flex flex-col p-4 bg-[#DFE2E6] border border-gray-300 rounded-lg shadow-sm w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Right Card</h3>

        {/* Right Front Media */}
        <div className="flex flex-col mb-4">
          <label className="block text-sm text-[#2B3674] mb-1">
            Ön Medya Alanı
          </label>
          <input
            type="text"
            readOnly
            value={rightFrontMedia || "  Seç"}
            onClick={() => setIsRightFrontModalOpen(true)}
            className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#667085] text-[16px] leading-[24px]"
            style={{ width: "423px", height: "50px" }}
          />
          <p style={{ color: "#667085", fontSize: "12px" }}>
            <span style={{ color: "red" }}>*</span>440x710(px)
          </p>
        </div>

        {/* Right Back Media */}
        <div className="flex flex-col mb-4">
          <label className="block text-sm text-[#2B3674] mb-1">
            Arka Medya Alanı
          </label>
          <input
            type="text"
            readOnly
            value={rightBackMedia || "  Seç"}
            onClick={() => setIsRightBackModalOpen(true)}
            className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#667085] text-[16px] leading-[24px]"
            style={{ width: "423px", height: "50px" }}
          />
          <p style={{ color: "#667085", fontSize: "12px" }}>
            <span style={{ color: "red" }}>*</span>440x710(px)
          </p>
        </div>
      </div>

      {/* Left Card */}
      <div className="flex flex-col p-4 bg-[#DFE2E6] border border-gray-300 rounded-lg shadow-sm w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Left Card</h3>

        {/* Left Front Media */}
        <div className="flex flex-col mb-4">
          <label className="block text-sm text-[#2B3674] mb-1">
            Ön Medya Alanı
          </label>
          <input
            type="text"
            readOnly
            value={leftFrontMedia || "  Seç"}
            onClick={() => setIsLeftFrontModalOpen(true)}
            className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#667085] text-[16px] leading-[24px]"
            style={{ width: "423px", height: "50px" }}
          />
          <p style={{ color: "#667085", fontSize: "12px" }}>
            <span style={{ color: "red" }}>*</span>440x710(px)
          </p>
        </div>

        {/* Left Back Media */}
        <div className="flex flex-col mb-4">
          <label className="block text-sm text-[#2B3674] mb-1">
            Arka Medya Alanı
          </label>
          <input
            type="text"
            readOnly
            value={leftBackMedia || "  Seç"}
            onClick={() => setIsLeftBackModalOpen(true)}
            className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#667085] text-[16px] leading-[24px]"
            style={{ width: "423px", height: "50px" }}
          />
          <p style={{ color: "#667085", fontSize: "12px" }}>
            <span style={{ color: "red" }}>*</span>440x710(px)
          </p>
        </div>
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

      {/* Section'un %50 küçültülmüş önizleme alanı */}
      {isPreviewOpen && (
        <div
          style={{
            transform: "scale(0.5)", // %50 küçültme
            transformOrigin: "top left", // Sol üstten küçült
            margin: "0 auto", 
            width: "100%", 
          }}
          className="p-2 rounded-lg mt-6"
        >
          <TwinFlipCardSection
            rightFrontMedia={rightFrontMedia}
            rightBackMedia={rightBackMedia}
            leftFrontMedia={leftFrontMedia}
            leftBackMedia={leftBackMedia}
          />
        </div>
      )}

      {/* Right Front Media Modal */}
      {isRightFrontModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-4 w-3/4 max-h-full overflow-y-auto relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-[#970928] bg-white rounded-full p-2 hover:bg-gray-100 transition transform duration-150 ease-in-out"
              onClick={() => setIsRightFrontModalOpen(false)}
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-4">Sağ Ön Medya Seç</h3>
            <input
              type="text"
              placeholder="Medya adına veya lansman adına göre arama"
              value={rightFrontSearchTerm}
              onChange={(e) => setRightFrontSearchTerm(e.target.value)}
              className="border border-gray-500 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-gray-500 text-sm font-medium text-gray-700 mb-4"
              style={{ width: "300px", height: "40px" }}
            />
            <div className="grid grid-cols-4 gap-4">
              {filteredRightFrontMediaList.map((mediaItem, index) => (
                <div
                  key={index}
                  onClick={() => handleRightFrontSelect(mediaItem.key)}
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
              onClick={() => setIsRightFrontModalOpen(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Right Back Media Modal */}
      {isRightBackModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-4 w-3/4 max-h-full overflow-y-auto relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-[#970928] bg-white rounded-full p-2 hover:bg-gray-100 transition transform duration-150 ease-in-out"
              onClick={() => setIsRightBackModalOpen(false)}
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-4">Sağ Arka Medya Seç</h3>
            <input
              type="text"
              placeholder="Medya adına veya lansman adına göre arama"
              value={rightBackSearchTerm}
              onChange={(e) => setRightBackSearchTerm(e.target.value)}
              className="border border-gray-500 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-gray-500 text-sm font-medium text-gray-700 mb-4"
              style={{ width: "300px", height: "40px" }}
            />
            <div className="grid grid-cols-4 gap-4">
              {filteredRightBackMediaList.map((mediaItem, index) => (
                <div
                  key={index}
                  onClick={() => handleRightBackSelect(mediaItem.key)}
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
              onClick={() => setIsRightBackModalOpen(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Left Front Media Modal */}
      {isLeftFrontModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-4 w-3/4 max-h-full overflow-y-auto relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-[#970928] bg-white rounded-full p-2 hover:bg-gray-100 transition transform duration-150 ease-in-out"
              onClick={() => setIsLeftFrontModalOpen(false)}
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-4">Sol Ön Medya Seç</h3>
            <input
              type="text"
              placeholder="Medya adına veya lansman adına göre arama"
              value={leftFrontSearchTerm}
              onChange={(e) => setLeftFrontSearchTerm(e.target.value)}
              className="border border-gray-500 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-gray-500 text-sm font-medium text-gray-700 mb-4"
              style={{ width: "300px", height: "40px" }}
            />
            <div className="grid grid-cols-4 gap-4">
              {filteredLeftFrontMediaList.map((mediaItem, index) => (
                <div
                  key={index}
                  onClick={() => handleLeftFrontSelect(mediaItem.key)}
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
              onClick={() => setIsLeftFrontModalOpen(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Left Back Media Modal */}
      {isLeftBackModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-4 w-3/4 max-h-full overflow-y-auto relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-[#970928] bg-white rounded-full p-2 hover:bg-gray-100 transition transform duration-150 ease-in-out"
              onClick={() => setIsLeftBackModalOpen(false)}
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-4">Sol Arka Medya Seç</h3>
            <input
              type="text"
              placeholder="Medya adına veya lansman adına göre arama"
              value={leftBackSearchTerm}
              onChange={(e) => setLeftBackSearchTerm(e.target.value)}
              className="border border-gray-500 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-gray-500 text-sm font-medium text-gray-700 mb-4"
              style={{ width: "300px", height: "40px" }}
            />
            <div className="grid grid-cols-4 gap-4">
              {filteredLeftBackMediaList.map((mediaItem, index) => (
                <div
                  key={index}
                  onClick={() => handleLeftBackSelect(mediaItem.key)}
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
              onClick={() => setIsLeftBackModalOpen(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwinFlipCardForm;
