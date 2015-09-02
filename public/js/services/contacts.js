'use strict';

//Room service used for contacts REST endpoint
angular.module('mean.contacts').factory('Contacts', ['$resource', function($resource) {
    return $resource('/contacts/:level/:page', {
        level: '@level',
        page: '@page'
    }, {
        update: {
            method: 'PUT'
        },
				remove:{
						method:'DELETE'
				}
    });
}]);