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
.run([
        '$rootScope','offNavMediator',
function($rootScope,  offNavMediator){
  //omg

  $rootScope.__pageTranSel = {
    ng3dPage : [
      'effeckt-ng-3d-page-zoom',
      'effeckt-ng-3d-page-flip',
    ],
    ng2dPage: [
      'effeckt-ng-2d-page-fade',
      'effeckt-ng-2d-page-preview-move'
    ],
    ngMenu: [
      'effeckt-ng-menu-1by1-fade',
      'effeckt-ng-menu-1by1-flip',
    ]
  };

  $rootScope.__curPageTran = {
    ng3dPage: $rootScope.__pageTranSel.ng3dPage[0],
    ng2dPage: $rootScope.__pageTranSel.ng2dPage[0],
    ngMenu: $rootScope.__pageTranSel.ngMenu[0],
  };

  var visited = false;
  $rootScope.__firstVisit = function(){
    if(!visited){
      visited = true;
      offNavMediator.publish('page:open');
    }
  };

}])

.controller('MainCtrl', [
           '$scope', 'offNavMediator', '$rootScope',
  function ($scope,   offNavMediator,   $rootScope) {
  $scope.awesomeThings = [
    'Main Ctrl',
    'AngularJS',
    'Karma'
  ];

  $scope.openMenuThenChangePage = function(){
    offNavMediator.publish('page:open');
    setTimeout(function(){
      window.location.assign('#/work');
    },1000);

    setTimeout(function(){
      window.location.assign('#/');
    },2250);

    setTimeout(function(){
      offNavMediator.publish('page:close');
    },3500);
  };

  $scope.testChangePage = function(){
    window.location.assign('#/work');
    setTimeout(function(){
      window.location.assign('#/');
    },1250);

  };

  $rootScope.__firstVisit();





}])


.controller('WorkCtrl', [
           '$scope',
  function ($scope) {

  $scope.awesomeThings = [
    'Work Ctrl',
    'AngularJS',
    'Karma'
  ];
}])


.service('effecktSwitchingMediator', [
          'Mediator',
  function(Mediator){

    function EffecktSwitchingMediator(){
      this.call(Mediator);
      this.init();
    }
    EffecktSwitchingMediator.prototype = Mediator.prototype;
    EffecktSwitchingMediator.prototype.init = function(){
    };


  return ;

}])
.directive('easyEffecktSwitch', [
           'effecktSwitchingMediator',
  function (effecktSwitchingMediator) {





  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {



    }
  };
}])

;


