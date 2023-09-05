import { IResumeData } from "contexts/FileUploadContext";
import { create } from "zustand";

const MAX_FILE_SIZE = 2097152;

export interface UploadCVStore {
  file: File | null;
  showJobTitles: boolean;
  notification: string | null;
  resumeData: IResumeData | null;
  isFileDownloading: boolean;
  isJobSearchingLoading: boolean;

  setFile: (file: File) => void;
  resetFile: () => void;
  searchWithResume?: () => void;
  setNotification: (notification: string | null) => void;

  _uploadCV: (file: File) => void;
}

export const useUploadCV = create<UploadCVStore>((set, get) => ({
  file: null,
  isFileDownloading: false,
  isJobSearchingLoading: false,
  notification: null,
  showJobTitles: false,
  resumeData: null,

  setNotification: (notification: string | null) => set({ notification }),
  setFile: (file: File) => get()._uploadCV(file),
  resetFile: () => {
    set({ file: null, notification: null });
  },

  _uploadCV: (file: File) => {
    const { setNotification, notification } = get();

    if (file.size > MAX_FILE_SIZE) {
      setNotification("File may not be more than 2MB");
      set({ file: null });

      return;
    } else {
      notification && setNotification(null);
      set({ file: file });

      const reader = new FileReader();
      // const candidateId =
    }
  },
}));
