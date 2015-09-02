'use strict';

angular.module('mean.testimonies').controller('TestimoniesController', ['$scope', '$routeParams', 'Global', 'Testimonies','$http','$location', function ($scope, $routeParams, Global, Testimonies,$http,$location) {
    $scope.global = Global;
    $scope.find = function() {
        Testimonies.query(function(testimonies) {
            $scope.testimonies = testimonies;
        });
    };
    $scope.action = function(id,active,$index) {
        var data={_id:id,active:active};
        $http.post('/testimoniactive',data).success(function(dat){
            // var index=$scope.testimonies.indexOf({_id});
            $scope.testimonies[$index].active=dat.active;
        });
    }
    $scope.findOne = function() {
        Testimonies.get({
            testimoniId: $routeParams.testimoniId
        }, function(article) {
            $scope.testimoni = article;
        });
    };
    $scope.update = function() {
        var testimoni = $scope.testimoni;
        if (!testimoni.updated) {
            testimoni.updated = [];
        }
        testimoni.updated.push(new Date().getTime());

        testimoni.$update(function() {
            $location.path('testimonies/');
        });
    };
    $scope.remove = function(article,item) {
				var testimonies=new Testimonies({_id:article});
        testimonies.$remove(function(){
						var index=$scope.testimonies.indexOf(item);
            $scope.testimonies.splice(index,1); 
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