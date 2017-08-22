app.controller('CollectorCreateCtrl', ['$scope','$state','$http','point',function($scope,$state,$http,point) {
	
	var header = {'appId':'iot-config'};
    $scope.dev = {};
    $scope.opcData={};
    $scope.tcpData={};
    $scope.comData={};
    
    $scope.dev.daDevProtocolName='协议接口名称';
    $scope.dev.physicalLink="物理链路";
    $scope.isdisableok = false;
    
    $scope.isOpcShow=false;
    $scope.isTcpShow=false;
    
    $scope.collectorType_id='';
    $scope.company_id='';
    $scope.serie_id='';
    $scope.seriesModel_id='';
    
    $scope.edit=false;
    
    $scope.isPPI=false;
    $scope.isOPC=false;
    $scope.isTCP=false;
    $scope.bandRates = [];
    $scope.bandRate = "";
    $scope.luastrshow=false;
    $scope.isOK = true;
    
    $scope.addList=[];
	$scope.addObj={};
    
	$scope.dev.enableLua=false;
	
	$scope.isdisabled = false;
	$scope.showGrid = false;
	$scope.isrepeat = false;
	$scope.companies = [];
	$scope.series = [];
	$scope.seriesModels = [];
	
	var url = window.location.protocol +"//" + window.location.host + "/config/api/v1.0";
	var monitorpoint = point.getpoint();
    $scope.dev.monitorPointId = monitorpoint.id;
    $scope.dev.monitorPointName = monitorpoint.name;
    
    $scope.cancel = function(){
    	$state.go('app.point.view.collector.list');
    };

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
	
    //取类型对应的值
    $scope.getCollectorTypes=function(){
    	$http.get(url+'/da-device/types',{headers:header})
    	.success(function(data){  
    		$scope.collectorTypes=data.entity; 
    		$scope.selectType();
    	}).error(function(data){
    		alert(data.message);
    	})
    };
    //取所选类型的id
    $scope.selectType=function(){   
    	$scope.edit = true;
	    $scope.companies.length = 0;
		$scope.series.length = 0;
		$scope.seriesModels.length = 0;
		$scope.seriesModel = null;
		$scope.companie = null;
		$scope.serie = null;
		$scope.isOPC=false;
		$scope.isTCP=false;
		$scope.isPPI=false;
    	if($scope.collectorType != null){
    		$scope.dev.daDevTypeId=$scope.collectorType.id;
    		$scope.dev.daDevTypeName=$scope.collectorType.name;
    		$scope.getCompanies();
    	}else{
    		$scope.collectorType_id='';
    	}
    };
     
    
    //获取采集设备厂商列表
    $scope.getCompanies=function(){
    	$http.get(url+'/da-device/types/'+$scope.dev.daDevTypeId+'/companies',{headers:header})
    	.success(function(data){
    		$scope.companies=data.entity;
    		$scope.selectCompany();
    	}).error(function(data){
    		alert(data.message);
    	})
    };
    //取所先厂商的id
    $scope.selectCompany=function(){
    	if($scope.companie != null){
    		$scope.dev.daDevCompanyId=$scope.companie.id;
    		$scope.dev.daDevCompanyName=$scope.companie.name;
    		$scope.getSeries();
    	}else{
    		$scope.dev.daDevCompanyId='';
    		$scope.series='';
    		$scope.seriesModels=[];
    		$scope.edit = true;
    		$scope.dev.daDevProtocolName='协议接口名称';
    		$scope.dev.physicalLink='物理链路';
    		$scope.isOPC=false
    		$scope.isTCP=false;
    		$scope.isPPI=false;
    	}
    	$scope.edit = true;
    };
    
    
    //获取采集设备系列列表
    $scope.getSeries=function(){
    	$http.get(url+'/da-device/types/'+$scope.dev.daDevCompanyId+'/companies/'+$scope.dev.daDevCompanyId+'/series',{headers:header})
    	.success(function(data){
    		$scope.series=data.entity;
    		$scope.selectSeries();
    		
    	})
    };
    //获取采集设备配置的id
    $scope.selectSeries=function(){
    	if($scope.serie != null){
    		$scope.dev.daDevSeriesId=$scope.serie.id;
    		$scope.dev.daDevSeriesName=$scope.serie.name;
    		$scope.dev.template=$scope.serie.template;
    		$scope.getSeriesModel();
    		$scope.getphysicalLink();
    	}else{
    		$scope.dev.daDevSeriesId='';
    		$scope.seriesModels=[];
    		$scope.edit = true;
    		$scope.dev.daDevProtocolName='协议接口名称';
    		$scope.dev.physicalLink='物理链路';
    		$scope.isOPC=false
    		$scope.isTCP=false;
    		$scope.isPPI=false;
    	}
    };
    
    
    //获取采集设备型号
    $scope.getSeriesModel=function(){
    	$http.get(url+'/da-device/series/'+$scope.dev.daDevSeriesId+'/models',{headers:header})
    	.success(function(data){
    		$scope.seriesModels=data.entity;
    		$scope.dev.daDevModelId=$scope.seriesModels[0].daDevSeriesId;
    		$scope.dev.daDevModelName=$scope.seriesModels[0].name;  
    		if($scope.seriesModels.length<=1){
        		$scope.edit=false;
        		$scope.seriesModels[0]={name:'无'};
        		$scope.seriesModel = $scope.seriesModels[0];     		
        	}else{
        		$scope.edit=true;
        	}
    		
    	})
    	
    };
    //获取采集设备型号id
    $scope.selectSeriesModel=function(){   	
    	if($scope.seriesModel != null){
    		$scope.dev.daDevModelId=$scope.seriesModel.id;
    		$scope.dev.daDevModelName=$scope.seriesModel.name;
    	}else{
    		$scope.dev.daDevModelId='';   		
    	}
    };
    
    
    //获取协议接口以及物理链路
    $scope.getphysicalLink=function(){
    	$http.get(url+'/da-device/series/'+$scope.dev.daDevSeriesId,{headers:header})
    	.success(function(data){
    		$scope.dev.physicalLink=data.entity.physicalLink;
    		$scope.dev.daDevProtocolName=data.entity.daDevProtocolName;
    		$scope.dev.daDevProtocolId=data.entity.daDevProtocolId;
    		$scope.isShowPPI();    		
    	}).error(function(data){
    		alert(data.message);
    	})
    };
    

    
    //判断物理链路是否为第一种
    $scope.isShowPPI=function(){
    	if($scope.dev.template == 2 ){
    		$scope.isOPC=false
    		$scope.isTCP=false;
    		$scope.isPPI=true;
    		//获取波特率
    		$scope.baudRates = $scope.getmethod("/da-devices/com/baud-rates");
    		$scope.comData.baudRate = $scope.baudRates[0];
    		//获取串口名称
    		$scope.com_ports = $scope.getmethod("/da-devices/com/com-ports");
    		$scope.comData.comPort = $scope.com_ports[0];
    		//获取windows串口名称
    		$scope.win_com_ports = $scope.getmethod("/da-devices/com/win-com-ports");
    		$scope.comData.winComPort = $scope.win_com_ports[0];
    		//获取校验位:
    		$scope.parity_bits = $scope.getmethod("/da-devices/com/parity-bits");
    		$scope.keys=Object.keys($scope.parity_bits);
    		//获取数据位 :
    		$scope.data_bits = $scope.getmethod("/da-devices/com/data-bits");
    		$scope.comData.dataBit = $scope.data_bits[0];
    		//获取停止位: 
    		$scope.stop_bits = $scope.getmethod("/da-devices/com/stop-bits");
    		$scope.comData.stopBit = $scope.stop_bits[0];
    		//数据传输模式 :
    		$scope.trans_types = $scope.getmethod("/da-devices/com/trans-types");
    		$scope.comData.transType = $scope.trans_types[0]
    	}else if($scope.dev.template == 3){
    		$scope.isPPI=false;
    		$scope.isTCP=false;
    		$scope.isOPC=true;
    	}else{
    		$scope.isPPI=false;
    		$scope.isOPC=false;
    		$scope.isTCP=true;
    	}
    }; 
    
    $scope.getmethod = function(methodurl){
    	var tmpdata = [];
    	$.ajax({
        	method: "GET",
        	url:url+methodurl,
        	async: false,
        	headers:header
    	})
    	.success(function(data){
    		tmpdata =  data.entity;
    	}).error(function(data){
    		alert(data.message);
    	})   	
    	return tmpdata;
    };
    
    //调用下拉框内容
    $scope.getCollectorTypes();
    
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
    
	//showLua
	$scope.luastrShow=function(){
		if($scope.dev.enableLua == true){
			$scope.luastrshow=true;
		}else{
			$scope.luastrshow=false;
			$scope.dev.initLuaStr = null;
			$scope.dev.luaStr = null;
		}
	}
        
    //确认添加
    $scope.ok = function(){    	
    	$scope.isdisableok = true;    	
    	$scope.isdisabled=true;
//PPI添加    	
    	if($scope.isPPI === true){
    		var data={};
    		data.dataAcquisitionDevice=angular.extend($scope.dev,$scope.comData);
    		data.attrs=$scope.addList;

        	$.ajax({
        		url:url + "/da-devices",
        		type:"POST",
        		data:JSON.stringify(data),
        		dataType:"JSON",
        		headers:header,
        		contentType:"application/json",
        		async: false
        	}).success(function(data){
//        		alert("创建成功！！！！");
        		$state.go('app.point.view.collector.list');
        	}).error(function(data){
        		alert(data.responseJSON.message); 
        		$scope.isdisabled=false;
            });
    	}
//OPC添加    	
    	if($scope.isOPC === true){   		
    		if($scope.isOpcShow === true){
    			alert('请输入正确的ip地址');
    			return false;
    		}
    		var data={};
    		data.dataAcquisitionDevice=angular.extend($scope.dev,$scope.opcData);
    		data.attrs=$scope.addList;
    		$.ajax({
    			url:url+"/da-devices",
    			type:"POST",
    			data:JSON.stringify(data),
    			headers:header,
    			contentType:'application/json',
    			dataType:"JSON",
    			async:false
    		}).success(function(){
//    			alert('创建成功！！！');
    			$state.go('app.point.view.collector.list');
    		}).error(function(data){
    			$scope.isdisabled=false;
    			alert(data.responseJSON.message);
        	})
    	}
//TCP添加
    	if($scope.isTCP === true){
    		
    		if($scope.isTcpShow === true){
    			alert('请输入正确的ip地址');
    			return false;
    		}
    		
    		var data={};
    		data.dataAcquisitionDevice=angular.extend($scope.dev,$scope.tcpData);
    		data.attrs=$scope.addList;
    		$.ajax({
    			url:url+'/da-devices',
    			type:"POST",
    			data:JSON.stringify(data),
    			contentType:'application/json',
    			dataType:"JSON",
    			headers:header,
    			async:false
    		}).success(function(data){
//    			alert('创建成功!!!!');
    			$state.go('app.point.view.collector.list');
    		}).error(function(data){
    			$scope.isdisabled=false;
    			alert(data.responseJSON.message);
        	})
    	}
    };

}]);
