import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore }
from "firebase/firestore";

const firebaseConfig={

apiKey:"AIzaSyAO5MNMKuRmcsaYqoVYw5jm3fIVlc6oRP0",

authDomain:"quicknotescloud.firebaseapp.com",

projectId:"quicknotescloud",

storageBucket:"quicknotescloud.firebasestorage.app",

messagingSenderId:"407482211198",

appId:"1:407482211198:web:66b579facddbf2d1d4712f"

};

const app=
initializeApp(
firebaseConfig
);

export const auth=
getAuth(app);

export const db=
getFirestore(app);