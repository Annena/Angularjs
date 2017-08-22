app.controller('SysVariableCtrl', ['$scope','$state','$http','$stateParams','point', function($scope,$state,$http,$stateParams,point) {
	var url = window.location.protocol +"//" + window.location.host + "/config/api/v1.0";
	var monitorpoint = point.getpoint();
	var collector = point.getcollector();
	
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
    $scope.setPagingData = function(data, page, pageSize){  
    	if(!data){
    		return;
    	}
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
    	var para = {};
    	para.page = page - 1;
    	para.size = pageSize;
    	para.monitorPointId = monitorpoint.id;
    	para.dataAcquisitionDeviceId = collector.id;
    	
    	$http({method:"get",
			url:url + "/sysdefinevariable/"+para.monitorPointId+"?page="+para.page+"&size="+para.size+"&monitorPointId="+para.monitorPointId+"&dataAcquisitionDeviceId="+para.dataAcquisitionDeviceId,
			contentType: "application/json",
			dataType:"JSON",
            async: false})
	    .success(function(data){
	    	$scope.myData = data;
		})
	    .error(function(data,e,dx){
	        
	    });
    };
    
    $scope.mySelections = [];
    
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    
    $scope.deleteVariable = function(row){

    	$http({method:"delete",
			url:url + "/sysdefinevariable/"+row.entity.id,
			contentType: "application/json",
			dataType:"JSON",
            async: false})
	    .success(function(data){
	    	$state.reload();
		})
	    .error(function(data,e,dx){
	    	$state.reload();
	    });
    };
    
    $scope.create = function(){
    	$state.go('app.point.view.sysvariable.create');
    };
    
    $scope.modify = function(row){
    	
    	if(!row.entity.sysDefineVariableId){

        	$state.go('app.point.view.sysvariable.detail',{id:undefined,sysDefineVariableId:row.entity.id});
    	}
    	else{

        	$state.go('app.point.view.sysvariable.detail',{id:row.entity.id,sysDefineVariableId:undefined});
    	}
    	
    };
    
    $scope.isbtnenable = function(row){
    	if(!row.entity.sysDefineVariableId){
    		return "启用";
    	}
    	return "禁用";
    };
    
    
    $scope.add = function(row){
    	var entity = row.entity;
    	entity.monitorPointId = monitorpoint.id;
    	entity.sysDefineVariableId = entity.id;
    	entity.id = undefined;
    	$http({method:"post",
			url:url + "/sysdefinevariable/",
			contentType: "application/json",
			dataType:"JSON",
			 data:JSON.stringify(row.entity),
            async: false})
	    .success(function(data){
	    	$state.reload();
		})
	    .error(function(data,e,dx){
	        $state.reload();
	    });
    };
    
    $scope.enableSysVariable = function(row){
    	if(!row.entity.sysDefineVariableId){
    		$scope.add(row);
    	}
    	else{
    		$scope.deleteVariable(row);
    	}
    };
    
    $scope.getstatus = function(row){
    	if(!row.entity.sysDefineVariableId){
        	return "glyphicon  glyphicon-remove-sign icon text-alert";
    	}

    	return "glyphicon glyphicon-ok-sign icon text-success";
    };
    
    $scope.statusClass = '<label class="{{getstatus(row)}}"></label>';
    $scope.NameCell = '<a  class="cmd-button" ng-click="modify(row)" >{{row.entity.name}}</a>';
    $scope.buttonCell = '<a  class="cmd-button" ng-click="enableSysVariable(row)" >{{isbtnenable(row)}}</a><a  class="cmd-button" ng-click="modify(row)" >详情</a>';
    $scope.gridOptions = {
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
                    {displayName:"名字",cellTemplate:$scope.NameCell,enableCellEdit: false},
                    {field: "description",displayName:"描述",enableCellEdit: false},
                    {field: "unit",displayName:"单位",enableCellEdit: false},
                    {field: "reportPeriod",displayName:"上报周期",enableCellEdit: false},
                    {field: "samplingPeriod",displayName:"采样周期",enableCellEdit: false},
                    {displayName:"状态",cellTemplate:$scope.statusClass,enableCellEdit: false},
                    {displayName:"操作",cellTemplate:$scope.buttonCell,enableCellEdit: false}
                ],
    };
}]);
