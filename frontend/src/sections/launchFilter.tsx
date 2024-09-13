import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import SearchComponentSection from "../sections/search-card-section";
import useLaunchStore from "../zustands/useLaunchStore";
import useSeoSettingsStore from "../zustands/useSeoSettingsStore";

const LaunchFilter: React.FC = () => {
  const { launches, getLaunchData } = useLaunchStore();
  const { fetchAllSeoSettings, allSeoSettings } = useSeoSettingsStore();

  const [filteredLaunches, setFilteredLaunches] = useState(launches);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Veritabanından gelen "gün.ay.yıl" formatını "yıl-ay-gün" formatına çevirme işlevi
  const convertDateFormat = (dateString: string) => {
    const [day, month, year] = dateString.split(".");
    return `${year}-${month}-${day}`; // "yıl-ay-gün" formatında geri döndürüyoruz
  };

  // Tarihleri dayjs formatına çeviriyoruz
  const getFormattedDate = (dateString: string) => {
    const formattedDate = convertDateFormat(dateString);
    return dayjs(formattedDate); // dayjs nesnesi olarak döndürüyoruz
  };

  // Verileri çekiyoruz
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        await getLaunchData();
        await fetchAllSeoSettings();
      } catch (error) {
        console.error("Veri çekilirken bir hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getLaunchData, fetchAllSeoSettings]);

  // Launches değiştiğinde, bunları yerel duruma kaydediyoruz
  useEffect(() => {
    setFilteredLaunches(launches);
  }, [launches]);

  // Bugünün lansmanlarını veya diğer kriterlere göre lansmanları filtreler
  const handleButtonClick = (type: string) => {
    setHasInteracted(true);
    const today = dayjs(); // Bugünün tarihi

    let filtered = [];

    switch (type) {
      case "todayLaunches": // Bugünün lansmanlarını filtrele
        filtered = launches.filter((launch) =>
          getFormattedDate(launch.launchDate).isSame(today, "day")
        );
        break;
      case "ongoing": // Devam eden lansmanları filtrele
        filtered = launches.filter(
          (launch) =>
            getFormattedDate(launch.launchDate).isBefore(today) &&
            getFormattedDate(launch.endDate).isAfter(today)
        );
        break;
      case "upcoming": // Gelecek lansmanları filtrele
        filtered = launches.filter((launch) =>
          getFormattedDate(launch.launchDate).isAfter(today)
        );
        break;
      case "past": // Geçmiş lansmanları filtrele
        filtered = launches.filter((launch) =>
          getFormattedDate(launch.endDate).isBefore(today, "day")
        );
        break;
      default:
        filtered = launches; // Tüm lansmanları göster
    }

    setFilteredLaunches(filtered); // Filtrelenmiş lansmanları güncelle
  };

  // Arama sorgusunu işleme
  const handleSearchQueryChange = (query: string) => {
    setHasInteracted(true);
    setSearchQuery(query);
    const searchedLaunches = launches.filter((launch) =>
      launch.launchName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredLaunches(searchedLaunches);
  };

  // Belirli bir launchId'ye göre SEO verilerini getirir
  const getSeoForLaunch = (launchId: string) => {
    return allSeoSettings.find((seo) => seo.launchId === launchId);
  };

  return (
    <div>
      {/* SearchComponentSection'u bağladık */}
      <SearchComponentSection
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        loading={loading}
        onButtonClick={handleButtonClick}
        onFocus={() => setHasInteracted(true)}
      />

      {/* Kullanıcı etkileşimde bulunduysa lansmanları göster */}
      {hasInteracted && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLaunches.length > 0 ? (
            filteredLaunches.map((launch) => {
              const seoData = getSeoForLaunch(launch._id); // SEO verilerini al

              return (
                <div
                  key={launch._id}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                >
                  {/* SEO bilgileri */}
                  {seoData ? (
                    <div className="mt-4">
                      {/* SEO Görsel */}
                      {seoData.socialImage && (
                        <div className="bg-gray-100 p-4 rounded-lg mb-4">
                          <img
                            src={`${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${
                              seoData.socialImage
                            }`}
                            alt="SEO Görseli"
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      {/* SEO Başlık */}
                      <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        <h4 className="font-medium">Başlık</h4>
                        <p>{seoData.title}</p>
                      </div>
                      {/* SEO Açıklama */}
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <h4 className="font-medium">Açıklama</h4>
                        <p>{seoData.description}</p>
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