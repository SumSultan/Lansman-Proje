import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ComponentEkle from "../components/ComponentEkle";
import useDeployDesignStore from "../zustands/useDeployDesingStore";
import NavBar from "../components/NavBar";

// Onay modal bileşeni
const ConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg mb-4">Bu öğeyi silmek istediğinize emin misiniz?</h2>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-md text-black"
          >
            Hayır
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Evet
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderSettings = () => {
  const { launchId } = useParams<{ launchId: string }>();
  const navigate = useNavigate();
  const {
    deployDesign,
    fetchDeployDesign,
    clearDeployDesign,
    updatePreviewStatus,
    updateInTrailerStatus,
    deleteDeployDesign,
    updateDeployDesignSequence,
  } = useDeployDesignStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewEnabled, setIsPreviewEnabled] = useState(false);
  const [savedMessages, setSavedMessages] = useState<string[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Onay modalını kontrol eden state
  const [selectedDeployDesignId, setSelectedDeployDesignId] = useState<string | null>(null); // Silinecek öğeyi saklar

  useEffect(() => {
    if (launchId) {
      clearDeployDesign();
      fetchDeployDesign(launchId);
    }
  }, [launchId]);

  useEffect(() => {
    if (deployDesign && deployDesign.length > 0) {
      const currentPreview = deployDesign.find((item) => item.preview);
      setIsPreviewEnabled(currentPreview ? currentPreview.preview : false);
    } else {
      setIsPreviewEnabled(false);
    }
  }, [deployDesign]);

  const showSavedMessage = () => {
    const newMessageId = `saved-${Date.now()}`;
    setSavedMessages((prev) => [newMessageId, ...prev]);

    setTimeout(() => {
      setSavedMessages((prev) => prev.filter((msg) => msg !== newMessageId));
    }, 2000);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const navigateToSeoSettings = () => {
    if (launchId) {
      navigate(`/seo-settings/${launchId}`);
    } else {
      console.error("Launch ID mevcut değil!");
    }
  };

  const navigateToPreview = () => {
    if (launchId) {
      navigate(`/preview/${launchId}`);
    } else {
      console.error("Launch ID mevcut değil!");
    }
  };

  const onToggleInTrailer = async (
    deployDesignId: string,
    currentInTrailerStatus: boolean
  ) => {
    if (!launchId) return;

    useDeployDesignStore.setState((state) => ({
      deployDesign: state.deployDesign.map((item) =>
        item._id === deployDesignId
          ? { ...item, inTrailer: !currentInTrailerStatus }
          : item
      ),
    }));

    try {
      await updateInTrailerStatus(
        launchId,
        deployDesignId,
        !currentInTrailerStatus
      );
      fetchDeployDesign(launchId);
      showSavedMessage();
    } catch (error) {
      console.error(`Error updating inTrailer status`, error);
    }
  };

  // Silme işlemi için confirm modalını açar
  const onDeleteDeployDesign = (deployDesignId: string) => {
    setSelectedDeployDesignId(deployDesignId);
    setIsConfirmOpen(true); // Onay modalını aç
  };

  // Onay modalındaki "Evet" butonuna basılırsa
  const handleConfirmDelete = async () => {
    if (!launchId || !selectedDeployDesignId) return;

    try {
      await deleteDeployDesign(launchId, selectedDeployDesignId);

      useDeployDesignStore.setState((state) => ({
        deployDesign: state.deployDesign.filter(
          (item) => item._id !== selectedDeployDesignId
        ),
      }));

      if (deployDesign.length === 1) {
        useDeployDesignStore.setState({ deployDesign: [] });
      } else {
        fetchDeployDesign(launchId);
      }

      showSavedMessage();
    } catch (error) {
      console.error(`Error deleting deployDesign`, error);
    }

    setIsConfirmOpen(false); // Onay modalını kapat
  };

  // "Hayır" seçilirse modalı kapat
  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setSelectedDeployDesignId(null); // Seçilen öğeyi temizle
  };

  const moveComponent = async (index: number, direction: "up" | "down") => {
    if (!deployDesign || !launchId) return;

    const newComponents = [...deployDesign];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newComponents.length) return;

    const [movedComponent] = newComponents.splice(index, 1);
    newComponents.splice(targetIndex, 0, movedComponent);

    useDeployDesignStore.setState({ deployDesign: newComponents });

    try {
      await updateDeployDesignSequence(
        launchId,
        movedComponent._id!,
        targetIndex + 1
      );

      fetchDeployDesign(launchId);
      showSavedMessage();
    } catch (error) {
      console.error("Error updating sequence number", error);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    moveComponent(index, direction);
  };

  const togglePreview = async () => {
    if (!launchId) return;
    try {
      await updatePreviewStatus(launchId, !isPreviewEnabled);
      setIsPreviewEnabled(!isPreviewEnabled);
      fetchDeployDesign(launchId);
      showSavedMessage();
    } catch (error) {
      console.error("Preview durumu güncellenemedi:", error);
    }
  };

  return (
    <div className="flex h-full">
      <NavBar />
      <div className="flex-1 p-8">
        <div
          className="bg-gray-800 text-white text-xs p-6 mx-8 my-4 rounded-lg"
          style={{ width: "950px", marginTop: "5px" }}
        >
          <p>DAMISE ADMIN PANEL</p>
        </div>
        <div
          className="flex flex-col justify-between p-4 bg-white rounded-lg shadow-md"
          style={{ width: "100%" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-black">Tasarım Ayarları</h2>
            <div className="flex items-center space-x-4">
              <div
                className={`relative inline-block w-[36px] h-[18px] rounded-full transition duration-50 ${
                  isPreviewEnabled ? "bg-blue-500" : "bg-gray-300"
                }`}
                onClick={togglePreview}
              >
                <div
                  className={`dot absolute w-[14px] h-[14px] bg-white rounded-full top-[2px] transition duration-200 ${
                    isPreviewEnabled
                      ? "translate-x-[18px]"
                      : "translate-x-[2px]"
                  }`}
                ></div>
              </div>
              <span className="text-sm text-[#243757] font-poppins"></span>

              <button
                onClick={navigateToPreview}
                disabled={!isPreviewEnabled}
                className={`px-4 py-2 text-sm font-poppins rounded-lg ${
                  isPreviewEnabled
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Ön izleme
              </button>

              <button
                onClick={navigateToSeoSettings}
                className="px-4 py-2 text-sm font-poppins text-[#243757] border border-gray-300 rounded-lg"
              >
                SEO
              </button>
              <button
                onClick={openModal}
                className="px-4 py-2 text-sm font-poppins text-[#243757] border border-gray-300 rounded-lg"
              >
                Component Ekle
              </button>

              <button className="px-4 py-2 text-sm font-poppins text-white bg-[#970928] rounded-lg">
                Kaydet
              </button>
            </div>
          </div>

          <div className="w-[651px] h-[1600px]">
            <div className="space-y-4 overflow-y-auto h-[1500px]">
              {deployDesign &&
                deployDesign.length > 0 &&
                deployDesign.map((item, index) => (
                  <div
                    key={item._id!}
                    className="flex items-center justify-between p-2 border rounded-lg bg-white"
                    style={{ backgroundColor: "#F7F9FC" }}
                  >
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMove(index, "up")}
                        className="text-[#243757] font-poppins text-[14px] leading-[20px] underline"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMove(index, "down")}
                        className="text-[#243757] font-poppins text-[14px] leading-[20px] underline"
                      >
                        ▼
                      </button>
                      <span className="text-[#243757] font-poppins font-[400] text-[14px] leading-[20px]">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`relative inline-block w-[36px] h-[18px] rounded-full transition duration-200 ${
                          item.inTrailer ? "bg-blue-500" : "bg-gray-300"
                        }`}
                        onClick={() =>
                          onToggleInTrailer(item._id!, item.inTrailer)
                        }
                      >
                        <div
                          className={`dot absolute w-[14px] h-[14px] bg-white rounded-full top-[2px] transition duration-200 ${
                            item.inTrailer
                              ? "translate-x-[18px]"
                              : "translate-x-[2px]"
                          }`}
                        ></div>
                      </div>
                      <span className="text-sm text-[#243757] font-poppins">
                        Fragmanda Göster
                      </span>
                      <button
                        onClick={() => onDeleteDeployDesign(item._id!)}
                        className="text-[#970928] font-poppins text-[14px] leading-[20px] underline ml-4"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="w-full flex justify-end mt-4"></div>
          <ComponentEkle
            isOpen={isModalOpen}
            onClose={closeModal}
            launchId={launchId}
          />
        </div>

        <style>
          {`
            .saved-message {
              position: fixed;
              background-color: #38a169;
              color: white;
              padding: 10px 20px;
              border-radius: 5px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
              opacity: 0;
              transform: translateY(50px);
              animation: slideIn 0.5s ease-out forwards, fadeOut 1.5s ease forwards 1.5s;
            }

            @keyframes slideIn {
              0% {
                opacity: 0;
                transform: translateY(50px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes fadeOut {
              0% {
                opacity: 1;
                transform: translateY(0);
              }
              100% {
                opacity: 0;
                transform: translateY(-20px);
              }
            }
          `}
        </style>

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={isConfirmOpen}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

        {/* Saved Message */}
        {savedMessages.map((msg, index) => (
          <div
            key={msg}
            className="saved-message"
            style={{
              bottom: `${4 + (savedMessages.length - 1 - index) * 60}px`,
              right: "4px",
              animationDelay: `${index * 0.1}s`,
            }}
          >
            Kaydedildi
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSettings;
