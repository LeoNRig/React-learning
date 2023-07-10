import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAzYGs5OQPTIZgKztyxRC0rxuEtj6uh24s",
    authDomain: "instagram-teste-739f7.firebaseapp.com",
    projectId: "instagram-teste-739f7",
    storageBucket: "instagram-teste-739f7.appspot.com",
    messagingSenderId: "809788322203",
    appId: "1:809788322203:web:1eabdeaf7a2b93619fb13e",
    measurementId: "G-DCSDQKQJZR"
  });

  const db = firebase.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
  const functions = firebase.functions();

  export {db, auth, storage, functions};