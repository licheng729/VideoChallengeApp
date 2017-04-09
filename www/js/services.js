app
.factory('Auth', function() {
                 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyBL4z_ZUYlZ-pLVvzrdbIRZmnY-mH-hIx0",
    authDomain: "video-challenge-eea37.firebaseapp.com",
    databaseURL: "https://video-challenge-eea37.firebaseio.com",
    storageBucket: "video-challenge-eea37.appspot.com",
    messagingSenderId: "743907782590"
  };
    var FbApp = firebase.initializeApp(config);
    return FbApp.auth();
})
.service('global', [function () {

}]);