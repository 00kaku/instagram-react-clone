import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
	//YOUR GOOGLE FIREBASE FIRESTORE CONFIG
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
