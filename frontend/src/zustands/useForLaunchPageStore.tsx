// src/stores/lansmanStore.ts
import create from "zustand";
import axios from "axios";

interface FullScreenCardItem {
  media: string;
  text: string;
  buttonText: string;
  buttonUrl: string;
  logoMedia: string;
}

interface InfoCardItem {
  icon: string;
  title: string;
  subtitle: string;
}
interface MiniCardItem {
  id: number;
  buttonText: string;
  text: string;
  logoMedia: string;
  buttonUrl: string; // Yeni eklenen alan
  backgroundMedia: string; // Yeni eklenen alan
}

interface ReelsCardItem {
  id: number;
  media: string;
  title: string;
  subTitle: string;
}
interface Content {
  title?: string;
  subTitle?: string;
  buttonText?: string;
  buttonUrl?: string;
  media?: string;
  rightMedia?: string;
  rightFrontMedia?: string;
  rightBackMedia?: string;
  leftFrontMedia?: string;
  leftBackMedia?: string;
  leftMedia?: string;
  rightTitle?: string;
  rightSubTitle?: string;
  rightButtonText?: string;
  rightButtonUrl?: string;
  leftTitle?: string;
  leftSubTitle?: string;
  leftButtonText?: string;
  leftButtonUrl?: string;
  url?: string;
  fullScreenCardItems?: FullScreenCardItem[];
  logoMedia?: string;
  text?: string;
  accordianItems?: Array<{ title: string; subTitle: string }>;
  infoCardSliderItems?: InfoCardItem[];
  frontMedia?: string; // LargeFlipCardSection için gerekli
  backMedia?: string; // LargeFlipCardSection için gerekli
  miniCardItems?: MiniCardItem[]; // MiniCardSliderSection için gerekli
  reelsCardSliderItems?: ReelsCardItem[]; // ReelsCardSliderSection için gerekli
}

interface Component {
  _id: string;
  type: string;
  name: string;
  content: Content;
  inTrailer: boolean;
}

interface LansmanStoreState {
  components: Component[];
  fetchComponents: (launchId: string) => Promise<void>;
}

const apiUrl = import.meta.env.VITE_BE_URL;

export const useLansmanStore = create<LansmanStoreState>((set) => ({
  components: [],
  fetchComponents: async (launchId: string) => {
    try {
      const response = await axios.get(`${apiUrl}/deployDesign/${launchId}`);
      set({ components: response.data });
    } catch (error) {
      console.error("Error fetching components:", error);
    }
  },
}));
