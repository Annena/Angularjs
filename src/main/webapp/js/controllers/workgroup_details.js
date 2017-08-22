app.controller("groupDetails",["$state","$scope","$http","$stateParams",function($state,$scope,$http,$stateParams){
	var url = window.location.protocol+"//"+window.location.host +"/config/api/v1.0" ;
	//路由传过来的ID、相关消息
	var details_id=$stateParams.details_id;     //获取id
	
	$scope.gateway = {};
	
	$scope.getTheGateway = function(){
		var header = {'appId':'iot-config'};
		$http.get(url+"/workgroups/"+details_id,{headers:header})
		.success(function(data){
			//默认选中传过来的值
			$scope.gateway = data.entity;
		}).error(function(data){
    		alert(data.message);
    	});
	};
	$scope.getTheGateway();
//确认修改按钮	
	$scope.Ok = function(){				
		$state.go('app.workgroup.modifygroup',{modify_id:details_id});	    
	};

	
//返回按钮
	$scope.Clear=function(){
		$state.go("app.workgroup.workgroup");
	};

}]);