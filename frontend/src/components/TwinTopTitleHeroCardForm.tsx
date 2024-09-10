import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import axios from "axios";

interface TwinTopTitleHeroCardFormProps {
  rightMedia: string;
  rightTitle: string;
  rightSubTitle: string;
  rightButtonText: string;
  rightButtonUrl: string;
  leftMedia: string;
  leftTitle: string;
  leftSubTitle: string;
  leftButtonText: string;
  leftButtonUrl: string;
  onRightMediaChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onRightTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRightSubTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRightButtonTextChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRightButtonUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLeftMediaChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onLeftTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLeftSubTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLeftButtonTextChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLeftButtonUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TwinTopTitleHeroCardForm: React.FC<TwinTopTitleHeroCardFormProps> = ({
  rightMedia,
  rightTitle,
  rightSubTitle,
  rightButtonText,
  rightButtonUrl,
  leftMedia,
  leftTitle,
  leftSubTitle,
  leftButtonText,
  leftButtonUrl,
  onRightMediaChange,
  onRightTitleChange,
  onRightSubTitleChange,
  onRightButtonTextChange,
  onRightButtonUrlChange,
  onLeftMediaChange,
  onLeftTitleChange,
  onLeftSubTitleChange,
  onLeftButtonTextChange,
  onLeftButtonUrlChange,
}) => {
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [isRightMediaModalOpen, setIsRightMediaModalOpen] =
    useState<boolean>(false);
  const [isLeftMediaModalOpen, setIsLeftMediaModalOpen] =
    useState<boolean>(false);
  const rightMediaModalRef = useRef<HTMLDivElement>(null);
  const leftMediaModalRef = useRef<HTMLDivElement>(null);

  // Medya listesini getirme
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

  // Modal dışına tıklanınca kapatma işlevi
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        rightMediaModalRef.current &&
        !rightMediaModalRef.current.contains(event.target as Node)
      ) {
        setIsRightMediaModalOpen(false);
      }
      if (
        leftMediaModalRef.current &&
        !leftMediaModalRef.current.contains(event.target as Node)
      ) {
        setIsLeftMediaModalOpen(false);
      }
    };

    if (isRightMediaModalOpen || isLeftMediaModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isRightMediaModalOpen, isLeftMediaModalOpen]);

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

  // Right Media Seçimi
  const handleRightMediaSelect = (selectedMedia: string) => {
    onRightMediaChange({
      target: { value: selectedMedia },
    } as ChangeEvent<HTMLSelectElement>);
    setIsRightMediaModalOpen(false); // Modalı kapat
  };

  // Left Media Seçimi
  const handleLeftMediaSelect = (selectedMedia: string) => {
    onLeftMediaChange({
      target: { value: selectedMedia },
    } as ChangeEvent<HTMLSelectElement>);
    setIsLeftMediaModalOpen(false); // Modalı kapat
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="p-4 border rounded-lg"
        style={{
          width: "882px",
          maxHeight: "600px",
          overflowY: "auto",
          backgroundColor: "rgba(16, 24, 40, 0.05)",
          borderRadius: "8px",
        }}
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Right Card */}
          <div className="p-4 bg-[#DFE2E6] border border-[#D1D5DB] rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Right Card</h3>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Medya Alanı
              </label>
              <input
                type="text"
                value={rightMedia || " Media Seç"}
                readOnly
                onClick={() => setIsRightMediaModalOpen(true)}
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-1">Başlık</label>
              <input
                type="text"
                value={rightTitle}
                onChange={onRightTitleChange}
                placeholder="Input"
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-1">
                Alt Başlık
              </label>
              <input
                type="text"
                value={rightSubTitle}
                onChange={onRightSubTitleChange}
                placeholder="Input"
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-1">
                Buton Adı
              </label>
              <input
                type="text"
                value={rightButtonText}
                onChange={onRightButtonTextChange}
                placeholder="Input"
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-1">
                Buton Url
              </label>
              <input
                type="text"
                value={rightButtonUrl}
                onChange={onRightButtonUrlChange}
                placeholder="Input"
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
          </div>

          {/* Left Card */}
          <div className="p-4 bg-[#DFE2E6] border border-[#D1D5DB] rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Left Card</h3>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Medya Alanı
              </label>
              <input
                type="text"
                value={leftMedia || " Media Seç"}
                readOnly
                onClick={() => setIsLeftMediaModalOpen(true)}
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-1">Başlık</label>
              <input
                type="text"
                value={leftTitle}
                onChange={onLeftTitleChange}
                placeholder="Input"
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-1">
                Alt Başlık
              </label>
              <input
                type="text"
                value={leftSubTitle}
                onChange={onLeftSubTitleChange}
                placeholder="Input"
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-1">
                Buton Adı
              </label>
              <input
                type="text"
                value={leftButtonText}
                onChange={onLeftButtonTextChange}
                placeholder="Input"
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-1">
                Buton Url
              </label>
              <input
                type="text"
                value={leftButtonUrl}
                onChange={onLeftButtonUrlChange}
                placeholder="Input"
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Media Modal */}
      {isRightMediaModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            ref={rightMediaModalRef}
            className="bg-white rounded-lg p-4 w-3/4 max-h-full overflow-y-auto relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-red-600 bg-white rounded-full p-2 hover:bg-gray-100 transition duration-150 ease-in-out"
              onClick={() => setIsRightMediaModalOpen(false)}
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-4">Right Medya Seç</h3>
            <div className="grid grid-cols-4 gap-4">
              {mediaList.map((mediaItem, index) => (
                <div
                  key={index}
                  onClick={() => handleRightMediaSelect(mediaItem)}
                  className="cursor-pointer"
                >
                  {renderFilePreview(mediaItem)}
                  <p className="text-center text-sm truncate">{mediaItem}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Left Media Modal */}
      {isLeftMediaModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            ref={leftMediaModalRef}
            className="bg-white rounded-lg p-4 w-3/4 max-h-full overflow-y-auto relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-red-600 bg-white rounded-full p-2 hover:bg-gray-100 transition duration-150 ease-in-out"
              onClick={() => setIsLeftMediaModalOpen(false)}
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-4">Left Medya Seç</h3>
            <div className="grid grid-cols-4 gap-4">
              {mediaList.map((mediaItem, index) => (
                <div
                  key={index}
                  onClick={() => handleLeftMediaSelect(mediaItem)}
                  className="cursor-pointer"
                >
                  {renderFilePreview(mediaItem)}
                  <p className="text-center text-sm truncate">{mediaItem}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwinTopTitleHeroCardForm;
