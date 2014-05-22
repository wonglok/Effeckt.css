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
        '$rootScope',
function($rootScope){
  //omg

  $rootScope.__pageTranSel = {
    ng3dPage : [
      'effeckt-ng-3d-page-zoom',
      'effeckt-ng-3d-page-flip',
    ],
    ng2dPage: [
      'effeckt-ng-2d-page-ios-preview-move',
      'effeckt-ng-2d-page-fade'
    ],
    ngMenu: [
      'effeckt-ng-menu-1by1-fade',
    ]
  };

  $rootScope.__curPageTran = {
    ng3dPage: $rootScope.__pageTranSel.ng3dPage[0],
    ng2dPage: $rootScope.__pageTranSel.ng2dPage[0],
    ngMenu: $rootScope.__pageTranSel.ngMenu[0],
  };


}])

.controller('MainCtrl', [
           '$scope', 'offNavMediator',
  function ($scope,   offNavMediator) {
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
  };



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


