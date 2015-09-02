'use strict';

angular.module('mean.infos').controller('InfosController', ['$scope', '$routeParams', '$location', 'Global', 'Infos','$upload', function ($scope, $routeParams, $location, Global, Infos,$upload) {
    $scope.global = Global;
		$scope.progress=0;
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
        var article = new Infos({
            name: this.name,
						image:this.image,
						rel:this.rel,
						occupancy:this.occupancy,
						view:this.view,
						size:this.size,
            type: $scope.myArray
        });
        article.$save(function(response) {
            $location.path('infos/');
        });

        this.title = '';
        this.content = '';
    };

    $scope.remove = function(article,item) {
				var infos=new Infos({_id:article,id:article});
        infos.$remove(function(){
						var index=$scope.infos.indexOf(item);
            $scope.infos.splice(index,1); 
				});
    };

    $scope.update = function() {
        if($scope.info._id){
            var info = $scope.info;
            if (!info.updated) {
                info.updated = [];
            }
            info.updated.push(new Date().getTime());

            info.$update(function() {
                $location.path('infos/');
            });
        }else{
            var article = new Infos($scope.info);
            article.id=$routeParams.infoId;
            article.$save(function(response) {
                $location.path('infos/');
            });
        }
    };

    $scope.find = function() {
        Infos.query(function(infos) {
            $scope.infos = infos;
        });
    };

    $scope.findOne = function() {
        Infos.get({
            infoId: $routeParams.infoId,
            home:$routeParams.home
        }, function(article) {
            $scope.info = article;
            if(!article.home){
                $scope.info.home=$routeParams.home;
            }
        });
    };
		    
}]);
