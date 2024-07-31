// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzPNQnF-GPdwJhL5XHIyZlHPGlJKf0daI",
  authDomain: "pantry-app-f65fd.firebaseapp.com",
  projectId: "pantry-app-f65fd",
  storageBucket: "pantry-app-f65fd.appspot.com",
  messagingSenderId: "136789372431",
  appId: "1:136789372431:web:d2a41fc35c6f1167affd7a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

export { firestore };
