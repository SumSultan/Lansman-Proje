import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import axios from "axios";
import LargeTopTitleHeroCardSection from "../sections/largeTopTitleHeroCard-section";

interface LargeTopTitleHeroCardFormProps {
  title: string;
  subTitle: string;
  buttonText: string;
  buttonUrl: string;
  media: string;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onButtonTextChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onButtonUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMediaChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onFormSubmit: (data: any) => void;
}

const LargeTopTitleHeroCardForm: React.FC<LargeTopTitleHeroCardFormProps> = ({
  title,
  subTitle,
  buttonText,
  buttonUrl,
  media,
  onTitleChange,
  onSubTitleChange,
  onButtonTextChange,
  onButtonUrlChange,
  onMediaChange,
}) => {
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Arama çubuğu için state
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false); // Önizleme state'i
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
    onMediaChange({
      target: { value: selectedMedia },
    } as ChangeEvent<HTMLSelectElement>);
    setIsModalOpen(false);
  };

  // Medya dosyalarını arama terimine göre filtreleme
  const filteredMediaList = mediaList.filter((mediaItem) =>
    mediaItem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-6 p-4">
      <div className="flex flex-col">
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{ marginLeft: "3%", height: "16px", lineHeight: "15.62px" }}
        >
          Başlık
        </label>
        <input
          type="text"
          value={title}
          onChange={onTitleChange}
          placeholder="Başlık Alanı"
          className="block text-gray-900 bg-white border border-gray-300 sm:text-sm"
          style={{
            width: "423px",
            height: "50px",
            borderRadius: "8px",
            padding: "10px 16px",
            marginLeft: "3%", // Input alanını da soldan %3 kaydırıyoruz
          }}
        />
      </div>

      <div className="flex flex-col">
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{ marginLeft: "3%", height: "16px", lineHeight: "15.62px" }}
        >
          Alt Başlık
        </label>
        <input
          type="text"
          value={subTitle}
          onChange={onSubTitleChange}
          placeholder="Alt Başlık Alanı"
          className="block text-gray-900 bg-white border border-gray-300 sm:text-sm"
          style={{
            width: "423px",
            height: "50px",
            borderRadius: "8px",
            padding: "10px 16px",
            marginLeft: "3%", // Input alanını da soldan %3 kaydırıyoruz
          }}
        />
      </div>

      <div className="flex flex-col">
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{ marginLeft: "3%", height: "16px", lineHeight: "15.62px" }}
        >
          Buton
        </label>
        <input
          type="text"
          value={buttonText}
          onChange={onButtonTextChange}
          placeholder="Buton Adı"
          className="block text-gray-900 bg-white border border-gray-300 sm:text-sm"
          style={{
            width: "423px",
            height: "50px",
            borderRadius: "8px",
            padding: "10px 16px",
            marginLeft: "3%", // Input alanını da soldan %3 kaydırıyoruz
          }}
        />
      </div>

      <div className="flex flex-col">
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{ marginLeft: "3%", height: "16px", lineHeight: "15.62px" }}
        >
          Buton Url
        </label>
        <input
          type="text"
          value={buttonUrl}
          onChange={onButtonUrlChange}
          placeholder="Buton Url Alanı"
          className="block text-gray-900 bg-white border border-gray-300 sm:text-sm"
          style={{
            width: "423px",
            height: "50px",
            borderRadius: "8px",
            padding: "10px 16px",
            marginLeft: "3%", // Input alanını da soldan %3 kaydırıyoruz
          }}
        />
      </div>

      {/* Medya Seçimi */}
      <div className="flex flex-col">
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{ marginLeft: "3%", height: "16px", lineHeight: "15.62px" }}
        >
          Medya
        </label>
        <input
          type="text"
          readOnly
          value={media || "  Medya Seç"}
          onClick={() => setIsModalOpen(true)}
          className="block border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#667085] text-[16px] leading-[24px]"
          style={{
            width: "423px",
            height: "50px",
            marginLeft: "3%", // Input alanını da soldan %3 kaydırıyoruz
          }}
        />
        <p
          style={{
            color: "#667085",
            fontSize: "12px",
            marginTop: "4px",
            marginLeft: "3%",
          }}
        >
          <span style={{ color: "red" }}>*</span>1050x650(px)
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

      {/* Section'un %50 küçültülmüş önizleme alanı */}
      {isPreviewOpen && (
        <div
          style={{
            transform: "scale(0.5)", // %50 küçültme
            transformOrigin: "top left", // Sol üstten küçült
            margin: "0 auto",
            width: "100%",
            height: "320px",
            marginLeft: "25%",
          }}
          className="p-2 rounded-lg mt-6"
        >
          <LargeTopTitleHeroCardSection
            title={title}
            subTitle={subTitle}
            buttonText={buttonText}
            buttonUrl={buttonUrl}
            media={media}
          />
        </div>
      )}

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
              onClick={() => setIsModalOpen(false)}
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-4">Medya Seç</h3>

            {/* Arama Çubuğu Eklendi */}
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
  );
};

export default LargeTopTitleHeroCardForm;
