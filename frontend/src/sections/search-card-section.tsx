import React, { useState } from "react";
import {
  FaSearch,
  FaSync,
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

interface SearchSectionProps {
  searchQuery: string; // Prop olarak geçeceğimiz searchQuery
}

const SearchSection: React.FC<SearchSectionProps> = ({ searchQuery }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleClearFilters = () => {
    setLocalSearchQuery(""); // Arama kutusunu temizle
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-start">
      <h1 className="text-2xl font-bold text-[#5F2EEA] mb-6 text-center">
        Lansman Arama
      </h1>

      {/* Filtre Kartları */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-200 p-4 rounded-lg text-center shadow-md cursor-pointer">
          <FaCalendarAlt className="text-3xl mb-2 text-gray-600 mx-auto" />
          <p className="font-semibold text-sm text-gray-800">
            Bugünün Lansmanları
          </p>
        </div>
        <div className="bg-gray-200 p-4 rounded-lg text-center shadow-md cursor-pointer">
          <FaEnvelope className="text-3xl mb-2 text-gray-600 mx-auto" />
          <p className="font-semibold text-sm text-gray-800">
            Devam Eden Lansmanlar
          </p>
        </div>
        <div className="bg-gray-200 p-4 rounded-lg text-center shadow-md cursor-pointer">
          <FaClock className="text-3xl mb-2 text-gray-600 mx-auto" />
          <p className="font-semibold text-sm text-gray-800">
            Gelecek Lansmanlar
          </p>
        </div>
        <div className="bg-gray-200 p-4 rounded-lg text-center shadow-md cursor-pointer">
          <FaSync className="text-3xl mb-2 text-gray-600 mx-auto" />
          <p className="font-semibold text-sm text-gray-800">
            Geçmiş Lansmanlar
          </p>
        </div>
      </div>

      {/* Temizle Butonu */}
      <div className="flex items-center mb-6">
        <button
          className="bg-gray-200 p-3 rounded-full text-sm flex items-center space-x-2"
          onClick={handleClearFilters}
        >
          <FaSync className="text-lg text-gray-600" />
          <span>Temizle</span>
        </button>
      </div>

      {/* Arama Çubuğu */}
      <div className="relative w-full max-w-xl">
        <input
          type="text"
          value={localSearchQuery}
          onChange={handleSearchChange}
          placeholder="Arama"
          className="w-full border border-gray-300 p-4 rounded-lg pl-10 bg-gray-50"
        />
        <div className="absolute inset-y-0 left-3 flex items-center">
          <FaSearch className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default SearchSection;