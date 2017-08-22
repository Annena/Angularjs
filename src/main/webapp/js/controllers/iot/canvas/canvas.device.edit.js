app.controller('CollectorModifyCtrl', ['$scope','$state','$http','point','$stateParams', function($scope,$state,$http,point,$stateParams) {
	
    $scope.dev = {};
    $scope.isdisableok = false;
	var url = window.location.protocol +"//" + window.location.host + "/config/api/v1.0";
	var header = {'appId':'iot-config'};
		
    
    $scope.tcpShow=false;
    $scope.opcShow=false;
    $scope.comShow=false;
   
    $scope.addList = [];
	$scope.addObj={};
    
	$scope.isdisabled = false;
	$scope.isOK = true;
	$scope.isrepeat = false;
	
    
  //初始化   
    $scope.init = function(){
    	var data=$scope.getdata("/da-devices/"+$scope.id);
    	$scope.selectTemplate(data);
    }
  //获得数据 
    $scope.getdata = function(methodurl){
    	var tmpdata = [];
    	$.ajax({
        	method: "GET",
        	url:url+methodurl,
        	headers:header,
        	async: false
    	})
    	.success(function(data){
    		tmpdata =  data.entity;
    	}).error(function(data){
            alert(data.message);
        })  	
    	return tmpdata;
    };
  //判断template
    $scope.selectTemplate = function(data){
    	if(data.dataAcquisitionDevice.template == 2){
    		$scope.addList = [];
    		$scope.tcpShow = false;
        	$scope.opcShow = false;
        	$scope.comShow = true;
        	$scope.comData = data.dataAcquisitionDevice;
        	$scope.addList = data.attrs;
        	$scope.myData = $scope.addList;
        	$scope.luastrShow('comData');
        	//获取波特率
    		$scope.baudRates = $scope.getmethod("/da-devices/com/baud-rates");
    		//获取串口名称
    		$scope.com_ports = $scope.getmethod("/da-devices/com/com-ports");
    		//获取windows串口名称
    		$scope.win_com_ports = $scope.getmethod("/da-devices/com/win-com-ports");
    		//获取校验位:
    		$scope.parity_bits = $scope.getmethod("/da-devices/com/parity-bits");
    		$scope.keys=Object.keys($scope.parity_bits);
    		//获取数据位 :
    		$scope.data_bits = $scope.getmethod("/da-devices/com/data-bits");
    		//获取停止位: 
    		$scope.stop_bits = $scope.getmethod("/da-devices/com/stop-bits");
    		//数据传输模式 :
    		$scope.trans_types = $scope.getmethod("/da-devices/com/trans-types");
    	}else if(data.dataAcquisitionDevice.template == 3){
    		$scope.addList = [];
    		$scope.tcpShow = false;
        	$scope.opcShow = true;
        	$scope.comShow = false;
        	$scope.opcData = data.dataAcquisitionDevice;
        	$scope.addList = data.attrs;
        	$scope.myData = $scope.addList;
        	$scope.luastrShow('opcData');
    	}else{
    		$scope.addList = [];
    		$scope.tcpShow = true;
        	$scope.opcShow = false;
            $scope.comShow = false;
        	$scope.tcpData = data.dataAcquisitionDevice;
        	$scope.addList = data.attrs;;
        	$scope.myData = $scope.addList;
        	$scope.luastrShow('tcpData');
    	}
    };
  //获得对应的接口
    $scope.getmethod = function(methodurl){
    	var tmpdata = [];
    	$.ajax({
        	method: "GET",
        	url:url+methodurl,
        	headers:header,
        	async: false
    	})
    	.success(function(data){
    		tmpdata =  data.entity;
    	}).error(function(data){
            alert(data.message);                
        })   	
    	return tmpdata;		
    };
  //lua腳本是否显示
	$scope.luastrShow=function(type){
		if($scope[type].enableLua == true){
			$scope.luastrshow=true;
		}else{
			$scope.luastrshow=false;
			$scope[type].initLuaStr = null;
			$scope[type].luaStr = null;
		}
	};
  //判断OpcIP中的IP是否正确   
    $scope.verifyIP = function(date){
   	 var strRegex=new RegExp("^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$");
        if(strRegex.test(date)){
        	$scope.isOpcShow=false;
        	$scope.isTcpShow=false;
        }else if(date === undefined || date === ""){
        	$scope.isOpcShow=false;
        	$scope.isTcpShow=false;
        }else{
        	$scope.isOpcShow=true;
        	$scope.isTcpShow=true;
        }
   }
    
 //设置自定义属性列表
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
	
    
    
    $scope.ok = function(){    	
//    	if(!confirm("确认要修改么？")){
//    		return;
//    	}
//    	console.log($scope.tcpData)
    	$scope.isdisableok = true;
    	
    	if($scope.tcpShow === true){
    		var data={};
    		if($scope.isTcpShow === true){
    			alert('请输入正确的ip地址');
    			return false;
    		}
    		data.dataAcquisitionDevice=$scope.tcpData;
    		data.attrs=$scope.addList;
    		$.ajax({
    			url:url+'/da-devices',
    			type:"PUT",
    			headers:header,
    			data:JSON.stringify(data),
    			contentType:'application/json',
    			async:false
    		}).success(function(data){
//    			alert('修改成功!!!!');
    			$scope.msg.result = "OK";
    	    	$scope.$emit("EditOver", $scope.msg);
    		}).error(function(data){
                alert(data.responseJSON.message);                
            })
    	}else if($scope.opcShow === true){
    		var data={};
    		if($scope.isOpcShow === true){
    			alert('请输入正确的ip地址');
    			return false;
    		}
    		data.dataAcquisitionDevice=$scope.opcData;
    		data.attrs=$scope.addList;;
    		$.ajax({
    			url:url+'/da-devices',
    			type:"PUT",
    			headers:header,
    			data:JSON.stringify(data),
    			contentType:'application/json',
    			async:false
    		}).success(function(data){
//    			alert('修改成功!!!!');
    			$scope.msg.result = "OK";
    	    	$scope.$emit("EditOver", $scope.msg);
    		}).error(function(data){
                alert(data.responseJSON.message);                
            })
    	}else{
    		var data={};
    		data.dataAcquisitionDevice=$scope.comData;
    		data.attrs=$scope.addList;
    		$.ajax({
        		url:url + "/da-devices",
        		type:"PUT",
        		headers:header,
        		data:JSON.stringify(data),
        		contentType:"application/json",
        		async: false
        	}).success(function(data){
//        		alert("修改成功！！！！");
        		$scope.msg.result = "OK";
    	    	$scope.$emit("EditOver", $scope.msg);
        	}).error(function(data){
                alert(data.responseJSON.message);                
            })
    	}    	
    };

  //取消修改按钮
	$scope.cancel = function(){
    	$scope.msg.result = "Cancel";
    	$scope.$emit("EditOver", $scope.msg);
	};
    $scope.msg = {};
	
	$scope.$on("EditDeviceFromCanvas",function(event,msg){
		/* 记录当前正在创建的网关，如果创建成功，则返回canvas己经创建好的网关信息  */
		$scope.msg.node = msg;
		$scope.gateway = {};
		$scope.gateway.x = msg.x;
		$scope.gateway.y = msg.y; 
		
		$scope.dev = {};
		$scope.dev.monitorPointId = msg.leftNode.id;
	    $scope.dev.monitorPointName = msg.leftNode.name;
	    $scope.myData = [];
		
		$scope.id = msg.id;
		$scope.init();
	});
	
	$scope.getEditOperation = function(){
    	$scope.$emit("EditGetOperation", "");
	};
	
	$scope.getEditOperation();
}]);
