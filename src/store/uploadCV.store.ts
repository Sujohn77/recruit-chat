import { IResumeData } from "contexts/FileUploadContext";
import { create } from "zustand";

export interface UploadCVStore {
  file: File | null;
  showJobTitles: boolean;
  notification: string | null;
  resumeData: IResumeData | null;
  isFileDownloading: boolean;
  isJobSearchingLoading: boolean;

  setFile: (file: File) => void;
  _uploadCv: (file: File) => void;
  resetFile: () => void;
  searchWithResume?: () => void;
  setNotification: (notification: string | null) => void;
}

export const useUploadCV = create<UploadCVStore>((set, get) => ({
  file: null,
  isFileDownloading: false,
  isJobSearchingLoading: false,
  notification: null,
  showJobTitles: false,
  resumeData: null,

  setNotification: (notification: string | null) => set({ notification }),
  setFile: (file: File) => get()._uploadCv(file),
  resetFile: () => {
    set({ file: null, notification: null });
  },

  _uploadCv: (file: File) => {
    const { setNotification, notification } = get();

    if (file.size > 2097152) {
      setNotification("File may not be more than 2MB");
      set({ file: null });

      return;
    }

    notification && setNotification(null);
    set({ file: file });

    const reader = new FileReader();
    // const candidateId =
  },
}));
