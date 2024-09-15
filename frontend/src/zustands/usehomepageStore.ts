import { create } from "zustand";
import axios from "axios";

interface Component {
  _id: string; // Bileşen için ID
  name: string; // Bileşen adı (ör. "Header")
  content: {
    title: string; // İçerik başlığı
    logoMedia: string; // Logo için medya
  };
}

interface Launch {
  launchName: string;
  companyName: string;
  launchDate: string;
  endDate: string;
}

interface HomePageState {
  homepageLaunch: Launch | null;
  components: Component[]; // Component tipini tanımlıyoruz
  getHomepageData: () => void;
}

const apiUrl = import.meta.env.VITE_BE_URL;

const useHomePageStore = create<HomePageState>((set) => ({
  homepageLaunch: null,
  components: [],

  // Backend'den anasayfa verilerini çek
  getHomepageData: async () => {
    try {
      const response = await axios.get(`${apiUrl}/homepage/with-components`);
      set({
        homepageLaunch: response.data.launchDetails, // launchDetails alanı store'a kaydediliyor
        components: response.data.components, // components alanı store'a kaydediliyor
      });
    } catch (error) {
      console.error("Verileri çekerken hata oluştu:", error);
    }
  },
}));

export default useHomePageStore;