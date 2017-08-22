app.controller('detailsPointReportCtrl', ['$scope','$state','$http', "$stateParams",'point',function($scope,$state,$http,$stateParams,point) {
	var id=$stateParams.id;
    $scope.pointReport = {};
    
	var url = window.location.protocol +"//" + window.location.host + "/config/api/v1.0";

   //获得对就的监控点中的变量名称以及id
//    var collector = point.getcollector();
//    $scope.variableReport.dataAcquisitionDeviceId = collector.id;
//    $scope.variableReport.dataAcquisitionDeviceName = collector.name;
//   
    $scope.cancel = function(){
    	$state.go('app.point.point');
    }
   
    
    
    $scope.ok = function(){
    	$state.go('app.point.report.modify',{id:id});
    	}
 
    
    
    $scope.getPointReport= function(){
    	$http.get(url+"/monitor-points/"+id+"/report-policys/")
    	.success(function(data){
    		$scope.pointReport = data[0];
    		console.log($scope.pointReport)
//    		console.log($scope.variableReport)
    	})
    	.error(function(largeLoad,status,dx){
    		alert(dx("X-configApp-error"));
    	});
    }; 	
    $scope.getPointReport();
    
}]);
