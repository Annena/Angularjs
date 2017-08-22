app.controller('groupGrid', ['$scope', '$http','$state','$rootScope', function($scope, $http,$state,$rootScope) {
	
	var header = {'appId':'iot-config'};
	var url = window.location.protocol+"//"+window.location.host +"/config/api/v1.0"; 
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    }; 
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [15, 30, 50],
        pageSize: 15,
        currentPage: 1
    };  
    $scope.setPagingData = function(data, page, pageSize){  
        $scope.myData = data.entity;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get(url+"/workgroups?page="+(page - 1)+"&size="+pageSize,{headers:header}).success(function (largeLoad,status,dx) {
                	$scope.totalServerItems = dx("count");//返回记录的总数
                	console.log($scope.totalServerItems)
                    data = largeLoad.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });            
            } else {
                $http.get(url+"/workgroups?page="+(page - 1)+"&size="+pageSize,{headers:header}).success(function (largeLoad,status,dx) {
                	$scope.totalServerItems = dx("count");
                    $scope.setPagingData(largeLoad,page,pageSize);
                });
            }
        }, 100);
    };
    if($rootScope.workgroupPage){
    	$scope.pagingOptions.currentPage = $rootScope.workgroupPage;
    	$rootScope.workgroupPage = 0;
    }
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal || newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    
    //删除
    $scope.deleteIngridTenant = function(row){
        var isTrue=confirm("确定删除吗？");
        if(isTrue===true){
        	$http.delete(url+"/workgroups/"+row.entity.id,{headers:header})
        	.success(function(){
        		$state.go("app.workgroup.workgroup",{},{reload:true});
        		if(($scope.totalServerItems%$scope.pagingOptions.pageSize)==1){
    	    		$rootScope.workgroupPage = $scope.pagingOptions.currentPage-1;
    	    	}else{
    	    		$rootScope.workgroupPage = $scope.pagingOptions.currentPage;
    	    	}
        	}).error(function(data){
        		alert(data.message);
        	});
        }
    };
    
    //修改
    $scope.updataIngridTenant = function(row){
    	$rootScope.workgroupPage = $scope.pagingOptions.currentPage;
    	$state.go('app.workgroup.modifygroup',{modify_id:row.entity.id}); 
    };
    //详细信息
    $scope.getRowName=function(row){
    	$state.go('app.workgroup.detailsgroup',{details_id:row.entity.id});
    };
    
    $scope.nameTemplate='<div class="ngCellText">'+'<a  class="cmd-button " ng-click="getRowName(row)" >{{row.entity.name}}</a>'+'</div>';
    $scope.revise='<div class="ngCellText">'+'<a  class="cmd-button " ng-click="deleteIngridTenant(row)" >删除</a>'+
    '<a  class="cmd-button " ng-click="updataIngridTenant(row)" >修改</a>'+'</div>';
    $scope.gridOptions = {
        showColumnMenu:true,
        i18n:'zh-cn',
        data: 'myData',
        enableSorting : true,//是否支持排序(列)
        enablePaging: true,
        showFooter: true,
        multiSelect: false,
        groups:["gate_name"],
        groupsCollapsedByDefault:false,
        selectedItems: $scope.mySelections,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs:[
         //   {field:"id",displayName:"群组ID",enableCellEdit:false},
            {field: "name",displayName:"群组名称",cellTemplate:$scope.nameTemplate,enableCellEdit: false,width:'28%'},
            {field: "description",displayName:"描述",enableCellEdit: false,width:'40%'}, 
            {field: "",displayName:'操作',cellTemplate:$scope.revise,enableCellEdit: false,width:"30%",class:'ngCellText'}
        ]
    };
}]);