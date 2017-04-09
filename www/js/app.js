// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'ngPassword', 'ion-floating-menu', 'firebase', 'ngCordovaOauth', 'ngCordova', 'ionic-sidemenu']);

app
.run(function($ionicPlatform, $rootScope, Auth, $location) {

  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
    //  StatusBar.styleDefault();

    }

  });

  $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {



                var user = window.localStorage.getItem("uid");;

if (user) {
  // User is signed in.
  console.log("logged");
  $location.path('/main/all_cat_challenge');
} else {
  console.log("not logged");
  // No user is signed in.
  $location.path('/login');
}
            });

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
     url: '/login',
     templateUrl: 'templates/login.html',
     controller: 'LoginCtrl'
    })
    .state('reset', {
     url: '/login',
     templateUrl: 'templates/reset_password.html',
     controller: 'ResetCtrl'
    })
  .state('registration', {
     url: '/login',
     templateUrl: 'templates/registration.html',
     controller: 'RegistrationCtrl'
    })
   .state('main', {
      url: "/main",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'HomeCtrl',
      cache: false
    })
   .state('cat_challenge', {
      url: "/cat_challenge",
      templateUrl: "templates/cat_challenge.html",
      controller: 'CatChallengeCtrl',
      cache: false
    })
    .state('challenge', {
      url: "/challenge",
      templateUrl: "templates/challenge.html",
      controller: 'ChallengeCtrl',
      cache: false
    })
    .state('uploadvideo', {
      url: "/uploadvideo",
      templateUrl: "templates/video_upload.html",
      controller: 'VideoUploadCtrl',
      cache: false,
    })
     .state('profile', {
      url: "/profile",
      templateUrl: "templates/profile.html",
      controller: 'ProfileCtrl',
      cache:false
    })
      .state('filter', {
      url: "/filter",
      templateUrl: "templates/filter.html",
      controller: 'FilterCtrl',
      cache:false
    })
    .state('favoritechallenges', {
      url: "/favoritechallenges",
      templateUrl: "templates/favorite_challenges.html",
      controller: 'FavoritesChalCtrl',
      cache: false
    })
     .state('favoritevideos', {
      url: "/favoritevideos",
      templateUrl: "templates/favorite_videos.html",
      controller: 'FavoritesVideoCtrl',
      cache: false
    })
    .state('main.all_cat_challenge', {
      url: "/all_cat_challenge",
      views: {
      'homeContent': {
       cache: false,
       templateUrl: "templates/all_cat_challenge.html",
       controller: 'AllCatChalCtrl'
      }
     }
   });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
})
.directive('forceLowercase', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, modelCtrl) {

                    modelCtrl.$parsers.push(function (inputValue) {

                        var transformedInput = inputValue.toLowerCase().replace(/ /g, '');

                        if (transformedInput != inputValue) {
                            modelCtrl.$setViewValue(transformedInput);
                            modelCtrl.$render();
                        }

                        return transformedInput;
                    });
                }
            };
  })
  .directive('validateEmail', function () {
            var EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return {
                require: '?ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    // only apply the validator if ngModel is present and Angular has added the email validator
                    if (ctrl && ctrl.$validators.email) {

                        // this will overwrite the default Angular email validator
                        ctrl.$validators.email = function (modelValue) {
                            return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                        };
                    }
                }
          };
}).directive('gotToProfile', function($state, $rootScope, $ionicPopup) {
    return {
        restrict: 'A',
        link: function($scope, element) {
            element.on('click', function() {
                $state.go('profile');
            });
        }
    }
}).directive('gotToFavorites', function($state, $rootScope, $ionicPopup) {
    return {
        restrict: 'A',
        link: function($scope, element) {
            element.on('click', function() {
                $state.go('favorites');
            });
        }
    }
}).directive('gotToFilter', function($state, $rootScope, $ionicPopup) {
    return {
        restrict: 'A',
        link: function($scope, element) {
            element.on('click', function() {
                $state.go('filter');
            });
        }
    }
}).directive('logOut', function($state, $rootScope, $ionicPopup) {
    return {
        restrict: 'A',
        link: function($scope, element) {
            element.on('click', function() {
              window.localStorage.clear();
                $state.go('login');
            });
        }
    }
}).filter('trustedlink', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);
