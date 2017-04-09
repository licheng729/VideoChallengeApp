
 
app
.controller('LoginCtrl', function($scope, $state, $cordovaOauth, Auth, $ionicPopup, $ionicLoading) {

$scope.formdata = {};


  $scope.loginWithFacebook = function() {
    $cordovaOauth.facebook("226177047787207", ["email"]).then(function(result) {

    var provider = firebase.auth.FacebookAuthProvider.credential(result.access_token);

    Auth.signInWithCredential(provider).then(function(success) {
      console.log("Firebase success: " + JSON.stringify(success));
      window.localStorage.setItem("uid", success.uid);
      window.localStorage.setItem("email", success.email);
       window.plugins.spinnerDialog.show(null, 'Processing please wait...', true);
       firebase.database().ref('/users/'+success.uid).once('value').then(function(snapshot) {
          var user = snapshot.val();
          if(typeof user == "undefined" || user == null){
              user = {
                challenge_count: 0,
                country: "",
                email: success.email,
                fav_count: 0,
                name: "",
                phone: "",
                profile_pic: "",
                video_count: 0,
                profile_bck:""
              }

              firebase.database().ref('/users/'+success.uid).set(user).then(function(snapshot) {
                 window.plugins.spinnerDialog.hide();
                $state.go("main.all_cat_challenge");
       }).catch(function(err){

       });
          }else{
              window.plugins.spinnerDialog.hide();
            $state.go("main.all_cat_challenge");
          }
       }).catch(function(err){
          window.plugins.spinnerDialog.hide();
        console.log(err);
       });
      
    }) .catch(function(error) {
      console.log("Firebase failure: " + JSON.stringify(error));

      if(error.code == "auth/account-exists-with-different-credential"){

          $ionicPopup.alert({
        title: "Error",
        template: "An account already exists with the same email address but different sign in method"
         }).then(function (result) {
       });
      }
    });

        }, function(error) {
            console.log("ERROR: " + error);
        });
  }

     

  $scope.loginWithGoogle = function () {
  window.plugins.googleplus.login(
    {
      'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
      'webClientId': '743907782590-dbkqidl2gk3dq6o7p9sdgint9an7n573.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
    },
    function (obj) {
      console.log(JSON.stringify(obj)); // do something useful instead of alerting
      var credential = firebase.auth.GoogleAuthProvider.credential(obj.idToken);

    Auth.signInWithCredential(credential).then(function(success) {
      console.log("Firebase success: " + JSON.stringify(success));
      window.localStorage.setItem("uid", success.uid);
      window.localStorage.setItem("email", success.email);
      window.localStorage.setItem("prof_pic", success.photoURL);
      window.plugins.spinnerDialog.show(null, 'Processing please wait...', true);
         firebase.database().ref('/users/'+success.uid).once('value').then(function(snapshot) {
          var user = snapshot.val();
          if(typeof user == "undefined" || user == null){
              user = {
                challenge_count: 0,
                country: "cntry",
                email: success.email,
                fav_count: 0,
                name: "",
                phone: "",
                profile_pic: "",
                video_count: 0,
                profile_bck:""
              }

              firebase.database().ref('/users/'+success.uid).set(user).then(function(snapshot) {
              window.plugins.spinnerDialog.hide();
                $state.go("main.all_cat_challenge");
       }).catch(function(err){
        console.log(err);
       });
          }else{
            window.plugins.spinnerDialog.hide();
            $state.go("main.all_cat_challenge");
          }
       }).catch(function(err){
        window.plugins.spinnerDialog.hide();
        console.log(err);
       });
    }).catch(function(error) {
      console.log("Firebase failure: " + JSON.stringify(error));
           if(error.code == "auth/account-exists-with-different-credential"){

          $ionicPopup.alert({
        title: "Error",
        template: "An account already exists with the same email address but different sign in method"
         }).then(function (result) {
       });
      }
    });
    },
    function (msg) {
      alert('error: ' + msg);
    }
);
  };

  $scope.loginWithTwitter = function () {

    $cordovaOauth.twitter("mcGbIvpM7AsJGy9d0FwqyWdKo", "B0thrghn2XVcvk9b13U6we4KDZ9tAqvEv7jWl0pwYFTjehPJhO").then(function(result) {
    console.log(JSON.stringify(result));
    var twiterRes = JSON.stringify(result)
    var credential = firebase.auth.TwitterAuthProvider.credential(result.oauth_token, result.oauth_token_secret);

    Auth.signInWithCredential(credential).then(function(success) {
      console.log("Firebase success: " + JSON.stringify(success));
      window.localStorage.setItem("uid", success.uid);
         window.plugins.spinnerDialog.show(null, 'Processing please wait...', true);
           firebase.database().ref('/users/'+success.uid).once('value').then(function(snapshot) {
          var user = snapshot.val();
          if(typeof user == "undefined" || user == null){
              user = {
                challenge_count: 0,
                country: "",
                email: "",
                fav_count: 0,
                name: "",
                phone: "",
                profile_pic: "",
                video_count: 0,
                profile_bck:""
              }

              firebase.database().ref('/users/'+success.uid).set(user).then(function(snapshot) {
               window.plugins.spinnerDialog.hide();
                $state.go("main.all_cat_challenge");
       }).catch(function(err){
         window.plugins.spinnerDialog.hide();
        console.log(err);
       });
          }else{
             window.plugins.spinnerDialog.hide();
            $state.go("main.all_cat_challenge");
          }
       }).catch(function(err){
         window.plugins.spinnerDialog.hide();
         console.log(err);
       });
    }).catch(function(error) {
      console.log("Firebase failure: " + JSON.stringify(error));
      
    });
    }, function(error) {
            console.log(JSON.stringify(error));
  });
};

  $scope.loginWithEmail = function(){
         $ionicLoading.show({
              content: 'Processing please wait',
              animation: 'fade-in',
              showBackdrop: true,
              showDelay: 0
          });

     Auth.signInWithEmailAndPassword($scope.formdata.email, $scope.formdata.password).then(function(success){
      $ionicLoading.hide();
        console.log("Firebase success: " + JSON.stringify(success));
        window.localStorage.setItem("uid", success.uid);
      window.localStorage.setItem("email", success.email);
        $state.go("main.all_cat_challenge");
     }).catch(function(error) {
      $ionicLoading.hide();

      if(error.code =="auth/wrong-password"){

        $ionicPopup.alert({
        title: "Error",
        template: "Incorrect Emai/Password"
         }).then(function (result) {
       });
      }else{

           $ionicPopup.alert({
           title: "Error",
           template: error.message
        }).then(function (result) {

  });
}

});
    }

})
.controller('ResetCtrl', function($scope, Auth, $ionicPopup, $ionicLoading, $state) {
  $scope.formdata = {};


      $scope.getResetLink = function(){
              $ionicLoading.show({
              content: 'Processing please wait',
              animation: 'fade-in',
              showBackdrop: true,
              showDelay: 0
          });
        Auth.sendPasswordResetEmail($scope.formdata.email).then(function() {
  // Email sent.
   $ionicLoading.hide();
             $ionicPopup.alert({
             title: "success",
             template: "Email Sent"
             })
       .then(function (result) {

   });
}, function(error) {
  console.log(error);
  // An error happened.
  $ionicLoading.hide();
             $ionicPopup.alert({
             title: "Error",
             template: error.message
             })
       .then(function (result) {

   });
});
      }

})
.controller('RegistrationCtrl', function($scope, Auth, $ionicPopup, $ionicLoading, $state) {
  $scope.formdata = {};

  $scope.registerUser = function(){
      $ionicLoading.show({
              content: 'Processing please wait',
              animation: 'fade-in',
              showBackdrop: true,
              showDelay: 0
          });
    Auth.createUserWithEmailAndPassword($scope.formdata.email, $scope.formdata.password).then(function(success){
      
       console.log("Firebase success: " + JSON.stringify(success));
       window.localStorage.setItem("uid", success.uid);
      window.localStorage.setItem("email", success.email);
               var  user = {
                challenge_count: 0,
                country: "",
                email: success.email,
                fav_count: 0,
                name: "",
                phone: "",
                profile_pic: "",
                video_count: 0,
                profile_bck:""
              }

              firebase.database().ref('/users/'+success.uid).set(user).then(function(snapshot) {
                $ionicLoading.hide();
                $state.go("main.all_cat_challenge");
       }).catch(function(err){
        $ionicLoading.hide();
       });
    })
    .catch(function(error) {

      console.log(error);
  // Handle Errors here.
  $ionicLoading.hide();

             $ionicPopup.alert({
             title: "Error",
             template: error.message
             })
       .then(function (result) {

   });
});
  }
})
.controller('HomeCtrl', function($scope, $ionicNavBarDelegate, $rootScope) {
  $ionicNavBarDelegate.showBackButton(false);

  $rootScope.name = window.localStorage.getItem('name');
  var userId = window.localStorage.getItem("uid");
   firebase.database().ref('/users/'+userId).once('value').then(function(snapshot) {
    var snapshotVal = snapshot.val();
    $rootScope.challenges_count = snapshotVal.challenge_count;
    $rootScope.all_video_count = snapshotVal.video_count;
    $rootScope.name = snapshotVal.name;
    $rootScope.all_fav_count = snapshotVal.fav_count;
    if(snapshotVal.profile_pic == ""){
      $rootScope.profile_pic = "http://videochallengeapi.sandboxserver.co.za/profile_pictures/default_pic.png";
    }else{
      $rootScope.profile_pic = snapshotVal.profile_pic;
    }

    if(snapshotVal.profile_bck == ""){
       $rootScope.profile_pic_bck  = "img/profile_background.png";
    }else{
       $rootScope.profile_pic_bck = snapshotVal.profile_bck;
    }
 
   }).catch(function(err){
    console.log(err);
   });

     $scope.theme = 'ionic-sidemenu-stable';
  $scope.tree =
    [{
      id: 1,
      level: 0,
      name: 'Profile',
      icon: "",
      state: 'profile',
    }, {
      id: 2,
      name: "Filter",
      icon: "",
      level: 0,
      state: 'filter',
    },{
      id: 3,
      level: 0,
      name: 'Favorites',
      icon: "",
      items: [{
        id: 30,
        level: 1,
        name: 'Challenges',
        icon: 'ion-chevron-right',
        state: 'favoritechallenges',
      },
      {
        id: 30,
        level: 1,
        name: 'Videos',
        icon: 'ion-chevron-right',
        state: 'favoritevideos',
      }]
    }];
})
.controller('AllCatChalCtrl', function($ionicNavBarDelegate, $scope, $window, $state, $ionicHistory, $rootScope, $cordovaCapture, $cordovaCamera, $ionicLoading, $cordovaSocialSharing, $cordovaToast, global) {
 $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
$scope.dev_width = $window.innerWidth;
$scope.dev_height = ($window.innerHeight / 3) + 10;
$scope.data = {
  categories:[]
};
var startTime = 0;
var startTime2 = 0;
var startTime3 = 0;

    $scope.video_url = "";
    $scope.video_poster = "";
    $scope.cat_length = "";
    $scope.challenge_name = "";
    var userId = window.localStorage.getItem("uid");
    var isfav = false;
     $ionicNavBarDelegate.showBackButton(false);
     var video, video2, video3;

     $scope.refresh = function(){
      $scope.loadAllChallenge();
     }

     $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
   $scope.loadAllChallenge();
});



  $scope.loadAllChallenge = function(){
    $rootScope.challengerScore = 0;
    $rootScope.challengerVideos = 0;
         $ionicLoading.show({
              content: 'Processing please wait',
              animation: 'fade-in',
              showBackdrop: true,
              showDelay: 0
          });
    firebase.database().ref('/favorite_challenges/').once('value').then(function(snapshot1) {
    
    firebase.database().ref('/categories/').once('value').then(function(snapshot2) {
   console.log(snapshot2.child("Break Dance").val());
      global.dropDownChal = [];
      global.dropDownCat = [];
      var currentChal = [];
      var currentCat = [];
    snapshot2.forEach(function(childSnapshot) {
       console.log(childSnapshot.key);
        global.dropDownCat.push(childSnapshot.key);
        currentCat.push(childSnapshot.key);
  });

    for (var i = 0; i < currentCat.length; i++) {
       snapshot2.child(currentCat[i]).forEach(function(childSnapshot) {
       console.log(childSnapshot.key);
        global.dropDownChal.push({cat_name: currentCat[i], chal_name: childSnapshot.key});
        currentChal.push({cat_name: currentCat[i], chal_name: childSnapshot.key});
  });
    }
   
    for (var cat = 0; cat < currentCat.length; cat++) {

            var json = snapshot2.child(currentCat[cat]).val();
    var arr = Object.keys(json).map(function(k) { return json[k] });
   console.log(arr);
    $scope.data.categories = [];
    for (i = 0; i < arr.length; i++) { 
    var arr2 = Object.keys(arr[i]).map(function(k) { return arr[i][k] });
    var upvoteCount = 0;
    var commentCount = 0;
    var favCount = 0;
    var no_of_views = 0;
    
      for (var i2 = 0; i2 < arr2.length; i2++) {
       commentCount += arr2[i2].comments_count;
       upvoteCount += arr2[i2].up_vote;
       favCount += arr2[i2].favorite_count;
       no_of_views += arr2[i2].no_of_views;

      if(arr2[i2].challenger_id == userId){
       $rootScope.challengerScore =  $rootScope.challengerScore + (commentCount + upvoteCount + favCount + no_of_views);
       $rootScope.challengerVideos++;
     }
  }

      if(i == 0){
        arr2[0].is_autoplay = 'autoplay'
      }else if(i == 1){
        arr2[0].is_autoplay = 'autoplay6'
      }else if(i == 2){
        arr2[0].is_autoplay = 'autoplay7'
      }else{
        arr2[0].is_autoplay = 'auto-play'
      }



     var challengeScore = commentCount + upvoteCount + favCount + no_of_views;

     
    console.log(arr2[0].challenge_name);      
      if (typeof arr2[0].challenge_name != "undefined" && arr2[0].challenge_name != "" && arr2[0].challenge_name != null) {
      var fav = snapshot1.child(arr2[0].challenge_name).val();
      if(typeof fav != "undefined" && fav !== null){

         var favArr = Object.keys(fav).map(function(k) { return fav[k] });

      for (var i3 = 0; i3 < favArr.length; i3++) {
        
        if(favArr[i3].user_id == userId){
          isfav = true;
          break;
        }
      }

      }
     
    }
      
     arr2.push(challengeScore);
     arr2.push(commentCount);
     arr2.push(isfav);
     upvoteCount = 0;
     commentCount = 0;
     favCount = 0;
     no_of_views = 0;
     isfav = false;
    // console.log(arr2);
    $scope.data.categories.push(arr2);

   }
  }


$scope.$apply();
$ionicLoading.hide();
console.log($scope.data.categories);
 $scope.$broadcast('scroll.refreshComplete');

video = document.querySelector('.autoplay');
video2 = document.querySelector('.autoplay6');
video3 = document.querySelector('.autoplay7');

   video.onended = function(e) {
    console.log("ended");
     video.currentTime = startTime;
    video.play();
}


var i = setInterval(function() {
  if(video.readyState > 0) {
    var minutes = parseInt(video.duration / 60, 10);
    var seconds = video.duration % 60;
    startTime = seconds - 3;
    video.currentTime = startTime;
    console.log(video.duration);
    video.play();
    clearInterval(i);
  }
}, 2000);

if($scope.data.categories.length > 1){
   video2.onended = function(e) {
    console.log("ended");
     video2.currentTime = startTime2;
    video2.play();
}


var i2 = setInterval(function() {
  if(video2.readyState > 0) {
    var minutes = parseInt(video2.duration / 60, 10);
    var seconds = video2.duration % 60;
    startTime2 = seconds - 3;
    video2.currentTime = startTime2;
    video2.play();
    clearInterval(i2);
  }
}, 2000);
}

if($scope.data.categories.length > 2){
   video3.onended = function(e) {
    console.log("ended");
     video3.currentTime = startTime3;
    video3.play();
}


var i3 = setInterval(function() {
  if(video3.readyState > 0) {
    var minutes = parseInt(video3.duration / 60, 10);
    var seconds = video3.duration % 60;
    startTime3 = seconds - 3;
    video3.currentTime = startTime3;
    video3.play();
    clearInterval(i3);
  }
}, 2000);
}

}).catch(function(err){
  console.log(err);
  $ionicLoading.hide();
   $scope.$broadcast('scroll.refreshComplete');
});

    }).catch(function(err){
       console.log(err);
  $ionicLoading.hide();
   $scope.$broadcast('scroll.refreshComplete');
    });
  }


$scope.goToCatChal = function(currentChal, currentCat){
  $rootScope.currentChal = currentChal;
  $rootScope.currentCat = currentCat;
  console.log(currentChal);
	$state.go("cat_challenge");
}

$scope.uploadVideo = function(){
  console.log("upload");

    var options = {
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: Camera.MediaType.VIDEO
    };

      $cordovaCamera.getPicture(options).then(function(imageURI) {
        console.log(imageURI);
          $rootScope.videoPath = imageURI;
          $state.go("uploadvideo");
    }, function(err) {
      // error
    });
}

$scope.recordVideo = function(){
  var options = { limit: 1, duration: 60 };
  $cordovaCapture.captureVideo(options).then(function(videoData) {
  console.log(videoData[0].fullPath+","+videoData[0].localURL);
        $rootScope.videoPath = videoData[0].fullPath;
        $state.go("uploadvideo");
  }, function(err){

  });

}

$scope.shareVideChallenges = function(a,b){
   $cordovaSocialSharing
    .share(a, "", "", b) // Share via native share sheet
    .then(function(result) {
      $cordovaToast
    .show('Video successfully shared', 'long', 'bottom')
    .then(function(success) {
      // success
    }, function (error) {
      // error
    });
    }, function(err) {
      // An error occured. Show a message to the user
    });
}

  function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   
     return dateTime;
} 

$scope.addFav = function($event, a){
  var date_time = getDateTime();
  var fav = {
    date_added: date_time,
    user_id: userId
  }
console.log($event.target.src);
var src = $event.target.src.split("/");
  if(src[src.length - 1] == 'ic_favoriteRed.png'){

    firebase.database().ref("favorite_challenges/"+a+"/"+userId).set(null).then(function() {
             console.log('Synchronization succeeded');
            $event.target.src = 'img/ic_favorite.png';

  })
  .catch(function(error) {
    console.log('Synchronization failed: '+ error);
   
  });

  }else{

    firebase.database().ref("favorite_challenges/"+a+"/"+userId).set(fav).then(function() {
             console.log('Synchronization succeeded');
            $event.target.src = 'img/ic_favoriteRed.png';

  })
  .catch(function(error) {
    console.log('Synchronization failed: '+ error);
   
  });
  }
}


})
.controller('FilterCtrl', function($ionicNavBarDelegate, $scope, $window, $state, $ionicHistory, $rootScope, $cordovaCapture, $cordovaCamera, $ionicLoading, $cordovaSocialSharing, $cordovaToast, global, $ionicModal, $ionicPlatform) {


     $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
  viewData.enableBack = true;
});
$scope.dev_width = $window.innerWidth;
$scope.dev_height = ($window.innerHeight / 3) + 10;
$scope.data = {
  categories:[]
};
var startTime3;
    $scope.video_url = "";
    $scope.video_poster = "";
    $scope.cat_length = "";
    $scope.challenge_name = "";
    $scope.selCat ="";
    $scope.dropDownCat = global.dropDownCat;
    var userId = window.localStorage.getItem("uid");
    var isfav = false;
     $ionicNavBarDelegate.showBackButton(false);
     var video ;

     $scope.refresh = function(){
      $scope.loadFilteredChallenge();
     }

  $ionicModal.fromTemplateUrl('templates/filter_modal.html', {
               scope: $scope,
               animation: 'slide-in-up'
               }).then(function(modal) {
                 $scope.modal = modal;
                 $scope.modal.show();
              });

  $scope.loadFilteredChallenge = function(){
     $scope.modal.hide();
         $ionicLoading.show({
              content: 'Processing please wait',
              animation: 'fade-in',
              showBackdrop: true,
              showDelay: 0
          });
    firebase.database().ref('/favorite_challenges/').once('value').then(function(snapshot1) {
    
    firebase.database().ref('/categories/'+$scope.selCat).once('value').then(function(snapshot2) {
    //console.log(snapshot2.child("Break Dance").val());
     // global.dropDownChal = [];
     // global.dropDownCat = [];
      var currentChal = [];
      var currentCat = [];
    snapshot2.forEach(function(childSnapshot) {
        console.log(childSnapshot.key);
      //  global.dropDownCat.push(childSnapshot.key);
        currentCat.push(childSnapshot.key);
  });

    for (var i = 0; i < currentCat.length; i++) {
       snapshot2.child(currentCat[i]).forEach(function(childSnapshot) {
        console.log(childSnapshot.key);
       // global.dropDownChal.push({cat_name: currentCat[i], chal_name: childSnapshot.key});
        currentChal.push({cat_name: currentCat[i], chal_name: childSnapshot.key});
  });
    }
   
    for (var cat = 0; cat < currentCat.length; cat++) {

            var json = snapshot2.child(currentCat[cat]).val();
    var arr = Object.keys(json).map(function(k) { return json[k] });
    console.log(arr);
    $scope.data.categories = [];
    for (i = 0; i < arr.length; i++) { 
    var arr2 = Object.keys(arr[i]).map(function(k) { return arr[i][k] });
    var upvoteCount = 0;
    var commentCount = 0;
    var favCount = 0;
    var no_of_views = 0;
    
      for (var i2 = 0; i2 < arr2.length; i2++) {
       commentCount += arr2[i2].comments_count;
       upvoteCount += arr2[i2].up_vote;
       favCount += arr2[i2].favorite_count;
       no_of_views += arr2[i2].no_of_views;
     }

        if(i == 0){
        arr2[0].is_autoplay = 'autoplay'
      }else{
        arr2[0].is_autoplay = 'auto-play'
      }
     var challengeScore = commentCount + upvoteCount + favCount + no_of_views;
     
    console.log(arr2[0].challenge_name);      
      if (typeof arr2[0].challenge_name != "undefined" && arr2[0].challenge_name != "" && arr2[0].challenge_name != null) {
      var fav = snapshot1.child(arr2[0].challenge_name).val();
      if(typeof fav != "undefined" && fav !== null){

         var favArr = Object.keys(fav).map(function(k) { return fav[k] });

      for (var i3 = 0; i3 < favArr.length; i3++) {
        
        if(favArr[i3].user_id == userId){
          isfav = true;
          break;
        }
      }

      }
     
    }
      
     arr2.push(challengeScore);
     arr2.push(commentCount);
     arr2.push(isfav);
     upvoteCount = 0;
     commentCount = 0;
     favCount = 0;
     no_of_views = 0;
     isfav = false;
     console.log(arr2);
    $scope.data.categories.push(arr2);

   }
    }


$scope.$apply();
$ionicLoading.hide();
 $scope.$broadcast('scroll.refreshComplete');

video = document.querySelector('.autoplay');

   video.onended = function(e) {
    console.log("ended");
     video.currentTime = startTime3;
    video.play();
}


var i = setInterval(function() {
  if(video.readyState > 0) {
       var minutes = parseInt(video.duration / 60, 10);
    var seconds = video.duration % 60;
    startTime3 = seconds - 3;
    video.currentTime = startTime3;
    console.log(video.duration);
    video.play();
    clearInterval(i);
  }
}, 2000);

}).catch(function(err){
  console.log(err);
  $ionicLoading.hide();
   $scope.$broadcast('scroll.refreshComplete');
});

    }).catch(function(err){
       console.log(err);
  $ionicLoading.hide();
   $scope.$broadcast('scroll.refreshComplete');
    });
  }


$scope.goToCatChal = function(currentChal, currentCat){
  $rootScope.currentChal = currentChal;
  $rootScope.currentCat = currentCat;
  console.log(currentChal);
  $state.go("cat_challenge");
}

$scope.uploadVideo = function(){
  console.log("upload");

    var options = {
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: Camera.MediaType.VIDEO
    };

      $cordovaCamera.getPicture(options).then(function(imageURI) {
        console.log(imageURI);
          $rootScope.videoPath = imageURI;
          $state.go("uploadvideo");
    }, function(err) {
      // error
    });
}

$scope.recordVideo = function(){
  var options = { limit: 1, duration: 60 };
  $cordovaCapture.captureVideo(options).then(function(videoData) {
  console.log(videoData[0].fullPath+","+videoData[0].localURL);
        $rootScope.videoPath = videoData[0].fullPath;
        $state.go("uploadvideo");
  }, function(err){

  });

}

$scope.shareVideChallenges = function(a,b){
   $cordovaSocialSharing
    .share(a, "", "", b) // Share via native share sheet
    .then(function(result) {
      $cordovaToast
    .show('Video successfully shared', 'long', 'bottom')
    .then(function(success) {
      // success
    }, function (error) {
      // error
    });
    }, function(err) {
      // An error occured. Show a message to the user
    });
}

  function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   
     return dateTime;
} 

$scope.addFav = function($event, a){
  var date_time = getDateTime();
  var fav = {
    date_added: date_time,
    user_id: userId
  }
console.log($event.target.src);
var src = $event.target.src.split("/");
  if(src[src.length - 1] == 'ic_favoriteRed.png'){

    firebase.database().ref("favorite_challenges/"+a+"/"+userId).set(null).then(function() {
             console.log('Synchronization succeeded');
            $event.target.src = 'img/ic_favorite.png';

  })
  .catch(function(error) {
    console.log('Synchronization failed: '+ error);
   
  });

  }else{

    firebase.database().ref("favorite_challenges/"+a+"/"+userId).set(fav).then(function() {
             console.log('Synchronization succeeded');
            $event.target.src = 'img/ic_favoriteRed.png';

  })
  .catch(function(error) {
    console.log('Synchronization failed: '+ error);
   
  });
  }
}

var goBack = function() {
    $state.go("main.all_cat_challenge");
};

$ionicPlatform.registerBackButtonAction(function (event) {
 if ($state.current.name=="main.all_cat_challenge") {
    ionic.Platform.exitApp();
  }else if($state.current.name=="challenge"){
    $state.go("cat_challenge");
  } else{
    goBack();
  }
}, 100);

$rootScope.$ionicGoBack = function() {
    goBack();
};


})
.controller('FavoritesChalCtrl', function($ionicNavBarDelegate, $scope, $window, $state, $ionicHistory, $rootScope, $cordovaCapture, $cordovaCamera, $ionicPlatform, $ionicLoading, $cordovaSocialSharing, $cordovaToast) {
 $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
$scope.dev_width = $window.innerWidth;
$scope.dev_height = ($window.innerHeight / 3) + 10;
$scope.data = {
  categories:[]
};
var startTime4 = 0;
    $scope.video_url = "";
    $scope.video_poster = "";
    $scope.cat_length = "";
    $scope.challenge_name = "";
    var userId = window.localStorage.getItem("uid");
    var isfav = false;
     $ionicNavBarDelegate.showBackButton(false);
     var video ;

     $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
  viewData.enableBack = true;
});



  $scope.loadAllChallenge = function(){
       window.plugins.spinnerDialog.show(null, 'Loading Favorite Challenges...', true);
    firebase.database().ref('/favorite_challenges/').once('value').then(function(snapshot1) {
    
    firebase.database().ref('/categories/').once('value').then(function(snapshot2) {
    console.log(snapshot2.child("Break Dance").val());
    var json = snapshot2.child("Break Dance").val();
    var arr = Object.keys(json).map(function(k) { return json[k] });
    console.log(arr);

    for (i = 0; i < arr.length; i++) { 
    var arr2 = Object.keys(arr[i]).map(function(k) { return arr[i][k] });
    var upvoteCount = 0;
    var commentCount = 0;
    var favCount = 0;
    var no_of_views = 0;
    
      for (var i2 = 0; i2 < arr2.length; i2++) {
       commentCount += arr2[i2].comments_count;
       upvoteCount += arr2[i2].up_vote;
       favCount += arr2[i2].favorite_count;
       no_of_views += arr2[i2].no_of_views;
     }

        if(i == 0){
        arr2[0].is_autoplay = 'autoplay'
      }else{
        arr2[0].is_autoplay = 'auto-play'
      }
     var challengeScore = commentCount + upvoteCount + favCount + no_of_views;
     
    console.log(arr2[0].challenge_name);      
      if (typeof arr2[0].challenge_name != "undefined" && arr2[0].challenge_name != "" && arr2[0].challenge_name != null) {
      var fav = snapshot1.child(arr2[0].challenge_name).val();
      if(typeof fav != "undefined" && fav !== null){

         var favArr = Object.keys(fav).map(function(k) { return fav[k] });

      for (var i3 = 0; i3 < favArr.length; i3++) {
        
        if(favArr[i3].user_id == userId){
          isfav = true;
             arr2.push(challengeScore);
     arr2.push(commentCount);
     arr2.push(isfav);
     upvoteCount = 0;
     commentCount = 0;
     favCount = 0;
     no_of_views = 0;
     isfav = false;
     console.log(arr2);
    $scope.data.categories.push(arr2);
          break;
        }
      }

      }
     
    }
      
   }


$scope.$apply();
window.plugins.spinnerDialog.hide();

video = document.querySelector('.autoplay');

   video.onended = function(e) {
    console.log("ended");
     video.currentTime = startTime4;
    video.play();
}


var i = setInterval(function() {
  if(video.readyState > 0) {
        var minutes = parseInt(video.duration / 60, 10);
    var seconds = video.duration % 60;
    startTime4 = seconds - 3;
    video.currentTime = startTime4;
    console.log(video.duration);
    video.play();
    clearInterval(i);
  }
}, 2000);

}).catch(function(err){
  console.log(err);
  $ionicLoading.hide();
});

    }).catch(function(err){
       console.log(err);
  $ionicLoading.hide();
    });
  }


$scope.goToCatChal = function(currentChal, currentCat){
  $rootScope.currentChal = currentChal;
  $rootScope.currentCat = currentCat;
  console.log(currentChal);
  $state.go("cat_challenge");
}

$scope.uploadVideo = function(){
  console.log("upload");

    var options = {
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: Camera.MediaType.VIDEO
    };

      $cordovaCamera.getPicture(options).then(function(imageURI) {
        console.log(imageURI);
          $rootScope.videoPath = imageURI;
          $state.go("uploadvideo");
    }, function(err) {
      // error
    });
}

$scope.recordVideo = function(){
  var options = { limit: 1, duration: 60 };
  $cordovaCapture.captureVideo(options).then(function(videoData) {
  console.log(videoData[0].fullPath+","+videoData[0].localURL);
        $rootScope.videoPath = videoData[0].fullPath;
        $state.go("uploadvideo");
  }, function(err){

  });

}

$scope.shareVideChallenges = function(a,b){
   $cordovaSocialSharing
    .share(a, "", "", b) // Share via native share sheet
    .then(function(result) {
      $cordovaToast
    .show('Video successfully shared', 'long', 'bottom')
    .then(function(success) {
      // success
    }, function (error) {
      // error
    });
    }, function(err) {
      // An error occured. Show a message to the user
    });
}

  function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   
     return dateTime;
} 

$scope.addFav = function($event, a){
  var date_time = getDateTime();
  var fav = {
    date_added: date_time,
    user_id: userId
  }
console.log($event.target.src);
var src = $event.target.src.split("/");
  if(src[src.length - 1] == 'ic_favoriteRed.png'){

    firebase.database().ref("favorite_challenges/"+a+"/"+userId).set(null).then(function() {
             console.log('Synchronization succeeded');
            $event.target.src = 'img/ic_favorite.png';

  })
  .catch(function(error) {
    console.log('Synchronization failed: '+ error);
   
  });

  }else{

    firebase.database().ref("favorite_challenges/"+a+"/"+userId).set(fav).then(function() {
             console.log('Synchronization succeeded');
            $event.target.src = 'img/ic_favoriteRed.png';

  })
  .catch(function(error) {
    console.log('Synchronization failed: '+ error);
   
  });
  }
}

var goBack = function() {
    $state.go("main.all_cat_challenge");
};

$ionicPlatform.registerBackButtonAction(function (event) {
 if ($state.current.name=="main.all_cat_challenge") {
    ionic.Platform.exitApp();
  }else if($state.current.name=="challenge"){
    $state.go("cat_challenge");
  } else{
    goBack();
  }
}, 100);

$rootScope.$ionicGoBack = function() {
    goBack();
};


})
.controller('CatChallengeCtrl', function($scope,  $window, $state, $ionicLoading, $rootScope, $cordovaCapture, $cordovaCamera, $ionicPlatform, $cordovaSocialSharing, $cordovaToast) {

$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
  viewData.enableBack = true;
});
$scope.dev_width = $window.innerWidth;
$scope.dev_height = ($window.innerHeight / 3) + 10;
$scope.data = {
  challenge:[]
};
var video, video2, video3;
$scope.show_all = true;
$scope.show_fav = false;
$scope.allFav = [];
$scope.allVid = [];

var startTime2 = 0;
var startTime3 = 0;
var startTime4 = 0;

$scope.autoplay_val = false;
var userId = localStorage.getItem('uid');

     $scope.addAutoPlay = function(a,b){
      console.log(b);
     }

$scope.showFav = function(){
  $scope.show_all = false;
  $scope.show_fav = true;

loadFavVideos();
}

$scope.showAll = function(){
  $scope.show_all = true;
  $scope.show_fav = false;

loadAllVideos();
}

$scope.uploadVideo = function(){
  console.log("upload");

    var options = {
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: Camera.MediaType.VIDEO
    };

      $cordovaCamera.getPicture(options).then(function(imageURI) {
        console.log(imageURI);
          $rootScope.videoPath = imageURI;
          $state.go("uploadvideo");
    }, function(err) {
      // error
    });
}

$scope.recordVideo = function(){
  var options = { limit: 1, duration: 60 };
  $cordovaCapture.captureVideo(options).then(function(videoData) {
  console.log(videoData[0].fullPath+","+videoData[0].localURL);
        $rootScope.videoPath = videoData[0].fullPath;
        $state.go("uploadvideo");
  }, function(err){

  });

}

  function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   
     return dateTime;
}

$scope.addFav = function($event, a){
  var date_time = getDateTime();
  var fav = {
    date_added: date_time,
    user_id: userId
  }
console.log($event.target.src);
var src = $event.target.src.split("/");
  if(src[src.length - 1] == 'ic_favoriteRed.png'){

    firebase.database().ref("favorite_videos/"+$rootScope.currentChal+"/"+a+"/"+userId).set(null).then(function() {
             console.log('Synchronization succeeded');
            $event.target.src = 'img/ic_favorite.png';

      firebase.database().ref("/categories/Break Dance/"+$rootScope.currentChal+"/"+a+"/favorite_count").transaction(function(favorite_count) {

            favorite_count = favorite_count - 1;
           
            return favorite_count;

    });

        firebase.database().ref("/users/"+userId+"/fav_count").transaction(function(fav_count) {

            fav_count = fav_count - 1;
           
            return fav_count;

    });

          firebase.database().ref("/users/"+userId+"/favorite_videos/"+a).set(null).then(function() {

         }).catch(function(err){

         });

  })
  .catch(function(error) {
    console.log('Synchronization failed: '+ error);
   
  });

  }else{

    firebase.database().ref("favorite_videos/"+$rootScope.currentChal+"/"+a+"/"+userId).set(fav).then(function() {
             console.log('Synchronization succeeded');
            $event.target.src = 'img/ic_favoriteRed.png';


      firebase.database().ref("/categories/"+$rootScope.currentCat+"/"+$rootScope.currentChal+"/"+a+"/favorite_count").transaction(function(favorite_count) {

            favorite_count = favorite_count + 1;
           
            return favorite_count;

    });

        firebase.database().ref("/users/"+userId+"/fav_count").transaction(function(fav_count) {

            fav_count = fav_count + 1;
           
            return fav_count;

    });

         firebase.database().ref("/users/"+userId+"/favorite_videos/"+a).set({category_id: $rootScope.currentCat, challenge_id: $rootScope.currentChal, video_id: a}).then(function() {

         }).catch(function(err){
            console.log(err);
         });

  })
  .catch(function(error) {
    console.log('Synchronization failed: '+ error);
   
  });
  }
}

var video = document.querySelector('#video');

function loadAllVideos(){
       $ionicLoading.show({
              content: 'Processing please wait',
              animation: 'fade-in',
              showBackdrop: true,
              showDelay: 0
          });
      firebase.database().ref('/favorite_videos/'+$rootScope.currentChal).once('value').then(function(snapshot1) {
  console.log(snapshot1.val());
  firebase.database().ref("/categories/"+$rootScope.currentCat+"/"+$rootScope.currentChal).once('value').then(function(snapshot) {
    console.log(snapshot.val());
       var json = snapshot.val();
    var arr = Object.keys(json).map(function(k) { return json[k] });
    console.log(arr);

      var upvoteCount = 0;
    var commentCount = 0;
    var favCount = 0;

      for (var i = 0; i < arr.length; i++) {
      commentCount = arr[i].comments_count;
      upvoteCount = arr[i].up_vote;
      favCount = arr[i].favorite_count;
      var videoScore = commentCount + upvoteCount + favCount;
      arr[i].video_score = videoScore;
      var is_fav = false;
     
     if (typeof arr[i].video_id != "undefined" && arr[i].video_id != null && arr[i].video_id != "") {
       var fav = snapshot1.child(arr[i].video_id).val();
       if(typeof fav != 'undefined' && fav != null){
        console.log(fav);
        var favArr = Object.keys(fav).map(function(k) { return fav[k] });
        var favArr2 = Object.keys(favArr).map(function(k) { return favArr[k] });
      for (var i3 = 0; i3 < favArr2.length; i3++) {
        console.log(favArr[i3]);
        if(favArr2[i3].user_id == userId){
          is_fav = true;
          break;
        }
      }
       }
     }
      

       arr[i].is_fav = is_fav;

     }
     arr.sort(function(a, b){return b.video_score - a.video_score});

     for (var i = 0; i < arr.length; i++) {
       if(i == 0){
        arr[i].is_autoplay = 'autoplay_2'
      }else if(i == 1){
        arr[i].is_autoplay = 'autoplay_8'
      }else if(i == 2){
        arr[i].is_autoplay = 'autoplay_9'
      }else{
        arr[i].is_autoplay = 'auto-play'
      }
     }
    
    $scope.data = {
      challenge: arr
    }
    $scope.$apply();
    $ionicLoading.hide();
    console.log($scope.data.challenge)
    video = document.querySelector('.autoplay_2');
    video2 = document.querySelector('.autoplay_8');
    video3 = document.querySelector('.autoplay_9');

   video.onended = function(e) {
    console.log("ended");
     video.currentTime = startTime2;
    video.play();
}


var i = setInterval(function() {
  if(video.readyState > 0) {
    var minutes = parseInt(video.duration / 60, 10);
    var seconds = video.duration % 60;
    startTime2 = seconds - 3;
    video.currentTime = startTime2;
    console.log(video.duration);
    video.play();
    clearInterval(i);
  }
}, 2000);

if($scope.data.challenge.length > 1){

      video2.onended = function(e) {
    console.log("ended");
     video2.currentTime = startTime3;
    video2.play();
}


var i2 = setInterval(function() {
  if(video2.readyState > 0) {
    var minutes = parseInt(video2.duration / 60, 10);
    var seconds = video2.duration % 60;
    startTime3 = seconds - 3;
    video2.currentTime = startTime3;
    video2.play();
    clearInterval(i2);
  }
}, 2000);
}

if($scope.data.challenge.length > 2){

      video3.onended = function(e) {
    console.log("ended");
     video3.currentTime = startTime4;
    video3.play();
}


var i3 = setInterval(function() {
  if(video2.readyState > 0) {
    var minutes = parseInt(video3.duration / 60, 10);
    var seconds = video3.duration % 60;
    startTime4 = seconds - 3;
    video3.currentTime = startTime4;
    video3.play();
    clearInterval(i3);
  }
}, 2000);
}

}).catch(function(err){
  console.log(err);
  $ionicLoading.hide();
});

      }).catch(function(err){
        console.log(err);
      });
}

function loadFavVideos(){
   $scope.data = {
      challenge: []
    }
       $ionicLoading.show({
              content: 'Processing please wait',
              animation: 'fade-in',
              showBackdrop: true,
              showDelay: 0
          });
      firebase.database().ref('/favorite_videos/'+$rootScope.currentChal).once('value').then(function(snapshot1) {
  console.log(snapshot1.val());
  firebase.database().ref("/categories/"+$rootScope.currentCat+"/"+$rootScope.currentChal).once('value').then(function(snapshot) {
    console.log(snapshot.val());
       var json = snapshot.val();
    var arr = Object.keys(json).map(function(k) { return json[k] });
    console.log(arr);

      var upvoteCount = 0;
    var commentCount = 0;
    var favCount = 0;

      for (var i = 0; i < arr.length; i++) {
      commentCount = arr[i].comments_count;
      upvoteCount = arr[i].up_vote;
      favCount = arr[i].favorite_count;
      var videoScore = commentCount + upvoteCount + favCount;
      arr[i].video_score = videoScore;
      var is_fav = false;
     
     if (typeof arr[i].video_id != "undefined" && arr[i].video_id != null && arr[i].video_id != "") {
       var fav = snapshot1.child(arr[i].video_id).val();
       if(typeof fav != 'undefined' && fav != null){
        console.log(fav);
        var favArr = Object.keys(fav).map(function(k) { return fav[k] });
        var favArr2 = Object.keys(favArr).map(function(k) { return favArr[k] });
      for (var i3 = 0; i3 < favArr2.length; i3++) {
        console.log(favArr[i3]);
        if(favArr2[i3].user_id == userId){
          is_fav = true;
          break;
        }
      }
       }
     }
      

       arr[i].is_fav = is_fav;
       if(is_fav){
        $scope.allFav.push(arr[i]);
       }
     }
     $scope.allFav.sort(function(a, b){return b.video_score - a.video_score});

     for (var i = 0; i < $scope.allFav.length; i++) {
       if(i == 0){
        $scope.allFav[i].is_autoplay = 'autoplay_2'
      }else{
        $scope.allFav[i].is_autoplay = 'auto-play'
      }
     }
    
    $scope.data = {
      challenge: $scope.allFav
    }
    $scope.$apply();
    $ionicLoading.hide();
    console.log($scope.data.challenge)
    video = document.querySelector('.autoplay_2');

   video.onended = function(e) {
    console.log("ended");
     video.currentTime = video.duration - 50;
    video.play();
}


var i = setInterval(function() {
  if(video.readyState > 0) {
    video.currentTime = video.duration - 150;
    console.log(video.duration);
    video.play();
    clearInterval(i);
  }
}, 2000);

if($scope.data.challenge.length > 1){

    video.onended = function(e) {
    console.log("ended");
     video.currentTime = video.duration - 50;
    video.play();
}


var i = setInterval(function() {
  if(video.readyState > 0) {
    video.currentTime = video.duration - 150;
    console.log(video.duration);
    video.play();
    clearInterval(i);
  }
}, 2000);
}

}).catch(function(err){
  console.log(err);
  $ionicLoading.hide();
});

      }).catch(function(err){
        console.log(err);
      });
}


 $scope.$on('$ionicView.afterEnter', function (event, viewData) {

  loadAllVideos();
 
});

$scope.goToChal = function(videoId){
  $rootScope.currentVideoId = videoId;
	$state.go("challenge");
}


  $scope.shareVideo = function(a,b){
  console.log("test2");
   $cordovaSocialSharing
    .share(a, "", "", b) // Share via native share sheet
    .then(function(result) {
      $cordovaToast
    .show('Video successfully shared', 'long', 'bottom')
    .then(function(success) {
      // success
    }, function (error) {
      // error
    });
    }, function(err) {
      // An error occured. Show a message to the user
    });
}

        var goBack = function() {
    $state.go("main.all_cat_challenge");
};

$ionicPlatform.registerBackButtonAction(function (event) {
 if ($state.current.name=="main.all_cat_challenge") {
    ionic.Platform.exitApp();
  }else if($state.current.name=="challenge"){
    $state.go("cat_challenge");
  } else{
    goBack();
  }
}, 100);

$rootScope.$ionicGoBack = function() {
    goBack();
};

})
.controller('FavoritesVideoCtrl', function($scope,  $window, $state, $ionicLoading, $rootScope, $cordovaCapture, $cordovaCamera, $ionicPlatform, $cordovaSocialSharing, $cordovaToast) {

$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
  viewData.enableBack = true;
});
$scope.dev_width = $window.innerWidth;
$scope.dev_height = ($window.innerHeight / 3) + 10;
$scope.data = {
  favVids:[]
};
var video, video2, video3;
$scope.show_all = true;
$scope.show_fav = false;
$scope.allFav = [];
$scope.allVid = [];



var startTime, startTime2, startTime3 = 0;

$scope.autoplay_val = false;
var userId = localStorage.getItem('uid');


$scope.uploadVideo = function(){
  console.log("upload");

    var options = {
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: Camera.MediaType.VIDEO
    };

      $cordovaCamera.getPicture(options).then(function(imageURI) {
        console.log(imageURI);
          $rootScope.videoPath = imageURI;
          $state.go("uploadvideo");
    }, function(err) {
      // error
    });
}

$scope.recordVideo = function(){
  var options = { limit: 1, duration: 60 };
  $cordovaCapture.captureVideo(options).then(function(videoData) {
  console.log(videoData[0].fullPath+","+videoData[0].localURL);
        $rootScope.videoPath = videoData[0].fullPath;
        $state.go("uploadvideo");
  }, function(err){

  });

}

  function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   
     return dateTime;
}

$scope.addFav = function($event, a, b, c){
  var date_time = getDateTime();
  var fav = {
    date_added: date_time,
    user_id: userId
  }
console.log($event.target.src);
var src = $event.target.src.split("/");
  if(src[src.length - 1] == 'ic_favoriteRed.png'){

    firebase.database().ref("favorite_videos/"+c+"/"+a+"/"+userId).set(null).then(function() {
             console.log('Synchronization succeeded');
            $event.target.src = 'img/ic_favorite.png';

      firebase.database().ref("/categories/"+b+"/"+c+"/"+a+"/favorite_count").transaction(function(favorite_count) {

            favorite_count = favorite_count - 1;
           
            return favorite_count;

    });

        firebase.database().ref("/users/"+userId+"/fav_count").transaction(function(fav_count) {

            fav_count = fav_count - 1;
           
            return fav_count;

    });

  })
  .catch(function(error) {
    console.log('Synchronization failed: '+ error);
   
  });

  }else{

    firebase.database().ref("favorite_videos/"+c+"/"+a+"/"+userId).set(fav).then(function() {
             console.log('Synchronization succeeded');
            $event.target.src = 'img/ic_favoriteRed.png';


      firebase.database().ref("/categories/"+b+"/"+c+"/"+a+"/favorite_count").transaction(function(favorite_count) {

            favorite_count = favorite_count + 1;
           
            return favorite_count;

    });

        firebase.database().ref("/users/"+userId+"/fav_count").transaction(function(fav_count) {

            fav_count = fav_count + 1;
           
            return fav_count;

    });

  })
  .catch(function(error) {
    console.log('Synchronization failed: '+ error);
   
  });
  }
}


function loadFavVideos(){
       $ionicLoading.show({
              content: 'Processing please wait',
              animation: 'fade-in',
              showBackdrop: true,
              showDelay: 0
          });

    firebase.database().ref("/users/").once('value').then(function(snapshot1) {
      $ionicLoading.hide();
      var allFavVidJson = snapshot1.child(userId+"/favorite_videos").val();
      console.log(allFavVidJson);
       var allFavArr = Object.keys(allFavVidJson).map(function(k) { return allFavVidJson[k] });
       console.log(allFavArr);
       console.log(allFavArr.length);
       for (var i1 = 0; i1 < allFavArr.length; i1++) {
          var video_id = allFavArr[i1].video_id;
          var cat_id = allFavArr[i1].category_id;
          var chal_id = allFavArr[i1].challenge_id;
          console.log(video_id);
          firebase.database().ref("/categories/"+cat_id+"/"+chal_id+"/"+video_id).once('value').then(function(snapshot) {
    console.log(snapshot.val());
    var json = snapshot.val();


      var upvoteCount = 0;
    var commentCount = 0;
    var favCount = 0;
    var noOfViews = 0;

      commentCount = json.comments_count;
      upvoteCount = json.up_vote;
      favCount = json.favorite_count;
      noOfViews = json.no_of_views;
      var videoScore = commentCount + upvoteCount + favCount + noOfViews;
      json.video_score = videoScore;
      

       json.is_fav = true;
        $scope.allFav.push(json);

}).catch(function(err){
  console.log(err);
  $ionicLoading.hide();
});

       }

        $scope.allFav.sort(function(a, b){return b.video_score - a.video_score});

     for (var i = 0; i < $scope.allFav.length; i++) {
       if(i == 0){
        $scope.allFav[i].is_autoplay = 'autoplay_5'
      }else if( i == 2){
        $scope.allFav[i].is_autoplay = 'autoplay_6'
      }else if(i == 3){
        $scope.allFav[i].is_autoplay = 'autoplay_7'
      }  else{
        $scope.allFav[i].is_autoplay = 'auto-play'
      }
     }
    
    $scope.data = {
      favVids: $scope.allFav
    }
  setTimeout(function(){
     $scope.$apply();
  },1000)
    console.log($scope.data.favVids)
   /* video = document.querySelector('.autoplay_5');
    video = document.querySelector('.autoplay_6');
    video = document.querySelector('.autoplay_7');

   video.onended = function(e) {
    console.log("ended");
     video.currentTime = startTime;
    video.play();
}

   video2.onended = function(e) {
    console.log("ended");
     video2.currentTime = video2.duration - 50;
    video.play();
}

   video3.onended = function(e) {
    console.log("ended");
     video3.currentTime = video3.duration - 50;
    video.play();
}


var i = setInterval(function() {
  if(video.readyState > 0) {
      var minutes = parseInt(video.duration / 60, 10);
    var seconds = video.duration % 60;
    startTime = seconds - 3;
    video.currentTime = startTime;
    console.log(video.duration);
    video.play();
    clearInterval(i);
  }
}, 2000);*/

}).catch(function(err){
        console.log(err);
});

}

 $scope.$on('$ionicView.afterEnter', function (event, viewData) {

  loadFavVideos();
 
});

$scope.goToChal = function(videoId,category_id,challenge_id){
  $rootScope.currentVideoId = videoId;
  $rootScope.currentChal = challenge_id;
  $rootScope.currentCat = category_id;
  $state.go("challenge");

}


  $scope.shareVideo = function(a,b){
  console.log("test2");
   $cordovaSocialSharing
    .share(a, "", "", b) // Share via native share sheet
    .then(function(result) {
      $cordovaToast
    .show('Video successfully shared', 'long', 'bottom')
    .then(function(success) {
      // success
    }, function (error) {
      // error
    });
    }, function(err) {
      // An error occured. Show a message to the user
    });
}

        var goBack = function() {
    $state.go("main.all_cat_challenge");
};

$ionicPlatform.registerBackButtonAction(function (event) {
 if ($state.current.name=="main.all_cat_challenge") {
    ionic.Platform.exitApp();
  }else if($state.current.name=="challenge"){
    $state.go("cat_challenge");
  } else{
    goBack();
  }
}, 100);

$rootScope.$ionicGoBack = function() {
    goBack();
};

})
.controller('ChallengeCtrl', function($scope,  $window, $rootScope, $ionicLoading, $cordovaSocialSharing, $cordovaToast, $ionicPlatform, $state, $ionicPopup, $state) {

var video = document.querySelector('#current_video');
$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
  viewData.enableBack = true;

});
$scope.dev_width = $window.innerWidth;
$scope.dev_height = ($window.innerHeight / 3) + 10;
$scope.current_video = "";
$scope.comments = [];
$scope.comment = {};
$scope.show_play_btn = true;
$scope.fav_img = "img/ic_favorite.png";
$scope.videoScore = 0;

var userId = localStorage.getItem("uid");

 $scope.playCurrentVideo = function(){
  console.log("test1");
    video.load();
    video.play();
    $scope.show_play_btn = false;
    video.setAttribute("controls", "controls");

    firebase.database()
    .ref("/categories/"+$rootScope.currentCat+"/"+$rootScope.currentChal+"/"+$rootScope.currentVideoId+"/no_of_views")
    .transaction(function(no_of_views) {

            no_of_views = no_of_views + 1;
           
            return no_of_views;

    });
}

$scope.shareVideo = function(){
  console.log("test2");
   $cordovaSocialSharing
    .share("share this", "", "", $scope.current_video.video_url) // Share via native share sheet
    .then(function(result) {
      $cordovaToast
    .show('Video successfully shared', 'long', 'bottom')
    .then(function(success) {
      // success
    }, function (error) {
      // error
    });
    }, function(err) {
      // An error occured. Show a message to the user
    });
}


 $scope.$on('$ionicView.afterEnter', function (event, viewData) {
  console.log($rootScope.currentChal);
   console.log($rootScope.currentCat);
     $ionicLoading.show({
              content: 'Processing please wait',
              animation: 'fade-in',
              showBackdrop: true,
              showDelay: 0
          });
     firebase.database().ref('/favorite_videos/'+$rootScope.currentChal+"/"+$rootScope.currentVideoId).once('value').then(function(snapshot1) {
        console.log(snapshot1.val());
         firebase.database().ref("/categories/"+$rootScope.currentCat+"/"+$rootScope.currentChal+"/"+$rootScope.currentVideoId).once('value').then(function(snapshot) {
    console.log(snapshot.val());
    $scope.current_video = snapshot.val();
    $scope.videoScore = $scope.current_video.up_vote + $scope.current_video.favorite_count + $scope.current_video.comments_count;
      var json = snapshot1.val();

      if(typeof json != "undefined" && json != null){

         var favArr = Object.keys(json).map(function(k) { return json[k] });
      
      for (var i = 0; i < favArr.length; i++) {
        
        if(favArr[i].user_id == userId){
          console.log(favArr[i].user_id);
        console.log(userId);
          $scope.fav_img = "img/ic_favoriteRed.png";
          $scope.$apply();
          break;
        }
      }
     
      }
   $ionicLoading.hide();

}).catch(function(err){
  console.log(err);
  $ionicLoading.hide();
});

     }).catch(function(err){
      console.log(err);
     });

   firebase.database().ref("/comments/"+$rootScope.currentVideoId).once('value').then(function(snapshot2) {
         var json = snapshot2.val();
    var arr = Object.keys(json).map(function(k) { return json[k] });
    console.log(arr);
    $scope.comments = arr;

}).catch(function(err){
  console.log(err);

});
});
      $scope.upVote = function(){

           firebase.database().ref("/votes/"+$rootScope.currentVideoId+"/"+userId).once('value').then(function(snapshot) {
         var json = snapshot.val();

         if(typeof json == 'undefined' || json == null){
          var vote = {
            vote_type : 'up_vote'
          }
           $scope.videoScore = $scope.videoScore + 1;
           $scope.$apply();

              firebase.database().ref("votes/"+$rootScope.currentVideoId+"/"+userId).set(vote).then(function() {
             console.log('Synchronization succeeded');

     firebase.database().ref("/categories/"+$rootScope.currentCat+"/"+$rootScope.currentChal+"/"+$rootScope.currentVideoId+"/up_vote").transaction(function(up_vote) {

            up_vote = up_vote + 1;

            return up_vote;

        });


  })
  .catch(function(error) {
    console.log('Synchronization failed');
   
  });
         }else{
             $cordovaToast
    .show('You have already voted this video', 'long', 'bottom')
    .then(function(success) {
      // success
    }, function (error) {
      // error
    });
         }

}).catch(function(err){
  console.log(err);

});
      }

           $scope.downVote = function(){
                firebase.database().ref("/votes/"+$rootScope.currentVideoId+"/"+userId).once('value').then(function(snapshot) {
         var json = snapshot.val();

         if(typeof json == 'undefined' || json == null){
          var vote = {
            vote_type : 'up_vote'
          }

              firebase.database().ref("votes/"+$rootScope.currentVideoId+"/"+userId).set(vote).then(function() {
    console.log('Synchronization succeeded');

     firebase.database().ref("/categories/"+$rootScope.currentCat+"/"+$rootScope.currentChal+"/"+$rootScope.currentVideoId+"/up_vote").transaction(function(up_vote) {

            up_vote = up_vote - 1;
            $scope.videoScore = $scope.videoScore - 1;
           
            return up_vote;

        });


  })
  .catch(function(error) {
    console.log('Synchronization failed');
   
  });
         }else{
             $cordovaToast
    .show('You have already voted this video', 'long', 'bottom')
    .then(function(success) {
      // success
    }, function (error) {
      // error
    });
         }

}).catch(function(err){
  console.log(err);

});
      }

      function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   
     return dateTime;
} 

      $scope.postComment = function(){

        if($scope.comment.comment !== ""){


         var date_time = getDateTime();
         var first_name = window.localStorage.getItem('name');

         if(typeof first_name != "undefined" && first_name != null){
              var comment = {
      comment: $scope.comment.comment,
      date_time: date_time,
      name: first_name,
      user_id: userId
    };
    firebase.database().ref('comments/'+$rootScope.currentVideoId).push().set(comment).then(function() {
    console.log('Synchronization succeeded');
      $scope.comments.push(comment);
      $scope.comment.comment = "";
       firebase.database().ref("/categories/"+$rootScope.currentCat+"/"+$rootScope.currentChal+"/"+$rootScope.currentVideoId+"/comments_count").transaction(function(comments_count) {

            comments_count = comments_count + 1;
           
            return comments_count;

        });
        $cordovaToast
    .show('comment successfully posted', 'long', 'bottom')
    .then(function(success) {
      // success
    }, function (error) {
      // error
    });

  })
  .catch(function(error) {
    console.log('Synchronization failed');
   
  });
         }else{
              $ionicPopup.alert({
        title: "Error",
        template: "update your profile first before to post a comment"
         }).then(function (result) {
          $state.go("profile");
       });
         }

        }


      }

      $scope.addFav = function($event, a){
  var date_time = getDateTime();
  var fav = {
    date_added: date_time,
    user_id: userId
  }
console.log($event.target.src);
var src = $event.target.src.split("/");
  if(src[src.length - 1] == 'ic_favoriteRed.png'){

    firebase.database().ref("favorite_videos/"+$rootScope.currentChal+"/"+a+"/"+userId).set(null).then(function() {
             console.log('Synchronization succeeded');
            $event.target.src = 'img/ic_favorite.png';


      firebase.database().ref("/categories/"+$rootScope.currentCat+"/"+$rootScope.currentChal+"/"+$rootScope.currentVideoId+"/favorite_count").transaction(function(favorite_count) {

            favorite_count = favorite_count - 1;
           
            return favorite_count;

    });

        firebase.database().ref("/users/"+userId+"/fav_count").transaction(function(fav_count) {

            fav_count = fav_count - 1;
           
            return fav_count;

    });

          firebase.database().ref("/users/"+userId+"/favorite_videos/"+a).set(null).then(function() {

         }).catch(function(err){

         });

  })
  .catch(function(error) {
    console.log('Synchronization failed: '+ error);
   
  });

  }else{

    firebase.database().ref("favorite_videos/"+$rootScope.currentChal+"/"+a+"/"+userId).set(fav).then(function() {
             console.log('Synchronization succeeded');
            $event.target.src = 'img/ic_favoriteRed.png';

                  firebase.database().ref("/categories/"+$rootScope.currentCat+"/"+$rootScope.currentChal+"/"+$rootScope.currentVideoId+"/favorite_count").transaction(function(favorite_count) {

            favorite_count = favorite_count + 1;
           
            return favorite_count;

    });

        firebase.database().ref("/users/"+userId+"/fav_count").transaction(function(fav_count) {

            fav_count = fav_count + 1;
           
            return fav_count;

    });

          firebase.database().ref("/users/"+userId+"/favorite_videos/"+a).set({category_id: $rootScope.currentCat, challenge_id: rootScope.currentChal, video_id: $rootScope.currentVideoId}).then(function() {

         }).catch(function(err){

         });

  })
  .catch(function(error) {
    console.log('Synchronization failed: '+ error);
   
  });
  }
}

        var goBack = function() {
    $state.go("main.all_cat_challenge");
};

$ionicPlatform.registerBackButtonAction(function (event) {
 if ($state.current.name=="main.all_cat_challenge") {
    ionic.Platform.exitApp();
  }else if($state.current.name=="challenge"){
    $state.go("cat_challenge");
  } else{
    goBack();
  }
}, 100);

$rootScope.$ionicGoBack = function() {
    goBack();
};



})
.controller('VideoUploadCtrl', function($scope,  $window, $cordovaFileTransfer, $state, $ionicPopup, $rootScope, $ionicPlatform, global) {
  var videoTrimStart;
  var videoTrimEnd;
  var videoDuration;
  var lastTrimTime;
  var video;
  $scope.add_chal = false;
  $scope.sel_chal = true;
  var user_name = window.localStorage.getItem('name');
  var userId = window.localStorage.getItem('uid');
  var challenge_id ="";
  var picName = $rootScope.profile_pic.split("/");
  picName = picName[picName.length -1];

  $scope.dropDownChal = [];
  $scope.dropDownCat = global.dropDownCat;

  console.log(global.dropDownChal);

  $scope.updateChallengeDropdown = function(){
    console.log("test");
    for (var i = 0; i < global.dropDownChal.length; i++) {
       console.log("cat name:"+ global.dropDownChal[i].cat_name);
       console.log("sel cat name:"+ $scope.videoFormData.cat);
      if(global.dropDownChal[i].cat_name == $scope.videoFormData.cat){
        $scope.dropDownChal.push(global.dropDownChal[i].chal_name);
      }
    }

     console.log($scope.dropDownChal);
  }

  $scope.videoFormData ={};

$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
  viewData.enableBack = true;
});

$scope.videoPathUrl = $rootScope.videoPath;
$scope.dev_width = $window.innerWidth;
$scope.dev_height = ($window.innerHeight / 3) + 10;

$scope.addNewChal = function(){
  $scope.add_chal = true;
  $scope.sel_chal = false;
  $scope.videoFormData.chal = "";

}

$scope.selChal = function(){
   $scope.add_chal = false;
  $scope.sel_chal = true;
  $scope.videoFormData.cust_chal ="";
}



    setTimeout( function setUpTrimLogic(){
    video = document.querySelector('#video_to_upload');
    video.currentTime = this.lastTrimTime || 0;

    var trimSlider = document.querySelector('#trim-slider');
    var numTrimSliderUpdates = 0;

    if (typeof trimSlider.noUiSlider !== 'undefined') {
      console.log('trimSlider already instantiated');
      // no need to recreate the slider it is already in the DOM
      // this can happen if coming back here from settings
      return;
    }

    noUiSlider.create(trimSlider, {
      start: [0, video.duration],
      limit: video.duration,
      tooltips: [true, true],
      connect: true,
      range: {
        min: 0,
        max: video.duration
      }
    });

    trimSlider.noUiSlider.on('update', (values, handle) => {
       // update is called twice before anything actually happens, this fixes it
      if (numTrimSliderUpdates < 3) {
          numTrimSliderUpdates++;
          return;
      }

      var value = Number(values[handle]);

      (handle) ? videoTrimEnd = value : videoTrimStart = value;

      videoDuration = (videoTrimEnd - videoTrimStart).toFixed(2);

      video.currentTime = lastTrimTime = value;
    });
}, 700);


  function trimVideo(videoPath) {
    console.log("clicked");
    window.plugins.spinnerDialog.show(null, 'Trimming...', true);
    VideoEditor.trim(
      (result) => {
        console.log('trim success, result: ', result);

         var a = result.split(".");
     if(a[a.length - 1] == "MP4" || a[a.length - 1] == "mp4" || a[a.length - 1] == "MP4"){
        doUpload(result)
     }else{
      transcodeVideo(result);
     }
      },
      (err) => {
        window.plugins.spinnerDialog.hide();
        console.log('trim error, err: ', err);
      },
      {
        fileUri: videoPath,
        outputFileName: new Date().getTime(),
        trimStart: videoTrimStart,
        trimEnd: videoTrimEnd
      }
    );
  }

function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   
     return dateTime;
}

  function transcodeVideo(trimmedVideoPath) {
     window.plugins.spinnerDialog.hide();
     window.plugins.spinnerDialog.show(null, 'Transcoding...', true);
    var ls = window.localStorage;
    var widthOption = ls['width'];
    var heightOption = ls['height'];
    var options = {
      fileUri: trimmedVideoPath,
      outputFileName: new Date().getTime(),
      outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
      videoBitrate: ls['videoBitrate'] || 1000000, // 1 megabit
      audioChannels: ls['audioChannels'] || 2,
      audioSampleRate: ls['audioSampleRate'] || 44100,
      audioBitrate: ls['audioBitrate'] || 128000,
      maintainAspectRatio: ls['maintainAspectRatio'] || true,
      optimizeForNetworkUse: ls['optimizeForNetworkUse'] || true,
      saveToLibrary: ls['saveToLibrary'] || true
    };

    if (widthOption && widthOption !== 0) {
      options.width = widthOption;
    }

    if (heightOption && heightOption !== 0) {
      options.height = heightOption;
    }

    VideoEditor.transcodeVideo(
      (result) => {
        console.log('transcodeVideo success, result: ', result);
           window.plugins.spinnerDialog.hide();
           window.plugins.spinnerDialog.show(null, 'Uploading...', true);
           doUpload(result);
      },
      (err) => {
        console.log('transcodeVideo error, err: ', err);
      },
      options
    );
  }

 $scope.uploadVideoToServer = function (){
    challenge_id = $scope.videoFormData.chal != "" ? $scope.videoFormData.chal : $scope.videoFormData.cust_chal;
    if(challenge_id == ""){
        $ionicPopup.alert({
        title: "Error",
        template: "Select or add a new challenge"
         }).then(function (result) {
       });

    }else{
      if(typeof user_name != "undefined" && user_name != null && picName != "default_pic.png"){
            var correctVideopath = getCorrectFilePath();
     if(videoTrimStart > 0 || (videoTrimEnd < video.duration)){
      trimVideo(correctVideopath);
     }else{
     var a = correctVideopath.split(".");
     console.log(a[a.length - 1]);
     if(a[a.length - 1] == "MP4" || a[a.length - 1] == "mp4"){
      window.plugins.spinnerDialog.show(null, 'Uploading...', true);
        doUpload($rootScope.videoPath)
     }else{
      transcodeVideo(correctVideopath);
     }
      
     }
      }else{

         $ionicPopup.alert({
        title: "Error",
        template: "update your name and profile picture before to upload a video"
         }).then(function (result) {
          $state.go("profile");
       });

      }
    }
  
}

$scope.playCurrentVideo = function(){
  console.log("test");
    video.play();
}

function updateFirebaseDatabase(video_id, profile_picture,video_poster, category_id, challenge_id, video_url, video_name){
   window.plugins.spinnerDialog.hide();
   window.plugins.spinnerDialog.show(null, 'Sharing your video...', true);
 var date_time = getDateTime();
  var video = {
      down_vote: 0,
      video_id: video_id,
      challenger_profile_picture: profile_picture,
      up_vote: 0,
      challenger_id: userId,
      chalenger_name: user_name,
      video_poster: video_poster,
      video_url: video_url,
      video_name: video_name,
      comments_count: 0,
      challenge_name: challenge_id,
      date_time: date_time,
      favorite_count: 0,
      no_of_views: 0,
      category: category_id
    }


    firebase.database().ref('categories/'+category_id+"/"+challenge_id+"/"+video_id).set(video).then(function() {
    console.log('Synchronization succeeded');
    window.plugins.spinnerDialog.hide();
        firebase.database().ref("/users/"+userId+"/video_count").transaction(function(video_count) {

            video_count = video_count + 1;
           
            return video_count;

    });
     $ionicPopup.alert({
        title: "Successfull",
        template: "Video successfully uploaded"
         }).then(function (result) {
       });
  })
  .catch(function(error) {
    console.log('Synchronization failed');
    $ionicPopup.alert({
        title: "Failed",
        template: "Upload failed please try again"
         }).then(function (result) {
       });
  });
}

function getCorrectFilePath(){
       var fileName  = $rootScope.videoPath;
    if (ionic.Platform.isAndroid()) {
      if(fileName.substring(0, 4) != "file"){
       
       fileName = "file:/"+fileName;
      }
  } else if (ionic.Platform.isIOS()) {

}
  
  return fileName;
}

function doUpload(videoPath){
     var options = {
            fileKey: "video",
            fileName: $scope.videoFormData.vid+".mp4",
            chunkedMode: false,
            mimeType: "video/mp4"
        };

    $cordovaFileTransfer.upload("http://videochallengeapi.sandboxserver.co.za/upload.php", videoPath, options, true)
      .then(function(result) {
         window.plugins.spinnerDialog.hide();
        console.log("SUCCESS: " + result.response);
        var json = JSON.parse(result.response);
        console.log("SUCCESS: " + json['video_id']);
        if(typeof json['video_id'] != 'undefined'){
          updateFirebaseDatabase(json['video_id'], $rootScope.profile_pic, json['video_poster'], $scope.videoFormData.cat, challenge_id, "https://api-files.sproutvideo.com/file/"+json['video_id']+"/"+json['security_token']+"/240.mp4", $scope.videoFormData.vid)

        }else{

        }
      }, function(err) {
         window.plugins.spinnerDialog.hide();
        // Error
         console.log("ERROR: " + JSON.stringify(err));
      }, function (progress) {
        // constant progress updates
      });
}

        var goBack = function() {
    $state.go("main.all_cat_challenge");
};

$ionicPlatform.registerBackButtonAction(function (event) {
 if ($state.current.name=="main.all_cat_challenge") {
    ionic.Platform.exitApp();
  }else if($state.current.name=="challenge"){
    $state.go("cat_challenge");
  } else{
    goBack();
  }
}, 100);

$rootScope.$ionicGoBack = function() {
    goBack();
};

})
.controller('ProfileCtrl', function($scope,  $window, $ionicPlatform, $state, $rootScope, $ionicPopup, $cordovaActionSheet, $cordovaCamera, $cordovaFileTransfer) {

  var user = firebase.auth().currentUser;
  var photoURL = null;

  console.log(user); 

$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
  viewData.enableBack = true;
});

var userId = window.localStorage.getItem('uid');



$scope.profile = {
  email : window.localStorage.getItem('email'),
  name: window.localStorage.getItem('name'),
  phone: window.localStorage.getItem('phone'),
  country: window.localStorage.getItem('country')
};

$scope.updateUser = function(){
  window.plugins.spinnerDialog.show(null, 'Processing please wait...', true);

    if($scope.profile.email != window.localStorage.getItem('email')){

      user.updateEmail($scope.profile.email).then(function() {
        firebase.database().ref('users/'+userId).update($scope.profile).then(function() {
    console.log('Synchronization succeeded');
    window.plugins.spinnerDialog.hide();
    window.localStorage.setItem('email', $scope.profile.email);
    window.localStorage.setItem('name', $scope.profile.name);
    window.localStorage.setItem('phone', $scope.profile.phone);
    window.localStorage.setItem('country', $scope.profile.country);
     $ionicPopup.alert({
        title: "Successfull",
        template: "Profile successfully updated"
         }).then(function (result) {
       });
  })
  .catch(function(error) {
    console.log(error);
    window.plugins.spinnerDialog.hide();
    console.log('Synchronization failed');
    $ionicPopup.alert({
        title: "Failed",
        template: "Update failed please try again"
         }).then(function (result) {
       });
  });
}, function(error) {
   window.plugins.spinnerDialog.hide();
  console.log(error);
   $ionicPopup.alert({
        title: "Failed",
        template: error.message
         }).then(function (result) {
       });
});

    }else{
         firebase.database().ref('users/'+userId).update($scope.profile).then(function() {
    console.log('Synchronization succeeded');
    window.plugins.spinnerDialog.hide();
    window.localStorage.setItem('email', $scope.profile.email);
    window.localStorage.setItem('name', $scope.profile.name);
    window.localStorage.setItem('phone', $scope.profile.phone);
    window.localStorage.setItem('country', $scope.profile.country);
    
     $ionicPopup.alert({
        title: "Successfull",
        template: "Profile successfully updated"
         }).then(function (result) {
       });
  })
  .catch(function(error) {
    window.plugins.spinnerDialog.hide()
    console.log('Synchronization failed');
    $ionicPopup.alert({
        title: "Failed",
        template: "Update failed please try again"
         }).then(function (result) {
       });
  });
    }
}

var goBack = function() {
    $state.go("main.all_cat_challenge");
};

$ionicPlatform.registerBackButtonAction(function (event) {
 if ($state.current.name=="main.all_cat_challenge") {
    ionic.Platform.exitApp();
  }else if($state.current.name=="challenge"){
    $state.go("cat_challenge");
  } else{
    goBack();
  }
}, 100);

$rootScope.$ionicGoBack = function() {
    goBack();
};

function updateFirebaseUser(picture_url){
           firebase.database().ref('users/'+userId).update({profile_pic: picture_url}).then(function() {
    console.log('Synchronization succeeded');
    window.plugins.spinnerDialog.hide();
   window.localStorage.setItem('photoURL', picture_url);
    
     $ionicPopup.alert({
        title: "Successfull",
        template: "Profile successfully updated"
         }).then(function (result) {
       });
  })
  .catch(function(error) {
    window.plugins.spinnerDialog.hide()
    console.log('Synchronization failed');
    $ionicPopup.alert({
        title: "Failed",
        template: "Update failed please try again"
         }).then(function (result) {
       });
  });
}

function updateFirebaseUser2(picture_url){
           firebase.database().ref('users/'+userId).update({profile_bck: picture_url}).then(function() {
    console.log('Synchronization succeeded');
    window.plugins.spinnerDialog.hide();
   //window.localStorage.setItem('photoURL', picture_url);
    
     $ionicPopup.alert({
        title: "Successfull",
        template: "Profile successfully updated"
         }).then(function (result) {
       });
  })
  .catch(function(error) {
    window.plugins.spinnerDialog.hide()
    console.log('Synchronization failed');
    $ionicPopup.alert({
        title: "Failed",
        template: "Update failed please try again"
         }).then(function (result) {
       });
  });
}

function uploadProfilePic(profilePic){
   window.plugins.spinnerDialog.show(null, 'Processing please wait...', true);
   var options = {
            fileKey: "pic",
            chunkedMode: false,
        };

    $cordovaFileTransfer.upload("http://videochallengeapi.sandboxserver.co.za/profile_pic.php", profilePic, options, true)
      .then(function(result) {
         window.plugins.spinnerDialog.hide();
        console.log("SUCCESS: " + result.response);
        var json = JSON.parse(result.response);
        if(typeof json['file_name'] != 'undefined'){
          updateFirebaseUser(json['file_name']);
        }else{

           $ionicPopup.alert({
        title: "Failed",
        template: "Update failed please try again"
         }).then(function (result) {
       });

        }
      }, function(err) {
         window.plugins.spinnerDialog.hide();
        // Error
         console.log("ERROR: " + JSON.stringify(err));
      }, function (progress) {
        // constant progress updates
      });
}

function uploadBckProfilePic(profilePic){
   window.plugins.spinnerDialog.show(null, 'Processing please wait...', true);
   var options = {
            fileKey: "pic",
            chunkedMode: false,
        };

    $cordovaFileTransfer.upload("http://videochallengeapi.sandboxserver.co.za/profile_pic.php", profilePic, options, true)
      .then(function(result) {
         window.plugins.spinnerDialog.hide();
        console.log("SUCCESS: " + result.response);
        var json = JSON.parse(result.response);
        if(typeof json['file_name'] != 'undefined'){
          updateFirebaseUser2(json['file_name']);
        }else{

           $ionicPopup.alert({
        title: "Failed",
        template: "Update failed please try again"
         }).then(function (result) {
       });

        }
      }, function(err) {
         window.plugins.spinnerDialog.hide();
        // Error
         console.log("ERROR: " + JSON.stringify(err));
      }, function (progress) {
        // constant progress updates
      });
}

  var asOptions = {
    title: 'Select an action',
    buttonLabels: ['Select a picture', 'Take a picture'],
    addCancelButtonWithLabel: 'Cancel',
    androidEnableCancelButton : true,
    winphoneEnableCancelButton : true,
  };

   var cameraOptions = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 250,
      targetHeight: 250,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
    correctOrientation:true
    };

$scope.showProfilePicActionSheet = function($event){
  $cordovaActionSheet.show(asOptions)
      .then(function(btnIndex) {
        var index = btnIndex;
        if(index == 1){


    var options = {
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 250,
      targetHeight: 250,
    };

      $cordovaCamera.getPicture(options).then(function(imageURI) {
        console.log(imageURI);
        $event.target.src = imageURI;
        uploadProfilePic(imageURI);
    }, function(err) {
      // error
    });

        }else if(index == 2){
     $cordovaCamera.getPicture(cameraOptions).then(function(imageURI) {
      console.log(imageURI);
      $event.target.src = imageURI;
      uploadProfilePic(imageURI);
    }, function(err) {
      // error
    });
        }
      });
}

$scope.showBckProfilePicActionSheet = function($event){
  $cordovaActionSheet.show(asOptions)
      .then(function(btnIndex) {
        var index = btnIndex;
        if(index == 1){


    var options = {
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 766,
      targetHeight: 415,
    };

      $cordovaCamera.getPicture(options).then(function(imageURI) {
        console.log(imageURI);      
      $rootScope.profile_pic_bck = imageURI;
        uploadBckProfilePic(imageURI);
    }, function(err) {
      // error
    });

        }else if(index == 2){
     $cordovaCamera.getPicture(cameraOptions).then(function(imageURI) {
      console.log(imageURI);
      $rootScope.profile_pic_bck = imageURI;
      uploadBckProfilePic(imageURI);
    }, function(err) {
      // error
    });
        }
      });
}

});