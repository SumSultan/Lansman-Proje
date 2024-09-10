import { create } from "zustand";
import axios from "axios";

export type Components = {
  title?: string;
  description?: string;
  image?: string;
  link?: string;
  logoMedia?: string;
  media?: string;
  url?: string;
  frontMedia?: string;
  backMedia?: string;
  text?: string;
  subTitle?: string;
  buttonText?: string;
  buttonUrl?: string;
  rightMedia?: string;
  leftMedia?: string;
  rightFrontMedia?: string;
  rightBackMedia?: string;
  leftFrontMedia?: string;
  leftBackMedia?: string;
  rightTitle?: string;
  rightSubTitle?: string;
  rightButtonText?: string;
  rightButtonUrl?: string;
  leftTitle?: string;
  leftSubTitle?: string;
  leftButtonText?: string;
  leftButtonUrl?: string;
  miniCardItems?: Array<{
    buttonText: string;
    text: string;
    logoMedia: string;
    buttonUrl?: string; // Yeni eklenen alan
    backgroundMedia?: string; // Yeni eklenen alan
  }>;
  accordianItems?: Array<{ title: string; subTitle: string }>;
  infoCardSliderItems?: Array<{
    icon: string;
    title: string;
    subtitle: string;
  }>;
  fullScreenCardItems?: Array<{
    media: string;
    text: string;
    buttonText: string;
    buttonUrl: string;
    logoMedia: string;
  }>;
  reelsCardSliderItems?: Array<{
    media: string;
    title: string;
    subTitle: string;
  }>;
};

export type DeployDesign = {
  _id?: string;
  launchId: string;
  name: string;
  inTrailer: boolean;
  preview: boolean;
  content: Partial<Components>; // "components" yerine "content"
  type: string; // Yeni "type" alanı eklendi
};

interface DeployDesignStore {
  deployDesign: DeployDesign[];
  loading: boolean;
  error: string | null;
  fetchDeployDesign: (launchId: string) => Promise<void>;
  createDeployDesign: (launchId: string, data: DeployDesign) => Promise<void>;
  updateInTrailerStatus: (
    launchId: string,
    id: string,
    inTrailer: boolean
  ) => Promise<void>;
  deleteDeployDesign: (launchId: string, id: string) => Promise<void>;
  updateDeployDesignSequence: (
    launchId: string,
    id: string,
    newSequenceNumber: number
  ) => Promise<void>;
  updatePreviewStatus: (launchId: string, preview: boolean) => Promise<void>;
  clearDeployDesign: () => void;
}

const apiUrl = import.meta.env.VITE_BE_URL;

const fetchDeployDesign = async (
  set: (state: Partial<DeployDesignStore>) => void,
  launchId: string
): Promise<void> => {
  set({ loading: true, error: null });
  try {
    const response = await axios.get(`${apiUrl}/deployDesign/${launchId}`);
    console.log("API Response:", response.data);
    set({
      deployDesign: response.data,
      loading: false,
    });
  } catch (error: any) {
    set({ error: error.response?.data || "An error occurred", loading: false });
  }
};

const createDeployDesign = async (
  set: (state: Partial<DeployDesignStore>) => void,
  launchId: string,
  data: DeployDesign
): Promise<void> => {
  set({ loading: true, error: null });
  try {
    console.log("POST data:", data);
    const response = await axios.post(
      `${apiUrl}/deployDesign/${launchId}`,
      data
    );
    console.log("Response:", response.data);
    set({ deployDesign: response.data, loading: false });
  } catch (error: any) {
    set({ error: error.response?.data || "An error occurred", loading: false });
    console.error("Error in POST request:", error);
  }
};

const updateInTrailerStatus = async (
  set: (state: Partial<DeployDesignStore>) => void,
  launchId: string,
  id: string,
  inTrailer: boolean
): Promise<void> => {
  set({ loading: true, error: null });
  try {
    const response = await axios.patch(
      `${apiUrl}/deployDesign/${launchId}/inTrailer`,
      {
        id,
        inTrailer,
      }
    );
    return response.data;
  } catch (error: any) {
    set({ error: error.response?.data || "An error occurred", loading: false });
  }
};

const updatePreviewStatus = async (
  set: (state: Partial<DeployDesignStore>) => void,
  launchId: string,
  preview: boolean
): Promise<void> => {
  set({ loading: true, error: null });
  try {
    const response = await axios.patch(
      `${apiUrl}/deployDesign/${launchId}/preview`,
      {
        preview,
      }
    );
    console.log("Preview updated:", response.data);
    set({ loading: false });
  } catch (error: any) {
    set({ error: error.response?.data || "An error occurred", loading: false });
    console.error("Error updating preview status:", error);
  }
};

const deleteDeployDesign = async (
  set: (state: Partial<DeployDesignStore>) => void,
  launchId: string,
  id: string
): Promise<void> => {
  set({ loading: true, error: null });
  try {
    await axios.delete(`${apiUrl}/deployDesign/${launchId}`, {
      data: { id },
    });
    // Silme işlemi başarılı olduğunda state'i güncelle
  } catch (error: any) {
    set({ error: error.response?.data || "An error occurred", loading: false });
  }
};

// Yeni eklenen sıralama güncelleme fonksiyonu
const updateDeployDesignSequence = async (
  set: (state: Partial<DeployDesignStore>) => void,
  launchId: string,
  id: string,
  newSequenceNumber: number
): Promise<void> => {
  set({ loading: true, error: null });
  try {
    const response = await axios.patch(`${apiUrl}/deployDesign/${launchId}`, {
      id,
      newSequenceNumber,
    });
    return response.data;
  } catch (error: any) {
    set({ error: error.response?.data || "An error occurred", loading: false });
  }
};

const clearDeployDesign = (
  set: (state: Partial<DeployDesignStore>) => void
): void => {
  set({ deployDesign: [] });
};

const initialState: any = {
  deployDesign: null,
  loading: false,
  error: null,
};

const useDeployDesignStore = create<DeployDesignStore>((set) => ({
  ...initialState,
  fetchDeployDesign: (launchId: string) => fetchDeployDesign(set, launchId),
  createDeployDesign: (launchId: string, data: DeployDesign) =>
    createDeployDesign(set, launchId, data),
  updateInTrailerStatus: (launchId: string, id: string, inTrailer: boolean) =>
    updateInTrailerStatus(set, launchId, id, inTrailer),
  updatePreviewStatus: (launchId: string, preview: boolean) =>
    updatePreviewStatus(set, launchId, preview),
  deleteDeployDesign: (launchId: string, id: string) =>
    deleteDeployDesign(set, launchId, id),
  updateDeployDesignSequence: (
    launchId: string,
    id: string,
    newSequenceNumber: number
  ) => updateDeployDesignSequence(set, launchId, id, newSequenceNumber),
  clearDeployDesign: () => clearDeployDesign(set),
}));

export default useDeployDesignStore;
