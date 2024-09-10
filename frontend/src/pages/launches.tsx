import { useEffect, useState } from "react";
import useLaunchStore from "../zustands/useLaunchStore";
import NewLaunchFormModal from "./LaunchFormModal";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import NavBar from "../components/NavBar";

const Launches = () => {
  const { launches, getLaunchData, fetchLaunchById, clearLaunchData } =
    useLaunchStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLaunchId, setSelectedLaunchId] = useState<string | null>(null);
  const [sortedLaunches, setSortedLaunches] = useState(launches);
  const [sortDirection, setSortDirection] = useState<
    "none" | "ascending" | "original"
  >("none");
  const navigate = useNavigate();

  // Sayfa yüklendiğinde verileri çek
  useEffect(() => {
    getLaunchData();
  }, [getLaunchData]);

  // Veriler her güncellendiğinde yeni eklenen lansman başa gelecek şekilde ayarlayın
  useEffect(() => {
    setSortedLaunches([...launches].reverse()); // Veriyi ters çevirip başa ekliyoruz
  }, [launches]);

  const handleCreateClick = () => {
    setSelectedLaunchId(null); // Yeni ekle butonuna tıklanıldığında seçili launchId sıfırlanır
    clearLaunchData(); // Mevcut verileri sıfırla
    setIsModalOpen(true); // Modalı aç
  };

  const handleEditClick = (launchId: string) => {
    setSelectedLaunchId(launchId); // Düzenle butonuna tıklanıldığında ilgili launchId seçilir
    setIsModalOpen(true); // Modalı aç
  };

  const closeModal = () => {
    setIsModalOpen(false); // Modalı kapat
  };

  useEffect(() => {
    if (selectedLaunchId) {
      fetchLaunchById(selectedLaunchId); // Eğer bir lansman ID'si seçildiyse, ilgili veriyi getir
    } else {
      clearLaunchData(); // Seçili bir lansman yoksa formu sıfırla
    }
  }, [selectedLaunchId, fetchLaunchById, clearLaunchData]);

  const handleDesignClick = (launchId: string) => {
    navigate(`/design-settings/${launchId}`);
  };

  // Yayına Giriş Tarihi'ne göre sıralama işlevi
  const handleSortByLaunchDate = () => {
    if (sortDirection === "none" || sortDirection === "original") {
      // Tarihlere göre artan sırada sıralama (en erken tarih en üstte)
      const sorted = [...launches].sort(
        (a, b) =>
          new Date(a.launchDate).getTime() - new Date(b.launchDate).getTime()
      );
      setSortedLaunches(sorted);
      setSortDirection("ascending");
    } else {
      // Orijinal sıralamaya geri dön (ilk eklenen en üstte)
      setSortedLaunches([...launches].reverse()); // Reverse burada da kullanılır
      setSortDirection("original");
    }
  };

  return (
    <div className="flex h-full">
      <NavBar /> {/* NavBar bileşenini sol tarafa yerleştirin */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="bg-gray-800 text-white text-xs p-6 mx-8 my-5 rounded-lg">
          <p>DAMISE ADMIN PANEL</p>
        </div>
        <div className="flex-1 p-4 bg-white rounded-t-lg mx-8">
          <div className="flex justify-between items-center">
            <h1
              className="font-poppins font-medium"
              style={{
                width: "144px",
                height: "32px",
                fontSize: "20px",
                lineHeight: "32px",
                gap: "10px",
              }}
            >
              Lansmanlar
            </h1>
            <div className="flex space-x-4">
              <button
                className="bg-white text-[#091E42] border border-[#D6D6D6] shadow-md flex items-center justify-center"
                onClick={handleCreateClick}
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
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span>Yeni</span>&nbsp;<span>Ekle</span>
              </button>
            </div>
          </div>
          <h2 className="text-xs text-gray-500 my-2">
            Bu kısımda oluşturmuş olduğunuz aktif/pasif lansmanları
            görüntüleyebilirsiniz.
          </h2>
          <hr className="my-5" />

          {/* Tablonun oluşturulması */}
          <table className="min-w-full bg-white table-fixed">
            <thead>
              <tr>
                {["Lansman Adı", "Şirket Adı", "Dil", "Durumu"].map(
                  (header, index) => (
                    <th
                      key={index}
                      className="text-left px-4 py-2"
                      style={{
                        fontSize: "12px",
                        fontWeight: "400",
                        lineHeight: "16px",
                        color: "#A3AED0",
                        wordWrap: "break-word",
                        wordBreak: "break-word",
                        maxWidth: "150px",
                      }}
                    >
                      <span>{header}</span>
                    </th>
                  )
                )}
                <th
                  className="text-left px-4 py-2 cursor-pointer"
                  style={{
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "16px",
                    color: "#A3AED0",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    maxWidth: "150px",
                  }}
                  onClick={handleSortByLaunchDate}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ marginRight: "7px" }}>
                      Yayına Giriş Tarihi
                    </span>
                    <svg
                      width="11.18"
                      height="6.59"
                      viewBox="0 0 11.18 6.59"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        transition: "transform 0.3s ease",
                        transform:
                          sortDirection === "ascending"
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                      }}
                    >
                      <path
                        d="M1 1l4.59 4.59L10.18 1"
                        fill="none"
                        stroke="#A3AED0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </th>

                {/* Yayın Bitiş Tarihi başlığı stili güncellendi */}
                <th
                  className="text-left px-4 py-2"
                  style={{
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "16px",
                    color: "#A3AED0", // Diğer başlıklarla aynı renk ve boyut
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    maxWidth: "150px",
                  }}
                >
                  <span>Yayın Bitiş Tarihi</span>
                </th>

                {["Düzenle", "Tasarla"].map((header, index) => (
                  <th
                    key={index}
                    className="text-left px-4 py-2"
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "16px",
                      color: "#A3AED0",
                      wordWrap: "break-word",
                      wordBreak: "break-word",
                      maxWidth: "150px",
                    }}
                  >
                    <span>{header}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedLaunches.map((launch) => (
                <tr key={launch._id} className="hover:bg-gray-100">
                  <td
                    className="px-4 py-2"
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-word",
                      maxWidth: "150px",
                    }}
                  >
                    {launch.launchName}
                  </td>
                  <td
                    className="px-4 py-2"
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-word",
                      maxWidth: "150px",
                    }}
                  >
                    {launch.companyName}
                  </td>
                  <td className="px-4 py-2">{launch.language}</td>
                  <td className="px-4 py-2 flex items-center space-x-2">
                    {launch.isActive ? (
                      <FaCheckCircle
                        className="text-[#05CD99]"
                        style={{ width: "20px", height: "20px" }}
                      />
                    ) : (
                      <FaTimesCircle
                        className="text-[#EE5D50]"
                        style={{ width: "20px", height: "20px" }}
                      />
                    )}
                    <span className="text-[#243757] font-poppins font-[400] text-[14px] leading-[20px]">
                      {launch.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-2">{launch.launchDate}</td>
                  <td className="px-4 py-2">{launch.endDate}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEditClick(launch._id)}
                      className="text-[#970928] font-poppins font-[400] text-[14px] leading-[20px] flex items-center space-x-2"
                    >
                      <span>Düzenle</span>
                      <FaArrowRight />
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDesignClick(launch._id)}
                      className="text-[#970928] font-poppins font-[400] text-[14px] leading-[20px] flex items-center space-x-2"
                    >
                      <span>Tasarla</span>
                      <FaArrowRight />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isModalOpen && <NewLaunchFormModal onClose={closeModal} />}
        </div>
      </div>
    </div>
  );
};

export default Launches;
