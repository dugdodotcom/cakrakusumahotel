'use strict';

angular.module('mean.bookings').controller('BookingsController', ['$scope', '$stateParams', 'Global', 'Bookings','$http','$state', function ($scope, $stateParams, Global, Bookings,$http,$state) {
    $scope.global = Global;
    $scope.cekchoose=function(){
      $http.get('/cekchoose').success(function(data){
        $scope.choose=data.no;
        console.log($scope.choose+'-'+$scope.choosedata.room);
        if($scope.choose>$scope.choosedata.room){
          $state.go('guestdetail');
        }
      });
    };
    $scope.find = function() {
        Bookings.query(function(bookings) {
            $scope.rooms = bookings;
        });
    };
    $scope.choosedatago=function(){
        $http({method: 'GET', url: '/choosedata'}).
        success(function(data, status, headers, config) {
            $scope.choosedata=data;
            $scope.cekchoose();
        }).
        error(function(data, status, headers, config) {
            $scope.choosedata='';
        });
    };
    $('body').on("click",'#datetimepicker1',function(){})
    $scope.addroom = function(choose,room,type,name) {
        var valid='';
        if($scope.choosedata.start===''){
            valid+='Please fill Check In Date.\n';
        }
        if($scope.choosedata.end===''){
            valid+='Please fill Check Out Date.\n';
        }
        if(valid===''){
            var data ={roomsId: room,type:type,choose:choose,name:name};
            $http.post('/addroom', data).success(function(data1){
              $scope.choose=$scope.choose+1;
              if($scope.choose-1>=$scope.choosedata.room||!$scope.choosedata.room){
                $state.go('guestdetail');
              }else{
                if(data1.success===0){
                  $scope.choosenroom=[data];
                }else{
                  choosenrm();
                }
              }
            });
        }else{
            alert(valid+'And Click "Edit reservation"');
        }
    };
	$scope.change = function(type,data){
		var datas={type:type,data:data};
		$http.post('/onchange',datas).success(function(){
		});
	}
  choosenrm();
	function choosenrm(){
		$http.get('/choosenroom').success(function(data){
      if(data.no!=0){
        $scope.choosenroom=data;
      }
		});
	};
  $scope.guestdetail=function(){
      $http.get('/guestdetail').success(function(data){
          $scope.data=data;
      });
  };
  $scope.booking=function(){
      var data={firstname:this.data.firstname,lastname:this.data.lastname,phone:this.data.phone,email:this.data.email,address:this.data.address,specialrequest:this.data.specialrequest};
      if(!$scope.global.authenticated){
          data.password=this.data.password;
          data.username=this.data.username;
      }
      $http.post('/bookinginput',data).success(function(res){
          if(res.success==1){
              window.location = "#!/ticket";
          }
      });
  }
  $scope.ticket=function(){
      $http.get('/ticket').success(function(res){
          $scope.tickets=res;
      });
  }
}]);
