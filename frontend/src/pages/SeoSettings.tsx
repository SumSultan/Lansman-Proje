import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa"; // FaArrowLeft simgesini içe aktar
import useSeoSettingsStore from "../zustands/useSeoSettingsStore";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";

const SeoSettings = () => {
  const { launchId } = useParams();
  const navigate = useNavigate();
  const { seoSettings, setSeoSettings, saveSeoSettings, fetchSeoSettings } =
    useSeoSettingsStore();

  const [isIndexActive, setIsIndexActive] = useState(seoSettings.indexStatus);
  const [isFollowActive, setIsFollowActive] = useState(
    seoSettings.followStatus
  );
  const [mediaList, setMediaList] = useState<
    { key: string; launchName: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Arama terimi için state
  const [formError, setFormError] = useState<string>(""); // Form hatalarını göstermek için state
  const modalRef = useRef<HTMLDivElement>(null);

  const apiUrl = import.meta.env.VITE_BE_URL;

  useEffect(() => {
    if (launchId) {
      fetchSeoSettings(launchId);
    }
  }, [fetchSeoSettings, launchId]);

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

  const toggleIndex = () => {
    setIsIndexActive(!isIndexActive);
    setSeoSettings({ indexStatus: !isIndexActive });
  };

  const toggleFollow = () => {
    setIsFollowActive(!isFollowActive);
    setSeoSettings({ followStatus: !isFollowActive });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSeoSettings({ [name]: value });
  };

  const handleMediaSelect = (selectedMedia: string) => {
    setSeoSettings({ socialImage: selectedMedia });
    setIsModalOpen(false);
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

  const filteredMediaList = mediaList.filter(
    (mediaItem) =>
      mediaItem.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mediaItem.launchName?.toLowerCase().includes(searchTerm.toLowerCase())
  ); // Lansman adına göre arama işlevi

  const handleSave = async () => {
    if (
      !seoSettings.title ||
      !seoSettings.launchUrl ||
      !seoSettings.keywords ||
      !seoSettings.description ||
      !seoSettings.socialImage
    ) {
      setFormError("Lütfen tüm zorunlu alanları doldurunuz.");
      return;
    }

    try {
      await saveSeoSettings();
      setFormError(""); // Başarılı olduğunda hata mesajını sıfırla
      alert("Veriler başarıyla kaydedildi!");
    } catch (error) {
      setFormError("Veriler kaydedilirken bir hata oluştu.");
    }
  };

  const navigateToDesignSettings = () => {
    if (launchId) {
      navigate(`/design-settings/${launchId}`);
    } else {
      console.error("Launch ID mevcut değil!");
    }
  };

  return (
    <div className="flex h-full">
      <NavBar />
      <div className="flex-1 p-8 relative">
        {" "}
        <button
          className="absolute top-36 right-12 bg-blue-500 text-white shadow-md rounded-full flex items-center p-1 px-3 hover:bg-blue-600 transition duration-200"
          onClick={navigateToDesignSettings}
          style={{
            fontSize: "15px", // Yazı boyutu küçültüldü
            borderRadius: "7px", // Buton köşe yuvarlatma küçültüldü
          }}
        >
          <FaArrowLeft className="mr-1" /> {/* Geri dönüş simgesi daha yakın */}{" "}
          Tasarım Ayarlarına Dön
        </button>
        {/* Başlık bölümü */}
        <div
          className="bg-gray-800 text-white text-xs p-6 mx-8 my-4 rounded-lg"
          style={{ width: "950px", marginTop: "10px" }}
        >
          <p>DAMISE ADMIN PANEL</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2
            className="font-bold text-[#091E42]"
            style={{ fontSize: "24px", lineHeight: "32px" }}
          >
            SEO Ayarları
          </h2>
          {formError && <p className="text-red-500">{formError}</p>}{" "}
          {/* Form hata mesajı */}
          <div className="grid grid-cols-2 gap-[28px] mt-4">
            {/* Başlık */}
            <div>
              <label
                className="block text-[#243757] font-poppins"
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                Başlık
              </label>
              <input
                type="text"
                name="title"
                value={seoSettings.title}
                onChange={handleInputChange}
                placeholder="Input"
                className="mt-1 p-2 border border-gray-300 rounded"
                style={{
                  width: "413px",
                  height: "50px",
                }}
                required
              />
            </div>
            {/* Lansman URL */}
            <div>
              <label
                className="block text-[#243757] font-poppins"
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                Lansman URL
              </label>
              <input
                type="text"
                name="launchUrl"
                value={seoSettings.launchUrl}
                onChange={handleInputChange}
                placeholder="Input"
                className="mt-1 p-2 border border-gray-300 rounded"
                style={{
                  width: "413px",
                  height: "50px",
                }}
                required
              />
            </div>
            {/* Anahtar Kelime */}
            <div>
              <label
                className="block text-[#243757] font-poppins"
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                Anahtar Kelime
              </label>
              <input
                type="text"
                name="keywords"
                value={seoSettings.keywords}
                onChange={handleInputChange}
                placeholder="Input"
                className="mt-1 p-2 border border-gray-300 rounded"
                style={{
                  width: "413px",
                  height: "50px",
                }}
                required
              />
            </div>
            {/* Açıklama */}
            <div>
              <label
                className="block text-[#243757] font-poppins"
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                Açıklama
              </label>
              <input
                type="text"
                name="description"
                value={seoSettings.description}
                onChange={handleInputChange}
                placeholder="Input"
                className="mt-1 p-2 border border-gray-300 rounded"
                style={{
                  width: "413px",
                  height: "50px",
                }}
                required
              />
            </div>
            {/* Sayfa Sosyal Paylaşım Görseli */}
            <div className="col-span-2">
              <label
                className="block text-[#243757] font-poppins"
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                Sayfa Sosyal Paylaşım Görseli
              </label>
              <div className="flex items-center mt-1">
                <input
                  type="text"
                  name="socialImage"
                  value={seoSettings.socialImage}
                  placeholder="Medya Seç"
                  className="p-2 border border-gray-300 rounded"
                  style={{
                    width: "413px",
                    height: "50px",
                  }}
                  readOnly
                  onClick={() => setIsModalOpen(true)}
                  required
                />
              </div>

              <p className="text-xs text-gray-500 mt-1">
                *1200x630 boyutlarında bir görsel ekleyiniz.
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
                    className="absolute top-2 right-2 text-[#970928] bg-white rounded-full p-2 hover:bg-gray-100"
                    onClick={() => setIsModalOpen(false)}
                  >
                    X
                  </button>
                  <h3 className="text-lg font-semibold mb-4">Medya Seç</h3>

                  {/* Arama Alanı */}
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
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="mt-4 w-full bg-[#970928] text-white py-2 px-4 rounded-md hover:bg-[#7a0620]"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
            {/* Switchler */}
            <div className="col-span-2 flex space-x-4 mt-4">
              <label
                className="flex items-center cursor-pointer"
                onClick={toggleIndex}
              >
                <div
                  className={`relative inline-block w-[36px] h-[18px] rounded-full transition duration-200 ${
                    isIndexActive ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`dot absolute w-[14px] h-[14px] bg-white rounded-full top-[2px] transition duration-200 ${
                      isIndexActive ? "translate-x-[18px]" : "translate-x-[2px]"
                    }`}
                  ></div>
                </div>
                <span className="ml-2 text-[#243757] font-poppins font-[400] text-[14px] leading-[20px]">
                  Index Durumu
                </span>
              </label>
              <label
                className="flex items-center cursor-pointer"
                onClick={toggleFollow}
              >
                <div
                  className={`relative inline-block w-[36px] h-[18px] rounded-full transition duration-200 ${
                    isFollowActive ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`dot absolute w-[14px] h-[14px] bg-white rounded-full top-[2px] transition duration-200 ${
                      isFollowActive
                        ? "translate-x-[18px]"
                        : "translate-x-[2px]"
                    }`}
                  ></div>
                </div>
                <span className="ml-2 text-[#243757] font-poppins font-[400] text-[14px] leading-[20px]">
                  Takip Etme
                </span>
              </label>
            </div>
            {/* Kaydet Butonu */}
            <div className="col-span-2 mt-6 flex justify-start">
              <button
                className="bg-[#970928] text-white shadow-md rounded"
                onClick={handleSave}
                style={{
                  width: "166px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "1px solid #970928",
                  padding: "10px 16px",
                  gap: "8px",
                  boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
                }}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoSettings;