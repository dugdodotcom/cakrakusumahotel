'use strict';

//Room service used for blogs REST endpoint
angular.module('mean.blogs').factory('Blogs', ['$resource', function($resource) {
    return $resource('/blogs/:page/:blogId', {
        blogId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
				remove:{
						method:'DELETE'
				}
    });
}]);
