const firebaseConfig = {
    apiKey: "AIzaSyBXVn_VNPzVqcG4xQlhmM12E5EgkY5sT60",
    authDomain: "gym-claude-687b5.firebaseapp.com",
    projectId: "gym-claude-687b5",
    storageBucket: "gym-claude-687b5.appspot.com",
    messagingSenderId: "504115001424",
    appId: "1:504115001424:web:86b8a0044a44bd03743955",
    measurementId: "G-Q663J1MVKY"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();