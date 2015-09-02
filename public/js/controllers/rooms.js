'use strict';

angular.module('mean.rooms').controller('RoomsController', ['$scope', '$routeParams', '$location', 'Global', 'Rooms','$upload','$http', function ($scope, $routeParams, $location, Global, Rooms,$upload,$http) {
    $scope.global = Global;
		$scope.myArray=[{type:''},{type:''}];
		$scope.addType=function(){
				$scope.myArray.push({type:''});
		}
    $scope.addType2=function(){
				$scope.room.type.push({type:''});
		}
		$scope.progress=0;
    $scope.action = function(id,type,available,parent,sub) {
        var data={_id:id,type:type,available:available};
        $http.post('/available',data).success(function(dat){
            // var index=$scope.bookings.indexOf({_id});
            $scope.rooms[parent].type[sub].available=dat.available;
        });
    }
		$scope.onFileSelect = function($files) {
				//$files: an array of files selected, each file has name, size, and type.
				for (var i = 0; i < $files.length; i++) {
						var $file = $files[i];
						$upload.upload({
								url: '/server/upload/url',
								file: $file,
								progress: function(e){}
						}).progress(function(evt) {
						$scope.progress=(parseInt(100.0 * evt.loaded / evt.total));
						}).success(function(data, status, headers, config) {
								if(data.success===1){
										$scope.progress=0;
										$scope.image=data.img;
								}
						});
				}
		}
    $scope.create = function() {
        var article = new Rooms({
            name: this.name,
						image:this.image,
						rel:this.rel,
						occupancy:this.occupancy,
						view:this.view,
						size:this.size,
            price:this.price,
            type: $scope.myArray
        });
        article.$save(function(response) {
            $location.path('rooms/');
        });

        this.title = '';
        this.content = '';
    };

    $scope.remove = function(article,item) {
				var rooms=new Rooms({_id:article,id:article});
        rooms.$remove(function(){
						var index=$scope.rooms.indexOf(item);
            $scope.rooms.splice(index,1); 
				});
    };

    $scope.update = function() {
        var room = $scope.room;
        if (!room.updated) {
            room.updated = [];
        }
        room.updated.push(new Date().getTime());

        room.$update(function() {
            $location.path('rooms/');
        });
    };

    $scope.find = function() {
        Rooms.query(function(rooms) {
            $scope.rooms = rooms;
        });
    };

    $scope.findOne = function() {
        Rooms.get({
            roomId: $routeParams.roomId
        }, function(article) {
            $scope.room = article;
        });
    };
}]);