
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
                country: "cntry",
                email: success.email,
                fav_count: 0,
                name: "-/-",
                phone: "----",
                profile_pic: "http://",
                video_count: 0
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
                name: "-/-",
                phone: "----",
                profile_pic: "http://",
                video_count: 0
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
                country: "cntry",
                email: "-/-",
                fav_count: 0,
                name: "-/-",
                phone: "----",
                profile_pic: "-/-",
                video_count: 0
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
.controller('RegistrationCtrl', function($scope, Auth, $ionicPopup, $ionicLoading) {
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
                country: "cntry",
                email: success.email,
                fav_count: 0,
                name: "-/-",
                phone: "----",
                profile_pic: "http://",
                video_count: 0
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
.controller('HomeCtrl', function($scope, $ionicNavBarDelegate) {
  $ionicNavBarDelegate.showBackButton(false);

  $scope.name = window.localStorage.getItem('first_name')
})
.controller('AllCatChalCtrl', function($ionicNavBarDelegate, $scope, $window, $state, $ionicHistory, $rootScope, $cordovaCapture, $cordovaCamera, $ionicLoading, $cordovaSocialSharing, $cordovaToast) {
 $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
$scope.dev_width = $window.innerWidth;
$scope.dev_height = ($window.innerHeight / 3) + 10;
$scope.data = {
  categories:[]
};
    $scope.video_url = "";
    $scope.video_poster = "";
    $scope.cat_length = "";
    $scope.challenge_name = "";
    var userId = window.localStorage.getItem("uid");
    var isfav = false;
     $ionicNavBarDelegate.showBackButton(false);
     var video ;



  $scope.loadAllChallenge = function(){
         $ionicLoading.show({
              content: 'Processing please wait',
              animation: 'fade-in',
              showBackdrop: true,
              showDelay: 0
          });
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
    
      for (var i2 = 0; i2 < arr2.length; i2++) {
       commentCount += arr2[i2].comments_count;
       upvoteCount += arr2[i2].up_vote;
       favCount += arr2[i2].favorite_count;
     }

        if(i == 0){
        arr2[0].is_autoplay = 'autoplay'
      }else{
        arr2[0].is_autoplay = 'auto-play'
      }
     var challengeScore = commentCount + upvoteCount + favCount;
     
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
     isfav = false;
     console.log(arr2);
    $scope.data.categories.push(arr2);

   }


$scope.$apply();
$ionicLoading.hide();

video = document.querySelector('.autoplay');

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

}).catch(function(err){
  console.log(err);
  $ionicLoading.hide();
});

    }).catch(function(err){
       console.log(err);
  $ionicLoading.hide();
    });
  }


$scope.goToCatChal = function(currentChal){
  $rootScope.currentChal = currentChal;
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
.controller('FavoritesChalCtrl', function($ionicNavBarDelegate, $scope, $window, $state, $ionicHistory, $rootScope, $cordovaCapture, $cordovaCamera, $ionicPlatform, $ionicLoading, $cordovaSocialSharing, $cordovaToast) {
 $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
$scope.dev_width = $window.innerWidth;
$scope.dev_height = ($window.innerHeight / 3) + 10;
$scope.data = {
  categories:[]
};
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
    
      for (var i2 = 0; i2 < arr2.length; i2++) {
       commentCount += arr2[i2].comments_count;
       upvoteCount += arr2[i2].up_vote;
       favCount += arr2[i2].favorite_count;
     }

        if(i == 0){
        arr2[0].is_autoplay = 'autoplay'
      }else{
        arr2[0].is_autoplay = 'auto-play'
      }
     var challengeScore = commentCount + upvoteCount + favCount;
     
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

}).catch(function(err){
  console.log(err);
  $ionicLoading.hide();
});

    }).catch(function(err){
       console.log(err);
  $ionicLoading.hide();
    });
  }


$scope.goToCatChal = function(currentChal){
  $rootScope.currentChal = currentChal;
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
.controller('CatChallengeCtrl', function($scope,  $window, $state, $ionicLoading, $rootScope, $cordovaCapture, $cordovaCamera, $ionicPlatform) {

$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
  viewData.enableBack = true;
});
$scope.dev_width = $window.innerWidth;
$scope.dev_height = ($window.innerHeight / 3) + 10;
$scope.data = {
  challenge:[]
};
var video;

$scope.autoplay_val = false;
var userId = localStorage.getItem('uid');

     $scope.addAutoPlay = function(a,b){
      console.log(b);
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

  })
  .catch(function(error) {
    console.log('Synchronization failed: '+ error);
   
  });

  }else{

    firebase.database().ref("favorite_videos/"+$rootScope.currentChal+"/"+a+"/"+userId).set(fav).then(function() {
             console.log('Synchronization succeeded');
            $event.target.src = 'img/ic_favoriteRed.png';


      firebase.database().ref("/categories/Break Dance/"+$rootScope.currentChal+"/"+a+"/favorite_count").transaction(function(favorite_count) {

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

var video = document.querySelector('#video');
 $scope.$on('$ionicView.afterEnter', function (event, viewData) {
     $ionicLoading.show({
              content: 'Processing please wait',
              animation: 'fade-in',
              showBackdrop: true,
              showDelay: 0
          });
      firebase.database().ref('/favorite_videos/'+$rootScope.currentChal).once('value').then(function(snapshot1) {
console.log(snapshot1.val());
  firebase.database().ref('/categories/Break Dance/'+$rootScope.currentChal).once('value').then(function(snapshot) {
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
     
      if(i == 0){
        arr[i].is_autoplay = 'autoplay_2'
      }else{
        arr[i].is_autoplay = 'auto-play'
      }
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
    
    
    console.log($scope.data.challenge);
    $scope.data = {
      challenge: arr
    }

    $scope.$apply();
    $ionicLoading.hide();

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

}).catch(function(err){
  console.log(err);
  $ionicLoading.hide();
});

      }).catch(function(err){
        console.log(err);
      });
 
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
.controller('ChallengeCtrl', function($scope,  $window, $rootScope, $ionicLoading, $cordovaSocialSharing, $cordovaToast, $ionicPlatform, $state) {

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

var userId = localStorage.getItem("uid");

 $scope.playCurrentVideo = function(){
  console.log("test1");
    video.load();
    video.play();
    $scope.show_play_btn = false;
    video.setAttribute("controls", "controls")
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
     $ionicLoading.show({
              content: 'Processing please wait',
              animation: 'fade-in',
              showBackdrop: true,
              showDelay: 0
          });
     firebase.database().ref('/favorite_videos/'+$rootScope.currentChal+"/"+$rootScope.currentVideoId).once('value').then(function(snapshot1) {
        console.log(snapshot1.val());
         firebase.database().ref('/categories/Break Dance/'+$rootScope.currentChal+"/"+$rootScope.currentVideoId).once('value').then(function(snapshot) {
    console.log(snapshot.val());
    $scope.current_video = snapshot.val();

      var json = snapshot1.val();
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

              firebase.database().ref("votes/"+$rootScope.currentVideoId+"/"+userId).set(vote).then(function() {
    console.log('Synchronization succeeded');

     firebase.database().ref("/categories/Break Dance/"+$rootScope.currentChal+"/"+$rootScope.currentVideoId+"/up_vote").transaction(function(up_vote) {

            up_vote = up_vote + 1;
            $scope.current_video.up_vote++;
           
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

     firebase.database().ref("/categories/Break Dance/"+$rootScope.currentChal+"/"+$rootScope.currentVideoId+"/up_vote").transaction(function(up_vote) {

            up_vote = up_vote - 1;
            $scope.current_video.up_vote--;
           
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
         var first_name = "name";
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
       firebase.database().ref("/categories/Break Dance/"+$rootScope.currentChal+"/"+$rootScope.currentVideoId+"/comments_count").transaction(function(comments_count) {

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


      firebase.database().ref("/categories/Break Dance/"+$rootScope.currentChal+"/"+$rootScope.currentVideoId+"/favorite_count").transaction(function(favorite_count) {

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

    firebase.database().ref("favorite_videos/"+$rootScope.currentChal+"/"+a+"/"+userId).set(fav).then(function() {
             console.log('Synchronization succeeded');
            $event.target.src = 'img/ic_favoriteRed.png';

                  firebase.database().ref("/categories/Break Dance/"+$rootScope.currentChal+"/"+$rootScope.currentVideoId+"/favorite_count").transaction(function(favorite_count) {

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
.controller('VideoUploadCtrl', function($scope,  $window, $cordovaFileTransfer, $state, $ionicPopup, $rootScope, $ionicPlatform) {
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
      favorite_count: 0
    }


    firebase.database().ref('categories/'+category_id+"/"+challenge_id+"/"+video_id).set(video).then(function() {
    console.log('Synchronization succeeded');
    window.plugins.spinnerDialog.hide();
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
          updateFirebaseDatabase(json['video_id'], "profile_picture",json['video_poster'], $scope.videoFormData.cat, challenge_id, "https://api-files.sproutvideo.com/file/"+json['video_id']+"/"+json['security_token']+"/240.mp4", $scope.videoFormData.vid)

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
.controller('ProfileCtrl', function($scope,  $window, $ionicPlatform, $state, $rootScope, $ionicPopup) {

$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
  viewData.enableBack = true;
});

var userId = window.localStorage.getItem('uid');



$scope.profile = {
  email : window.localStorage.getItem('email'),
  name: window.localStorage.getItem('first_name'),
  phone: window.localStorage.getItem('phone'),
};

$scope.updateUser = function(){
  window.plugins.spinnerDialog.show(null, 'Processing please wait...', true);
      firebase.database().ref('users/'+userId).update($scope.profile).then(function() {
    console.log('Synchronization succeeded');
    window.plugins.spinnerDialog.hide();
    window.localStorage.setItem('email', $scope.profile.email);
    window.localStorage.setItem('first_name', $scope.profile.name);
    window.localStorage.getItem('phone', $scope.profile.phone);
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
        template: "Upload failed please try again"
         }).then(function (result) {
       });
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


});