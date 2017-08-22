app.controller("Edit",["$scope","$http","$state",function($scope,$http,$state){
	var url = window.location.protocol+"//"+window.location.host +"/config/api/v1.0" ;
	var header = {'appId':'iot-config'};
	$scope.gateway={};
	
	$scope.workgroups = [];
	$scope.gatewaytypes = [];
	
	$scope.workgroup = {};
	$scope.gatewaytype={};
	
	
	$scope.addList=[];
	$scope.addObj={};

	$scope.isdisabled = false;
	$scope.isOK = true;
	$scope.isrepeat = false;
//判断所输入的IP地址
	$scope.gatewayIp = function(){
		var strRegex=new RegExp("^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$");
        if(strRegex.test($scope.gateway.ip)){
        	$scope.isIpShow=false;
        }else if($scope.gateway.ip === undefined || $scope.gateway.ip === ""){
        	$scope.isIpShow=false;
        }else{
        	$scope.isIpShow=true;
        }
	};
//判断所输入的Mac地址	
	$scope.getewayMac = function(){
		var strRegex=new RegExp("^([0-9a-fA-F]{2})(([/\s:-][0-9a-fA-F]{2}){5})$");
        if(strRegex.test($scope.gateway.mac)){
        	$scope.isMacShow=false;
        }else if($scope.gateway.mac === undefined || $scope.gateway.mac === ""){
        	$scope.isMacShow=false;
        }else{
        	$scope.isMacShow=true;
        }
	};
	
	
//获取数据下拉框的id
		$scope.initPage = function(){
			$http.get(url+"/workgroups",{headers:header})
			.success(function(data){
				$scope.workgroups = data.entity;
				
				$http.get(url+"/gateway-types",{headers:header})
				.success(function(data){
					$scope.gatewaytypes = data.entity;
				});
			});
		};
		$scope.initPage();
	
//clear返回数据事件
      $scope.Clear=function(){
    	 $state.go('app.gateway.gateway');
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
	
/*		$scope.formatAddList = function(list){
			var attrsList = [];
			angular.forEach(list,function(item){
				var obj = {
						name:item.name,
						value:item.value,
						applyToGateway:item.applyToGateway
				};
				attrsList.push(obj);
			})
			return attrsList;
		}*/
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
//创建事件
	$scope.Ok=function(){
						
		var data={};
		 
		$scope.gateway.workgroupId = $scope.workgroup.id==undefined?0:$scope.workgroup.id;
		$scope.gateway.gatewayTypeId = $scope.gatewaytype.id;
		$scope.gateway.priority=0;
		$scope.gateway.status="INIT";
		
		data.gateway=$scope.gateway;
		data.attrs=$scope.addList;
		var data=JSON.stringify(data);
		$http({
            url:url+"/gateways",
            contentType: "application/json",
			dataType:"JSON",
            method: 'POST',
            headers:header,
            data: data      
        }).success(function(){
        	$scope.isdisabled = true;
        	$state.go("app.gateway.gateway");
            //$scope.Clear();
        }).error(function(data){
    		alert(data.message);
    	});
	};
	
}]);