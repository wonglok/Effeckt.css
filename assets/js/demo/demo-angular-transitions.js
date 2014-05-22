angular
  .module('yourApp', [
    'ngEffeckt'
  ])
.config(['$routeProvider',function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'ng-views/home.html',
        controller: 'MainCtrl'
      })
      .when('/work', {
        templateUrl: 'ng-views/work.html',
        controller: 'WorkCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
.run(['$rootScope',function($rootScope){
  $rootScope.___all2DPageEffeckt = [];
  $rootScope.___all3DPageEffeckt = [];
  $rootScope.___allMenuEffeckt = [];
}])

.controller('MainCtrl', ['$scope', function ($scope) {
  $scope.awesomeThings = [
    'Main Ctrl',
    'AngularJS',
    'Karma'
  ];
}])


.controller('WorkCtrl', ['$scope', function ($scope) {
  $scope.awesomeThings = [
    'Work Ctrl',
    'AngularJS',
    'Karma'
  ];
}])




.service('effecktSwitchingMediator', ['Mediator',function(Mediator){



  return ;

}])
.directive('easyEffecktSwitch', [function () {
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {

    }
  };
}])

;


