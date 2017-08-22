app.controller('modifyPointReportCtrl', ['$scope','$state','$http','point','$stateParams', function($scope,$state,$http,point,$stateParams) {
	
    $scope.pointReport = {};
    $scope.isdisableok = false;
	var url = window.location.protocol +"//" + window.location.host + "/config/api/v1.0";
    
	$scope.id = $stateParams.id;
//    var monitorpoint = point.getpoint();
//    $scope.variable.monitorPointId = monitorpoint.id;
//    $scope.variable.monitorPointName = monitorpoint.name;
//    
//    var collector = point.getcollector();
//    $scope.variable.dataAcquisitionDeviceId = collector.id;
//    $scope.variable.dataAcquisitionDeviceName = collector.name;
    
    $scope.isChangeReports = [true,false];
	$scope.isCycleReports = [true,false];
	
	$scope.isChange =false;
	$scope.isCycle=false;
    
    
    //周期上报
    $scope.setCycleReport=function(Cycle){
    	var keepGoing = true;
		angular.forEach($scope.isCycleReports,function(data){
			if(keepGoing===true){
			 if(data===Cycle){
				$scope.isCycle=data;
				keepGoing=false;
			   }
			}
		});
    };
  //修改上报
    $scope.setChangeReport=function(Change){
    	var keepGoing = true;
		angular.forEach($scope.isChangeReports,function(data){
			if(keepGoing===true){
			 if(data===Change){
				$scope.isChange=data;
				keepGoing=false;
			   }
			}
		});
    };

    
    $scope.getTheDev = function(){
    	$http({method:"get",
			url:url + "/monitor-points/"+$scope.id+"/report-policys",
			contentType: "application/json",
			dataType:"JSON",
            async: false})
	    .success(function(data){
	    	$scope.pointReport = data[0];
	    	$scope.setChangeReport($scope.pointReport.isChangeReport);
	    	$scope.setCycleReport($scope.pointReport.isCycleReport);	    	
		})
	    .error(function(data,e,dx){
	        alert("查找不到待修改的采集变量，请查看待修改的采集变量是否存在。");
	    	$state.go('app.point.variable.list');
	    });
    };
    
    $scope.getTheDev();

    $scope.cancel = function(){
    	$state.go('app.point.point');
    };
    
    $scope.ok = function(){
    	
    	if(!confirm("确认要修改么？")){
    		return;
    	}
    	
    	$scope.isdisableok = true;
    	
    	$scope.pointReport.isChangeReport = $scope.isChange;
    	$scope.pointReport.isCycleReport = $scope.isCycle;
    	
    	$http({method:"put",
			url:url + "/monitor-points/"+$scope.id+"/report-policys",
			contentType: "application/json",
			dataType:"JSON",
			 data:JSON.stringify($scope.pointReport),
            async: false})
	    .success(function(data){
	    	alert('修改成功！！');
	    	$state.go('app.point.point');
		})
	    .error(function(data,e,dx){
	    	$scope.isdisableok = false;
	        alert("修改失败。");
	    });
    };

}]);
