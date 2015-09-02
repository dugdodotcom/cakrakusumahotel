'use strict';

angular.module('mean.slides').controller('SlidesController', ['$scope', '$routeParams', '$location', 'Global', 'Slides','$upload', function ($scope, $routeParams, $location, Global, Slides,$upload) {
    $scope.global = Global;
		$scope._id='';
		$scope.progress=0;
		$scope.onFileSelect = function($files) {
				//$files: an array of files selected, each file has name, size, and type.
				for (var i = 0; i < $files.length; i++) {
						var $file = $files[i];
						$upload.upload({
								url: '/slides/upload',
								file: $file,
                data:{above:$scope.above,bottom:$scope.bottom,_id:$scope._id,rel:$scope.rel},
								progress: function(e){}
						}).progress(function(evt) {
						$scope.progress=(parseInt(100.0 * evt.loaded / evt.total));
						}).success(function(data, status, headers, config) {
                $scope.progress=0;
								if($scope._id===''){
										$scope.slides.push(data);
								}else{
                    $location.path('slides/');
                }
						});
				}
		}
    $scope.create = function() {
        var article = new Slides({
            name: this.name,
						image:this.image,
						rel:this.rel,
						occupancy:this.occupancy,
						view:this.view,
						size:this.size,
            type: $scope.myArray
        });
        article.$save(function(response) {
            $location.path('slides/');
        });

        this.title = '';
        this.content = '';
    };

    $scope.remove = function(article,item) {
				var slides=new Slides({_id:article,id:article});
        slides.$remove(function(){
						var index=$scope.slides.indexOf(item);
            $scope.slides.splice(index,1); 
				});
    };

    $scope.update = function() {
        var slide = $scope.slide;
        if (!slide.updated) {
            slide.updated = [];
        }
        slide.updated.push(new Date().getTime());

        slide.$update(function() {
            $location.path('slides/');
        });
    };

    $scope.find = function() {
        Slides.query(function(slides) {
            $scope.slides = slides;
        });
    };

    $scope.findOne = function() {
        Slides.get({
            slideId: $routeParams.slideId
        }, function(article) {
            $scope._id = article._id;
            $scope.rel = article.rel;
            $scope.above = article.above;
            $scope.bottom = article.bottom;
        });
    };
}]);