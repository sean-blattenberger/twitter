// Code goes here
'use strict';

angular.module("ng-learn", ["firebase"])
.run(function($rootScope, $firebaseAuth, $window){
  $rootScope.fbRef = new $window.Firebase('https://my-tweeterapp.firebaseio.com/');
  $rootScope.afAuth = $firebaseAuth($rootScope.fbRef);
})

.controller("TweetCtrl", function($scope, $firebaseAuth, $rootScope, $firebaseArray) {
  $scope.tweet = "";
  $scope.password = "";
  $scope.username = "";
  $scope.tweetList = ["Fake tweet 1", "Fake tweet 2", "Fake tweet 3"];
  $scope.tweetList = $firebaseArray($rootScope.fbRef.child('tweets'));
  console.log($scope.tweetList);
//  $scope.tweeters = [];
//  $scope.addUser = function (){
//    $scope.tweeters.push( { name: $scope.username, pass: $scope.password });
//    console.log($scope.tweeters);
//    $scope.username = "";
//    $scope.password = "";
//  }
  $scope.isTweetMaxed = function() {
    return $scope.tweet.length > 140;
  };
  $scope.tweetRemainder = function () {
    return 140 - $scope.tweet.length;
  }
  $scope.tweetIsOver = function () {
    return $scope.tweet.length - 140;
  }
  $scope.addTweet = function() {
    $scope.tweetList.$add({
      tweet: $scope.tweet,
      user: $rootScope.activeUser.username,
      avatar: $rootScope.activeUser.cachedUserProfile["avatar_url"],
      likes: []
    });
    console.log($scope.tweetList);
    $scope.tweet = "";
  }
//  $scope.like = function() {
//    $scope.tweetList
//  }
})
.controller("UserCtrl", function($scope, User, $rootScope, $firebaseObject) {
//  var ref = new Firebase("https://my-tweeterapp.firebaseio.com/");
  $rootScope.loggedin = false;
  $scope.authform = false;
  $scope.signin = function() {
    $scope.authform= $scope.authform ? false : true;
  }
  $scope.afAuth.$onAuth(function(data){
    if(data){
      $rootScope.loggedin = "true";
      console.log(data);
      $rootScope.activeUser = data.github;
      console.log(data.github);
      $rootScope.fbUser = $rootScope.fbRef.child('users/' + data.github.username);
      console.log($rootScope.fbUser);
      $rootScope.afUser = $firebaseObject($rootScope.fbUser);
      console.log($rootScope.afUser);
      $rootScope.fbUser.set({
        user: $rootScope.activeUser.username,
        avatar: $rootScope.activeUser.cachedUserProfile["avatar_url"],
        followers: []
      });
    }else{
      $rootScope.activeUser = null;
      $rootScope.fbUser = null;
      $rootScope.afUser = null;
    }
    $scope.authform = false;
  });
  $scope.oauth = function(){
    User.oauth();
  };
})
.factory('User', function($rootScope){
  function User(){}

  User.oauth = function(provider){
    return $rootScope.afAuth.$authWithOAuthPopup('github');
  }
  return User;
});
