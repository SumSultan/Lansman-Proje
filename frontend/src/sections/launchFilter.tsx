import React, { useState, useEffect, CSSProperties, useCallback } from "react";
import dayjs from "dayjs";
import {
  FaCalendarAlt,
  FaPlayCircle,
  FaClock,
  FaSyncAlt,
  FaSearch,
} from "react-icons/fa";
import useLaunchStore from "../zustands/useLaunchStore";
import useSeoSettingsStore from "../zustands/useSeoSettingsStore";

// SearchComponentSection Props
interface SearchComponentSectionProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  loading: boolean;
  onButtonClick: (type: string) => void;
  onFocus?: () => void;
  onClearSearch: () => void;
}

const SearchSection: React.FC<SearchComponentSectionProps> = ({
  searchQuery,
  onSearchQueryChange,
  loading,
  onButtonClick,
  onClearSearch,
}) => {
  const cardStyle: CSSProperties = {
    width: "100%",
    height: "250px",
    transition: "transform 0.7s ease-in-out, box-shadow 0.7s ease-in-out",
    cursor: "pointer",
  };

  const hoverStyle: CSSProperties = {
    transform: "scale(1.05)",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
  };

  const searchBoxStyle: CSSProperties = {
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  };

  const clearButtonStyle: CSSProperties = {
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    transition: "transform 0.7s ease-in-out, box-shadow 0.7s ease-in-out",
  };

  const [hovered, setHovered] = useState<number | null>(null);
  const [isClearHovered, setIsClearHovered] = useState<boolean>(false);

  return (
    <div className="p-6 bg-white flex flex-col items-center justify-start w-full">
      <div className="grid grid-cols-4 gap-8 w-full max-w-6xl mb-6">
        {/* Button Components */}
        {["todayLaunches", "ongoing", "upcoming", "past"].map((type, index) => (
          <button
            key={type}
            type="button"
            className="bg-gray-100 rounded-lg text-center shadow-md cursor-pointer"
            onClick={() => onButtonClick(type)}
            disabled={loading}
            style={{
              ...cardStyle,
              ...(hovered === index ? hoverStyle : {}),
            }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            <IconLabel index={index} />
          </button>
        ))}

        <div className="col-span-4 flex">
          <div className="relative w-full" style={searchBoxStyle}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Arama yapın..."
              className="w-full border border-gray-300 p-5 rounded-lg pl-12 bg-gray-50 focus:ring-2 focus:ring-gray-100"
              disabled={loading}
            />
            <div className="absolute inset-y-0 left-3 flex items-center">
              <FaSearch className="text-gray-400" />
            </div>
          </div>

          {/* Temizle Butonu */}
          <button
            className="ml-4 border border-gray-300 bg-gray-50 text-gray-400 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100"
            onClick={onClearSearch}
            disabled={loading}
            onMouseEnter={() => setIsClearHovered(true)}
            onMouseLeave={() => setIsClearHovered(false)}
            style={{
              ...clearButtonStyle,
              ...(isClearHovered ? hoverStyle : {}),
            }}
          >
            Temizle
          </button>
        </div>
      </div>

      {loading && (
        <p className="mt-4 text-center text-lg text-gray-600">Yükleniyor...</p>
      )}
    </div>
  );
};

// Separate Icon Label for Optimization
const IconLabel = ({ index }: { index: number }) => {
  const labels = [
    {
      icon: <FaCalendarAlt className="text-3xl mb-2 text-gray-500 mx-auto" />,
      text: "Bugünün Lansmanları",
    },
    {
      icon: <FaPlayCircle className="text-3xl mb-2 text-gray-500 mx-auto" />,
      text: "Devam Eden Lansmanlar",
    },
    {
      icon: <FaClock className="text-3xl mb-2 text-gray-500 mx-auto" />,
      text: "Gelecek Lansmanlar",
    },
    {
      icon: <FaSyncAlt className="text-3xl mb-2 text-gray-500 mx-auto" />,
      text: "Geçmiş Lansmanlar",
    },
  ];

  return (
    <>
      {labels[index].icon}
      <span className="font-semibold text-md text-gray-500">
        {labels[index].text}
      </span>
    </>
  );
};

const LaunchFilter: React.FC = () => {
  const { launches, getLaunchData } = useLaunchStore();
  const { fetchAllSeoSettings, allSeoSettings } = useSeoSettingsStore();

  const [filteredLaunches, setFilteredLaunches] = useState<any[]>([]);
  const [allLaunches, setAllLaunches] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHiding, setIsHiding] = useState(false); // Gizleme animasyonu durumu

  const convertDateFormat = useCallback((dateString: string) => {
    const [day, month, year] = dateString.split(".");
    return `${year}-${month}-${day}`;
  }, []);

  const getFormattedDate = useCallback(
    (dateString: string) => {
      const formattedDate = convertDateFormat(dateString);
      return dayjs(formattedDate);
    },
    [convertDateFormat]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await getLaunchData();
        await fetchAllSeoSettings();
        setAllLaunches(launches);
        setFilteredLaunches(launches);
      } catch (error) {
        console.error("Veri çekilirken bir hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!loading && allLaunches.length === 0) {
      fetchData();
    }
  }, [getLaunchData, fetchAllSeoSettings, launches, loading, allLaunches]);

  const handleButtonClick = useCallback(
    (type: string) => {
      setHasInteracted(true);
      setSelectedCategory(type);
      setIsAnimating(true); // Açılma animasyonu başlat
      const today = dayjs();

      const filtered = allLaunches.filter((launch) => {
        const launchDate = getFormattedDate(launch.launchDate);
        const endDate = getFormattedDate(launch.endDate);

        switch (type) {
          case "todayLaunches":
            return launchDate.isSame(today, "day");
          case "ongoing":
            return launchDate.isBefore(today) && endDate.isAfter(today);
          case "upcoming":
            return launchDate.isAfter(today);
          case "past":
            return endDate.isBefore(today, "day");
          default:
            return true;
        }
      });

      setFilteredLaunches(filtered);
      setTimeout(() => setIsAnimating(false), 1000); // Açılma animasyonunu bitir
    },
    [allLaunches, getFormattedDate]
  );

  const handleSearchQueryChange = useCallback(
    (query: string) => {
      setHasInteracted(true);
      setSearchQuery(query);

      if (query.trim() === "") {
        handleButtonClick(selectedCategory || "");
        return;
      }

      const launchData = selectedCategory ? filteredLaunches : allLaunches;

      const searched = launchData.filter((launch) => {
        const seoData = getSeoForLaunch(launch._id);

        let seoMatches = false;

        if (seoData?.keywords) {
          if (Array.isArray(seoData.keywords)) {
            seoMatches = seoData.keywords.some((keyword: string) =>
              keyword.toLowerCase().includes(query.toLowerCase())
            );
          } else if (typeof seoData.keywords === "string") {
            seoMatches = seoData.keywords
              .toLowerCase()
              .includes(query.toLowerCase());
          }
        }

        const titleMatches = seoData?.title
          ? seoData.title.toLowerCase().includes(query.toLowerCase())
          : false;

        return seoMatches || titleMatches;
      });

      setFilteredLaunches(searched);
    },
    [allLaunches, filteredLaunches, selectedCategory]
  );

  // Temizle Butonu Fonksiyonu
  const handleClearSearch = () => {
    setIsHiding(true); // Gizleme animasyonunu başlat
    setTimeout(() => {
      setSearchQuery(""); // Arama sorgusunu temizle
      setFilteredLaunches([]); // Lansmanları gizle
      setHasInteracted(false); // İlk haline dön
      setSelectedCategory(null); // Seçilen kategoriyi sıfırla
      setIsHiding(false); // Gizleme animasyonunu durdur
    }, 700); // 700ms sonra gizle
  };

  const getSeoForLaunch = useCallback(
    (launchId: string) => {
      return allSeoSettings.find((seo) => seo.launchId === launchId);
    },
    [allSeoSettings]
  );

  const handleMoreClick = useCallback((launchUrl: string) => {
    if (launchUrl) {
      window.location.href = launchUrl;
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-9xl">
        <SearchSection
          searchQuery={searchQuery}
          onSearchQueryChange={handleSearchQueryChange}
          loading={loading}
          onButtonClick={handleButtonClick}
          onFocus={() => setHasInteracted(true)}
          onClearSearch={handleClearSearch}
        />
      </div>

      {hasInteracted && filteredLaunches.length > 0 && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-16 w-full max-w-6xl">
          {filteredLaunches.map((launch, index) => {
            const seoData = getSeoForLaunch(launch._id);

            return (
              <div
                key={launch._id}
                className={`bg-gray-50 rounded-lg shadow-md overflow-hidden transition-all transform ${
                  isAnimating && !isHiding
                    ? "opacity-0 translate-y-10"
                    : "opacity-100 translate-y-0"
                } duration-1000 ease-out col-span-1 hover:scale-105 hover:shadow-lg ${
                  isHiding ? "opacity-0 translate-y-10" : ""
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  transform: `translateY(${
                    isAnimating || isHiding ? "15px" : "0"
                  }) scale(${hovered === index ? 1.05 : 1})`,
                }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                {seoData ? (
                  <div className="flex flex-col h-full">
                    {seoData.socialImage && (
                      <img
                        src={`${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${
                          seoData.socialImage
                        }`}
                        alt="SEO Görseli"
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-600">
                          {seoData.title || "Lansman Başlık"}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">
                          {seoData.description || "Lansman açıklaması..."}
                        </p>
                      </div>
                      <div>
                        <button
                          className="text-indigo-600 text-sm font-medium hover:underline"
                          onClick={() => handleMoreClick(seoData.launchUrl)}
                        >
                          Daha fazlası...
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>SEO bilgisi bulunamadı.</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LaunchFilter;
