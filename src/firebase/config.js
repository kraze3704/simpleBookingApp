import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAQtmOvBPurfZUULylTuYyg6TKyn8OO_-U",
    authDomain: "laundrybookingapp.firebaseapp.com",
    databaseURL: "https://laundrybookingapp.firebaseio.com",
    projectId: "laundrybookingapp",
    storageBucket: "laundrybookingapp.appspot.com",
    messagingSenderId: "354731960455"
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const settings = {
    timestampsInSnapshots: true,
}
firestore.settings(settings);

export const _Auth = firebase.auth();

export const db = firebase.firestore();


export function _googleLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/calendar');
    // request scope for calendar api

    console.log('google login');
    return firebase.auth().signInWithPopup(provider)
};