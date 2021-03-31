import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

const fire = firebase.initializeApp({
  apiKey: "AIzaSyBZMP0WJ_dTfg-TTw0hrowhDCm9Iw2aHQc",
  authDomain: "printroom-11f4a.firebaseapp.com",
  projectId: "printroom-11f4a",
  storageBucket: "printroom-11f4a.appspot.com",
  messagingSenderId: "1079102889468",
  appId: "1:1079102889468:web:76fcf0a812176d90b5a679",
});


const st = fire.storage()   //in the cloud
const db = fire.firestore()
const au = fire.auth()
const fn = firebase.functions()

const getTimeStamp = firebase.firestore.FieldValue.serverTimestamp

// if (window.location.hostname === "localhost") {
    
//     db.useEmulator("localhost", 8088);

//     au.useEmulator('http://localhost:9099/');

//     fn.useEmulator("localhost", 5001);

// }

export { db, st, au, fn, getTimeStamp };
export default fire




