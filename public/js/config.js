'use strict';

//Setting up route
angular.module('mean').config(['$urlRouterProvider','$stateProvider',
    function($urlRouterProvider,$stateProvider){
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('home', {
            abstract: true,
            url: '/',
            templateUrl: '/views/index.html',
            controller: 'BookingsController'
        })
        .state('home.roompick', {
            url: '',
            templateUrl: '/views/booking/room.html'
        })
		.state('guestdetail', {            
            url: '/guestdetail',
            templateUrl: '/views/booking/guestdetail.html',
            controller: 'BookingsController'
        })
    .state('ticket', {            
            url: '/ticket',
            templateUrl: '/views/booking/ticket.html',
            controller: 'BookingsController'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);