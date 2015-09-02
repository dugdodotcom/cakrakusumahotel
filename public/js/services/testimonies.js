'use strict';

//Room service used for testimonies REST endpoint
angular.module('mean.testimonies').factory('Testimonies', ['$resource', function($resource) {
    return $resource('/testimonies/:testimoniId', {
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