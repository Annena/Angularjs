app.controller('SysVariableModifyCtrl', ['$scope','$state','$http','point','$stateParams', function($scope,$state,$http,point,$stateParams) {
	
    $scope.sysvariable = {};
    $scope.isdisableok = false;
	var url = window.location.protocol +"//" + window.location.host + "/config/api/v1.0";
    
	$scope.id = $stateParams.id;
    var monitorpoint = point.getpoint();
    $scope.sysvariable.monitorPointId = monitorpoint.id;
    $scope.sysvariable.monitorPointName = monitorpoint.name;
    
    var collector = point.getcollector();
    $scope.sysvariable.dataAcquisitionDeviceId = collector.id;
    $scope.sysvariable.dataAcquisitionDeviceName = collector.name;
    
    
    
    $scope.getTheSysVariable = function(){
    	
    	var tmpurl = url;
    	
    	if(!$stateParams.id){
    		tmpurl += "/sysdefine-variables/"+$stateParams.sysDefineVariableId;
    	}
    	else{
    		tmpurl += "/sysdefinevariable/get/" + $scope.id;
    	}
    	$http({method:"get",
			url:tmpurl,
			contentType: "application/json",
			dataType:"JSON",
            async: false})
	    .success(function(data){
	    	$scope.sysvariable = data;
		})
	    .error(function(data,e,dx){
	        alert("查找不到待修改的采集变量，请查看待修改的采集变量是否存在。");
	    	$state.go('app.point.view.sysvariable.list');
	    });
    };
    
    $scope.getTheSysVariable();
    
    $scope.cancel = function(){
    	$state.go('app.point.view.sysvariable.list');
    }
    
}]);
