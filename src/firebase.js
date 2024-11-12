// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUo3UDFtjzl71j3wLEsoMWUWlfHgFK4p0",
  authDomain: "groceryapp-61b38.firebaseapp.com",
  projectId: "groceryapp-61b38",
  storageBucket: "groceryapp-61b38.firebasestorage.app",
  messagingSenderId: "800747540114",
  appId: "1:800747540114:web:9b5aae4dc2a6f65c39604b",
  measurementId: "G-8K707HDXV2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
auth.appVerificationDisabledForTesting = true;

export { auth, provider };
