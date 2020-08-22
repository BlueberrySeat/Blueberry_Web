import firebase from 'firebase/app';

import 'firebase/database'

var firebaseConfig = {
    apiKey: "AIzaSyCbtJ3RZBRRZ96avBwNRuKSHnVxaHxGmoQ",
    authDomain: "seatticketing.firebaseapp.com",
    databaseURL: "https://seatticketing.firebaseio.com",
    projectId: "seatticketing",
    storageBucket: "seatticketing.appspot.com",
    messagingSenderId: "680395068789",
    appId: "1:680395068789:web:6e92e04ef455fd7f812f3c",
    measurementId: "G-2YZLLFEMQZ"
};

firebase.initializeApp(firebaseConfig);