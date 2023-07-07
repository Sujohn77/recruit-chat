import firebaseApp from "firebase/app";
import "firebase/firestore";

const FIREBASE_CONFIG = {
  apiKey: "117BD5BC-857D-428B-97BE-A5EC7256E281",
  authDomain: "loop-messenger-firebase.firebaseapp.com",
  databaseURL: "https://loop-messenger-firebase.firebaseio.com",
  projectId: "loop-messenger-firebase",
  storageBucket: "loop-messenger-firebase.appspot.com",
  messagingSenderId: "4011845244",
  appId: "1:4011845244:web:cb0178855ef34a17eb8bf9",
};

let app: firebaseApp.app.App = firebaseApp.initializeApp(FIREBASE_CONFIG);
app.firestore().settings({ experimentalForceLongPolling: true });

export const reinitializeAppWithoutLongPolling = async () => {
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
};
