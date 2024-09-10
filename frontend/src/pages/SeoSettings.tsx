import React, { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import useSeoSettingsStore from "../zustands/useSeoSettingsStore"; // Zustand store'u içe aktar
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar"; // NavBar bileşenini içe aktar

const SeoSettings = () => {
  const { launchId } = useParams();
  const { seoSettings, setSeoSettings, saveSeoSettings, fetchSeoSettings } =
    useSeoSettingsStore();

  const [isIndexActive, setIsIndexActive] = useState(seoSettings.indexStatus);
  const [isFollowActive, setIsFollowActive] = useState(
    seoSettings.followStatus
  );

  useEffect(() => {
    if (launchId) {
      fetchSeoSettings(launchId);
    }
  }, [fetchSeoSettings, launchId]);

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

  const handleSave = async () => {
    try {
      await saveSeoSettings(); // Verileri kaydetme işlemi başarılı olursa
      alert("Veriler başarıyla kaydedildi!"); // Başarı mesajı göster
    } catch (error) {}
  };

  return (
    <div className="flex h-full">
      <NavBar /> {/* NavBar bileşenini sol tarafa yerleştirin */}
      <div className="flex-1 p-8">
        {/* Başlık bölümü */}
        <div
          className="bg-gray-800 text-white text-xs p-6 mx-8 my-4 rounded-lg"
          style={{ width: "950px", marginTop: "10px" }}
        >
          {" "}
          {/* Genişliği artır ve yukarı al */}
          <p>DAMISE ADMIN PANEL</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2
            className="font-bold text-[#091E42]"
            style={{
              fontSize: "24px", // Yazı Boyutu
              lineHeight: "32px", // Satır Yüksekliği
            }}
          >
            SEO Ayarları
          </h2>
          <div className="grid grid-cols-2 gap-[28px] mt-4">
            {/* Başlık */}
            <div>
              <label
                className="block text-[#243757] font-poppins"
                style={{
                  fontSize: "14px", // Yazı Boyutu
                  lineHeight: "20px", // Satır Yüksekliği
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
                  width: "413px", // Genişlik
                  height: "50px", // Yükseklik
                }}
              />
            </div>
            {/* Lansman URL */}
            <div>
              <label
                className="block text-[#243757] font-poppins"
                style={{
                  fontSize: "14px", // Yazı Boyutu
                  lineHeight: "20px", // Satır Yüksekliği
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
                  width: "413px", // Genişlik
                  height: "50px", // Yükseklik
                }}
              />
            </div>
            {/* Anahtar Kelime */}
            <div>
              <label
                className="block text-[#243757] font-poppins"
                style={{
                  fontSize: "14px", // Yazı Boyutu
                  lineHeight: "20px", // Satır Yüksekliği
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
                  width: "413px", // Genişlik
                  height: "50px", // Yükseklik
                }}
              />
            </div>
            {/* Açıklama */}
            <div>
              <label
                className="block text-[#243757] font-poppins"
                style={{
                  fontSize: "14px", // Yazı Boyutu
                  lineHeight: "20px", // Satır Yüksekliği
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
                  width: "413px", // Genişlik
                  height: "50px", // Yükseklik
                }}
              />
            </div>
            {/* Sayfa Sosyal Paylaşım Görseli */}
            <div className="col-span-2">
              <label
                className="block text-[#243757] font-poppins"
                style={{
                  fontSize: "14px", // Yazı Boyutu
                  lineHeight: "20px", // Satır Yüksekliği
                }}
              >
                Sayfa Sosyal Paylaşım Görseli
              </label>
              <div className="flex items-center mt-1">
                <input
                  type="text"
                  name="socialImage"
                  value={seoSettings.socialImage}
                  placeholder="Link or upload"
                  className="p-2 border border-gray-300 rounded-l"
                  style={{
                    width: "352px", // Genişlik
                    height: "50px", // Yükseklik
                  }}
                  readOnly
                />
                <label
                  className="flex items-center justify-center p-2 border border-gray-300 rounded-r bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  style={{ width: "61px", height: "50px" }} // Genişlik ve yükseklik
                >
                  <FaUpload size={16} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setSeoSettings({
                        socialImage: e.target.files
                          ? e.target.files[0].name
                          : "",
                      })
                    }
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                *1200x630 boyutlarında bir görsel ekleyiniz.
              </p>
            </div>
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
                onClick={handleSave} // Kaydetme işlemini yönet
                style={{
                  width: "166px", // Genişlik
                  height: "40px", // Yükseklik
                  borderRadius: "8px", // Kenar Yuvarlama
                  border: "1px solid #970928", // Sınır Rengi
                  padding: "10px 16px", // İç Boşluk
                  gap: "8px", // İçerik Arasındaki Boşluk
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
