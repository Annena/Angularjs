app.controller('CanvasController', ['$timeout','$scope','$rootScope','$state','$http','point', function($timeout,$scope,$rootScope,$state,$http,point) {
	var url = window.location.protocol+"//"+window.location.host +"/config/api/v1.0" ;

	$scope.my_data = [{label:"ROOT",id:-1,children:[]}];
	
	$scope.toggle = function(id){
		if(id){
			$("#"+id).toggle();
		}
	};
	
	$("#contextmenu").hide();
	$scope.isCreating = false;
	
	$scope.currentNode = undefined;
	
	$scope.editingnode = {};
	
	$scope.$on("CreateGetOperation",function(event,msg){
		$scope.sendMessage($scope.event,$scope.editingnode);
	});

	$scope.$on("CreateOver",function(event,msg){
		$scope.createOperationOver(msg);
	});
	
	$scope.$on("EditGetOperation",function(event,msg){
		$scope.sendMessage($scope.event,$scope.editingnode);
	});
	
	$scope.$on("EditOver",function(event,msg){
		var obj = $("#editobject");
		$scope.operation_object ="";
		obj.hide();
	});
	
	$scope.$on("CreateVariableFromCanvasOver",function(event,msg){
		var obj = $("#editobject");
		obj.hide();
		msg.isCreated = true;
		$scope.isCreating = false;
	});
	$scope.$on("VariableListCreateFromCanvasOver",function(event,msg){
		$scope.operation_object =  "tpl/iot/canvas.variable.list.html";
		$scope.editingnode = msg;
		$scope.event = "VariableListFromCanvas";
	});
	
	$scope.$on("VariableEditOver",function(event,msg){
		$scope.operation_object =  "tpl/iot/canvas.variable.list.html";
		$scope.editingnode = msg;
		$scope.event = "VariableListFromCanvas";
	});
	
	$scope.$on("VariableListNeedEdit",function(event,msg){
		$scope.operation_object =  "tpl/iot/canvas.variable.edit.html";
		$scope.editingnode = msg;
		$scope.event = "EditVariableFromCanvas";

	});
	$scope.$on("VariableListCreate",function(event,msg){
		$scope.operation_object = 'tpl/iot/canvas.variable.create.html';
		$scope.editingnode = msg;
		$scope.event = "VariableListCreateFromCanvas";
	});
	
	$scope.reLocation = function(){

		$scope.editingnode = $scope.currentNode;
		$scope.event = "GatewayRelocation";
		
		var obj = $("#editobject");		
		$scope.operation_object =  "tpl/iot/canvas.location.tree.html";
		obj.show();
		$scope.$apply();
	};
	
	$scope.$on("GatewayRelocationOver",function(event,msg){
		var obj = $("#editobject");
		$scope.operation_object = "";
		obj.hide();
		if(msg.result == "OK"){
			/**
			 * 更新对应gatway地点信息
			 */
			
			if(msg.location.id == $scope.loctionSelected.id){
				return;
			}
			var node = msg.gateway;
			var methodurl = "/canvas";
			var data = {};
			data.id = node.id;
			data.x = node.x;
			data.y = node.y;
			data.locationId = msg.location.id;
			data.locationName = msg.location.label;
			$.ajax({
	        	method: "PUT",
	        	url:url+methodurl,
	        	headers:{'appId':'iot-config'},
	        	headers:header,
				data:JSON.stringify(data),
				contentType:'application/json',
				async:false
	    	})
	    	.success(function(data){
	    		if(node.rightNodes && node.rightNodes.length > 0){
					$scope.removeChildren(node.rightNodes);
				}
				
				$scope.editor.scene.remove(node);
	    	}).error(function(data){
	    		alert("更改地点失败。请重试。");
	    	});
		}
	});
	
	$scope.event = "";
	
	$scope.editOperation = function(node){
		var eidtPage = "";
		var obj = $("#editobject");		
		switch(node.type){
			case "gateway":{
				eidtPage = "tpl/iot/canvas.gateway.edit.html";
				$scope.event ="EditGateWayFromCanvas";
				break;
			}
			case "monitor":{
				eidtPage = "tpl/iot/canvas.monitor.edit.html";
				$scope.event = "EditMonitorFromCanvas";
				break;
			}
			case "device":{
				eidtPage = "tpl/iot/canvas.device.edit.html";
				$scope.event = "EditDeviceFromCanvas";
				break;
			}
			case "variable":{
				eidtPage = "tpl/iot/canvas.variable.list.html";
				$scope.event = "VariableListFromCanvas";
				break;
			}
			default:{
				$scope.event = "";
				return;
			}
		}
		
		$scope.editingnode = node;
		$scope.operation_object = eidtPage;
		obj.show();
		$scope.$apply();
	};
	
	/* 解决时序问题 */
	$scope.sendMessage = function(event,node){
		if(event ==""){
			return;
		}
		$scope.$broadcast(event, node);
	};
	$scope.CreateMesage = function(event,page,node){
		$scope.event = event;
		var obj = $("#editobject");		
		obj.show();
		$scope.operation_object = page;
		$scope.editingnode = node;
		$scope.$apply();
	};
	
	$scope.createOperationOver = function(msg){
		var obj = $("#editobject");
		$scope.operation_object = "";
		obj.hide();
		if(msg.result == "Cancel"){
			$scope.editor.scene.remove($scope.editingnode);
			$scope.editingnode = {};
		}else if(msg.result == 'OK'){
			$scope.editingnode.text = msg.node.name;
			$scope.editingnode.id = msg.node.id;			
			$scope.editingnode.isCreated = true;
			$scope.editingnode = {};
		}
		$scope.isCreating = false;
	};
	
	$scope.editor = {};
	$scope.editor.container = undefined;
	$scope.editor.gateway = {};
	$scope.editor.monitor = {};
	$scope.editor.device = {};
	$scope.initCanvas = function(){
		var canvas = document.getElementById("drawCanvas");
		canvas.width = $("#canvasParent").width();
		canvas.height = "580";
		
		/**
		 * canvas响应绑定鼠标拖拽事件
		 */
		canvas.ondragover = function (e) {
			e.preventDefault();
			return false;
		};
		  
		canvas.ondrop = function(e){
			if($scope.isCreating == true){
				alert("正在创建节点，请先创建完成再进行下一个节点的创建。");
				return;
			}
			if(!$scope.editor.icon){
				return;
			}
			var scaleX = $scope.editor.scene.scaleX;
			var scaleY = $scope.editor.scene.scaleY;
			$scope.editor.scene.scaleX = 1;
			$scope.editor.scene.scaleY = 1;
			$scope.isCreating = true;
			var newnode = $scope.addNode($scope.editor.icontext,$scope.editor.icon, e.layerX,e.layerY,$scope.editor.nodeType,true);
			$scope.editor.scene.scaleX = scaleX;
			$scope.editor.scene.scaleY = scaleY;
			$scope.editor.icon = "";
			newnode.isCreated = false;
			switch($scope.editor.nodeType){
				case "gateway":{
					$scope.createOperation(newnode);
					break;
				}
				default:{
					break;
				}
			}
		};
		
		$scope.editor.tmpNode = new JTopo.Node();
		$scope.editor.tmpNode.rightNodes = [];
		$scope.editor.tmpNode.leftNode = undefined;
		$scope.editor.tmpNode.id = 0;
		
		var stage = new JTopo.Stage(canvas);
		
		stage.click(function(event){
            if(event.button == 0){// 右键
                // 关闭弹出菜单（div）
                $("#contextmenu").hide();
            }
        });
				
		var scene = new JTopo.Scene(stage); 
		scene.mode = 'normal';
		
		/**
		 * scene响应绑定鼠标移动事件
		 */
		scene.mousemove(function(e){
			$scope.editor.tmpNode.setLocation(e.x, e.y);
		});
		  
		scene.mouseup(function(e){
			
			if(e.target && e.target.layout){
                JTopo.layout.layoutNode(scene, e.target, true);    
            }  
			
		  	// mouse right click event, means canceled the opration linked
			if(e.button == 2){
				if($scope.editor.tmpLink){
					$scope.editor.scene.remove($scope.editor.tmpLink);
					$scope.editor.tmpLink = undefined;
					$scope.editor.startNode = undefined;
		  		}
		  		return;
			}
			
			
		  	// current selected node
		  	var nodes = $scope.editor.scene.selectedElements;
		  	
		  	if(nodes.length != 1 || nodes[0].elementType != "node"){
		  		return;
		  	}
		  	
		  	// if there is no selected node, we need to set the first node to be selected 
		  	if(!$scope.editor.startNode){
		  		$scope.editor.startNode = nodes[0];
		  		
		  		switch($scope.editor.startNode.type){
			  		case "gateway":{
			  			$scope.editor.tmpNode.type = "monitor";
			  			break;
			  		}
			  		case "monitor":{
			  			$scope.editor.tmpNode.type = "device";
			  			break;
			  		}
			  		case "device":{
			  			$scope.editor.tmpNode.type = "variable";
			  			break;
			  		}
			  		default:{
			  			$scope.editor.tmpLink = undefined;
			  			$scope.editor.tmpNode.leftNode = undefined;
			  			$scope.editor.tmpNode.rightNodes = [];
			  			$scope.editor.startNode = undefined;
			  			return;
			  		}
		  		}
		  		
		  		$scope.editor.tmpLink = $scope.linkNode($scope.editor.startNode,$scope.editor.tmpNode);
		  	}
		  	else if($scope.editor.startNode &&  $scope.editor.startNode == nodes[0]){
		  		return;
		  	}
		
		  	if(e.target && e.target instanceof  JTopo.Node)
		  	{
		  		if($scope.editor.startNode != nodes[0]){
		  			// select an another node,so we need to link the two nodes
			  		if($scope.editor.tmpLink){
			  			$scope.editor.scene.remove($scope.editor.tmpLink);
			  			$scope.editor.tmpLink = undefined;
			  			$scope.editor.tmpNode.leftNode = undefined;
			  			$scope.editor.tmpNode.rightNodes = [];
			  		}
			  		
					// link the two nodes
					$scope.linkNode($scope.editor.startNode,nodes[0]);
					$scope.editor.startNode = undefined;

				}
		  	}
		});
		
		$scope.editor.lineType = "one";
		$scope.editor.canvas = canvas;
		$scope.editor.scene = scene;
		$scope.editor.stage = stage;
		$scope.editor.tmpLink = undefined;
		$scope.editor.startNode = undefined; 
		$scope.editor.endNode = undefined; 
		$scope.editor.icon = "";
		
	};
	
	
	/**
	 * 工具栏上的按钮事件
	 * 
	 * */
//缩小
    $scope.zoomIn = function(){
    	$scope.editor.stage.zoomIn();
    };
//放大
	$scope.zoomOut = function(){
		$scope.editor.stage.zoomOut();
	};
//导出
	$scope.saveImage = function(){
		$scope.editor.stage.saveImageInfo();
	}
//默认或者框选
	$scope.select = function(){
		$scope.editor.stage.mode = $scope.selected;
	}
//鼠标缩放
	$scope.zoom = function(){
		if($scope.zoomCheckbox == true){
			$scope.editor.stage.wheelZoom = 1.2; // 设置鼠标缩放比例
		}else{
			$scope.editor.stage.wheelZoom = null; // 取消鼠标缩放比例
		}
	}
//保存的时候自动缩放
	$scope.save = function(){
		var bHasCanvas = false;
		var oCanvas =$("#drawCanvas")[0];
		var context=oCanvas.getContext("2d");
		if (context) {
			bHasCanvas = true;
		}
		if(!bHasCanvas){
			return false;
		}
		 var image = oCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
         window.location.href=image;
	}
	
	$scope.removeChildren = function(children){
		var length = children.length;
		for(var i=0; i<length; i++){
			$scope.editor.scene.remove(children[i]);
			if(children[i].rightNodes && children[i].rightNodes.length > 0){
				$scope.removeChildren(children[i].rightNodes);
			}
		}
	};
	
	$scope.todeleteNode = undefined;
	$scope.deleteFromDB = function(node){
		
		if(!confirm("确认要删除么？")){
    		return;
    	}
		
		if(!node.id){
			if(node.rightNodes && node.rightNodes.length > 0){
				$scope.removeChildren(node.rightNodes);
			}
			
			$scope.editor.scene.remove(node);
			
			return;
		}
		
		var uri = "";
		switch (node.type){
			case "gateway":
				uri = "/gateways/" + node.id;
				break;
			case "monitor":
				uri = "/monitor-points/" + node.id;
				break;
			case "device":
				uri = "/da-devices/" + node.id;
				break;
			default:
				return;
		}
		$scope.todeleteNode = node;
		$http({method:"delete",
			url:url + uri,
			contentType: "application/json",
			dataType:"JSON",
			headers:{'appId':'iot-config'},
            async: false})
	    .success(function(data){
	    	
	    	if($scope.todeleteNode.rightNodes && $scope.todeleteNode.rightNodes.length > 0){
				$scope.removeChildren($scope.todeleteNode.rightNodes);
			}
			
			$scope.editor.scene.remove($scope.todeleteNode);
			$scope.todeleteNode = undefined;
		})
	    .error(function(data){
	        alert(data.message);
			$scope.todeleteNode = undefined;
	    });
	};
	
	$scope.setNodeHide = function(node,isVisible){
		
		var children = node.rightNodes;
		node.visible = isVisible;
		
		if(!children || children.length == 0){
			return;
		}
		
		if(node.outLinks){
			var linkCount = node.outLinks.length;
			for(var i=0; i<linkCount;i++){
				node.outLinks[i].visible = isVisible;
			}
		}
		
		var length = children.length;
		for(var i=0; i < length; i++){
			$scope.setNodeHide(children[i],isVisible);
		}
	}
	
	$scope.toggleNode = function(node, isVisible){
		var children = node.rightNodes;
		if(!children || children.length == 0){
			return;
		}
		node.foldmode = !isVisible;
		if(node.outLinks){
			var linkCount = node.outLinks.length;
			for(var i=0; i<linkCount;i++){
				node.outLinks[i].visible = isVisible;
			}
		}
		
		var length = children.length;
		for(var i=0; i < length; i++){
			$scope.setNodeHide(children[i],isVisible);
		}
	};
	
	/* 右键菜单处理 */    
    $("#contextmenu a").click(function(){
        var text = $(this).text();
        
        switch (text){
        	case "删除该节点":{
        		$scope.deleteFromDB($scope.currentNode);
    	        $scope.currentNode = undefined;
        		break;
        	}
        	case "收起":{
        		$scope.toggleNode($scope.currentNode,false);
        		break;
        	}
        	case "展开":{
        		$scope.toggleNode($scope.currentNode,true);
        		break;
        	}
        	case "网关重新定位":{
        		$scope.reLocation();
        		break;
        	}
        	case "添加":{
        		$scope.createOperation($scope.currentNode);
        		break;
        	}
        	default:{
            	$scope.currentNode.save();
        		break;
        	}
        	
        }
        
        $("#contextmenu").hide();
        $scope.currentNode = undefined;
    });
    
    /*双击处理*/
    $scope.edit = function(node){
    	console.log(node);
    };
    
    $scope.createOperation = function(node){
    	var event = "";
        var page = "";
    	switch(node.type){
	    	case "monitor":{
	        	event = "CreateMonitorFromCanvas";
	        	page = 'tpl/iot/canvas.monitor.create.html';	
	    		break;
	    	}
	    	case "device":{

	        	event = "CreateDeviceFromCanvas";
	        	page = 'tpl/iot/canvas.device.create.html';	
	    		break;
	    	}
	    	case "variable":{
	        	event = "CreateVariableFromCanvas";
	        	page = 'tpl/iot/canvas.variable.create.html';	
	    		break;
	    	}
	    	case "gateway":{
	        	event = "CreateGateWayFromCanvas";
	        	page = 'tpl/iot/canvas.gateway.create.html';	
	    		break;
	    	}
	    	default:{
	    		return;
	    	}
	    		
    	}
    	
    	$scope.CreateMesage(event,page,node);
    };
    
    $scope.changeParent = function(link,nodeParent,node){

    	if(node.leftNode.id == nodeParent.id){
    		/**
    		 * 新老父节点相同
    		 */
    		return;
    	}
    	
    	var data = {};
    	data.childid = node.id;
    	data.oldparentid = node.leftNode.id;
    	data.newparentid = nodeParent.id;
    	data.type = node.type;
    	if(node.type == "variable"){
    		/**
    		 * 需要把monitorid也带下去
    		 */
    		data.monitorid = nodeParent.leftNode.id;
    	}
    	var oldLink = undefined;
    	/**
    	 * 一定能找到
    	 */
    	for(var i=0;i<node.leftNode.outLinks.length;i++){
    		var linkTmp = node.leftNode.outLinks[i];
    		if(linkTmp.right.id == node.id){
    			oldLink = linkTmp;
    			break;
    		}
    	}
    	
    	$.ajax({
        	method: "PUT",
        	url:url+'/canvas/parent',
        	headers:{'appId':'iot-config'},
        	headers:header,
			data:JSON.stringify(data),
			contentType:'application/json',
			async:false
    	})
    	.success(function(data){
    		/**
 	    	 * 成功后进行连线，并且删除原有的连线
 	    	 */
    		$scope.editor.scene.remove(oldLink)
 			$scope.editor.scene.add(link);
    		/**
    		 * 将原来的父节点右节点中删除此节点
    		 */
    		for(var i=0;i<node.leftNode.rightNodes.length;i++){
    			if(node.id == node.leftNode.rightNodes[i].id){
    				node.leftNode.rightNodes.del(i);
    				if(node.leftNode.layout){
    					JTopo.layout.layoutNode($scope.editor.scene, node.leftNode, true);    
    				}
    				break;
    			}
    		}
    		nodeParent.rightNodes.push(node);
    		node.leftNode = nodeParent;
    		link.left = nodeParent;
    		link.right = node;
    		if(nodeParent.layout){
				JTopo.layout.layoutNode($scope.editor.scene, nodeParent, true);    
			}
    	}).error(function(data){
    		return -1;
    	})  
    	
    	
    };
    
	/**
	 * line 需要存储的元素
	 * nodeLeft
	 * nodeRight
	 * direction
	 * lineType
	 */
	$scope.linkNode = function(nodeS, nodeD, f){
		/**
		 * 先要判断连线的方向，如果nodeS为网关，nodeZ为监控点，则可以直接连，如果监控点为nodeS,网关为nodeZ，则连线需要方向相反
		 */
		var nodeA = nodeS;
		var nodeZ = nodeD;

		/* 调整连线方向 */
		switch(nodeS.type){
			case "gateway":{
				if(nodeD.type == "monitor"){
					nodeA = nodeS;
					nodeZ = nodeD;
				}else{
					/* 其它的不能与此网关相连  */
					return;
				}
				break;
			}
			case "monitor":{
				if(nodeD.type == "device"){
					nodeA = nodeS;
					nodeZ = nodeD;
				}else if(nodeD.type=="gateway"){
					/* 连线方向应该相反  */
					nodeA = nodeD;
					nodeZ = nodeS;
				}else{
					return;
				}
				break;
			}
			case "device":{
				if(nodeD.type == "variable"){
					nodeA = nodeS;
					nodeZ = nodeD;
				}else if(nodeD.type=="monitor"){
					/* 连线方向应该相反  */
					nodeA = nodeD;
					nodeZ = nodeS;
				}else{
					return;
				}
				break;
			}
			case "variable":{
				if(nodeD.type=="device"){
					/* 连线方向应该相反  */
					nodeA = nodeD;
					nodeZ = nodeS;
				}else if(nodeD.type != "tmp"){
					return;
				}
				break;
			}
			default:{
				return;
			}
		}
		
		if(nodeZ.leftNode && nodeZ.leftNode.id == nodeA.id){
			return;
		}

		var link;
		if(f){
			link = new JTopo.FoldLink(nodeA, nodeZ);
		}else{
			link = new JTopo.Link(nodeA, nodeZ);
		}
		link.topoLevel = 2;
		link.parentLevel = 1;
		if($scope.editor.lineType == "one" || $scope.editor.lineType == "both"){
			link.arrowsRadius = 15;
		}
		link.bundleGap = 15;
		link.direction = 'vertical';
		link.arrowDirection = 'one';
		link.id = $scope.uuid(32,16);
		
		/* 连线NodeA为源，NodeZ为目的，目的的左只能为一个结点，如果左己经被连线了，则不能再连了  */
		if(nodeZ.leftNode){
			$scope.changeParent(link,nodeA,nodeZ);
			return;
		}
		
		var bNeedLink = true;
		var bNeedPush = true;
		var bNeedCreate = false;
		if(nodeZ != $scope.editor.tmpNode){
			
			/**
			 * 调出创建节点的窗口
			 */
			if($scope.isCreating){
				var nodeTmp = undefined;
				if(!nodeZ.isCreated){
					nodeTmp = nodeZ;
				}else if(!nodeA.isCreated){
					nodeTmp = nodeA;
				}
				if(nodeTmp){
					bNeedCreate = true;
					if(nodeTmp.type == "variable"){
						if(nodeA.rightNodes.length > 0){
							$scope.editor.scene.remove(nodeTmp);
							bNeedLink = false;
							bNeedPush = false;
							nodeTmp = nodeA.rightNodes[0];
						}
					}
				}
				
			}
			if(bNeedPush){
				nodeA.rightNodes.push(nodeZ);
				nodeZ.leftNode = nodeA;
				link.left = nodeA;
				link.right = nodeZ;
			}
			if(bNeedCreate){
				$scope.createOperation(nodeTmp);
			}
		}
		
		if(bNeedLink){
			$scope.editor.scene.add(link);
		}
		if(nodeZ.type == "variable"){
			nodeZ.text = nodeA.text + "_采集变量";
		}
		if(nodeA.layout && (nodeZ != $scope.editor.tmpNode)){
			JTopo.layout.layoutNode($scope.editor.scene, nodeA, true);    
		}
		return link;
		//双向箭头实现
//		if($scope.editor.lineType == "both"){
//			link.getStartPosition = function() {
//				var a;
//				return null != this.arrowsRadius && (a = (function(thisl){
//					var b=thisl.nodeA,c=thisl.nodeZ;
//					var d = JTopo.util.lineF(b.cx, b.cy, c.cx, c.cy),
//							e = b.getBound(),
//							f = JTopo.util.intersectionLineBound(d, e);
//					return f
//				})(this)),
//				null == a && (a = {
//					x: this.nodeA.cx,
//					y: this.nodeA.cy
//				}),
//						a
//			};
//			link.paintPath = function(a, b) {
//				if (this.nodeA === this.nodeZ) return void this.paintLoop(a);
//				a.beginPath(),
//						a.moveTo(b[0].x, b[0].y);
//				for (var c = 1; c < b.length; c++) {
//					null == this.dashedPattern ? (
//							(null==this.PointPathColor?a.lineTo(b[c].x, b[c].y):a.JtopoDrawPointPath(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, a.strokeStyle,this.PointPathColor))
//					) : a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern)
//				};
//				if (a.stroke(), a.closePath(), null != this.arrowsRadius) {
//					var d = b[b.length - 2],
//							e = b[b.length - 1];
//					this.paintArrow(a, d, e);
//					this.paintArrow(a, e, d)
//				}
//			};
//		}
		
	};
	
	$scope.addContainer = function(){
		var container = new JTopo.Container('');
        container.textPosition = 'Middle_Center';
        container.fontColor = '100,255,0';
        container.font = '18pt 微软雅黑';
        container.borderColor = '255,0,0';
        container.borderRadius = 30; // 圆角
        $scope.editor.scene.add(container);
        $scope.editor.container = container;
	};
	
	$scope.updateGatewayXY = function(id,x,y,locationId,locationName){
		var methodurl = "/canvas";
		var data = {};
		data.id = id;
		data.x = x;
		data.y = y;
		data.locationId = locationId;
		data.locationName = locationName;
		$.ajax({
        	method: "PUT",
        	url:url+methodurl,
        	headers:{'appId':'iot-config'},
        	headers:header,
			data:JSON.stringify(data),
			contentType:'application/json',
			async:false
    	})
    	.success(function(data){
    		return 0;
    	}).error(function(data){
    		return -1;
    	})  
	};
	
	$scope.updateMonitorXY = function(id,x,y){
		var methodurl = "/canvas/monitor";
		var data = {};
		data.id = id;
		data.x = x;
		data.y = y;
		$.ajax({
        	method: "PUT",
        	url:url+methodurl,
        	headers:{'appId':'iot-config'},
        	headers:header,
			data:JSON.stringify(data),
			contentType:'application/json',
			async:false
    	})
    	.success(function(data){
    		return;
    	}).error(function(data){
    		return;
    	})  
	};
	
	$scope.addNode = function(text, icon, x , y, type, isnew, id){
		var node = new JTopo.Node();
		var currentNode = null;
		if(!icon){
			node.setImage('./img/iot/images/'+ 'servervm.png', false);
		}else{
			node.setImage('./img/iot/icon/'+ icon+".png", false);
		}
		node.id = undefined;
		if(id){
			node.id = id;
		}
		node.fontColor = '0,0,0';
		node.mode="edit";
		node.name = text;
		node.counts = 0;
		node.setLocation(x, y);
		node.setSize(33,33);
		node.leftNode = undefined;
		node.rightNodes = [];
		node.type = type;
		node.x = x;
		node.y = y;
		node.foldmode = false;
		$scope.editor.scene.add(node);
		node.isCreated = !isnew;
      
		switch(node.type){
			case "gateway":{
				$scope.editor.gateway = node;
				node.locationId = $scope.loctionSelected.id;
				node.locationName = $scope.loctionSelected.label;
				break;
			}
			case "monitor":{
				node.layout = {type: 'tree', direction: 'bottom',width:100, height: 100};
				//$scope.linkNode($scope.editor.gateway,node);
				break;
			}
			case "device":{
				node.layout = {type: 'tree', direction: 'bottom', width:100, height: 100};
				break;
			}
			default:{
				break;
			}
		}
				
		node.mouseup(function(e){
			
			if(this.dragging == true){
				this.dragging = false;
				/**
				 * 更新坐标点
				 */
				if(this.type == "gateway"){
					$scope.updateGatewayXY(this.id,e.target.x,e.target.y,this.locationId,this.locationName);
				}else if(this.type == "monitor"){
					$scope.updateMonitorXY(this.id,e.target.x,e.target.y);
				}
			}
			
			if(e.button == 2){
				// 当前位置弹出菜单（div）
                $("#contextmenu").css({
                    top: event.pageY,
                    left: event.pageX
                }).show();
                
                /* 收缩右键菜单响应事件  */
                if(this.type != "variable"){
                	$("#menu_delete").show();
                	$("#menu_add").hide();
                	if(this.type == "gateway"){
                		$("#menu_changelocation").show();
                	}else{
                		$("#menu_changelocation").hide();
                	}
                	if(this.rightNodes){
                		if(this.rightNodes.length == 0){
                        	/* 如果没有叶子节点，则隐藏两个按钮  */
                        	$("#menu_unfolded").hide();
                        	$("#menu_folded").hide();
                        }else{
                        	if(this.foldmode){
                            	$("#menu_unfolded").show();
                            	$("#menu_folded").hide();
                        	}else{
                            	$("#menu_unfolded").hide();
                            	$("#menu_folded").show();
                        	}
                        }
                	}
                    
                }else{
            		$("#menu_changelocation").hide();
                	$("#menu_unfolded").hide();
                	$("#menu_folded").hide();
                	$("#menu_delete").hide();
                	$("#menu_add").show();
                }
                $scope.currentNode = e.target;
			}
			console.log(e.clientX);
		});
      
		node.dbclick(function(e){
			if(this.isCreated && !$scope.isCreating){
				$scope.editOperation(this);
			}
		});
		node.mousedrag(function(e){
			if(this.type == "gateway" || this.type == "monitor"){
				this.dragging = true;
			}
		});
		
		node.text = text;
		if(isnew){
			node.text = text + "_" + parseInt(Math.random()*10000,10);
		}
		if(node.type == "variable"){
			node.mouseover(function(){
				this.alarmColor = '255,0,0';
				this.alarmAlpha = 0.9;
				if(node.counts){
					this.alarm = "采集变量总数："+ node.counts;
				}else{
					this.alarm = "采集变量总数：0";
				}
				
				this.text = this.name;
			});
			node.mouseout(function(){
				this.alarm = undefined;
				this.text = undefined;
			});
		}else{
			node.mouseover(function(){
				if(node.foldmode){
					this.alarmColor = '0,255,0';
					this.alarmAlpha = 0.9;
					if(node.rightNodes){
						this.alarm = "可展开子节点个数："+ node.rightNodes.length;
					}else{
						this.alarm = "子节点个数：0";
					}
				}
			});
			node.mouseout(function(){
				this.alarm = undefined;
			});
		}
		
		return node;
	};
	  
	// create uuid
	$scope.uuid = function(len, radix) {
	    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	    var uuid = [], i;
	    radix = radix || chars.length;
	 
	    if (len) {
	      for (i = 0; i < len; i++){
	    	  uuid[i] = chars[0 | Math.random()*radix];
	      } 
	    } else {
	    	var r;
	 
	    	uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	    	uuid[14] = '4';
	 
	    	for (i = 0; i < 36; i++) {
	    		if (!uuid[i]) {
	    			r = 0 | Math.random()*16;
	    			uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
	    		}
	    	}
	    }
	 
	    return uuid.join('');
	};
	
	$scope.initCanvas();
	
	
	
	$scope.addVariable = function(device,variables){
		if(!variables){
			return;
		}
		var length = variables.length;
		for(var i=0;i<length;i++){
			var name = device.text + "_采集变量";
			variable = $scope.addNode(name,'tpIcon_4',1,2,'variable',false);
			$scope.linkNode(device,variable);
			variable.text = undefined;
			variable.counts = length;
			break;
		}
		
		JTopo.layout.layoutNode($scope.editor.scene, device, true);
	};
	
	$scope.addDeviceToCanvas = function(monitor,devices){
		if(!devices){
			return;
		}
		
		var length = devices.length;
		for(var i=0;i<length;i++){
			device = $scope.addNode(devices[i].name,'vr-selfdefined',1,2,'device',false,devices[i].id);
			$scope.linkNode(monitor,device);
			$scope.addVariable(device,devices[i].variables);
		}
	};
	
	
	$scope.addMonitorsTocanvas = function(monitors,gateway){
		if(!monitors){
			return;
		}
		var x = 0; 
		var y = 0;
		var length = monitors.length;
		for(var i=0;i<length;i++){
			
			var gX = x;
			var gY = y;
			if(monitors[i].x != 0){
				gX=monitors[i].x;
			}else{
				if(0 == monitors[i].devices.length){
					x +=100;
				}else{
					gX= x + Math.floor(100*monitors[i].devices.length/2);
					x += 100*monitors[i].devices.length;
				}
			}
			
			if(monitors[i].y != 0){
				gY=monitors[i].y;
			}else{
				y += 50;
			}
			
			monitor = $scope.addNode(monitors[i].name,'tpIcon_9',gX,gY,'monitor',false,monitors[i].id);
			$scope.linkNode(gateway,monitor);
			$scope.addDeviceToCanvas(monitor, monitors[i].devices);
			/**
			 * 调整monitor的位置
			 */
			JTopo.layout.layoutNode($scope.editor.scene, monitor, true);
			
		}
		
	};
	
	$scope.addGateWayToCanvas = function(id,name,x,y){
		//(text, icon, x , y, type, isnew)
		var gX = x;
		var gY = y;
		if(gX==0 && gY==0){
			gX=750;
			gY=10;
		}
		return $scope.addNode(name,'tpIcon_5',gX,gY,'gateway',false,id);
	};
		
	$scope.addGetNodesToCanvas = function(data){
		var gateway = $scope.addGateWayToCanvas(data.id,data.name,data.x,data.y);
		$scope.addMonitorsTocanvas(data.monitors, gateway);

	};
	
	$scope.getGateInfo = function(locationId){
		/**
		 * 先清空画板
		 */
		$scope.editor.scene.clear();
		var url = window.location.protocol +"//" + window.location.host + "/config/api/v1.0";
	    $.ajax({
	    	type:"get",
	    	url: url + "/canvas/location/" + locationId,
	    	async:false,
	    	headers:{'appId':'iot-config'},
	    	success:function(data){
	    		if(data && data != []){
	    			for(var i=0;i<data.length;i++){
		    			$scope.addGetNodesToCanvas(data[i]);
	    			}
	    		}
	    	},
	    	error:function(s,e,r){
	    		return;
	    	}
	    })
	};
	
	window.onresize=function(){
		$scope.editor.canvas.width=$("#canvasParent").width();
	};
    
    /**
     * 树形结构
     */
    $scope.showAddBranch = false;
    $scope.showEditBranch = false;
    $scope.my_data = [{label:"ROOT",children:[],id:'-1'}];
    //必须的!用于全部展开和收缩
    $scope.my_tree = {};
    var header = {'appId':'iot-config'};
    $scope.my_tree = {};
    $scope.isExpand = false;
    $scope.buttonContext = '全部收缩';
    
    $scope.allBranchCtrl = function(){
    	if($scope.isExpand){
    		$scope.my_tree.expand_all();
    		$scope.buttonContext = '全部收缩';
    	}else{
    		$scope.my_tree.collapse_all();
    		$scope.buttonContext = '全部展开';
    	}
    	$scope.isExpand = !$scope.isExpand;
    }

    /**
     * 递归调用有可能把网页弄漰
     */
    //展开所有父级及本身
    $scope.expandParent = function(data){
    	if(data.parentId){
    		data = $scope.my_tree.get_parent_branch(data);
    		$scope.my_tree.expand_branch(data);
    		$scope.expandParent(data);
    	}else{
    		return;
    	}
    }
    
    $scope.reselected = function(data,id,expandData){
    	//id为当前选中的branch的id
    	if(!$scope.loctionSelected){
    		return;
    	}
    	if(data.id == id){
			$scope.my_tree.select_branch(data);
			if(expandData){
				$scope.expandParent(expandData);
			}else{
				$scope.expandParent($scope.loctionSelected);
			}
			return;
		}
    	if(!data.children){
    		return;
    	}
    	
    	for(var i=0;i<data.children.length;i++){
    		$scope.reselected(data.children[i],id,expandData);
    	}
    };
    
    $scope.getAllLocations = function(id,expandData){
    	$http.get(url+'/location',{headers:header}).success(function(data){
		   $scope.my_data[0].children = data;
		   $scope.reselected($scope.my_data[0],id,expandData);
    	});
    }
    $scope.getAllLocations();
   //添加
   $scope.add_branch = function(){
	   $scope.addBranchName = null;
	   $scope.add = $scope.my_tree.get_selected_branch();
	   if($scope.add){
		   $scope.showAddBranch = true;
	   }
   };
  
   $scope.addBranchOk = function(){
	   $scope.add.id = $scope.add.id == -1?null:$scope.add.id;
	   $scope.showAddBranch = false;
	   var data = {};
	   data.name = $scope.addBranchName;
	   data.parentId = $scope.add.id;
	   data=JSON.stringify(data);
	   $http({
		   url:url+"/location",
		   method:"post",
		   data:data
	   }).success(function(data){
		   $scope.getAllLocations($scope.loctionSelected.id,$scope.my_tree.get_first_child($scope.loctionSelected));
	   }).error(function(){
		   console.log('error')
	   });
   }
   
   $scope.clearAddBranch = function(){
	   $scope.addBranchName = null;
	   $scope.showAddBranch = false;
   }
   
   //修改
   $scope.edit_branch = function(){
	   $scope.edit = $scope.my_tree.get_selected_branch();
	   if($scope.edit && $scope.edit.id!='-1'){
		   $scope.editBranch = {
			   id:$scope.edit.id,
			   name:$scope.edit.label,
			   parentId:$scope.edit.parentId
		   }
		   $scope.showEditBranch = true;
	   }
   }
   
   $scope.editBranchOk = function(){
	   $http({
		   url:url+'/location',
		   method:'put',
		   data:$scope.editBranch,
		   headers:{'appId':"iot-config"}
	   }).success(function(data){
		   $scope.getAllLocations($scope.loctionSelected.id);
	   });
	   $scope.showEditBranch = false;
   }
   
   $scope.clearEditBranch = function(){
	   $scope.showEditBranch = false;
   }
   
   //删除
   $scope.delete_branch = function(){
	   if(confirm("确定删除吗？")){
		   $scope.deleteId = $scope.my_tree.get_selected_branch().id;
		   $http({
			   url:url+"/location/"+$scope.deleteId,
			   method:'delete',
			   headers:{'appId':"iot-config"}
		   }).success(function(data){
			   $scope.getAllLocations($scope.loctionSelected.parentId);
		   });
	   }
   }
   
   $scope.candelete = true;
   //当前选中的branch
   $scope.loctionSelected = {label:"ROOT",id:-1};
   $scope.treeSeleced = function(branch){
	    if(branch.children && branch.children.length>0){
	    	$scope.candelete = false;
	    }else{
	    	$scope.candelete = true;
	    }
	    $scope.loctionSelected = branch;
		$scope.editor.scene.scaleY = 1;
		$scope.editor.scene.scaleX = 1;
		$scope.editor.scene.translateX = 0;
		$scope.editor.scene.translateY = 0;
		$scope.getGateInfo(branch.id);
		$scope.isCreating = false;
		var obj = $("#editobject");
		obj.hide();
   };
}]);
