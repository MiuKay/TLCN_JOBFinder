import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOXF4eME1O72oetBse-JlJuWSms_1bugQ",
  authDomain: "veryfi-otp.firebaseapp.com",
  projectId: "veryfi-otp",
  storageBucket: "veryfi-otp.appspot.com",
  messagingSenderId: "567264722123",
  appId: "1:567264722123:web:66170b836dd0b4d8c7af4e",
  measurementId: "G-6EVRDQE56H",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
