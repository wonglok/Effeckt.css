/**
 * ng-page-menu-transtion.js 0.1
 * http://github.wonglok.com/YH
 *
 * Rewritten for effeckts project
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Wonglok
 * http://www.yellowhappy.com
 */

;(function(window){
  'use strict';

  function checkDefined(item, name){
    if (typeof item === 'undefined'){
      throw new Error('require: '+name);
    }
  }

  checkDefined(angular, 'AngularJS');
  checkDefined(angular.module('ngAnimate'), 'ngAnimate');

  checkDefined(Effeckt, 'Effect core');
  checkDefined(Effeckt.transitionEndEventName, 'Effect transtion end event');
  checkDefined(Effeckt.buttonPressedEvent, 'Effect button pressed event');
  checkDefined(Effeckt.buttonUpEvent, 'Effect button up event');


  var __clickEvent = Effeckt.buttonPressedEvent;
  var __mouseupEvent = Effeckt.buttonUpEvent;
  var __transitionEndEvent = Effeckt.transitionEndEventName;



  angular.module('ngEffeckt')
    .factory('Mediator', function(){
      //http://carldanley.com/js-mediator-pattern/
      function Mediator() {
        this._topics = {};
        //topics = { 'myevent': [listnersFn1,listnersFn2] }
      }
      Mediator.prototype.subscribe = function mediatorSubscribe( topic, callback ) {
        if( ! this._topics.hasOwnProperty( topic ) ) {
          this._topics[ topic ] = [];
        }
        this._topics[ topic ].push( callback );
        return true;
      };

      Mediator.prototype.unsubscribe = function mediatorUnsubscrive( topic, callback ) {
        if( ! this._topics.hasOwnProperty( topic ) ) {
          return false;
        }

        for( var i = 0, len = this._topics[ topic ].length; i < len; i++ ) {
          if( this._topics[ topic ][ i ] === callback ) {
            this._topics[ topic ].splice( i, 1 );
            return true;
          }
        }

        return false;
      };

      Mediator.prototype.publish = function mediatorPublish() {
        var args = Array.prototype.slice.call( arguments );
        var topic = args.shift();

        if( ! this._topics.hasOwnProperty( topic ) ) {
          return false;
        }

        for( var i = 0, len = this._topics[ topic ].length; i < len; i++ ) {
          this._topics[ topic ][ i ].apply( null, args );
        }
        return true;
      };

      return Mediator;
    })


    .factory('_doTransEnd', function () {
      function _doTransEnd(element, endFn, maxTime){
        var doneTsk = false;
        var _handleTransitionEnd = function (evt){
          if (!doneTsk){
            doneTsk = true;
            endFn(evt);
            element.removeEventListener(__transitionEndEvent,_handleTransitionEnd);
          }
        };
        // safynet if the tranns event is not fired.
        setTimeout(function cbEndFn(){
          if (!doneTsk){
            doneTsk = true;
            endFn(null);
            element.removeEventListener(__transitionEndEvent,_handleTransitionEnd);
          }
        }, maxTime || 1500);
        element.addEventListener(__transitionEndEvent,_handleTransitionEnd,false);
      }
      return _doTransEnd;
    })



    .factory('offNavMediator',function(Mediator){
      function OffNavMediator(){
        Mediator.call(this);
      }
      OffNavMediator.prototype = Object.create(Mediator.prototype);
      var self = new OffNavMediator();
      return self;
    })


    .directive('effecktNgContainer', [
               'offNavMediator', '_doTransEnd',
      function (offNavMediator, _doTransEnd) {

      //from class.ie
      //https://github.com/desandro/classie/blob/master/classie.js
      // class helper functions from bonzo https://github.com/ded/bonzo
      var _clssReg = function( className ){
        return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
      };

      var _hasClass;
      if ( 'classList' in document.documentElement ) {
        _hasClass = function( elem, c ) {
          return elem.classList.contains( c );
        };
      }else{
         _hasClass = function( elem, c ) {
          return classReg( c ).test( elem.className );
        };
      }
      var _hasParentClass = function ( eTarget, classname ) {
        if(eTarget === document){ return false; }
        if( _hasClass( eTarget, classname ) ) {
          return true;
        }
        return eTarget.parentNode && _hasParentClass( eTarget.parentNode, classname );
      };

      var _onClosePage = function(evt){
        if (!_hasParentClass(evt.target, 'effeckt-ng-nav')){
          offNavMediator.publish('page:close');
        }
      };

      return {
        restrict: 'C',
        link: function ($scope, $element) {
          var _onOpenMenu = function(){
            console.log('page:open:menu');

            $element.addClass('effeckt-ng-lock-scroll');



            setTimeout(function (){
              $element.addClass('effeckt-ng-open-menu');
            },5);

            _doTransEnd($element[0], function _cbmMakePageCloseBtn(){
              $element[0].addEventListener(__clickEvent, _onClosePage,true);
            },1000);

          };


          var _onCloseMenu = function(){
            console.log('page:close');

            $element.removeClass('effeckt-ng-open-menu');

            _doTransEnd($element[0], function _cbmMakePageCloseBtn(){
              $element.removeClass('effeckt-ng-lock-scroll');
            },800);

            $element[0].removeEventListener(__clickEvent, _onClosePage, true);
          };

          offNavMediator.subscribe('page:open', _onOpenMenu);
          offNavMediator.subscribe('page:close', _onCloseMenu);


          $scope.$on('$destroy',function(){
            offNavMediator.unsubscribe('page:open', _onOpenMenu);
            offNavMediator.unsubscribe('page:close', _onCloseMenu);
          });


          $scope.offNavMediator = offNavMediator;

          $scope._swipeOpenMenu = function(){
            console.log('_swipeOpenMenu');
            if (Modernizr.touch){
              offNavMediator.publish('page:open');
            }
          };

        }
      };
    }])

    .directive('effecktNgNavTrigger', [
               'offNavMediator',
      function (offNavMediator) {

      return {
        restrict: 'C',
        link: function ($scope, $element) {
          var _onClickMenuBtn = function(){
            offNavMediator.publish('page:open');
          };
          $element[0].addEventListener(__clickEvent, _onClickMenuBtn,true);
          offNavMediator.publish('page:open');

        }
      };
    }])
    .directive('effecktNgMenuBtn', [
               'offNavMediator',
      function (offNavMediator) {

      return {
        restrict: 'C',
        link: function ($scope, $element) {

          var _onOpenMenu = function(){
            console.log('page:open:menu-btn');
            $element.addClass('effeckt-ng-open-menu');
          };

          var _onCloseMenu = function(){
            console.log('page:close:menu-btn');
            $element.removeClass('effeckt-ng-open-menu');
          };

          offNavMediator.subscribe('page:open', _onOpenMenu);
          offNavMediator.subscribe('page:close', _onCloseMenu);

          var _onClickMenuBtn = function(){
            offNavMediator.publish('page:open');
          };


          $element[0].addEventListener(__clickEvent, _onClickMenuBtn,true);

          $scope.$on('$destroy',function(){
            $element[0].removeEventListener(__clickEvent, _onClickMenuBtn);
          });

        }
      };
    }])

    .directive('effecktNgMenuBtnClose', [
               'offNavMediator',
      function (offNavMediator) {
      return {
        restrict: 'C',
        controller: function ($scope, $element) {
          //close button
          var _onClickMenuBtnClose = function(){
            offNavMediator.publish('page:close');
          };
          $element[0].addEventListener(__clickEvent, _onClickMenuBtnClose,true);
          $scope.$on('$destroy',function(){
            $element[0].removeEventListener(__clickEvent, _onClickMenuBtnClose);
          });
        }
      };
    }])

    .directive('effecktNgNav', [
      function () {
      function _makeLinkFaster(evt) {
        //delegate
        if(evt.target && evt.target.nodeName === 'A' && evt.target.href && !!!evt.target.attributes.closebtn) {
          evt.preventDefault();
          evt.stopPropagation();
          window.location.assign(evt.target.href);
        }
      }
      return {
        restrict: 'C',
        controller: function ($scope, $element) {
          $element[0].addEventListener(__mouseupEvent, _makeLinkFaster,true);
          $scope.$on('$destroy',function(){
            $element[0].removeEventListener(__mouseupEvent, _makeLinkFaster);
          });
        },
      };
    }])
    .directive('activeLink', ['$location', function ($location) {
      return {
        //http://jsfiddle.net/p3ZMR/3/
        restrict: 'A',
        link: function(scope, element, attrs) {
          var activeClass = attrs.activeLink;

          var ngHref = element.attr('ng-href');
          var href = element.attr('href');

          var path = href || ngHref;


          //detelte hashbang
          if (path.indexOf('#') === 0){
            path = path.substring(1);
          }

          //activeLink
          scope.location = $location;
          scope.$watch('location.path()', function(newPath) {

            if (newPath.indexOf('#') !== -1){
              newPath = newPath.substring(1);
            }

            if (path === newPath) {
              element.addClass(activeClass);
            } else {
              element.removeClass(activeClass);
            }
          });

        }
      };
    }]);



})(this);


