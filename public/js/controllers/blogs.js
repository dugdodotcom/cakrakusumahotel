'use strict';

angular.module('mean.blogs').controller('BlogsController', ['$http','$scope', '$routeParams', '$location', 'Global', 'Blogs','$upload', function ($http,$scope, $routeParams, $location, Global, Blogs,$upload) {
    $scope.global = Global;
    $scope.progress=0;
		$scope.onFileSelect = function($files) {
				//$files: an array of files selected, each file has name, size, and type.
				for (var i = 0; i < $files.length; i++) {
						var $file = $files[i];
						$upload.upload({
								url: '/blog/upload/url',
								file: $file,
								progress: function(e){}
						}).progress(function(evt) {
						$scope.progress=(parseInt(100.0 * evt.loaded / evt.total));
						}).success(function(data, status, headers, config) {
								if(data.success===1){
										$scope.progress=0;
										$scope.blog.image=data.img;
								}
						});
				}
		}
    $scope.create = function() {
        var article = new Blogs($scope.blog);
        article.$save(function(response) {
            $location.path('blogs/');
        });
    };

    $scope.remove = function(article,item) {
				var blogs=new Blogs({_id:article});
        blogs.$remove(function(){
						var index=$scope.blogs.indexOf(item);
            $scope.blogs.splice(index,1); 
				});
    };

    $scope.update = function() {
        var blog = $scope.blog;
        if (!blog.updated) {
            blog.updated = [];
        }
        blog.updated.push(new Date().getTime());

        blog.$update(function() {
            $location.path('blogs/');
        });
    };

    /*$scope.find = function() {
        Blogs.get({
            page: $routeParams.page
        },function(blogs) {
            $scope.blogs = blogs.blogs;
            $scope.totalItems = blogs.count;
            $scope.currentPage = blogs.page;
        });
    };
     $scope.findOne = function() {
        Blogs.get({
            level: $routeParams.level
        }, function(article) {
            $scope.blog = article;
        });
    }; */
    $scope.findOne = function() {
        Blogs.get({
            blogId: $routeParams.blogId,
            page:'detail'
        }, function(article) {
            $scope.blog = article;
        });
    };
    $scope.find = function(){
        var page=$routeParams.page?'/'+$routeParams.page:'';
        $http.get('/blogs'+page).success(function(blogs){
            $scope.blogs = blogs.blogs;
            $scope.totalItems = blogs.count;
            $scope.currentPage = blogs.page;
        });
    }
    $scope.action = function(id,publish,$index) {
        var data={_id:id,publish:publish};
        $http.post('/blogpublish',data).success(function(dat){
            // var index=$scope.bookings.indexOf({_id});
            $scope.blogs[$index].publish=dat.publish;
        });
    }
    $scope.urlchange = function(){
        $scope.blog.url=convertToSlug($scope.blog.title);
    }
    function convertToSlug(Text)
    {
        console.log(Text);
        return Text
            .toLowerCase()
            .replace(/[^\w ]+/g,'')
            .replace(/ +/g,'-')
            ;
    }
    /* function playSound() {
      var type_attr = '';
      if (navigator.userAgent.indexOf('Firefox') != -1) {
        type_attr = "type=\"application/x-mplayer2\"";
      }
      document.getElementById("dummy").innerHTML = "<embed src=\"/sound/ding.wav\" hidden=\"true\" autostart=\"true\" loop=\"false\" " + type_attr + " />";
    } */
}]);
