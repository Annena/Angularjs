app.controller('VariableModifyCtrl', ['$scope','$state','$http','point','$stateParams',"$timeout", function($scope,$state,$http,point,$stateParams,$timeout) {
	
    $scope.variable = {};
    $scope.isdisableok = false;
    $scope.className = true;
    
    $scope.isdisabled = false;
    $scope.luastrshow=false;
    
    $scope.addList=[];
	$scope.addObj={};

    $scope.opcShow=false;
    $scope.comShow=true;
    $scope.isOK = true;
    $scope.isrepeat = false;
    $scope.startAddrOver = false;
    $scope.endAddrOver = false;
    $scope.endAddrOver1=false;
    
	var url = window.location.protocol +"//" + window.location.host + "/config/api/v1.0";
    
	$scope.id = $stateParams.id;
    var monitorpoint = point.getpoint();
    $scope.variable.monitorPointId = monitorpoint.id;
    $scope.variable.monitorPointName = monitorpoint.name;
    
    var collector = point.getcollector();
    $scope.variable.dataAcquisitionDeviceId = collector.id;
    $scope.variable.dataAcquisitionDeviceName = collector.name;
    $scope.variable.template=collector.template;
    $scope.variable.daDevModelId=collector.daDevModelId;
    $scope.isCmdString = true;
    
    $scope.variable.cmdStr="";
    
//OPC时的修改
    if($scope.variable.template == 3){
    	$scope.comShow =false;
    	$scope.opcShow=true;
    	$scope.fnkShow=false;
    }else if($scope.variable.template == 4){
    	$scope.comShow=false;
    	$scope.opcShow=false;
    	$scope.fnkShow=true;
    }else{
    	$scope.comShow=true;
    	$scope.opcShow=false;
    	$scope.fnkShow=false;
    }
    
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
	
	//初始化表格的显示
	$scope.initEdit = function(row){
		if(row.entity.name){
			row.entity.valueEditDisable = true;
			row.entity.nameEditDisable = true;
			row.entity.checkDisable = true;
			row.entity.showOK = false;
			row.entity.showEdit = true;
			$scope.isOK = true;
		}else{
			$scope.isOK = false;
			row.entity.valueEditDisable = false;
			row.entity.nameEditDisable = false;
			row.entity.checkDisable = false;
		}
	}
		
		$scope.valueTemplate = '<input ng-class="\'colt\' + col.index" ng-disabled="row.entity.valueEditDisable" style="height: 30px;text-align:center" ng-model="row.entity.value"/>';
		
		$scope.nameTemplate = '<input ng-class="\'colt\' + col.index" ng-disabled="row.entity.nameEditDisable" style="height: 30px;text-align:center" ng-model="row.entity.name"/>';
		
		$scope.operTemplate = '<a ng-show="row.entity.showOK" title="保存"><span class="glyphicon glyphicon-ok" style="margin-left:3%;margin-top:6px;color:#d9534f " ng-click="clickOK(row)"></span></a></span></a><a ng-show="row.entity.showEdit" title="编辑" ng-init="initEdit(row)"><span class="glyphicon glyphicon-edit" style="margin-left:3%;margin-top:6px;color:#d9534f " ng-click="clickEdit(row)"></span></a><a title="删除"><span class="glyphicon glyphicon-remove" style="margin-left:3%;margin-top:6px;color:#d9534f " ng-click="Remove(row)"></span></a>';
		
		$scope.gridOptions = {
		        data: 'myData',
		        enableColumnResize:true,
		        multiSelect:false,
		        columnDefs: [{field: 'name',width:"35%",cellClass:"",displayName: '属性名',cellTemplate:$scope.nameTemplate}, 
		                     {field:'value',width:"35%", displayName:'属性值',cellTemplate:$scope.valueTemplate},
		                     {field:'applyToGateway', displayName:'下发',width:'15%', enableCellEdit: false,cellTemplate:'<input type="checkbox"  ng-model=" row.entity.applyToGateway" style=" width: 24px;height: 24px;margin-top:3px;" ng-disabled="row.entity.checkDisable">'},
		                     {displayName:'操作',width:'15%',cellTemplate:$scope.revise,enableCellEdit: false,cellTemplate:$scope.operTemplate}]
		};
		
//删除动态添加属性
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

//判断是否运行脚本
    $scope.luastrShow=function(){
    	if($scope.variable.enableLua == true){
    		$scope.luastrshow=true;
    	}else{
    		$scope.luastrshow=false;
    		$scope.variable.luaStr = null;
    	}
    }    
    $scope.selectCmdString = function(data){
    	if(data){
    		$scope.variable.cmdStr = data[0].cmdStr;
    		$scope.verifyCmdString();
    	}else{
    		return;
    	}
    };
    
    
    $scope.getFocus=function(){
    	if($scope.variable.cmdStr == null){
    		$scope.variable.cmdStr="";
    	}
    	$scope.change=true;
    };   
 
//输入字符串类型的正则验证
    $scope.verifyCmdString = function(){
    	if($scope.variable.cmdStr == null){
    		$scope.isCmdString = true;
    		$scope.change = false;
    		return;
    	}
    	var reg = "";
    	if($scope.variable.cmdStrType==0){
    		//0是十六进制
    		reg = new RegExp("^[0-9a-fA-F]*$");
    	}else if($scope.variable.cmdStrType==1){
    		//1是ascii码
    		reg = new RegExp("^[\x00-\xff]*$");
    	}
    	$scope.isCmdString = reg.test($scope.variable.cmdStr)?true:false;
    	$scope.change = false;
    }    
	
    
//实际地址
    $scope.startAddr=function(){
    	if($scope.addrMap != undefined){
    	$scope.absoluteEndMax = $scope.addrMap.addrMaxPos - $scope.addrMap.addrPosOffset;
    	$scope.variable.absoluteStartAddr=$scope.addrMap.addrPosOffset + $scope.variable.relativeStartAddr;
    	}
    };
    $scope.endAddr=function(){
    	$scope.absoluteEndMax = $scope.addrMap.addrMaxPos - $scope.addrMap.addrPosOffset;
    	if($scope.addrMap != undefined){
    	$scope.variable.absoluteEndAddr = $scope.addrMap.addrPosOffset + $scope.variable.relativeEndAddr;
    	}
    };	
	//地址长度验证
    $scope.checkStartAddr = function(){ 
    	if($scope.variable.relativeEndAddr != null){
    		if($scope.variable.relativeStartAddr > $scope.variable.relativeEndAddr){
    			$scope.endAddrOver1=true;
    		}
    		else{
    			$scope.endAddrOver1=false;
    		}
    	}
		if($scope.variable.relativeStartAddr>$scope.absoluteEndMax){
    		$scope.startAddrOver = true;
    	}else{
    		var reg= new RegExp("^\\d*(\\.\\d)?$");
        	if(reg.test($scope.variable.relativeStartAddr)){
//        		$scope.variable.relativeStartAddr=$scope.variable.relativeStartAddr.toFixed(1);
            	$scope.startAddrOver=false;
            }else if($scope.variable.relativeStartAddr === null || $scope.variable.relativeStartAddr === ""){
            	$scope.startAddrOver=false;
            }else{
            	$scope.startAddrOver=true;
            }
    	}  
	 	
};
$scope.checkEndAddr = function(){
	if($scope.variable.relativeStartAddr != null){
		if($scope.variable.relativeStartAddr > $scope.variable.relativeEndAddr){
			$scope.endAddrOver1=true;
		}
		else{
			$scope.endAddrOver1=false;
		}
	}
		if($scope.variable.relativeEndAddr>$scope.absoluteEndMax){
    		$scope.endAddrOver = true;
    	}else{
    		var reg= new RegExp("^\\d*(\\.\\d)?$");
        	if(reg.test($scope.variable.relativeEndAddr)){
//        		$scope.variable.relativeStartAddr=$scope.variable.relativeStartAddr.toFixed(1);
        		$scope.endAddrOver=false;
            }else if($scope.variable.relativeEndAddr === null || $scope.variable.relativeEndAddr === ""){
            	$scope.endAddrOver=false;
            }else{
            	$scope.endAddrOver=true;
            }
    	}
	
};
    
    
    $scope.getmethod = function(methodurl){
    	var tmpdata = [];
    	$.ajax({
        	method: "GET",
        	url:url+methodurl,
        	headers:{'appId':'iot-config'},
        	async: false
    	})
    	.success(function(data){
    		tmpdata =  data.entity;
    	}).error(function(data){
    		alert(data.message);
    	})   	
    	return tmpdata;		
    };
    
    $scope.selectAddrCfgType=function(){
    	if($scope.variable.daAddrCfgType == 0 || $scope.variable.daAddrCfgType == undefined){
    		$scope.className=true;
    	}else{
    		$scope.className=false;
    		$scope.verifyCmdString();
    	}
    }
    
    $scope.getTheDev = function(){
    	$http({method:"get",
			url:url + "/da-variables/"+$scope.id,
			contentType: "application/json",
			dataType:"JSON",
			headers:{'appId':'iot-config'},
            async: false})
	    .success(function(data){
	    	$scope.variable = data.entity.dataAcquisitionVariable;
	    	$scope.variable.relativeStartAddr = $scope.variable.relativeStartAddr*1;
	    	$scope.variable.relativeEndAddr = $scope.variable.relativeEndAddr*1;
	    	$scope.addList=data.entity.attrs;
	        $scope.selectAddrCfgType();
	        $scope.addrMap($scope.variable.daAddrMapName)
	        $scope.startAddr();
	    	$scope.endAddr();
	        $scope.luastrShow();
	        $scope.myData = $scope.addList;
		})
	    .error(function(data){
	        alert(data.message);
	    	//$state.go('app.point.variable.list');
	    });
    };
    
//判断地址区块号
    $scope.addrMap=function(name){
    	var deep=true;
    	angular.forEach($scope.addrMaps,function(data){
    		if(deep == true){
    			if(name == data.name){
        			$scope.addrMap=data;
        			deep=false;
        		}
    		}
    		
    	});
    }
    
    //获取数据类型
    $scope.dataTypes = $scope.getmethod("/da-variables/data-types/");
    //获取值类型
    $scope.valueTypes = $scope.getmethod("/da-variables/value-types/");
    //获取小数位
    $scope.dataBits = $scope.getmethod("/da-variables/data-bits/");
    //获取读写模式
    $scope.readWriteTypes = $scope.getmethod("/da-variables/read-write-types/");
    //获取字节顺序
    $scope.byteOrders = $scope.getmethod("/da-variables/byte-orders/");
    //获取地址设备类型
    $scope.daAddrCfgTypes = $scope.getmethod("/da-variables/com/addr-cfg-types/");
    //获取发送命令串类型
    $scope.cmdStrTypes = $scope.getmethod("/da-variables/com/cmd-str-types/");
    //获取功能码
    $scope.funcCodes = $scope.getmethod("/da-variables/tcp/func-codes/");
    //获取地址段区块号
    $scope.addrMaps = $scope.getmethod("/da-variables/"+$scope.variable.daDevModelId+"/daaddrmaps");
    //获取发送命令串
    $scope.cmdstrings=$scope.getmethod("/da-variables/"+$scope.variable.daDevModelId+"/dacmdstrings");	
    $scope.getTheDev();
//取消    
    $scope.cancel = function(){
    	$state.go('app.point.variable.list');
    }
    
    
//修改
    $scope.ok = function(){
    	if(!$scope.isCmdString){
    		return;
    	}
    	var data={};
    	if($scope.variable.daAddrCfgType == 0 && $scope.addrMap != null){
    		$scope.variable.daAddrMapId=$scope.addrMap.id;
        	$scope.variable.daAddrMapName=$scope.addrMap.name;
    	}
    	$scope.isdisableok = true;
    	
    	data.attrs=$scope.addList;
    	data.dataAcquisitionVariable=$scope.variable;
    	
    	$http({
    		method:"put",
			url:url + "/da-variables/",
			contentType: "application/json",
			dataType:"JSON",
			headers:{'appId':'iot-config'},
			data:JSON.stringify(data),
            async: false
            })
	    .success(function(data){
	    	$scope.isdisabled = true;
	    	$state.go('app.point.variable.list');
		})
	    .error(function(data){
	    	$scope.isdisableok = false;
	        alert(data.message);
	    });
    };
}]);
