import React, { useState, useEffect, ChangeEvent, useRef } from "react";
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
    e: ChangeEvent<HTMLTextAreaElement>
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
  const [mediaList, setMediaList] = useState<
    { key: string; launchName: string }[]
  >([]); // Lansman adına göre medya listesi
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [charCounts, setCharCounts] = useState<number[]>(
    accordian.map(() => 0)
  );
  const [errors, setErrors] = useState<string[]>(accordian.map(() => ""));
  const [searchTerm, setSearchTerm] = useState<string>(""); // Arama çubuğu için state
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
    onMediaChange({
      target: { value: selectedMedia },
    } as ChangeEvent<HTMLSelectElement>);
    setIsModalOpen(false);
  };

  const handleSubTitleChange = (
    index: number,
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newText = e.target.value;
    const updatedCharCounts = [...charCounts];
    const updatedErrors = [...errors];

    if (newText.length <= 200) {
      updatedErrors[index] = "";
      updatedCharCounts[index] = newText.length;
      onAccordianSubTitleChange(index, e);
    } else {
      updatedErrors[index] = "Karakter sınırını aştınız!";
      updatedCharCounts[index] = 200;
      const truncatedEvent = {
        ...e,
        target: { ...e.target, value: newText.slice(0, 200) },
      };
      onAccordianSubTitleChange(
        index,
        truncatedEvent as ChangeEvent<HTMLTextAreaElement>
      );
    }

    setCharCounts(updatedCharCounts);
    setErrors(updatedErrors);
  };

  // Lansman adına göre medya filtreleme
  const filteredMediaList = mediaList.filter(
    (mediaItem) =>
      mediaItem.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mediaItem.launchName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            value={media || "Media Seç"}
            onClick={() => setIsModalOpen(true)}
            className="block text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
            style={{
              width: "396px",
              height: "50px",
              padding: "10px 16px",
              borderRadius: "8px",
              outline: "none",
            }}
          />
          <p style={{ color: "#667085", fontSize: "12px", marginTop: "4px", marginLeft: "2px" }}>
            <span style={{ color: "red" }}>*</span>530x790(px)
          </p>
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
                    {/* Lansman adı gösteriliyor */}
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
              <label className="block text-sm text-[#1F2937] mb-1">Yazı</label>
              <textarea
                value={section.subTitle.slice(0, 200)}
                onChange={(e) => handleSubTitleChange(index, e)}
                placeholder="Yazı Alanı"
                className="block w-full text-gray-900 bg-white border border-gray-300 sm:text-sm p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                rows={3}
                style={{ resize: "none" }}
              />
              {errors[index] && (
                <p className="text-red-500 text-xs mt-1">{errors[index]}</p>
              )}
              <div className="text-right text-sm text-gray-500 mt-1">
                {charCounts[index]}/200
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center">
          <button
            onClick={onAddAccordianItem}
            className="bg-[#FCFCFC] text-[#353642] border border-[#D6D6D6] rounded-lg shadow-xs focus:outline-none"
            style={{
              width: "184px",
              height: "40px",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #D6D6D6",
              boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
              fontFamily: "Poppins",
              fontSize: "14px",
              color: "#101828",
              textAlign: "left",
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
