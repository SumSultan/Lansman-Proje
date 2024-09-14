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
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [searchTerm, setSearchTerm] = useState(""); // Arama çubuğu için yeni state
  const navigate = useNavigate();

  // Sayfa yüklendiğinde verileri çek
  useEffect(() => {
    getLaunchData();
  }, [getLaunchData]);

  // Veriler her güncellendiğinde yeni eklenen lansman başa gelecek şekilde ayarlayın
  useEffect(() => {
    setSortedLaunches([...launches].reverse());
  }, [launches]);

  // Lansman adı ve şirket adına göre arama fonksiyonu
  const searchLaunches = (launches: any[]) => {
    return launches.filter(
      (launch) =>
        launch.launchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        launch.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Duruma göre filtreleme fonksiyonu
  const filterLaunches = (launches: any[]) => {
    const filteredByStatus =
      filterStatus === "active"
        ? launches.filter((launch) => launch.isActive)
        : filterStatus === "inactive"
        ? launches.filter((launch) => !launch.isActive)
        : launches;
    return searchLaunches(filteredByStatus); // Hem filtreleme hem arama fonksiyonunu birleştiriyoruz
  };

  const handleCreateClick = () => {
    setSelectedLaunchId(null);
    clearLaunchData();
    setIsModalOpen(true);
  };

  const handleEditClick = (launchId: string) => {
    setSelectedLaunchId(launchId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (selectedLaunchId) {
      fetchLaunchById(selectedLaunchId);
    } else {
      clearLaunchData();
    }
  }, [selectedLaunchId, fetchLaunchById, clearLaunchData]);

  const handleDesignClick = (launchId: string) => {
    navigate(`/design-settings/${launchId}`);
  };

  // Yayına Giriş Tarihi'ne göre sıralama işlevi
  const handleSortByLaunchDate = () => {
    if (sortDirection === "none" || sortDirection === "original") {
      const sorted = [...launches].sort(
        (a, b) =>
          new Date(a.launchDate).getTime() - new Date(b.launchDate).getTime()
      );
      setSortedLaunches(sorted);
      setSortDirection("ascending");
    } else {
      setSortedLaunches([...launches].reverse());
      setSortDirection("original");
    }
  };

  // Filtreleme seçeneğini değiştir
  const handleFilterChange = (status: "all" | "active" | "inactive") => {
    setFilterStatus(status);
  };

  return (
    <div className="flex h-full">
      <NavBar />
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
            <div className="flex space-x-4 items-center">
              {/* Arama çubuğu */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Lansman Adı veya Şirket Adı ile Ara"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-[#D6D6D6] rounded-md px-4 py-2 pl-10 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  style={{
                    height: "40px", // Make the input height same as the button
                  }}
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
                onClick={handleCreateClick}
                style={{
                  width: "92px",
                  height: "40px", // Set the button height explicitly
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

          {/* Filtreleme butonları */}
          <div className="flex space-x-4 mt-6">
            {" "}
            {/* mt-6 ile sadece üst boşluk eklendi */}
            <button
              onClick={() => handleFilterChange("all")}
              className={`${
                filterStatus === "all" ? "text-black" : "text-gray-400"
              }`}
            >
              Tüm Lansmanlar
            </button>
            <button
              onClick={() => handleFilterChange("active")}
              className={`${
                filterStatus === "active" ? "text-black" : "text-gray-400"
              }`}
            >
              Aktif Lansmanlar
            </button>
            <button
              onClick={() => handleFilterChange("inactive")}
              className={`${
                filterStatus === "inactive" ? "text-black" : "text-gray-400"
              }`}
            >
              Pasif Lansmanlar
            </button>
          </div>
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
                  <div style={{ display: "flex", alignItems: "center" }}>
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
                <th
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
              {filterLaunches(sortedLaunches).map((launch) => (
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