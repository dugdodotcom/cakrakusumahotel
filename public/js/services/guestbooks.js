'use strict';

//Room service used for guestbooks REST endpoint
angular.module('mean.guestbooks').factory('Guestbooks', ['$resource', function($resource) {
    return $resource('/guestbooks/:testimoniId', {
        testimoniId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
				remove:{
						method:'DELETE'
				}
    });
}]);