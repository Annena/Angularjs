app.controller('detailsVariableReportCtrl', ['$scope','$state','$http', "$stateParams",'point',function($scope,$state,$http,$stateParams,point) {
	var id=$stateParams.id;
    $scope.variableReport = {};
    
	var url = window.location.protocol +"//" + window.location.host + "/config/api/v1.0";

   //获得对就的监控点中的变量名称以及id
//    var collector = point.getcollector();
//    $scope.variableReport.dataAcquisitionDeviceId = collector.id;
//    $scope.variableReport.dataAcquisitionDeviceName = collector.name;
   
    $scope.cancel = function(){
    	$state.go('app.point.variable.list');
    }
   
    
    
    $scope.ok = function(){
    	$state.go('app.point.variable.report.modify',{id:id});
    	}
 
    
    
    $scope.getVariableReport= function(){
    	$http.get(url+"/data-acquisition-variables/"+id+"/report-policys/")
    	.success(function(data){
    		$scope.variableReport = data[0];
//    		console.log($scope.variableReport)
    	})
    	.error(function(largeLoad,status,dx){
    		alert(dx("X-configApp-error"));
    	})
    }; 	
    $scope.getVariableReport();
    
}]);
