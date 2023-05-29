// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {initializeFirestore} from 'firebase/firestore'
import { getFirestore  } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyAV6TIGaLM3m85pmmxx7QJ7awv-ZKA9HBI",
  authDomain: "zwigato-9b391.firebaseapp.com",
  projectId: "zwigato-9b391",
  storageBucket: "zwigato-9b391.appspot.com",
  messagingSenderId: "529796645033",
  appId: "1:529796645033:web:43af9e274fca803dc169b8",
  measurementId: "G-PDBC3FYL7Z"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const firestoreDB = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});
export const db = getFirestore(app);

// const analytics = getAnalytics(app);