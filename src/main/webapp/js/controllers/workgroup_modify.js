app.controller("groupModify",["$state","$scope","$http","$stateParams",function($state,$scope,$http,$stateParams){
	var url = window.location.protocol+"//"+window.location.host +"/config/api/v1.0" ;
	//路由传过来的ID、相关消息
	var modify_id=$stateParams.modify_id;     //获取id
	var header = {'appId':'iot-config'};
	
	$scope.gateway = {};
	
	$scope.addObj={};
	$scope.addList=[];
	
	$scope.isdisabled=false;
	
	$scope.getTheGateway = function(){
		$http.get(url+"/workgroups/"+modify_id,{headers:header})
		.success(function(data){
			//默认选中传过来的值
			$scope.gateway = data.entity;
		})
		.error(function(data){
           alert(data.message);
        });
	};
	$scope.getTheGateway();
 

 
//确认修改按钮	
	$scope.OK = function(){
		data=$scope.gateway;
		$http({method:"put",
			url:url + "/workgroups",
			contentType: "application/json",
			dataType:"JSON",
			headers:header,
            data:JSON.stringify(data),
            async: false})
	    .success(function(data){
//	          alert("修改成功!")
	    	$scope.isdisabled=true;
	    	$state.go("app.workgroup.workgroup");
		}).error(function(data){
	        alert(data.message);
	        return;
	    });
	};

	
//返回按钮
	$scope.Clear=function(){
		$state.go("app.workgroup.workgroup");
	};
}]);