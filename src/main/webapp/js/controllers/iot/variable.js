app.controller('VariableCtrl', ['$scope','$state','$http','$stateParams','point','$rootScope', function($scope,$state,$http,$stateParams,point,$rootScope) {
	var url = window.location.protocol +"//" + window.location.host + "/config/api/v1.0";
	var monitorpoint = point.getpoint();
	var collector = point.getcollector();
	
	$scope.pointName=monitorpoint.name;
	$scope.collectorName=collector.name;
	
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
    	para.monitorPointId = monitorpoint.id;
    	para.dataAcquisitionDeviceId = collector.id;
    	
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
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

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
	    	$state.reload();
	    	if($scope.totalServerItems%$scope.pagingOptions.pageSize==1){
	    		$rootScope.variablePage = $scope.pagingOptions.currentPage-1;
	    	}else{
	    		$rootScope.variablePage = $scope.pagingOptions.currentPage;
	    	}
		})
	    .error(function(data){
	        alert(data.message);
	    	$state.reload();
	    });
    };
    
    $scope.create = function(){
    	$state.go('app.point.variable.create');
    };
    
    $scope.modify = function(row){
    	$rootScope.variablePage = $scope.pagingOptions.currentPage;
    	$state.go('app.point.variable.modify',{id:row.entity.id});
    };
    
    $scope.detailsVariables=function(row){
    	$state.go('app.point.variable.report.policy',{id:row.entity.id});
    }
    
    $scope.buttonCell='<div class="ngCellText">'+'<a  class="cmd-button " ng-click="deleteVariable(row)" >删除</a>'+
    '<a  class="cmd-button " ng-click="modify(row)" >修改</a>'+'</div>';
    $scope.report_policy = '<a class="cmd-button" ng-click="detailsVariables(row)" >策略详情</a>';
    
    
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
}]);
