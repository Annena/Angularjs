app.controller('devicesController', function($scope,$http, $timeout) {
    var url = window.location.protocol +"//" + window.location.host + "/config/api/v1.0";
    $scope.showList = false;
    //必须的!用于全部展开和收缩
    $scope.my_tree = {};
    $.ajax({
    	type:"get",
    	url: url + "/da-device-model-tree/",
    	async:false,
    	headers:{'appId':'iot-config'},
    	success:function(data){
    		var modelData = toTreeData(data.entity);
        	$scope.my_data = modelData;
    	}
    })
    //对后台的数据格式进行修改
    function toTreeData(modelData){
    	var treedata = [];
    	var compaines = '',series = '',models = '';
    	//类型
        var types = modelData.types;
        angular.forEach(types,function(type,typeIndex){
        	treedata.push({label:type.name});
        	
        	//厂商
        	if(type.companies){
        		companies = type.companies;
        		treedata[typeIndex].children = [];
        		angular.forEach(companies,function(company,comIndex){
        			treedata[typeIndex].children.push({label:company.name});
        			
        			//系列
        			if(company.series){
        				series = company.series;
        				treedata[typeIndex].children[comIndex].children = [];
        				angular.forEach(series,function(item,seriesIndex){
        					treedata[typeIndex].children[comIndex].children.push({label:item.name});
        					//型号
        					if(item.models){
        						models = item.models;
        						treedata[typeIndex].children[comIndex].children[seriesIndex].children = [];
        						angular.forEach(models,function(model,modelIndex){
        							treedata[typeIndex].children[comIndex].children[seriesIndex].children.push({label:model.name,daDevModelId:model.id});
        						});
        					}
        					
        				})
        			}
        		});
        	}
        });
        return treedata;
    }
    
    //显示地址段列表
    $scope.showDevicesList = function(branch) {
        $scope.showList = false;
        if(branch.level==4){
      	  $http({
      		  url:url+'/da-variables/'+branch.daDevModelId+'/daaddrmaps',
      		  method:'get',
      		  headers:{'appId':'iot-config'},
      	  }).success(function(data){
      		  $scope.myData = data.entity;
      	  })
      	  
      	  $.ajax({
      		  url:url+'/da-variables/'+branch.daDevModelId+'/daaddrmaps',
      		  type:"get",
      		  async:false,
      		  headers:{'appId':'iot-config'},
      		  success:function(data){
      			  $scope.showList = true;
      			  $scope.myData = data.entity;
      			$scope.gridOptions = {
    		    		data:"myData",
    		    		multiSelect:false,
    		    		 columnDefs:[
    		                {field: "name",displayName:"地址段名称",enableCellEdit: false,width:'25%'},
    		                {field: "description",displayName:"地址段描述",enableCellEdit: false,width:'25%'},
    		                {field: "addrPosOffset",displayName:"地址偏移量",enableCellEdit: false,width:'25%'}, 
    		                {field: "addrMaxPos",displayName:"最大地址",enableCellEdit: false,width:'25%'}
    		            ]
    		    }
      		  }
      	  });
        }
      };
	    
    
});
