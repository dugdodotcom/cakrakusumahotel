'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        'title': 'Rooms',
        'link': 'rooms'
    },{
        'title': 'Info',
        'link': 'infos'
    },{
        'title': 'Gallery',
        'link': 'galleries'
    },{
        'title': 'Slide',
        'link': 'slides'
    },{
        'title': 'Bookings',
        'link': 'bookings'
    },{
        'title': 'Testimonies',
        'link': 'testimonies'
    },{
        'title': 'Guestbooks',
        'link': 'guestbooks'
    },{
        'title': 'Blogs',
        'link': 'blogs'
    },{
        'title': 'Contact',
        'link': '',
        'subs':[{
              'title': 'Manager',
              'link': 'contacts/1'
          },{
              'title': 'Marketing',
              'link': 'contacts/2'
          },{
              'title': 'Frontdesk',
              'link': 'contacts/3'
          }]
    }];
    
    $scope.isCollapsed = false;
}]);
