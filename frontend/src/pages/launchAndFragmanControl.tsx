import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BE_URL; // API URL'sini import ediyoruz

const LaunchAndFragmanControl: React.FC = () => {
  const { launchId } = useParams<{ launchId: string }>(); // URL'den launchId'yi alıyoruz
  const [launchDate, setLaunchDate] = useState<string | null>(null); // Lansman tarihi
  const [endDate, setEndDate] = useState<string | null>(null); // Lansman bitiş tarihi
  const [loading, setLoading] = useState<boolean>(true); // Yüklenme durumu
  const [redirect, setRedirect] = useState<string | null>(null); // Yönlendirme durumu

  useEffect(() => {
    const fetchLaunchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/launch/${launchId}`); // API'den veri çekiyoruz
        const { launchDate, endDate } = response.data; // launchDate ve endDate verilerini alıyoruz
        setLaunchDate(launchDate);
        setEndDate(endDate);

        // Tarihleri date objelerine çeviriyoruz
        const launchDateObj = new Date(launchDate);
        const endDateObj = new Date(endDate);
        const currentDate = new Date();

        // Tarih kontrolü ve yönlendirme
        if (currentDate >= launchDateObj && currentDate <= endDateObj) {
          setRedirect(`/preview/${launchId}`); // Lansman başlamışsa preview sayfasına yönlendir
        } else if (currentDate < launchDateObj) {
          setRedirect(`/fragman/${launchId}`); // Lansman başlamamışsa fragman sayfasına yönlendir
        } else if (currentDate > endDateObj) {
          setRedirect("finished"); // Lansman bitmişse mesaj göstereceğiz
        }
      } catch (error) {
        console.error("Error fetching launch data:", error);
      } finally {
        setLoading(false); // Yüklenme bitti
      }
    };

    if (launchId) {
      fetchLaunchData(); // Verileri fetch ediyoruz
    }
  }, [launchId]);

  if (loading) {
    return <div>Yükleniyor...</div>; // Veri yüklenirken gösterilecek mesaj
  }

  // Eğer yönlendirme varsa, kullanıcıyı ilgili sayfaya yönlendir
  if (redirect === "finished") {
    return <div>Lansman sona ermiştir.</div>; // Lansman bitiş mesajı
  } else if (redirect) {
    return <Navigate to={redirect} replace />; // Başka bir sayfaya yönlendirme
  }

  return null; // Yönlendirme veya mesaj yoksa hiçbir şey göstermiyoruz
};

export default LaunchAndFragmanControl;
