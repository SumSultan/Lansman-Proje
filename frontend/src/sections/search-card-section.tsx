import React from "react";

// Props arayüzünü tanımlayın
interface SearchComponentSectionProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  loading: boolean;
  onButtonClick: (type: string) => void;
  onFocus?: () => void; // onFocus fonksiyonunu ekledik ve opsiyonel yaptık
}

const SearchSection: React.FC<SearchComponentSectionProps> = ({
  searchQuery,
  onSearchQueryChange,
  loading,
  onButtonClick,
}) => {
  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 shadow-lg rounded-xl">
      {/* Lansman Butonları */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <button
          type="button"
          className="bg-gradient-to-br from-purple-600 to-indigo-600 p-5 rounded-xl text-center flex flex-col items-center hover:shadow-xl transition duration-300 transform hover:scale-105 text-white"
          onClick={() => onButtonClick("todayLaunches")}
          disabled={loading}
        >
          <svg
            className="w-10 h-10 mb-2 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Bugünün Lansmanları</span>
        </button>

        <button
          type="button"
          className="bg-gradient-to-br from-green-500 to-teal-400 p-5 rounded-xl text-center flex flex-col items-center hover:shadow-xl transition duration-300 transform hover:scale-105 text-white"
          onClick={() => onButtonClick("ongoing")}
          disabled={loading}
        >
          <svg
            className="w-10 h-10 mb-2 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v8m-4-4h8"
            />
          </svg>
          <span>Devam Eden Lansmanlar</span>
        </button>

        <button
          type="button"
          className="bg-gradient-to-br from-yellow-500 to-orange-400 p-5 rounded-xl text-center flex flex-col items-center hover:shadow-xl transition duration-300 transform hover:scale-105 text-white"
          onClick={() => onButtonClick("upcoming")}
          disabled={loading}
        >
          <svg
            className="w-10 h-10 mb-2 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 12h16m-8-8v16"
            />
          </svg>
          <span>Gelecek Lansmanlar</span>
        </button>

        <button
          type="button"
          className="bg-gradient-to-br from-red-500 to-pink-400 p-5 rounded-xl text-center flex flex-col items-center hover:shadow-xl transition duration-300 transform hover:scale-105 text-white"
          onClick={() => onButtonClick("past")}
          disabled={loading}
        >
          <svg
            className="w-10 h-10 mb-2 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>Geçmiş Lansmanlar</span>
        </button>
      </div>

      {/* Arama Kutusu */}
      <div className="flex items-center bg-white p-4 rounded-xl shadow-md">
        <svg
          className="w-6 h-6 text-gray-400 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Arama yapın..."
          className="w-full p-3 border-2 border-gray-300 rounded focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          disabled={loading}
        />
      </div>

      {/* Yükleniyor durumu */}
      {loading && (
        <p className="mt-6 text-center text-lg text-indigo-600">
          Yükleniyor...
        </p>
      )}
    </div>
  );
};

export default SearchSection;