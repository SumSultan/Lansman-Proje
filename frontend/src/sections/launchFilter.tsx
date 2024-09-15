import React, { useState, useEffect, CSSProperties } from "react";
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
}

const SearchSection: React.FC<SearchComponentSectionProps> = ({
  searchQuery,
  onSearchQueryChange,
  loading,
  onButtonClick,
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

  const [hovered, setHovered] = useState<number | null>(null);

  const searchBoxStyle: CSSProperties = {
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  };

  return (
    <div className="p-6 bg-white flex flex-col items-center justify-start w-full">
      <div className="grid grid-cols-4 gap-8 w-full max-w-6xl mb-6">
        <button
          type="button"
          className="bg-gray-100 rounded-lg text-center shadow-md cursor-pointer"
          onClick={() => onButtonClick("todayLaunches")}
          disabled={loading}
          style={{
            ...cardStyle,
            ...(hovered === 1 ? hoverStyle : {}),
          }}
          onMouseEnter={() => setHovered(1)}
          onMouseLeave={() => setHovered(null)}
        >
          <FaCalendarAlt className="text-3xl mb-2 text-gray-500 mx-auto" />
          <span className="font-semibold text-md text-gray-500">
            Bugünün Lansmanları
          </span>
        </button>

        <button
          type="button"
          className="bg-gray-100 rounded-lg text-center shadow-md cursor-pointer"
          onClick={() => onButtonClick("ongoing")}
          disabled={loading}
          style={{
            ...cardStyle,
            ...(hovered === 2 ? hoverStyle : {}),
          }}
          onMouseEnter={() => setHovered(2)}
          onMouseLeave={() => setHovered(null)}
        >
          <FaPlayCircle className="text-3xl mb-2 text-gray-500 mx-auto" />
          <span className="font-semibold text-md text-gray-500">
            Devam Eden Lansmanlar
          </span>
        </button>

        <button
          type="button"
          className="bg-gray-100 rounded-lg text-center shadow-md cursor-pointer"
          onClick={() => onButtonClick("upcoming")}
          disabled={loading}
          style={{
            ...cardStyle,
            ...(hovered === 3 ? hoverStyle : {}),
          }}
          onMouseEnter={() => setHovered(3)}
          onMouseLeave={() => setHovered(null)}
        >
          <FaClock className="text-3xl mb-2 text-gray-500 mx-auto" />
          <span className="font-semibold text-md text-gray-500">
            Gelecek Lansmanlar
          </span>
        </button>

        <button
          type="button"
          className="bg-gray-100 rounded-lg text-center shadow-md cursor-pointer"
          onClick={() => onButtonClick("past")}
          disabled={loading}
          style={{
            ...cardStyle,
            ...(hovered === 4 ? hoverStyle : {}),
          }}
          onMouseEnter={() => setHovered(4)}
          onMouseLeave={() => setHovered(null)}
        >
          <FaSyncAlt className="text-3xl mb-2 text-gray-500 mx-auto" />
          <span className="font-semibold text-md text-gray-500">
            Geçmiş Lansmanlar
          </span>
        </button>

        <div className="col-span-4">
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
        </div>
      </div>

      {loading && (
        <p className="mt-4 text-center text-lg text-gray-600">Yükleniyor...</p>
      )}
    </div>
  );
};

const LaunchFilter: React.FC = () => {
  const { launches, getLaunchData } = useLaunchStore();
  const { fetchAllSeoSettings, allSeoSettings } = useSeoSettingsStore();

  const [filteredLaunches, setFilteredLaunches] = useState<any[]>([]);
  const [allLaunches, setAllLaunches] = useState<any[]>([]); // Tüm lansmanları saklar
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Seçilen kategori
  const [isAnimating, setIsAnimating] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const convertDateFormat = (dateString: string) => {
    const [day, month, year] = dateString.split(".");
    return `${year}-${month}-${day}`;
  };

  const getFormattedDate = (dateString: string) => {
    const formattedDate = convertDateFormat(dateString);
    return dayjs(formattedDate);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await getLaunchData();
        await fetchAllSeoSettings();
        setAllLaunches(launches); // Tüm lansmanları burada ayırıyoruz
        setFilteredLaunches(launches); // Başlangıçta tüm lansmanlar
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

  const handleButtonClick = (type: string) => {
    setHasInteracted(true);
    setSelectedCategory(type); // Kategori setle
    setIsAnimating(true);
    const today = dayjs();

    let filtered = [];

    switch (type) {
      case "todayLaunches":
        filtered = allLaunches.filter((launch) =>
          getFormattedDate(launch.launchDate).isSame(today, "day")
        );
        break;
      case "ongoing":
        filtered = allLaunches.filter(
          (launch) =>
            getFormattedDate(launch.launchDate).isBefore(today) &&
            getFormattedDate(launch.endDate).isAfter(today)
        );
        break;
      case "upcoming":
        filtered = allLaunches.filter((launch) =>
          getFormattedDate(launch.launchDate).isAfter(today)
        );
        break;
      case "past":
        filtered = allLaunches.filter((launch) =>
          getFormattedDate(launch.endDate).isBefore(today, "day")
        );
        break;
      default:
        filtered = allLaunches;
    }

    setFilteredLaunches(filtered);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handleSearchQueryChange = (query: string) => {
    setHasInteracted(true);
    setSearchQuery(query);

    if (query.trim() === "") {
      if (selectedCategory) {
        handleButtonClick(selectedCategory); // Kategori seçilmişse onu uygula
      } else {
        setFilteredLaunches(allLaunches); // Kategori seçilmemişse tüm lansmanları göster
      }
      return;
    }

    // SEO anahtar kelimeleri ve başlık ile arama yapıyoruz
    const launchData = selectedCategory ? filteredLaunches : allLaunches;

    const searched = launchData.filter((launch) => {
      const seoData = getSeoForLaunch(launch._id);

      let seoMatches = false;

      // SEO anahtar kelimelerine göre arama
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

      // Başlığa göre arama
      const titleMatches = seoData?.title
        ? seoData.title.toLowerCase().includes(query.toLowerCase())
        : false;

      return seoMatches || titleMatches;
    });

    setFilteredLaunches(searched);
  };

  const getSeoForLaunch = (launchId: string) => {
    return allSeoSettings.find((seo) => seo.launchId === launchId);
  };

  const handleMoreClick = (launchUrl: string) => {
    if (launchUrl) {
      window.location.href = launchUrl;
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-9xl">
        <SearchSection
          searchQuery={searchQuery}
          onSearchQueryChange={handleSearchQueryChange}
          loading={loading}
          onButtonClick={handleButtonClick}
          onFocus={() => setHasInteracted(true)}
        />
      </div>

      {hasInteracted && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-16 w-full max-w-6xl">
          {filteredLaunches.length > 0 ? (
            filteredLaunches.map((launch, index) => {
              const seoData = getSeoForLaunch(launch._id);

              return (
                <div
                  key={launch._id}
                  className={`bg-gray-50 rounded-lg shadow-md overflow-hidden transition-all transform ${
                    isAnimating
                      ? "opacity-0 translate-y-10"
                      : "opacity-100 translate-y-0"
                  } duration-1000 ease-out col-span-1 hover:scale-105 hover:shadow-lg`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                    transform: `translateY(${
                      isAnimating ? "15px" : "0"
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
            })
          ) : (
            <p>Seçilen kritere göre lansman bulunamadı.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LaunchFilter;
