'use strict';

//Room service used for slides REST endpoint
angular.module('mean.slides').factory('Slides', ['$resource', function($resource) {
    return $resource('/slides/:slideId', {
        slideId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
				remove:{
						method:'DELETE'
				}
    });
}]);