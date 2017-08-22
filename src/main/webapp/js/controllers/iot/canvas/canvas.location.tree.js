app.controller("CanvasLocationTree",["$scope","$http","$state",function($scope,$http,$state){
	/**
     * 树形结构
     */
	var url = window.location.protocol +"//" + window.location.host + "/config/api/v1.0";
    $scope.showAddBranch = false;
    $scope.showEditBranch = false;
    $scope.my_LocationData = [{label:"ROOT",children:[],id:'-1'}];
    //必须的!用于全部展开和收缩
    $scope.my_LocationTree = {};
    var header = {'appId':'iot-config'};

    
    $scope.getAllLocations = function(init){
    	$scope.initName = init || "ROOT";
    	$http.get(url+'/location',{headers:header}).success(function(data){
    		   $scope.my_LocationData[0].children = data;
    		   $scope.my_LocationTree.expand_all();
    	   });
    }
    
   $scope.loctionSelected = {label:"ROOT",id:-1};
   $scope.treeSeleced = function(branch){
	    $scope.loctionSelected = branch;
		$scope.editor.scene.scaleY = 1;
		$scope.editor.scene.scaleX = 1;
		$scope.editor.scene.translateX = 0;
		$scope.editor.scene.translateY = 0;
		$scope.isCreating = false;
   };
   
   $scope.Cancel = function(){
	   	$scope.msg.result = "Cancel";
	   	$scope.$emit("GatewayRelocationOver", $scope.msg);
   };

   $scope.Ok = function(){
	    $scope.msg.result = "OK";
	   	$scope.msg.location = {};
	   	var selected = $scope.my_LocationTree.get_selected_branch();
	   	if(selected){
	   		if($scope.msg.locationId == selected.id){
		   		$scope.msg.result = "Cancel";
	   		}else{
		   		$scope.msg.location = selected;
	   		}
	   	}else{
	   		$scope.msg.result = "Cancel";
	   	}
	   	$scope.$emit("GatewayRelocationOver", $scope.msg);
   };
   
   $scope.$on("GatewayRelocation",function(event,msg){
	   $scope.msg = {};
	   if(!msg || msg=={}){
		   $scope.Cancel();
		   return;
	   }
	   $scope.msg.gateway = msg;
	   $scope.getAllLocations();
   });
   
	$scope.getCreateOperation = function(){
    	$scope.$emit("CreateGetOperation", "");
	};
	
	$scope.getCreateOperation();
}]);