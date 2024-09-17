import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEye } from "react-icons/fa";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMediaItems, setSelectedMediaItems] = useState<string[]>([]);

  const apiUrl = import.meta.env.VITE_BE_URL;

  const fetchMedia = async () => {
    try {
      const response = await axios.get(`${apiUrl}/media/list`);
      setMediaList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Medya listesi alınamadı:", error);
      setErrorMessage("Medya listesi alınamadı.");
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

  const closeViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedMedia(null);
  };

  const handleDelete = async (key: string) => {
    try {
      await axios.delete(`${apiUrl}/media`, {
        data: { key },
      });
      setMediaList(mediaList.filter((media) => media.Key !== key));
    } catch (error) {
      console.error("Dosya silinirken hata oluştu:", error);
      setErrorMessage("Dosya silinirken bir hata oluştu.");
    }
  };

  const handleMediaUploaded = () => {
    fetchMedia();
  };

  const handleViewMedia = (mediaKey: string) => {
    setSelectedMedia(mediaKey);
    setIsViewModalVisible(true);
  };

  const filteredMediaList = mediaList.filter((media) =>
    media.Key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Medya seçme ve seçimi yönetme
  const handleMediaSelect = (key: string) => {
    if (selectedMediaItems.includes(key)) {
      setSelectedMediaItems(selectedMediaItems.filter((item) => item !== key));
    } else {
      setSelectedMediaItems([...selectedMediaItems, key]);
    }
  };

  // Toplu silme işlemi (geçici tek tek silme çözümü)
const handleBulkDelete = async () => {
  if (selectedMediaItems.length === 0) {
    setErrorMessage("Silmek için medya seçin.");
    return;
  }

  try {
    // Her bir medya dosyasını tek tek sil
    for (const key of selectedMediaItems) {
      await axios.delete(`${apiUrl}/media`, { data: { key } });
    }

    // Medya listesini güncelle
    setMediaList(mediaList.filter((media) => !selectedMediaItems.includes(media.Key)));
    setSelectedMediaItems([]); // Seçimleri temizle
    setIsSelectionMode(false); // Seçim modunu kapat
  } catch (error) {
    console.error("Toplu silme sırasında hata oluştu:", error);
    setErrorMessage("Dosyalar silinirken bir hata oluştu.");
  }
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

          <div className="flex space-x-4 items-center">
            {/* Arama çubuğu */}
            <div className="relative">
              <input
                type="text"
                placeholder="Medya Adı ile Ara"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-[#D6D6D6] rounded-md px-4 py-2 pl-10 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                style={{ height: "40px" }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"
                />
              </svg>
            </div>

            {/* Yeni Ekle Butonu */}
            <button
              className="bg-white text-[#091E42] border border-[#D6D6D6] shadow-md flex items-center justify-center"
              onClick={handleAddNewClick}
              style={{
                width: "92px",
                height: "40px",
                borderRadius: "8px",
                padding: "10px 16px",
                boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "20px",
                color: "#2E2E2E",
                border: "1px solid #D6D6D6",
                backgroundColor: "#FFFFFF",
              }}
            >
              <span>Yeni</span>&nbsp;<span>Ekle</span>
            </button>

            {/* Seç Butonu */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => setIsSelectionMode(!isSelectionMode)}
            >
              {isSelectionMode ? "Seçim Kapat" : "Seç"}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="text-red-500 mt-4">
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Toplu Silme Butonu */}
        {isSelectionMode && selectedMediaItems.length > 0 && (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md my-4"
            onClick={handleBulkDelete}
          >
            Seçilenleri Sil ({selectedMediaItems.length})
          </button>
        )}

        <table className="w-full mt-6 border-collapse">
          <thead>
            <tr className="text-left">
              {isSelectionMode && <th className="p-2">Seç</th>}
              <th className="p-2">ID</th>
              <th className="p-2">Medya Adı</th>
              <th className="p-2">Medya Tipi</th>
              <th className="p-2">Oluşturma Tarihi</th>
              <th className="p-2 text-center">Sil</th>
              <th className="p-2 text-center">Görüntüle</th>
            </tr>
          </thead>
          <tbody>
            {filteredMediaList.map((media, index) => (
              <tr key={media.Key} className="border-t">
                {isSelectionMode && (
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedMediaItems.includes(media.Key)}
                      onChange={() => handleMediaSelect(media.Key)}
                    />
                  </td>
                )}
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
                <td className="p-2 text-center">
                  <button
                    className="text-blue-500 flex items-center justify-center"
                    onClick={() => handleViewMedia(media.Key)}
                  >
                    <FaEye className="mr-1" /> Görüntüle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Görüntüleme Modali */}
        {isViewModalVisible && selectedMedia && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl max-h-full overflow-auto">
              <h2 className="text-xl font-semibold mb-4">Medya Görüntüle</h2>
              <div className="flex justify-center items-center">
                {selectedMedia.split(".").pop()?.toLowerCase() === "mp4" ? (
                  <video
                    controls
                    className="w-full max-h-[500px]"
                    src={`${
                      import.meta.env.VITE_AWS_S3_BUCKET_URL
                    }/${selectedMedia}`}
                  />
                ) : (
                  <img
                    className="w-full max-h-[500px]"
                    src={`${
                      import.meta.env.VITE_AWS_S3_BUCKET_URL
                    }/${selectedMedia}`}
                    alt="Görüntü"
                  />
                )}
              </div>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={closeViewModal}
              >
                Kapat
              </button>
            </div>
          </div>
        )}

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
