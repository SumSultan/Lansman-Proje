import { create } from "zustand";
import axios from "axios";

// Launch arayüzü: Her bir lansmanın yapısını tanımlar
interface Launch {
  _id: string; // Benzersiz kimlik
  launchName: string;
  language: string;
  groupNumber: string;
  companyName: string;
  companyLogo: string;
  launchDate: string;
  endDate: string;
  sequenceNumber: string;
  isActive: boolean;
  showOnHomepage: boolean;
}

// Zustand store'unun durum ve eylemlerini tanımlayan arayüz
interface LaunchState {
  launches: Launch[]; // Tüm lansmanların tutulduğu dizi
  launchId?: string; // Lansmanın ID'si, sadece güncelleme için kullanılır
  launchName: string;
  language: string;
  groupNumber: string;
  companyName: string;
  companyLogo: string;
  launchDate: string;
  endDate: string;
  sequenceNumber: string;
  isActive: boolean;
  showOnHomepage: boolean;
  setLaunchData: (data: Launch[]) => void; // Lansman verilerini ayarlar
  resetLaunchData: () => void; // Form alanlarını sıfırlar
  updateLaunchField: (field: string, value: string | boolean | Date) => void;
  submitLaunchData: () => Promise<void>; // Yeni bir lansman oluşturur veya mevcut lansmanı günceller (POST veya PATCH isteği)
  getLaunchData: () => Promise<void>; // Tüm lansmanları getirir (GET isteği)
  fetchLaunchById: (launchId: string) => Promise<void>; // Belirli bir lansmanı getirir (GET isteği)
  updateLaunchData: (launchId: string) => Promise<void>; // Belirli bir lansmanı günceller (PATCH isteği)
  deleteLaunch: (launchId: string) => Promise<void>; // Burada deleteLaunch fonksiyonunu tanımladık
  clearLaunchData: () => void; // Form verilerini temizler
}

const apiUrl = import.meta.env.VITE_BE_URL;

const useLaunchStore = create<LaunchState>((set, get) => ({
  // Başlangıç durumları
  launches: [],
  launchId: undefined,
  launchName: "",
  language: "",
  groupNumber: "",
  companyName: "",
  companyLogo: "",
  launchDate: "",
  endDate: "",
  sequenceNumber: "",
  isActive: false,
  showOnHomepage: false,

  // Tüm lansman verilerini ayarlar
  setLaunchData: (data) => set({ launches: data }),

  // Form alanlarını sıfırlar
  resetLaunchData: () =>
    set({
      launchId: undefined,
      launchName: "",
      language: "",
      groupNumber: "",
      companyName: "",
      companyLogo: "",
      launchDate: "",
      endDate: "",
      sequenceNumber: "",
      isActive: false,
      showOnHomepage: false,
    }),

  // Belirli bir alanı günceller
  updateLaunchField: (field: string, value: string | boolean | Date) =>
    set((state) => ({ ...state, [field]: value })),

  // Yeni bir lansman oluşturur veya mevcut lansmanı günceller (POST veya PATCH isteği)
  submitLaunchData: async () => {
    const {
      launchName,
      language,
      groupNumber,
      companyName,
      companyLogo,
      launchDate,
      endDate,
      sequenceNumber,
      isActive,
      showOnHomepage,
      updateLaunchData,
    } = get();

    // Eğer launchId mevcutsa, PATCH işlemi yapılacak, değilse POST
    if (get().launchId) {
      // PATCH isteği
      await updateLaunchData(get().launchId as string);
    } else {
      // POST isteği
      try {
        const response = await axios.post(`${apiUrl}/launch`, {
          launchName,
          language,
          groupNumber,
          companyName,
          companyLogo,
          launchDate,
          endDate,
          sequenceNumber,
          isActive,
          showOnHomepage,
        });

        console.log("Launch Data Saved:", response.data);

        // Yeni lansman başarıyla eklendikten sonra mevcut lansmanları güncelle
        await get().getLaunchData();

        // Form alanlarını sıfırla
        get().resetLaunchData();
      } catch (error) {
        console.error("Error saving launch data:", error);
      }
    }
  },

  // Tüm lansmanları getirir (GET isteği)
  getLaunchData: async () => {
    try {
      const response = await axios.get(`${apiUrl}/launch`);
      console.log("Launch Data Retrieved:", response.data);

      // Gelen verileri store'a kaydet
      set({ launches: response.data });
    } catch (error) {
      console.error("Error retrieving launch data:", error);
    }
  },

  // Belirli bir lansmanı launchId'ye göre getirir (GET isteği)
  fetchLaunchById: async (launchId: string) => {
    try {
      const response = await axios.get(`${apiUrl}/launch/${launchId}`);
      const launchData = response.data;

      // Gelen verileri store'a kaydet
      set({
        launchId: launchData._id,
        launchName: launchData.launchName,
        language: launchData.language,
        groupNumber: launchData.groupNumber,
        companyName: launchData.companyName,
        companyLogo: launchData.companyLogo,
        launchDate: launchData.launchDate,
        endDate: launchData.endDate,
        sequenceNumber: launchData.sequenceNumber,
        isActive: launchData.isActive,
        showOnHomepage: launchData.showOnHomepage,
      });
    } catch (error) {
      console.error("Error fetching launch by id:", error);
    }
  },

  // Belirli bir lansmanı launchId'ye göre günceller (PATCH isteği)
  updateLaunchData: async (launchId: string) => {
    const {
      launchName,
      language,
      groupNumber,
      companyName,
      companyLogo,
      launchDate,
      endDate,
      sequenceNumber,
      isActive,
      showOnHomepage,
    } = get();

    try {
      const response = await axios.patch(`${apiUrl}/launch/${launchId}`, {
        launchName,
        language,
        groupNumber,
        companyName,
        companyLogo,
        launchDate,
        endDate,
        sequenceNumber,
        isActive,
        showOnHomepage,
      });

      console.log("Launch Data Updated:", response.data);

      await get().getLaunchData();
    } catch (error) {
      console.error("Error updating launch data:", error);
    }
  },

  deleteLaunch: async (launchId: string) => {
    try {
      await axios.delete(`${apiUrl}/launch/${launchId}`);
      console.log(`Launch with ID ${launchId} has been deleted`);

      // Silme işleminden sonra mevcut lansmanları güncelle
      await get().getLaunchData();
    } catch (error) {
      console.error("Error deleting launch:", error);
    }
  },

  // Form verilerini temizler
  clearLaunchData: () => {
    set({
      launchId: undefined,
      launchName: "",
      language: "",
      groupNumber: "",
      companyName: "",
      companyLogo: "",
      launchDate: "",
      endDate: "",
      sequenceNumber: "",
      isActive: false,
      showOnHomepage: false,
    });
  },
}));

export default useLaunchStore;
