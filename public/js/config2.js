'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/rooms', {
            templateUrl: '/views/admin/rooms/list.html'
        }).
        when('/rooms/create', {
            templateUrl: '/views/admin/rooms/create.html'
        }).
        when('/rooms/:roomId/edit', {
            templateUrl: '/views/admin/rooms/edit.html'
        }).
        when('/rooms/:roomId', {
            templateUrl: '/views/admin/rooms/view.html'
        }).
        when('/infos', {
            templateUrl: '/views/admin/infos/list.html'
        }).
        when('/infos/:home/:infoId', {
            templateUrl: '/views/admin/infos/edit.html'
        }).
        when('/infos/:infoId/view', {
            templateUrl: '/views/admin/infos/view.html'
        }).
        when('/contacts/:level', {
            templateUrl: '/views/admin/contacts/list.html'
        }).
         when('/galleries', {
            templateUrl: '/views/admin/galleries/list.html'
        }).
        when('/galleries/:galleryId/edit', {
            templateUrl: '/views/admin/galleries/edit.html'
        }).
        when('/slides', {
            templateUrl: '/views/admin/slides/list.html'
        }).
        when('/slides/:slideId/edit', {
            templateUrl: '/views/admin/slides/edit.html'
        }).
        when('/bookings', {
            templateUrl: '/views/admin/bookings/list.html'
        }).
        when('/bookings/page/:page', {
            templateUrl: '/views/admin/bookings/list.html'
        }).
        when('/testimonies', {
            templateUrl: '/views/admin/testimonies/list.html'
        }).
        when('/testimonies/create', {
            templateUrl: '/views/admin/testimonies/create.html'
        }).
        when('/testimonies/:testimoniId/edit', {
            templateUrl: '/views/admin/testimonies/edit.html'
        }).
        when('/testimonies/:testimoniId', {
            templateUrl: '/views/admin/testimonies/view.html'
        }).
        when('/guestbooks', {
            templateUrl: '/views/admin/guestbooks/list.html'
        }).
        when('/guestbooks/create', {
            templateUrl: '/views/admin/guestbooks/create.html'
        }).
        when('/guestbooks/:guestbookId/edit', {
            templateUrl: '/views/admin/guestbooks/edit.html'
        }).
        when('/guestbooks/:guestbookId', {
            templateUrl: '/views/admin/guestbooks/view.html'
        }).
        when('/blogs', {
            templateUrl: '/views/admin/blogs/list.html'
        }).
        when('/blogs/page/:page', {
            templateUrl: '/views/admin/blogs/list.html'
        }).
        when('/blogs/create', {
            templateUrl: '/views/admin/blogs/create.html'
        }).
        when('/blogs/edit/:blogId', {
            templateUrl: '/views/admin/blogs/edit.html'
        }).
        when('/blogs/:roomId', {
            templateUrl: '/views/admin/blogs/view.html'
        }).
        when('/', {
            templateUrl: '/views/admin/bookings/list.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);
