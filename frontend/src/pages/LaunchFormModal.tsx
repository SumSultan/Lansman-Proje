import React, { useEffect, useState, useRef } from "react";
import useLaunchStore from "../zustands/useLaunchStore";
import ReactInputMask from "react-input-mask";
import axios from "axios";

const NewLaunchFormModal: React.FC<any> = ({ onClose }) => {
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const apiUrl = import.meta.env.VITE_BE_URL;

  const {
    launchId, // store'dan launchId'yi alıyoruz
    deleteLaunch, // store'dan silme işlemi için deleteLaunch fonksiyonunu alıyoruz
    resetLaunchData, // formu sıfırlamak için
    launchName = "", // Varsayılan değer olarak boş string veriyoruz
    language = "EN", // Dil varsayılan olarak EN olabilir
    groupNumber = "", // Varsayılan değer boş string
    companyName = "",
    companyLogo = "",
    launchDate = "",
    endDate = "",
    sequenceNumber = "",
    isActive = false, // Varsayılan olarak false
    showOnHomepage = false,
    updateLaunchField,
    submitLaunchData,
    updateLaunchData,
  } = useLaunchStore();

  const fetchMediaList = async () => {
    try {
      const response = await axios.get(`${apiUrl}/media/list`);
      const mediaNames = response.data.map((media: any) => media.Key);
      setMediaList(mediaNames);
    } catch (error) {
      console.error("Medya listesi alınamadı:", error);
    }
  };

  useEffect(() => {
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

  const handleMediaSelect = (selectedMedia: string) => {
    updateLaunchField("companyLogo", selectedMedia);
    setIsModalOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateLaunchField(name, value);
  };

  const handleSubmit = () => {
    const { launchId } = useLaunchStore.getState();

    if (launchId) {
      updateLaunchData(launchId);
    } else {
      submitLaunchData();
    }

    fetchMediaList();
    onClose();
  };

  const handleDelete = async () => {
    if (launchId) {
      try {
        await deleteLaunch(launchId); // Silme işlemi
        resetLaunchData(); // Formu sıfırla
        onClose(); // Modal'ı kapat
      } catch (error) {
        console.error("Launch silinirken bir hata oluştu:", error);
      }
    } else {
      console.error("Silmek için geçerli bir lansman ID'si yok.");
    }
  };

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
          <video controls muted className={previewStyle}>
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[530px] max-h-[90vh] overflow-y-auto relative">
        <div className="w-full bg-[#EDEFFF] rounded-t-lg flex justify-between items-center p-6">
          <h2 className="text-2xl font-semibold text-[#091E42]">
            Yeni Lansman Ekle / Düzenle
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            style={{
              width: "20px",
              height: "45px",
              fontSize: "30px",
              color: "#676E7E",
            }}
          >
            &times;
          </button>
        </div>

        <form
          className="p-6 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="space-y-4">
            {[
              { label: "Lansman Adı", name: "launchName", value: launchName },
              {
                label: "Dil",
                name: "language",
                value: language,
                type: "select",
                options: [
                  { value: "EN", label: "EN" },
                  { value: "TR", label: "TR" },
                ],
              },
              {
                label: "Grup Numarası",
                name: "groupNumber",
                value: groupNumber,
              },
              { label: "Firma Adı", name: "companyName", value: companyName },
              {
                label: "Firma Logosu",
                name: "companyLogo",
                value: companyLogo || "media seç",
                type: "text",
                onClick: () => setIsModalOpen(true),
                isReadOnly: true,
              },
              {
                label: "Yayına Başlama Tarihi",
                name: "launchDate",
                value: launchDate,
                type: "text",
                component: ReactInputMask,
                mask: "99.99.9999", // Tarih formatı maskelemesi
                maskChar: "_",
              },
              {
                label: "Yayın Bitiş Tarihi",
                name: "endDate",
                value: endDate,
                type: "text",
                component: ReactInputMask,
                mask: "99.99.9999", // Tarih formatı maskelemesi
                maskChar: "_",
              },
              {
                label: "Sıra Numarası",
                name: "sequenceNumber",
                value: sequenceNumber,
              },
            ].map(
              (
                {
                  label,
                  name,
                  value,
                  type = "text",
                  options,
                  onClick,
                  isReadOnly,
                  component: Component = "input", // input mask için bileşen ayarlaması
                  mask,
                  maskChar,
                },
                index
              ) => (
                <div key={index}>
                  <label className="block text-[#243757] font-poppins font-[400] text-[14px] leading-[20px] mb-1">
                    {label}
                  </label>
                  {type === "select" ? (
                    <select
                      name={name}
                      value={value}
                      onChange={handleChange}
                      className="mt-1 p-2 border border-gray-300 rounded"
                      style={{ width: "413px", height: "50px" }}
                    >
                      <option value="">Medya Seçin</option>
                      {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : Component === ReactInputMask ? (
                    <Component
                      type={type}
                      name={name}
                      value={value || ""}
                      onClick={onClick}
                      onChange={handleChange}
                      mask={mask || "99.99.9999"} // Mask tanımlı değilse varsayılan mask
                      maskChar={maskChar || "_"} // MaskChar tanımlı değilse varsayılan karakter
                      placeholder="gg.aa.yyyy"
                      readOnly={isReadOnly}
                      className="mt-1 p-2 border border-gray-300 rounded"
                      style={{ width: "413px", height: "50px" }}
                    />
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={value || ""}
                      onClick={onClick}
                      onChange={handleChange}
                      readOnly={isReadOnly}
                      className="mt-1 p-2 border border-gray-300 rounded"
                      style={{ width: "413px", height: "50px" }}
                    />
                  )}
                </div>
              )
            )}
          </div>

          <div className="mt-4 flex items-center space-x-6">
            <label
              className="flex items-center cursor-pointer"
              onClick={() => updateLaunchField("isActive", !isActive)}
            >
              <div
                className={`relative inline-block w-[36px] h-[18px] rounded-full transition duration-200 ${
                  isActive ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`dot absolute w-[14px] h-[14px] bg-white rounded-full top-[2px] transition duration-200 ${
                    isActive ? "translate-x-[18px]" : "translate-x-[2px]"
                  }`}
                ></div>
              </div>
              <span className="ml-2 text-[#243757] font-poppins font-[400] text-[14px] leading-[20px]">
                Aktif Et
              </span>
            </label>
            <label
              className="flex items-center cursor-pointer"
              onClick={() =>
                updateLaunchField("showOnHomepage", !showOnHomepage)
              }
            >
              <div
                className={`relative inline-block w-[36px] h-[18px] rounded-full transition duration-200 ${
                  showOnHomepage ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`dot absolute w-[14px] h-[14px] bg-white rounded-full top-[2px] transition duration-200 ${
                    showOnHomepage ? "translate-x-[18px]" : "translate-x-[2px]"
                  }`}
                ></div>
              </div>
              <span className="ml-2 text-[#243757] font-poppins font-[400] text-[14px] leading-[20px]">
                Anasayfada Göster
              </span>
            </label>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="submit"
              className="bg-[#970928] text-white flex items-center justify-center shadow-lg rounded-lg"
              style={{
                width: "166px",
                height: "40px",
                borderRadius: "8px",
                border: "1px solid #970928",
                padding: "10px 16px",
                gap: "8px",
                boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
                fontSize: "16px",
                fontWeight: "500",
                maxWidth: "166px",
              }}
            >
              Kaydet
            </button>
            <button
              type="button"
              className="flex items-center justify-center shadow-lg rounded-lg"
              style={{
                width: "91px",
                height: "40px",
                borderRadius: "8px",
                border: "1px solid #970928",
                padding: "10px 16px",
                gap: "8px",
                boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
                fontSize: "16px",
                fontWeight: "500",
                color: "#970928",
                backgroundColor: "white",
              }}
              onClick={handleDelete}
            >
              Sil
            </button>
          </div>
        </form>
      </div>

      {/* Firma Logosu seçimi için modal */}
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

export default NewLaunchFormModal;
