import firebase from 'firebase';
require('firebase/firestore')

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