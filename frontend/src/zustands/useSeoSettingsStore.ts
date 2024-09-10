import { create } from "zustand";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BE_URL;

interface SeoSettings {
  launchId: string; // MongoDB ObjectId olarak kabul edilen string
  seoId?: string; // Yeni eklenen alan
  title: string;
  keywords: string;
  description: string;
  socialImage: string;
  indexStatus: boolean;
  followStatus: boolean;
  launchUrl: string;
}

interface SeoSettingsState {
  seoSettings: SeoSettings;
  setSeoSettings: (settings: Partial<SeoSettings>) => void;
  saveSeoSettings: () => Promise<void>;
  fetchSeoSettings: (launchId: string) => Promise<void>;
  updateSeoSettings: (
    launchId: string,
    settings: Partial<SeoSettings>
  ) => Promise<void>;
  handleSave: () => Promise<void>;
}

const useSeoSettingsStore = create<SeoSettingsState>((set, get) => ({
  seoSettings: {
    launchId: "",
    seoId: "", // Yeni alan
    title: "",
    keywords: "",
    description: "",
    socialImage: "",
    indexStatus: false,
    followStatus: false,
    launchUrl: "",
  },

  setSeoSettings: (settings) =>
    set((state) => ({
      seoSettings: { ...state.seoSettings, ...settings },
    })),

  saveSeoSettings: async () => {
    const { seoSettings } = get();
    try {
      await axios.post(
        `${apiUrl}/seoSettings/${seoSettings.launchId}`,
        seoSettings
      );
    } catch (error) {
      console.error("SEO ayarları kaydedilirken bir hata oluştu:", error);
    }
  },

  fetchSeoSettings: async (launchId: string) => {
    try {
      const response = await axios.get(`${apiUrl}/seoSettings/${launchId}`);
      const seoData = response.data;

      // SEO ayarlarını ve seoId'yi store'a kaydediyoruz
      set({
        seoSettings: {
          ...seoData,
          seoId: seoData._id, // Backend'den gelen `_id` değerini `seoId` olarak saklıyoruz
          launchId,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 404) {
          set({
            seoSettings: {
              launchId,
              seoId: "",
              title: "",
              keywords: "",
              description: "",
              socialImage: "",
              indexStatus: false,
              followStatus: false,
              launchUrl: "",
            },
          });
        } else {
          console.error(
            "SEO ayarları alınırken bir hata oluştu:",
            error.message
          );
        }
      } else {
        console.error("Bilinmeyen bir hata oluştu:", error);
      }
    }
  },

  updateSeoSettings: async (
    launchId: string,
    settings: Partial<SeoSettings>
  ) => {
    const { seoId } = get().seoSettings; // Zustand'dan seoId'yi al
    if (!seoId) {
      console.error("SEO ID eksik, güncelleme yapılamaz.");
      return;
    }

    try {
      const response = await axios.patch(
        `${apiUrl}/seoSettings/${launchId}/${seoId}`,
        settings
      );
      set({ seoSettings: response.data });
    } catch (error) {
      console.error("SEO ayarları güncellenirken bir hata oluştu:", error);
    }
  },

  handleSave: async () => {
    const { launchId, seoId } = get().seoSettings;

    if (seoId) {
      // Eğer SEO ID mevcutsa PATCH isteği yap
      get().updateSeoSettings(launchId, get().seoSettings);
    } else {
      // Eğer SEO ID mevcut değilse önce SEO ayarlarını kontrol et ve POST isteği yap
      await get().fetchSeoSettings(launchId);

      const updatedSeoId = get().seoSettings.seoId;

      if (updatedSeoId) {
        // Eğer fetch sonrasında seoId alındıysa, bu daha önce kaydedilmiş bir ayar demektir, PATCH yap
        get().updateSeoSettings(launchId, get().seoSettings);
      } else {
        // Yeni bir SEO ayarı oluştur, POST yap
        get().saveSeoSettings();
      }
    }
  },
}));

export default useSeoSettingsStore;
