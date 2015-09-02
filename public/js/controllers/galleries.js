'use strict';

angular.module('mean.galleries').controller('GalleriesController', ['$scope', '$routeParams', '$location', 'Global', 'Galleries','$upload','$http', function ($scope, $routeParams, $location, Global, Galleries,$upload,$http) {
    $scope.global = Global;
    $scope._id='';
		$scope.progress=0;
		$scope.onFileSelect = function($files) {
				//$files: an array of files selected, each file has name, size, and type.
				for (var i = 0; i < $files.length; i++) {
						var $file = $files[i];
						$upload.upload({
								url: '/galleries/upload',
								file: $file,
                data:{rel:$scope.rel,_id:$scope._id},
								progress: function(e){}
						}).progress(function(evt) {
						$scope.progress=(parseInt(100.0 * evt.loaded / evt.total));
						}).success(function(data, status, headers, config) {
								if($scope._id===''){
                    $scope.progress=0;
										$scope.galleries.push(data);
								}else{
                    $location.path('galleries/');
                }
						});
				}
		}
    $scope.action = function(id,active,$index) {
        var data={_id:id,active:active};
        $http.post('/galleryactive',data).success(function(dat){
            // var index=$scope.testimonies.indexOf({_id});
            $scope.galleries[$index].active=dat.active;
        });
    }
    $scope.create = function() {
        var article = new Galleries({
            name: this.name,
						image:this.image,
						rel:this.rel,
						occupancy:this.occupancy,
						view:this.view,
						size:this.size,
            type: $scope.myArray
        });
        article.$save(function(response) {
            $location.path('galleries/');
        });

        this.title = '';
        this.content = '';
    };

    $scope.remove = function(article,item) {
				var galleries=new Galleries({_id:article,id:article});
        galleries.$remove(function(){
						var index=$scope.galleries.indexOf(item);
            $scope.galleries.splice(index,1); 
				});
    };

    $scope.update = function() {
        var gallery = $scope.gallery;
        if (!gallery.updated) {
            gallery.updated = [];
        }
        gallery.updated.push(new Date().getTime());

        gallery.$update(function() {
            $location.path('galleries/');
        });
    };

    $scope.find = function() {
        Galleries.query(function(galleries) {
            $scope.galleries = galleries;
        });
    };

    $scope.findOne = function() {
        Galleries.get({
            galleryId: $routeParams.galleryId
        }, function(article) {
            $scope._id = article._id;
            $scope.rel = article.rel;
        });
    };
}]);