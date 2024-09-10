import React, { useState } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";

type MediaFormModalProps = {
  onClose: () => void;
  onMediaUploaded: () => void; // Yeni bir callback prop eklendi
};

const apiUrl = import.meta.env.VITE_BE_URL;

const MediaFormModal: React.FC<MediaFormModalProps> = ({
  onClose,
  onMediaUploaded,
}) => {
  const [mediaName, setMediaName] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMediaNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMediaName(event.target.value);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setMediaFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!mediaFile || !mediaName) {
      setErrorMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    const formData = new FormData();
    formData.append("mediaUploadOrLink", mediaFile); // backend'deki 'req.file' bu veriyi alır
    formData.append(
      "mediaName",
      `${mediaName}.${mediaFile.name.split(".").pop()}`
    ); // Medya adını ve uzantısını birleştir

    try {
      const response = await axios.post(`${apiUrl}/media`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        console.log("Medya başarıyla yüklendi:", response.data);
        onMediaUploaded(); // Medya yüklendikten sonra callback'i çağır
        onClose(); // Başarılı işlemden sonra modalı kapat
      } else {
        setErrorMessage("Medya yüklenirken bir sorun oluştu.");
      }
    } catch (error) {
      console.error("POST isteği sırasında bir hata oluştu:", error);
      setErrorMessage("Medya yüklenirken bir hata oluştu.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[779px] relative">
        {/* Başlık ve Kapatma Butonu */}
        <div
          className="bg-[#EDEFFF] rounded-t-lg flex justify-between items-center p-4"
          style={{ width: "779px", height: "51px" }}
        >
          <h2 className="text-[24px] font-[500] leading-[32px] text-[#091E42] font-poppins">
            Yeni Medya Ekle
          </h2>
          <button
            className="text-gray-600 hover:text-gray-800 text-[24px] focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medya (Logo / Görsel / Video)
            </label>
            <div className="flex items-center">
              <label
                className="flex items-center justify-center p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                style={{ width: "423px", height: "50px" }} // Genişlik ve yükseklik
              >
                <FaUpload size={16} />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-[#243757] font-poppins font-[400] text-[14px] leading-[20px] mb-1"
              style={{ width: "100%" }}
            >
              Medya Adı
            </label>
            <input
              type="text"
              value={mediaName}
              onChange={handleMediaNameChange}
              placeholder="lansmanAdi_medyaAdi"
              className="border rounded p-2"
              style={{ width: "413px", height: "50px" }} // Genişlik ve yükseklik
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}

          <button
            type="submit"
            className="bg-[#970928] text-white rounded shadow flex items-center justify-center"
            style={{
              width: "81px",
              height: "40px",
              borderRadius: "8px",
              border: "1px solid #970928",
              padding: "10px 16px",
              gap: "8px",
              boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "20px",
            }}
          >
            Kaydet
          </button>
        </form>
      </div>
    </div>
  );
};

export default MediaFormModal;
