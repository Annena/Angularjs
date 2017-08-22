app.controller("CavansMonitorCreate",["$scope","$http","$state",function($scope,$http,$state){
	var url = window.location.protocol+"//"+window.location.host +"/config/api/v1.0" ;
	var header = {'appId':'iot-config'};
	$scope.point={};

	$scope.point.enableCustomReport = false;
	$scope.point.enableLua = false;
	
	$scope.gatewaytype={};	
	$scope.gatewaytype.id=null;
	$scope.gatewaytype.name='';
	$scope.description='';
	
	$scope.addObj={};
	$scope.addList=[];
	$scope.luastrshow=false;
	
	
	$scope.isdisabled=false;
	$scope.isOK = true;
	$scope.isrepeat = false;

//show模块显示
	$scope.isShow=false;
	$scope.showAddAttr=function(){
		$scope.isShow=!$scope.isShow;
	};
	
//add事件
	$scope.Add=function(){
		$scope.addObj={
			name:"",
			value:"",
			applyToGateway:false,
			priority:0,
			
			nameEditDisable:false,
			valueEditDisable:false,
			checkDisable:false,
			showOK:true,
			showEdit:false,
		};		
		$scope.isOK = false;
		$scope.addList.push($scope.addObj);
	 };
	 $scope.clickOK = function(row){
			
			if(row.entity.name){
				$scope.isOK = true;
				var i = 0;
				angular.forEach($scope.myData,function(item){
					if(row.entity.name == item.name){
						i++;
						if(i==2){
							alert("属性名重复，请重新输入！")
							$scope.isrepeat = true;
							$scope.isOK = false;
						}
					}
					if(!item.name){
						$scope.isOK = false;
					}
				});
				if($scope.isrepeat){
					$scope.isrepeat = false;
					return;
				}
				row.entity.valueEditDisable = true;
				row.entity.nameEditDisable = true;
				row.entity.checkDisable = true;
				row.entity.showOK = false;
				row.entity.showEdit = true;
			}else{
				alert("属性名不能为空!");
			}
		};
	
	$scope.clickEdit = function(row){
		$scope.isOK = false;
		row.entity.valueEditDisable = false;
		row.entity.nameEditDisable = false;
		row.entity.checkDisable = false;
		
		row.entity.showEdit = false;
		row.entity.showOK = true;
	};
	
	$scope.myData = $scope.addList;
	$scope.valueTemplate = '<input ng-class="\'colt\' + col.index" ng-disabled="row.entity.valueEditDisable" style="height: 30px;text-align:center" ng-model="row.entity.value" />';
	
	$scope.nameTemplate = '<input ng-class="\'colt\' + col.index" ng-disabled="row.entity.nameEditDisable" style="height: 30px;text-align:center" ng-model="row.entity.name"/>';
	
	$scope.operTemplate = '<a ng-show="row.entity.showOK" title="保存"><span class="glyphicon glyphicon-ok" style="margin-left:3%;margin-top:6px;color:#d9534f " ng-click="clickOK(row)"></span></a></span></a><a ng-show="row.entity.showEdit" title="编辑"><span class="glyphicon glyphicon-edit" style="margin-left:3%;margin-top:6px;color:#d9534f " ng-click="clickEdit(row)"></span></a><a title="删除"><span class="glyphicon glyphicon-remove" style="margin-left:3%;margin-top:6px;color:#d9534f " ng-click="Remove(row)"></span></a>';
	
	$scope.gridOptions = {
	        data: 'myData',
	        enableColumnResize:true,
	        multiSelect:false,
	        columnDefs: [{field: 'name',width:"35%",cellClass:"",displayName: '属性名',cellTemplate:$scope.nameTemplate}, 
	                     {field:'value',width:"35%", displayName:'属性值',cellTemplate:$scope.valueTemplate},
	                     {field:'applyToGateway', displayName:'下发',width:'15%', enableCellEdit: false,cellTemplate:'<input type="checkbox"  ng-model=" row.entity.applyToGateway" style=" width: 24px;height: 24px;margin-top:3px;" ng-disabled="row.entity.checkDisable">'},
	                     {displayName:'操作',width:'15%',cellTemplate:$scope.revise,enableCellEdit: false,cellTemplate:$scope.operTemplate}]
	};
//删除事件
	$scope.Remove=function(row){
		$scope.addList.splice(row.rowIndex,1);
		$scope.isOK = true;
		angular.forEach($scope.addList,function(item){
			if(item.name==""){
				$scope.isOK = false;
			}
		});
		if($scope.addList.length<=0){
			$scope.isOK = true;
		}
		
	};

	// showLua
	$scope.luastrShow=function(){
		if($scope.point.enableLua == true){
			$scope.luastrshow=true;
		}else{
			$scope.luastrshow=false;
		}
	}
/* 根据名称获取己创建的网关信息  */
	$scope.getmonitorInfoByName = function(){
		var methodurl = "/canvas/monitor/" +$scope.point.gatewayId + "/" + $scope.point.name;
		$.ajax({
        	method: "GET",
        	url:url+methodurl,
        	headers:{'appId':'iot-config'},
        	async: false
    	})
    	.success(function(data){
    		if(data && data != {}){
    			$scope.msg.node =  data;
    			$scope.msg.result = "OK";
    	    	$scope.$emit("CreateOver", $scope.msg);
    		} else{
    			alert("创建失败，请重新创建。");
    		}
        	$scope.isdisabled = false;
    	}).error(function(data){
    		alert("创建失败，请重新创建。");
        	$scope.isdisabled = false;
    	})   	
	};	
//clear返回数据事件
    $scope.Clear=function(){
    	$scope.msg.node = $scope.editNode;
    	$scope.msg.result = "Cancel";
    	$scope.$emit("CreateOver", $scope.msg);
	};
//创建事件
	$scope.Ok=function(){
	 if($scope.gatewaytype.id != null){
		 $scope.point.gatewayId=$scope.gatewaytype.id;
	 }
								
		var data={};
		
		data.monitorPoint=$scope.point;
		data.attrs=$scope.addList;
		data=JSON.stringify(data);
		$scope.isdisabled=true;
		$http({
            url:url+"/monitor-points",
            method: 'POST',
            headers:header,
            data: data      
        }).success(function(){      
        	$scope.getmonitorInfoByName();
            //$scope.Clear();
        }).error(function(data){
           alert(data.message);
           $scope.isdisabled=false;
        });
	};
	
	$scope.msg = {};
	
	$scope.$on("CreateMonitorFromCanvas",function(event,msg){
		/* 记录当前正在创建的网关，如果创建成功，则返回canvas己经创建好的网关信息  */
		$scope.msg.node = msg;
		$scope.point = {};
		$scope.point.x = msg.x;
		$scope.point.y = msg.y;
		$scope.point.name = msg.text;
		
		$scope.point.enableCustomReport = false;
		$scope.point.enableLua = false;
		$scope.point.gatewayId = msg.leftNode.id;
		$scope.point.gatewayName = msg.leftNode.name;	
		
	});
	
	$scope.getCreateOperation = function(){
    	$scope.$emit("CreateGetOperation", "");
	};
	
	$scope.getCreateOperation();
}]);