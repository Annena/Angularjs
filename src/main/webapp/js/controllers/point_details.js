app.controller("pointDetails",["$state","$scope","$http","$stateParams",function($state,$scope,$http,$stateParams){
	var url = window.location.protocol+"//"+window.location.host +"/config/api/v1.0" ;
	//路由传过来的ID、相关消息
	var details_id=$stateParams.details_id;     //获取id
	console.log(details_id)
	$scope.point = {};
	
	$scope.workgroups = [];
	$scope.gatewaytypes = [];
	
	$scope.workgroup = {};
	$scope.gatewaytype={};
	
	
	$scope.setWorkGroupById = function(id){
//		console.log(id);
		var keepGoing = true;
		angular.forEach($scope.workgroups,function(data){
			if(keepGoing===true){
			 if(data.id===id){
				$scope.workgroup=data;
				//break;
				keepGoing=false;
			   }
			}
		});
	};

	
	$scope.setGateWayTypeById = function(id){
//		console.log(id);
		var keepGoing = true;
		angular.forEach($scope.gatewaytypes,function(data){
//			console.log(data);
			if(keepGoing===true){
			 if(data.id===id){
				$scope.gatewaytype=data;
				//break;
				keepGoing=false;
			   }
			}
			
		});
//		console.log($scope.gatewaytype);
	};

	
	
	
	$scope.getThePoint = function(){
		$http.get(url+"/monitor-points/"+details_id)
		.success(function(data){
			//默认选中传过来的值
			$scope.attrs=data.attrs;
			$scope.point = data.monitorPoint;
			$scope.setWorkGroupById($scope.point.workgroupId);
			$scope.setGateWayTypeById($scope.point.gatewayId);
//			console.log(data.gatewayTypeId);
		}).error(function(data){
           alert(data.message);
        });
	};

//取下拉框中的所以信息以及调用	
	$scope.initPage = function(){
		$http.get(url+"/workgroups")
		.success(function(data){
			$scope.workgroups = data;
			
			$http.get(url+"/gateways")
			.success(function(data){
				$scope.gatewaytypes = data;
				
				$scope.getThePoint();
			});
		});
	};
	
//修改按钮	
	$scope.Ok = function(){
		$state.go('app.point.modifypoint',{modify_id:details_id});
	};

	
//返回按钮
	$scope.Clear=function(){
		$state.go('app.point.point');
	};
	$scope.initPage();
}]);