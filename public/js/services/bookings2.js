'use strict';

//Room service used for rooms REST endpoint
angular.module('mean.bookings').factory('Bookings', ['$resource', function($resource) {
    return $resource('/bookings/page/:page', {
        page: '@page'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);