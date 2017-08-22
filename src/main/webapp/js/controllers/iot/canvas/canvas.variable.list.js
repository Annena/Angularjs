app.controller('VariableListCtrl', ['$scope','$state','$http','$stateParams','$rootScope', function($scope,$state,$http,$stateParams,$rootScope) {
	var url = window.location.protocol +"//" + window.location.host + "/config/api/v1.0";
	$scope.msg = {};
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    }; 
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [10, 20],
        pageSize: 10,
        currentPage: 1
    };  
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
    	var para = {};
    	para.page = page - 1;
    	para.size = pageSize;
    	para.monitorPointId = $scope.monitorpointId;
    	para.dataAcquisitionDeviceId = $scope.deviceId;
    	
    	$http({method:"get",
			url:url + "/da-variables?page="+para.page+"&size="+para.size+"&monitorPointId="+para.monitorPointId+"&dataAcquisitionDeviceId="+para.dataAcquisitionDeviceId,
			contentType: "application/json",
			dataType:"JSON",
			headers:{'appId':'iot-config'},
            async: false})
	    .success(function(data,status,dx){
	    	 $scope.myData = data.entity;
	    	 $scope.totalServerItems = dx("count");
		}).error(function(data){
    		alert(data.message);
    	})
    };
    
    $scope.mySelections = [];
    if($rootScope.variablePage){
    	$scope.pagingOptions.currentPage = $rootScope.variablePage;
    	$rootScope.variablePage = 0;
    }

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal || newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText,$scope.dataArg);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText,$scope.dataArg);
        }
    }, true);
    
    $scope.deleteVariable = function(row){
    	if(!confirm("确认要删除么？")){
    		return;
    	}
    	$http({method:"delete",
			url:url + "/da-variables/"+row.entity.id,
			contentType: "application/json",
			dataType:"JSON",
			headers:{'appId':'iot-config'},
            async: false})
	    .success(function(data){
	    	 $scope.msg.counts--;
	    	 $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
		})
	    .error(function(data){
	        alert(data.message);
	    	$state.reload();
	    });
    };
    
    $scope.create = function(){
    	$scope.$emit("VariableListCreate",$scope.msg);
    };
    
    $scope.modify = function(row){
    	$scope.msg.variable = row.entity;
    	$scope.$emit("VariableListNeedEdit", $scope.msg);
    };
    
    $scope.buttonCell='<div class="ngCellText">'+'<a  class="cmd-button " ng-click="deleteVariable(row)" >删除</a>'+
    '<a  class="cmd-button " ng-click="modify(row)" >修改</a>'+'</div>';
    
    
    $scope.gridOptions = {
    	showColumnMenu:true,
        data: 'myData',
        i18n:'zh-cn',
        enableSorting : true,
        enablePaging: true,
        showFooter: true,
        multiSelect: false, 
        selectedItems: $scope.mySelections,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs:[
                    {field: "name",displayName:"采集变量名称",enableCellEdit: false,width:'20%'},
                    {field: "description",displayName:"描述",enableCellEdit: false,width:'40%'},
                    {field: "unit",displayName:"单位",enableCellEdit: false,width:'20%'},
//                    {field: "getCycle",displayName:"采集周期",enableCellEdit: false},
//                    {displayName:"上报策略",cellTemplate:$scope.report_policy,enableCellEdit:false},
                    {field: "",displayName:"操作",cellTemplate:$scope.buttonCell,enableCellEdit: false}
                ],
    };
    
    $scope.Cancel = function(){
	   	$scope.$emit("EditOver", {});
    };
    
    $scope.$on("VariableListFromCanvas",function(event,node){
    	if(!node || node == {}){
    		$scope.Cancel();
    	}
    	
    	/**
    	 * 此处必须为连线后才进来，所以对于当前页面来说一定存在网关，监控点，采集设备
    	 */
    	$scope.msg = node;
    	
    	$scope.gatewayName = node.leftNode.leftNode.leftNode.name;
        $scope.pointName=node.leftNode.leftNode.name;
    	$scope.collectorName=node.leftNode.name;
    	$scope.monitorpointId = node.leftNode.leftNode.id;
    	$scope.deviceId = node.leftNode.id;
    	
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    });
    
    $scope.getEditOperation = function(){
    	$scope.$emit("EditGetOperation", "");
	};
	
	$scope.getEditOperation();
}]);
