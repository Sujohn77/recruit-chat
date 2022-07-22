import firebase from "firebase";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

export const FIREBASE_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY1ODQ4NTc5NywiaWF0IjoxNjU4NDgyMTk3fQ.M1rnFk-0IyFwvFiQJRkLZ-o4D0TwaDweEWgp0yBC_I_wOYMA3KfeX1UhImHGyTvvVrirJjgtX84PxJvqY64Npji3qWVBmGPRcoVKM26TDcSgVzhUu92OWDlAZemMXNXkCqTwGRogUkPAZ8NmNzDj1MrlGpJU2O1Ugfvz56YXTdqoD5GXq12F1gg0JD67rAMC2fgLP-PN48ELUg8dh8NJfBTFc5mLpLdd89KnTtAjzYrAa-Tj5dqwTVhqf2_B84GlmO84U9F7UIXAoyz7W1iEwc5677RWeHbhHjptM8Jes69vu6W5q6HEaksmAr1UjFSOuo1WP46yKSQKK_EO-wQblQ';
export const ACCESS_TOKEN = 'FBF4aXlvCy0V2XeIrDqzOXoAVCvS7AwaOlqwoLowGNsVAf7owYMWHhvpxSnVT1L22Gq1Eo0v6hWPdLzWRLr19F7fMeadcEssqPPKKCrBGzA1gmvjireYR3Z6iSAmsIdaoKpj0pCngC2hh7_9M33jJPx3M-wFb3PadJ6zTkZ9SF6upYzZcunk7NEp-e657tLMNDmdAV6ctVeNLVORPtuEaOh8vdBZDiK11PAlcsCDzOdYRn9zlBtMN0gqVY8e28iJf2vW8aLo5xhR9Y7iF-W2dB5z5CW95vM568fgILXBAqx5OWHC8L22-OGyiDPKagH6xI0p-i1p32ihjSN-P8BI52jRoaY4wrIogjXbfIsWtoorC26A1vJo-Q5cFhso9PnLI_ADK4KqpAC8h-DKIb-qQjlAw30_n25xkDlgAhp0aLi5xeglaUTmNG9uYlt3OylQDGDmnsQ2IyRXf3aBeeHEQtqtf9h_WZfsAfjc637bCaAq-7CG-7FXApSs0kX_z1acNf_2e52qMRW642kFlyaS8N6eDZ62Gz85Sn25EF1bovcfowqJob8dwf1fPHcxcp1KkR_S9udczwqjzELjFCfLdmqDDCDbAywsJ3iqxZTv-XP8_vC810oGC3M8gq58ax24TSYBmRsDc-kZesvKcRKk_22-gQmofx-CguGHNlYLd6ifti22crNfSawIjXgX_qwtTBnNNZtGVEDh40jRag_LfUdNMvXMqenwyBdGQENkbf9hx847RicAIPxxi-7y6bbQgGWj28oTnPSzxpTbSwJLbCi6cvzVohWt_w7paRxqSNyGqAs-sTfCymI2uOuxEjVqdt6MkjpD23-Ag-f3Ni4DGCPak3TgkHKQkqGt2Vw_4XSnD8iQi_mtIgdWMM5Xr_lpf0Ufgyp1VxzLOIWRv_bXH2zTyo2ok5cEFUHZOUHIsejnc-cMJFj4JMBX8eEVDSoJW20_muUJeW6DN_LfKnWMhFPQmfWedDIHBEeogt0XWK01m2ym5ggHv2HXgyvmcqjV2LAEMWRgvcjD5nA_yXPwPNYaZbomjSTTCoxR_CipRqi7J20ON7fFht2wkJ64oHQE27UUM9VJbHY0TLy9CJx9oQbl8mKcVO5fon16iP9iWVw9BW3Q-IQ3-4KNCzYHPXLcij7gy4LAfdx8Pjk-VaBjXn7uQVgyhazL-JPbpHjyvXEt5kp3cBD2P22QthW_2SidzNQvWXmdiL4BFqDptdM-IsIhX4ELUN4xd9HAfrL9z6187VZRvFavI2N18Q9df9tjDpvNSUmeCNq8anSCjKSrY-a6RhKoTuG48U6XVSWL2O6vbTBUM94zSLsdfvM7q0L4uXBlTssJh1aeuWaYWnmcJDVrfpbCTjz9YEqveVxTvSE';

export const app = firebase.initializeApp(firebaseConfig);
export const db = app.firestore();
