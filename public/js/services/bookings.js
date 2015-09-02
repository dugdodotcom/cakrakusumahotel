'use strict';

//Room service used for rooms REST endpoint
angular.module('mean.bookings').factory('Bookings', ['$resource', function($resource) {
    return $resource('/rooms/:roomId', {
        roomId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);