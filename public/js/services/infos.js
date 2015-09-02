'use strict';

//Room service used for infos REST endpoint
angular.module('mean.infos').factory('Infos', ['$resource', function($resource) {
    return $resource('/infos/:home/:infoId', {
        infoId: '@id',
        home: '@home',
    }, {
        update: {
            method: 'PUT'
        },
				remove:{
						method:'DELETE'
				}
    });
}]);