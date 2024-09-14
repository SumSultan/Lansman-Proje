import React from "react";
import {
  FaCalendarAlt,
  FaPlayCircle,
  FaClock,
  FaSyncAlt,
} from "react-icons/fa";

interface SearchFormProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilters: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
}) => {
  return (
    <div className="p-6 bg-white-100 flex flex-col items-center justify-start">
      {/* Açıklama */}
      <p className="text-center text-gray-700 mb-6">
        <span className="text-red-500">*</span> Bu component lansmanları;
        geçmiş lansmanlar, devam eden lansmanlar, gelecek lansmanlar ve bugünün
        lansmanları olacak şekilde dört başlıkta kategorize eder{" "}
        <span className="text-red-500">*</span>
      </p>

      {/* Filtre Kartları */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded-lg text-center shadow-md cursor-pointer">
          <FaCalendarAlt className="text-3xl mb-2 text-gray-600 mx-auto" />
          <p className="font-semibold text-sm text-gray-600">
            Bugünün Lansmanları
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg text-center shadow-md cursor-pointer">
          <FaPlayCircle className="text-3xl mb-2 text-gray-600 mx-auto" />
          <p className="font-semibold text-sm text-gray-600">
            Devam Eden Lansmanlar
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg text-center shadow-md cursor-pointer">
          <FaClock className="text-3xl mb-2 text-gray-600 mx-auto" />
          <p className="font-semibold text-sm text-gray-600">
            Gelecek Lansmanlar
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg text-center shadow-md cursor-pointer">
          <FaSyncAlt className="text-3xl mb-2 text-gray-600 mx-auto" />
          <p className="font-semibold text-sm text-gray-600">
            Geçmiş Lansmanlar
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
