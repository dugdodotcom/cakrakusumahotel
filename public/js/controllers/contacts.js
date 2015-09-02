'use strict';

angular.module('mean.contacts').controller('ContactsController', ['$http','$scope', '$routeParams', '$location', 'Global', 'Contacts','$upload', function ($http,$scope, $routeParams, $location, Global, Contacts,$upload) {
    $scope.global = Global;
    $scope.txtchat='';
    $scope.addchat=function(user,chat, $event){
        var chat={user:user,chat:chat,type:2};
        $http.post('/chatadmin',chat).success(function(res){
            var data4={
              level:$routeParams.level,
              _id:user,
              chat:res.chat
            }
            $scope.chats.push(res);
            $('input').val('');
        })
    };
    $scope.create = function() {
        var article = new Contacts({
            name: this.name,
						image:this.image,
						rel:this.rel,
						occupancy:this.occupancy,
						view:this.view,
						size:this.size,
            type: $scope.myArray
        });
        article.$save(function(response) {
            $location.path('contacts/');
        });

        this.title = '';
        this.content = '';
    };

    $scope.remove = function(article,item) {
				var contacts=new Contacts({_id:article,id:article});
        contacts.$remove(function(){
						var index=$scope.contacts.indexOf(item);
            $scope.contacts.splice(index,1); 
				});
    };

    $scope.update = function() {
        if($scope.contact._id){
            var contact = $scope.contact;
            $http.post('/contacts/'+$routeParams.level+'/update',contact).success(function() {
                $location.path('contacts/'+$routeParams.level);
            });
        }else{
            var article = new Contacts($scope.contact);
            article.level=$routeParams.level;
            article.$save(function(response) {
                $location.path('contacts/'+$routeParams.level);
            });
        }
    };

    /*$scope.find = function() {
        Contacts.get({
            page: $routeParams.page
        },function(contacts) {
            $scope.contacts = contacts.contacts;
            $scope.totalItems = contacts.count;
            $scope.currentPage = contacts.page;
        });
    };
     $scope.findOne = function() {
        Contacts.get({
            level: $routeParams.level
        }, function(article) {
            $scope.contact = article;
        });
    }; */
    $scope.findOne = function() {
        Contacts.get({
            level: $routeParams.level,
            page: $routeParams.page
        }, function(contacts) {
            $scope.contact = contacts.contact;
            $scope.contacts = contacts.contacts;
            $scope.totalItems = contacts.count;
            $scope.currentPage = contacts.page;
        });
    };
    $scope.action = function(id,replied,$index) {
        var data={_id:id,replied:replied};
        $http.post('/contactreplied',data).success(function(dat){
            // var index=$scope.bookings.indexOf({_id});
            $scope.contacts[$index].replied=dat.replied;
        });
    }
    /* function playSound() {
      var type_attr = '';
      if (navigator.userAgent.indexOf('Firefox') != -1) {
        type_attr = "type=\"application/x-mplayer2\"";
      }
      document.getElementById("dummy").innerHTML = "<embed src=\"/sound/ding.wav\" hidden=\"true\" autostart=\"true\" loop=\"false\" " + type_attr + " />";
    } */
}]);