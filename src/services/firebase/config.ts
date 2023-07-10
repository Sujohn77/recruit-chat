import firebaseApp from "firebase/app";
import "firebase/firestore";

const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

let app: firebaseApp.app.App = firebaseApp.initializeApp(FIREBASE_CONFIG);
app.firestore().settings({ experimentalForceLongPolling: true });

export const reinitializeAppWithoutLongPolling = async () => {
  try {
    if (firebaseApp.app()) {
      firebaseApp
        .app()
        .delete()
        .then(() => {
          app = !firebaseApp.apps.length
            ? firebaseApp.initializeApp(FIREBASE_CONFIG)
            : firebaseApp.app();
          app.firestore().settings({
            experimentalForceLongPolling: false,
          });
        });
    } else {
      app = firebaseApp.initializeApp(FIREBASE_CONFIG);
      app.firestore().settings({
        experimentalForceLongPolling: false,
      });
    }

    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
};
