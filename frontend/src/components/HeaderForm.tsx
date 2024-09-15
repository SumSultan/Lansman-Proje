import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import axios from "axios";
import HeaderSection from "../sections/header-section"; // Eğer HeaderSection aynı klasörde ise

interface HeaderFormProps {
  title: string;
  logoMedia: string;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLogoMediaChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: () => void;
}

const HeaderForm: React.FC<HeaderFormProps> = ({
  title,
  logoMedia,
  onTitleChange,
  onLogoMediaChange,
}) => {
  const [mediaList, setMediaList] = useState<
    { key: string; launchName: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false); // Önizleme kontrol durumu
  const modalRef = useRef<HTMLDivElement>(null);

  const apiUrl = import.meta.env.VITE_BE_URL;

  useEffect(() => {
    const fetchMediaList = async () => {
      try {
        const response = await axios.get(`${apiUrl}/media/list`);
        const mediaNames = response.data.map((media: any) => ({
          key: media.Key,
          launchName: media.launchName,
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
    onLogoMediaChange({
      target: { value: selectedMedia },
    } as ChangeEvent<HTMLSelectElement>);
    setIsModalOpen(false);
  };

  const filteredMediaList = mediaList.filter(
    (mediaItem) =>
      mediaItem.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mediaItem.launchName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col justify-between space-y-6 p-4">
      <div className="flex flex-col space-y-4" style={{ paddingLeft: "3%" }}>
        <div>
          <label className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1">
            Başlık
          </label>
          <input
            type="text"
            value={title}
            onChange={onTitleChange}
            placeholder="  Input"
            className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#101828] placeholder:text-[#667085] text-[16px] leading-[24px]"
            style={{ width: "423px", height: "50px" }}
          />
        </div>

        <div>
          <label className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1">
            Logo Medya
          </label>
          <input
            type="text"
            readOnly
            value={logoMedia || "  Medya Seç"}
            onClick={() => setIsModalOpen(true)}
            className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#667085] text-[16px] leading-[24px]"
            style={{ width: "423px", height: "50px" }}
          />
          <p style={{ color: "#667085", fontSize: "12px", marginTop: "4px" }}>
            <span style={{ color: "red" }}>*</span>200x200(px)
          </p>
        </div>

        <div className="flex space-x-4">
          {/* Yeni Önizleme Butonu */}
          <button
            type="button"
            className="bg-[#970928] text-white py-2 px-4 rounded-md hover:bg-[#7a0620] transition transform duration-150 ease-in-out"
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
          >
            Önizleme
          </button>
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
                    onClick={() => handleMediaSelect(mediaItem.key)}
                    className="cursor-pointer"
                  >
                    {renderFilePreview(mediaItem.key)}
                    <p className="text-center text-sm truncate">
                      {mediaItem.key}
                    </p>
                    <p className="text-center text-sm truncate">
                      {mediaItem.launchName}
                    </p>{" "}
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

      {/* Önizleme Kartı */}
      {isPreviewOpen && (
        <div
          className="bg-gray-100 p-4 rounded-lg shadow-lg flex justify-center items-center"
          style={{
            width: "750px", // Arka plan genişliği
            height: "100px", // Arka plan yüksekliğini 100px yaptım
            marginLeft: "17%",
          }}
        >
          <div
            style={{
              width: "1500px", // Genişlik
              height: "100px", // İçerik yüksekliği
              transform: "scale(0.5)", // %50 küçült
            }}
          >
            <HeaderSection title={title} logoMedia={logoMedia} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderForm;
