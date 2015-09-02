'use strict';

angular.module('mean.guestbooks').controller('GuestbooksController', ['$scope', '$routeParams', 'Global', 'Guestbooks','$http','$location', function ($scope, $routeParams, Global, Guestbooks,$http,$location) {
    $scope.global = Global;
    $scope.find = function() {
        Guestbooks.query(function(guestbooks) {
            $scope.guestbooks = guestbooks;
        });
    };
    $scope.action = function(id,active,$index) {
        var data={_id:id,active:active};
        $http.post('/guestbookactive',data).success(function(dat){
            // var index=$scope.guestbooks.indexOf({_id});
            $scope.guestbooks[$index].active=dat.active;
        });
    }
    $scope.findOne = function() {
        Guestbooks.get({
            guestbookId: $routeParams.guestbookId
        }, function(article) {
            $scope.guestbook = article;
        });
    };
    $scope.update = function() {
        var guestbook = $scope.guestbook;
        if (!guestbook.updated) {
            guestbook.updated = [];
        }
        guestbook.updated.push(new Date().getTime());

        guestbook.$update(function() {
            $location.path('guestbooks/');
        });
    };
    $scope.remove = function(article,item) {
				var guestbooks=new Guestbooks({_id:article});
        guestbooks.$remove(function(){
						var index=$scope.guestbooks.indexOf(item);
            $scope.guestbooks.splice(index,1); 
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