app.controller('GridDemoCtrl', ['$scope', '$http','$state','$rootScope', function($scope, $http,$state,$rootScope) {
	$scope.gatewaytypes=[];
	var url = window.location.protocol+"//"+window.location.host +"/config/api/v1.0" ;
//	var obj1={};
	var obj2={};
	var statusObj = {
			"INIT":"未注册",
			"OFFLINE":"离线",
			"ONLINE":"在线"
	}
	var header = {'appId':'iot-config'};
	
	$scope.gateway_arg='';
	$scope.workgroup_arg='';
	$scope.dataArg='';
	
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
    //格式未分组群组
    $scope.formatData = function(data){
    	angular.forEach(data,function(item,index){
    		item.workgroupName = item.workgroupName==0?null:item.workgroupName;
    		if(item.status in statusObj){
    			item.status = statusObj[item.status];
    		}
    	})
    	return data;
    }
    
    $scope.setPagingData = function(data, page, pageSize){  
        $scope.myData = $scope.formatData(data.entity);
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText, urlData) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get(url+"/gateways?page="+(page - 1)+"&size="+pageSize+urlData,{headers:header}).success(function (largeLoad,status,dx) {
                	$scope.totalServerItems = dx("count");//返回记录的总数
                    data = largeLoad.entity.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });            
            } else {
                $http.get(url+"/gateways?page="+(page - 1)+"&size="+pageSize+urlData,{headers:header}).success(function (largeLoad,status,dx) {
                	$scope.totalServerItems = dx("count");
                    $scope.setPagingData(largeLoad,page,pageSize);
                });
            }
        }, 100);
    };
    if($rootScope.gatewayPage){
    	$scope.pagingOptions.currentPage = $rootScope.gatewayPage;
    	$rootScope.gatewayPage = 0;
    }
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,undefined,$scope.dataArg);

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
   
    //删除
    $scope.deleteIngridTenant = function(row){
//    	$rootScope.gatewayPage = $scope.pagingOptions.currentPage;
        var isTrue=confirm("确定删除吗？");
        if(isTrue===true){
        	$http.delete(url+"/gateways/"+row.entity.id,{headers:header})
        	.success(function(){
        		$state.go("app.gateway.gateway",{},{reload:true});
        		if(($scope.totalServerItems%$scope.pagingOptions.pageSize)==1){
    	    		$rootScope.gatewayPage = $scope.pagingOptions.currentPage-1;
    	    	}else{
    	    		$rootScope.gatewayPage = $scope.pagingOptions.currentPage;
    	    	}
        	}).error(function(data){
        		alert(data.message);
        	});
        };
};    

	//修改
    $scope.updataIngridTenant = function(row){
    	$rootScope.gatewayPage = $scope.pagingOptions.currentPage;
    	$state.go('app.gateway.modifygate',{modify_id:row.entity.id}); 
    }
    
    //详细信息
  	$scope.getRowName = function(row){
  		$rootScope.gatewayPage = $scope.pagingOptions.currentPage;
  		$state.go('app.gateway.detailsgate',{details_id:row.entity.id});
  	}
    
    //显示和隐藏

    
   //筛选网关类型
    $scope.init = function(){
    	$http.get(url+"/gateway-types",{headers:header})
		.success(function(data){
			$scope.gatewaytypes = data.entity;	
			$http.get(url+"/workgroups",{headers:header})
			.success(function(data){
				if(data.entity){
					obj2.name='未分组';
	                obj2.id=0;
	                data.entity.unshift(obj2);
				}				
				$scope.workgroups = data.entity;				
			});
    });
  };       
 $scope.init();
 
 $scope.search_gateway_id="";
 $scope.search_workgroup_id="";
 //筛选中的下拉以及网关筛选
 $scope.selectGateway=function(data){
	 var value=data[0].name;
	 $scope.gateway_search=value;
	 $scope.search_gateway_id=data[0].id;
	 $scope.dataArg='&gatewayTypeId='+$scope.search_gateway_id;
	 if($scope.search_workgroup_id !=undefined){
		 $scope.dataArg += "&workgroupId=" + $scope.search_workgroup_id;
	 }
	 $scope.pagingOptions.currentPage = 1;
	 $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,undefined,$scope.dataArg);
 };
 $scope.selectWorkgroup=function(data){
	 var gateway=$scope.dataArg;
	 var value=data[0].name;
	 $scope.workgroup_search=value;
	 $scope.search_workgroup_id=data[0].id;
	 $scope.dataArg ='&workgroupId='+$scope.search_workgroup_id;
	 if($scope.search_gateway_id !=undefined && $scope.search_gateway_id != ""){
		 $scope.dataArg += "&gatewayTypeId=" + $scope.search_gateway_id;
	 }
	 $scope.pagingOptions.currentPage = 1;
	 $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,undefined,$scope.dataArg);
 };
//清空筛选条件
 $scope.clear=function(){
	 $scope.workgroup_search='';
	 $scope.gateway_search='';
	 
	 $scope.search_gateway_id='';
	 $scope.search_workgroup_id='';
	 
	 $scope.dataArg='';
	 
	 $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,undefined,$scope.dataArg);
 };
 
  	$scope.nameTemplate = '<div class="ngCellText">'+'<a  class="cmd-button " ng-click="getRowName(row)" >{{row.entity.name}}</a>'+'</div>';
    $scope.revise='<div class="ngCellText">'+'<a  class="cmd-button " ng-click="deleteIngridTenant(row)" >删除</a>'+
    '<a  class="cmd-button " ng-click="updataIngridTenant(row)" >修改</a>'+'</div>';
   
    $scope.gridOptions = {
        showColumnMenu:true,// 是否显示列头部菜单按钮
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
            {field: "name",displayName:"网关名称",cellTemplate:$scope.nameTemplate,enableCellEdit: false,width:"15%"},
            {field: "gatewayTypeName",displayName:"网关类型",enableCellEdit: false,visible:true,width:"15%"},
            {field: "workgroupName",displayName:"群组",enableCellEdit: false,visible:true,width:"15%"},
            {field: "description",displayName:"描述",enableCellEdit: false,width:"30%"}, 
            {field: "status",displayName:"状态",enableCellEdit: false,width:"10%"},
            {field: "",displayName:'操作',cellTemplate:$scope.revise,enableCellEdit: false,width:"13%",class:'ngCellText'}
        ]
    };
}]);