import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import MediaFormModal from "./MediaFormModal";
import NavBar from "../components/NavBar";

interface MediaItem {
  Key: string;
  LastModified: string;
  [key: string]: any;
}

const GalleryList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_BE_URL;

  const fetchMedia = async () => {
    try {
      const response = await axios.get(`${apiUrl}/media/list`);
      console.log("Gelen veri:", response.data);
      setMediaList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Medya listesi alınamadı:", error);
      setErrorMessage("Medya listesi alınamadı."); // Hata mesajını ayarla
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleAddNewClick = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async (key: string) => {
    try {
      await axios.delete(`${apiUrl}/media`, {
        data: { key },
      });
      setMediaList(mediaList.filter((media) => media.Key !== key));
    } catch (error) {
      console.error("Dosya silinirken hata oluştu:", error);
      setErrorMessage("Dosya silinirken bir hata oluştu."); // Hata mesajını ayarla
    }
  };

  const handleMediaUploaded = () => {
    fetchMedia(); // Medya yüklendiğinde medya listesini yenile
  };

  return (
    <div className="flex h-full">
      <NavBar />
      <div className="flex-1 p-8">
        <div className="bg-gray-800 text-white text-xs p-6 mx-8 my-5 rounded-lg">
          <p>DAMISE ADMIN PANEL</p>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="font-poppins font-medium text-lg">Galeri</h2>
          <button
            className="bg-white text-[#091E42] border border-[#D6D6D6] shadow-md flex items-center justify-center"
            onClick={handleAddNewClick}
            style={{
              width: "92px",
              height: "40px",
              borderRadius: "8px",
              padding: "10px 16px",
              boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "20px",
            }}
          >
            <span>Yeni</span>&nbsp;<span>Ekle</span>
          </button>
        </div>

        {errorMessage && (
          <div className="text-red-500 mt-4">
            <p>{errorMessage}</p>
          </div>
        )}

        <table className="w-full mt-6 border-collapse">
          <thead>
            <tr className="text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Medya Adı</th>
              <th className="p-2">Medya Tipi</th>
              <th className="p-2">Oluşturma Tarihi</th>
              <th className="p-2 text-center">Sil</th>
            </tr>
          </thead>
          <tbody>
            {mediaList.map((media, index) => (
              <tr key={media.Key} className="border-t">
                <td className="p-2">{`DL${index + 1}`}</td>
                <td className="p-2">{media.Key.split(".")[0]}</td>
                <td className="p-2">
                  {media.Key.split(".").pop()?.toUpperCase()}
                </td>
                <td className="p-2">
                  {new Date(media.LastModified).toLocaleDateString()}
                </td>
                <td className="p-2 text-center">
                  <button
                    className="text-red-500 flex items-center justify-center"
                    onClick={() => handleDelete(media.Key)}
                  >
                    <FaTrash className="mr-1" /> Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalVisible && (
          <MediaFormModal
            onClose={closeModal}
            onMediaUploaded={handleMediaUploaded}
          />
        )}
      </div>
    </div>
  );
};

export default GalleryList;
