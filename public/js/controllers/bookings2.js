'use strict';

angular.module('mean.bookings').controller('BookingsController', ['$scope', '$routeParams', 'Global', 'Bookings','$http','$location', function ($scope, $routeParams, Global, Bookings,$http,$location) {
    $scope.global = Global;
    $scope.find = function() {
        Bookings.get({
            page: $routeParams.page
        },function(bookings) {
            $scope.bookings = bookings.content;
            $scope.totalItems = bookings.count;
            $scope.currentPage = bookings.page;
        });
    };    
    $scope.action = function(id,action,$index) {
        var data={_id:id,action:action};
        $http.post('/bookaction',data).success(function(dat){
            // var index=$scope.bookings.indexOf({_id});
            $scope.bookings[$index].action=dat.action;
        });
    }
    $scope.setPage = function(page){
        $location.path('bookings/page/'+page);
    }
    $scope.remove = function(article,item) {
        $http({method: 'delete', url: '/bookings/delete/'+article}).success(function(data){
            var index=$scope.bookings.indexOf(item);
            $scope.bookings.splice(index,1); 
        });
    };
    /* $scope.$watch('todos[$index]',
        function(newval, oldval, scope) {
            console.log(
                "todo with following text changed:",
                $scope.todos[$scope.$index].text
            );
    },true); */
}]);
