angular
  .module('yourApp', [
    'ngEffeckt'
  ])
.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/page1.html',
        controller: 'MainCtrl'
      })
      .when('/page2', {
        templateUrl: 'views/page2.html',
        controller: 'CvCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
