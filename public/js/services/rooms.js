'use strict';

//Room service used for rooms REST endpoint
angular.module('mean.rooms').factory('Rooms', ['$resource', function($resource) {
    return $resource('/rooms/:roomId', {
        roomId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
				remove:{
						method:'DELETE'
				}
    });
}]);