import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PreviewPage from "./previewPage";
import FragmentPage from "./fragman";

// API URL'sini import ediyoruz
const apiUrl = import.meta.env.VITE_BE_URL;

const LaunchPage: React.FC = () => {
  const { launchId } = useParams<{ launchId: string }>();
  const [launchDate, setLaunchDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLaunch = async () => {
      try {
        // Lansman verilerini çekiyoruz
        const response = await axios.get(`${apiUrl}/launch/${launchId}`);
        const { launchDate, endDate } = response.data; // Sadece gerekli verileri alıyoruz
        console.log(response.data);
        setLaunchDate(launchDate);
        setEndDate(endDate);
        setLoading(false);
      } catch (error) {
        console.error("Lansman bilgileri alınırken hata oluştu:", error);
        navigate("/access-denied"); // Hata durumunda yetki yok sayfasına yönlendirme
      }
    };

    if (launchId) {
      fetchLaunch();
    }
  }, [launchId, navigate]);

  if (loading) return <div>Yükleniyor...</div>;

  if (launchDate === null || endDate === null) {
    return <div>Lansman bilgileri bulunamadı.</div>;
  }

  // Veritabanından gelen "gün.ay.yıl" formatını "yıl-ay-gün" formatına çevirme
  const convertDateFormat = (dateString: string) => {
    const [day, month, year] = dateString.split("."); // Gün, Ay ve Yıl parçalarına ayırıyoruz
    return `${year}-${month}-${day}`; // "yıl-ay-gün" formatında yeniden oluşturuyoruz
  };

  const launchDateFormatted = convertDateFormat(launchDate); // Lansman tarihi formatı düzeltildi
  const endDateFormatted = convertDateFormat(endDate); // Bitiş tarihi formatı düzeltildi

  // Tarihleri Date nesnesine çeviriyoruz
  const today = new Date(); // Bugünün tarihini alıyoruz
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const launchDateObj = new Date(launchDateFormatted); // Lansman başlangıç tarihini Date nesnesine çeviriyoruz
  const endDateObj = new Date(endDateFormatted); // Lansman bitiş tarihini Date nesnesine çeviriyoruz

  // gg.aa.yyyy formatında tarih karşılaştırmasını yapabilmek için tarihi manuel olarak ayarlıyoruz
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0"); // Gün (gg)
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ay (aa), +1 çünkü aylar 0 tabanlı
    const year = date.getFullYear(); // Yıl (yyyy)
    return `${day}.${month}.${year}`;
  };

  const formattedLaunchDate = formatDate(launchDateObj); // Düzeltilmiş lansman tarihi
  const formattedTodayDate = formatDate(todayDateOnly); // Bugünün tarihi

  console.log("Lansman Başlangıç Tarihi:", formattedLaunchDate);
  console.log("Bugünün Tarihi:", formattedTodayDate);

  // Tarih karşılaştırması yaparken yalnızca yıl, ay ve günü dikkate alıyoruz (saat dikkate alınmaz)
  const launchDateOnly = new Date(
    launchDateObj.getFullYear(),
    launchDateObj.getMonth(),
    launchDateObj.getDate()
  );
  const endDateOnly = new Date(
    endDateObj.getFullYear(),
    endDateObj.getMonth(),
    endDateObj.getDate()
  );

  if (launchDateOnly > todayDateOnly) {
    return <FragmentPage />; // Lansman tarihi gelmemişse fragman sayfasını göster
  } else if (endDateOnly < todayDateOnly) {
    return <div>Bu lansmanın tarihi geçmiştir.</div>; // Tarih geçmişse mesaj gösterme
  } else {
    return <PreviewPage />; // Tarih bugündür ve preview sayfasını göster
  }
};

export default LaunchPage;