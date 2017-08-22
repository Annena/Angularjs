app.controller('CavansVariableCreate', ['$scope','$state','$http','point','$timeout', function($scope,$state,$http,point,$timeout) {
	
    $scope.variable = {};
    $scope.isdisableok = false;
    
    $scope.addList=[];
	$scope.addObj={};
    
    $scope.className=true;
    $scope.luastrshow=false;
    
    $scope.isdisabled = false;
    
    $scope.opcShow=false;
    $scope.comShow=true;
    $scope.fnkShow=false;
    $scope.isOK = true;
    $scope.isrepeat = false;
    $scope.startAddrOver = false;
    $scope.endAddrOver = false;
    $scope.variable.enableLua=false;

    
	var url = window.location.protocol +"//" + window.location.host + "/config/api/v1.0";
	var header = {'appId':'iot-config'};
    
    $scope.isCmdString = true;
    $scope.isName = true;
    
    $scope.init = function(){    	
    	//获得上级采集设备的id
		$http.get(url+"/da-devices/"+$scope.collector.id,{headers:header})
		.success(function(data){
			$scope.collector.template = data.entity.dataAcquisitionDevice.template;
			$scope.collector.daDevModelId = data.entity.dataAcquisitionDevice.daDevModelId;
			//OPC时的创建
	        if($scope.collector.template == 3){
	        	$scope.comShow =false;
	        	$scope.opcShow=true;
	        	$scope.fnkShow=false;
	        	$scope.variable.opcDevice='opc_device';
	        	$scope.variable.opcGroup='opc_group';
	        	$scope.variable.opcTags='opc_tags';
	        }else if($scope.collector.template == 4){
	        	$scope.fnkShow=true;
	        	$scope.comShow=false;
	        	$scope.opcShow=false;
	        }else{
	        	$scope.comShow=true;
	        	$scope.fnkShow=false;
	        	$scope.opcShow=false;
	        }
	        $scope.getData();
		});   	
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
    
    //调用
    $scope.getmethod = function(methodurl){
    	var tmpdata = [];
    	$.ajax({
        	method: "GET",
        	url:url+methodurl,
        	async: false
    	})
    	.success(function(data){
    		tmpdata =  data.entity;
    	}).error(function(data){
    		alert(data.message);
    	})   	
    	return tmpdata;
    };
    $scope.getData = function(){
    	$scope.dataBits=$scope.getmethod("/da-variables/data-bits");
    	$scope.variable.dataBits = 0;
        $scope.valueTypes=$scope.getmethod("/da-variables/value-types");
        $scope.variable.valueType = 0;
        $scope.byteOrders=$scope.getmethod("/da-variables/byte-orders");
        $scope.variable.byteOrder = 0
        $scope.daAddrCfgTypes=$scope.getmethod("/da-variables/com/addr-cfg-types");
        $scope.variable.daAddrCfgType = 0;
        $scope.cmdStrTypes=$scope.getmethod("/da-variables/com/cmd-str-types");
        $scope.funcCodes=$scope.getmethod("/da-variables/com/func-codes");
        $scope.dataTypes=$scope.getmethod("/da-variables/data-types");
        $scope.variable.dataType = 0;
        $scope.readWriteTypes=$scope.getmethod("/da-variables/read-write-types");
        $scope.variable.readWriteType = 0;
        $scope.addrMaps=$scope.getmethod("/da-variables/"+$scope.collector.daDevModelId+"/daaddrmaps");
        $scope.cmdstrings=$scope.getmethod("/da-variables/"+$scope.collector.daDevModelId+"/dacmdstrings");
        $scope.variable.cmdStrType = 0;
    };
    
   //实际地址
    $scope.startAddr=function(){
    	if($scope.addrMap != undefined){
        	$scope.absoluteEndMax = $scope.addrMap.addrMaxPos - $scope.addrMap.addrPosOffset;
        	$scope.variable.absoluteStartAddr=$scope.addrMap.addrPosOffset + $scope.variable.relativeStartAddr;
    	}
    };
    $scope.endAddr=function(){
    	$scope.absoluteEndMax = $scope.addrMap.addrMaxPos - $scope.addrMap.addrPosOffset;
    	$scope.variable.absoluteEndAddr = $scope.addrMap.addrPosOffset + $scope.variable.relativeEndAddr;
    	if($scope.addrMap != undefined){
    		$scope.variable.absoluteEndAddr = $scope.addrMap.addrPosOffset + $scope.variable.relativeEndAddr;
    	}
    };
    
   //判断地址设备类型 
    $scope.selectAddrCfgType=function(){
    	if($scope.variable.daAddrCfgType == 0 || $scope.variable.daAddrCfgType== undefined){
    		$scope.className=true;
    	}else{
    		$scope.className=false;
    	}
    };    
    $scope.selectAddrCfgType();
    
    //判断是否运行脚本
    $scope.luastrShow=function(){
    	if($scope.variable.enableLua == true){
    		$scope.luastrshow=true;
    	}else{
    		$scope.luastrshow=false;
    		$scope.variable.luaStr = null;
    	}
    };
    //地址验证
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
//            		$scope.variable.relativeStartAddr=$scope.variable.relativeStartAddr.toFixed(1);
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
//            		$scope.variable.relativeStartAddr=$scope.variable.relativeStartAddr.toFixed(1);
            		$scope.endAddrOver=false;
                }else if($scope.variable.relativeEndAddr === null || $scope.variable.relativeEndAddr === ""){
                	$scope.endAddrOver=false;
                }else{
                	$scope.endAddrOver=true;
                }
        	}
    	
    };
    
    
    //变量名的正则验证
    $scope.verifyName = function(name){
    	var reg = new RegExp("^[a-zA-Z_][a-zA-Z0-9_]*$");
    	$scope.isName = reg.test(name)?true:false;
    };
 
    $scope.selectCmdString = function(data){
    	if(data){
    		$scope.variable.cmdStr = data[0].cmdStr;
    		$scope.verifyCmdString();
    	}else{
    		return;
    	}
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
    };
    
   
    
    $scope.ok = function(){
    	if(!$scope.isName||!$scope.isCmdString){
    		return;
    	}
    	var data={};
    	
    	$scope.isdisabled=true;
    	$scope.isdisableok = true;
    	
    	if($scope.variable.daAddrCfgType == 0 && $scope.addrMap != null){
    		$scope.variable.daAddrMapId=$scope.addrMap.id;
        	$scope.variable.daAddrMapName=$scope.addrMap.name;
    	}
    	
    	$scope.variable.template = $scope.collector.template;
    	data.dataAcquisitionVariable=$scope.variable;
    	data.attrs=$scope.addList;
    	
    	$http({method:"post",
			url:url + "/da-variables",
			contentType: "application/json",
			dataType:"JSON",
			headers:{'appId':'iot-config'},
			data:JSON.stringify(data),
            async: false})
	    .success(function(data){
	    	$scope.msg.node.counts ++;
			$scope.msg.node.isCreated = true;
			$scope.msg.result = "OK";
	    	$scope.$emit($scope.event,$scope.msg);
	    	$scope.isdisabled = false;
		})
	    .error(function(data){
	        alert(data.message);
	        $scope.isdisabled=false;
	        $scope.isdisableok = false;
	    });
    };
    
    
    $scope.cancel = function(){
    	$scope.msg.result = "Cancel";
    	$scope.$emit($scope.event, $scope.msg);
    }
    
    $scope.msg = {};
    
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
    
    $scope.CreateInit = function(msg){
    	$scope.collector = {};
    	$scope.collector.id = msg.leftNode.id; 
    	
    	$scope.msg = msg;
    	$scope.msg.node = msg;
    	$scope.variable = {};
    	$scope.variable.x = msg.x;
    	$scope.variable.y = msg.y;
    	
    	$scope.variable.enableLua=false;
    	$scope.variable.monitorPointId = msg.leftNode.leftNode.id;
        $scope.variable.monitorPointName = msg.leftNode.leftNode.name;
        $scope.variable.dataAcquisitionDeviceId = msg.leftNode.id;
        $scope.variable.dataAcquisitionDeviceName = msg.leftNode.name;        		
		$scope.init();
    };
    
    $scope.$on("CreateVariableFromCanvas",function(event,msg){
    	$scope.event = "CreateVariableFromCanvasOver";
    	$scope.CreateInit(msg);
    });
    
    $scope.$on("VariableListCreateFromCanvas",function(event,msg){
    	$scope.event = "VariableListCreateFromCanvasOver";
    	$scope.CreateInit(msg);
    });

    $scope.getCreateOperation = function(){
    	$scope.$emit("CreateGetOperation", "");
	};
	
	$scope.getCreateOperation();
}]);
