'use strict';
angular.module('mean').filter('fromNow', function() {
        return function(dateString) {
            moment.lang('id'); 
            return moment(dateString).format("dddd, DD MMMM YYYY");
        };
 }) 
