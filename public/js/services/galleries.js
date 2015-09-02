'use strict';

//Room service used for galleries REST endpoint
angular.module('mean.galleries').factory('Galleries', ['$resource', function($resource) {
    return $resource('/galleries/:galleryId', {
        galleryId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
				remove:{
						method:'DELETE'
				}
    });
}]);