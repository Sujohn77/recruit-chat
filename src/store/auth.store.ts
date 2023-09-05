export interface AuthState {
  candidateId?: number;
  chatId?: number;
  isAnonym: boolean;
  chatBotToken?: string;
  firebaseToken: string | null;
  isAuthInFirebase: boolean;
  emailAddress: string;
  firstName: string;
  lastName: string;

  setIsAuthInFirebase: (isAuth: boolean) => void;
  logout: () => void;
}
