app.controller('CollectorCtrl', ['$scope','$state','$http','$stateParams','point','$rootScope', function($scope,$state,$http,$stateParams,point,$rootScope) {
	var url = window.location.protocol +"//" + window.location.host + "/config/api/v1.0";
	$scope.pointName="";
	var monitorpoint = point.getpoint();
	$scope.pointName=monitorpoint.name;
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
    	
    	$http({method:"get",
			url:url + "/da-devices?page="+para.page+"&size="+para.size+"&monitorPointId="+para.monitorPointId,
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

    if($rootScope.collectorPage){
    	$scope.pagingOptions.currentPage = $rootScope.collectorPage;
    	$rootScope.collectorPage = 0;
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
    
    $scope.deleteCollector = function(row){
    	if(!confirm("确认要删除么？")){
    		return;
    	}
    	$http({method:"delete",
			url:url + "/da-devices/"+row.entity.id, 	 	
			contentType: "application/json",
			dataType:"JSON",
			headers:{'appId':'iot-config'},
            async: false})
	    .success(function(data){
	    	$state.reload();
	    	if(($scope.totalServerItems%$scope.pagingOptions.pageSize)==1){
	    		$rootScope.collectorPage = $scope.pagingOptions.currentPage-1;
	    	}else{
	    		$rootScope.collectorPage = $scope.pagingOptions.currentPage;
	    	}
		})
	    .error(function(data){
	        alert(data.message);
	    	$state.reload();
	    });
    };
    
    $scope.create = function(){
    	$state.go('app.point.view.collector.create');
    };
    
    $scope.modify = function(row){
    	$rootScope.collectorPage = $scope.pagingOptions.currentPage;
    	$state.go('app.point.view.collector.modify',{id:row.entity.id,name:row.entity.template});
    };
    
    $scope.gotoVariable = function(row){
    	var collecor = {};
    	collecor.id = row.entity.id;
    	collecor.name = row.entity.name;
    	collecor.template=row.entity.template;
    	collecor.daDevModelId=row.entity.daDevModelId;
    	point.setcollector(collecor);
    	$state.go("app.point.variable.list");
    };
    
    $scope.gotoVariableList = '<a  class="cmd-button" title="添加采集变量" ng-click="gotoVariable(row)" >{{row.entity.name}}</a>'
    $scope.buttonCell = '<div class="ngCellText">'+'<a  class="cmd-button " ng-click="deleteCollector(row)" >删除</a>'+
    '<a  class="cmd-button " ng-click="modify(row)" >修改</a>'+'</div>';
    $scope.gridOptions = {
    	showColumnMenu:true,
        data: 'myData',
        i18n:'zh-cn',
        enableSorting : true,
        enablePaging: true,
        showFooter: true,
        multiSelect: false, 
//        selectedItems: $scope.mySelections,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs:[
                    {field: "name",displayName:"采集设备名称",cellTemplate:$scope.gotoVariableList,enableCellEdit: false},
                    {field: "daDevCompanyName",displayName:"厂商",enableCellEdit: false},
                    {field: "daDevSeriesName",displayName:"系列",enableCellEdit: false},
                    {field: "daDevModelName",displayName:"型号",enableCellEdit: false},
                    {field: "daDevProtocolName",displayName:"协议接口",enableCellEdit: false},
                    {field: "physicalLink",displayName:"物理链路",enableCellEdit: false},                   
                    {field: "",displayName:"操作",cellTemplate:$scope.buttonCell,enableCellEdit: false,class:'ngCellText'}
                ],
    };

   

}]);
