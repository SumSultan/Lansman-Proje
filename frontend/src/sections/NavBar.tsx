import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Yönlendirme için useNavigate'i ekleyin

const NavBar: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("tr"); // Varsayılan dil Türkçe
  const [isVisible, setIsVisible] = useState(false); // Animasyon durumu
  const navigate = useNavigate(); // Yönlendirme için hook'u kullanıyoruz

  // Sayfa yüklendiğinde animasyonu tetikle
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true); // 100ms sonra görünür yap
    }, 100);
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
    console.log("Selected Language:", e.target.value);
  };

  const goToLoginPage = () => {
    navigate("/login"); // Yönlendirme işlemi
  };

  return (
    <nav
      className={`bg-white p-4 text-black flex justify-between items-center transition-transform duration-[1.3s] ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Sol tarafta büyük ve özel renkte DAMISE yazısı */}
      <div className="text-4xl font-semibold" style={{ color: "#970928" }}>
        DAMISE
      </div>

      {/* Sağ tarafta dil seçme dropdown, Anasayfa ve Admin butonu */}
      <div className="flex items-center space-x-4">
        <div>
          <label htmlFor="language-select" className="mr-2 text-black">
            Dil Seç:
          </label>
          <select
            id="language-select"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="bg-gray-200 text-black p-2 rounded-md"
          >
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
          </select>
        </div>

        {/* Admin butonu */}
        <div className="flex flex-col items-center">
          <button
            onClick={goToLoginPage}
            className="bg-[#970928] text-white p-1 rounded-md hover:bg-[#780720] transition-colors"
          >
            Admin Panele Git
          </button>
          <p className="text-xs text-gray-500 mt-1">
            *Geçici olarak yapılmıştır
          </p>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;