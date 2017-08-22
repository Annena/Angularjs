
/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;        
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {
          
          $urlRouterProvider
              .otherwise('/app/gateway/gateway');
          $stateProvider
	          .state('app', {
	              abstract: true,
	              url: '/app',
	              templateUrl: 'tpl/app.html'
	          })
	          .state('app.canvas', {
                  url: '/canvas',
                  templateUrl: 'tpl/iot/canvas.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(['ngGrid','canvasTree']).then(
                              function(){
                                  return $ocLazyLoad.load(['js/controllers/iot/canvas/canvas.variable.edit.js',
                                                           'js/controllers/iot/canvas/canvas.variable.list.js',
                                                           'js/controllers/iot/canvas/canvas.location.tree.js',
                                                           'js/controllers/iot/canvas/canvas.gateway.create.js',
                                                           'js/controllers/iot/canvas/canvas.gateway.edit.js',
                                                           'js/controllers/iot/canvas/canvas.monitor.create.js',
                                                           'js/controllers/iot/canvas/canvas.monitor.edit.js',
                                                           'js/controllers/iot/canvas/canvas.device.create.js',
                                                           'js/controllers/iot/canvas/canvas.device.edit.js',
                                                           'js/controllers/iot/canvas/canvas.variable.create.js',
                                                           'js/services/iot/pointservice.js',
                                                           'vendor/jquery/jtopo/jtopo-0.4.8-dev.js',
                                                           'js/controllers/iot/canvas/canvas.js']);
                              }
                          );
                      }]
                  }
              })
              // gateway
              .state('app.gateway', {
                  url: '/gateway',
                  template: '<div ui-view></div>'
              })
              .state('app.gateway.gateway', {
                  url: '/gateway',
                  templateUrl: 'tpl/gateway.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('ngGrid').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/gateway.js');
                              }
                          );
                      }]
                  }
              })
              //创建网关页面
              .state('app.gateway.creategate',{
                  url:'/creategate',
                  templateUrl:'tpl/gateway_create.html',
                  resolve:{
                	  deps:['$ocLazyLoad',
                	    function($ocLazyLoad){
                		  	return $ocLazyLoad.load('ngGrid').then(
                                  function(){
                                      return $ocLazyLoad.load('js/controllers/gateway_create.js');
                                  }
                              );
                			}	  
                	  ]
                  }
              })              
              //修改网关页面table
              .state('app.gateway.modifygate',{
            	  url:'/modifygate',
            	  params: {modify_id:null},            	    
            	  templateUrl:'tpl/gateway_modify.html',
            	  resolve:{
                	  deps:['$ocLazyLoad',
                	    function($ocLazyLoad){
                		  return $ocLazyLoad.load('ngGrid').then(
                                  function(){
                                      return $ocLazyLoad.load('js/controllers/gateway_modify.js');
                                  }
                              );
                			}	  
                	  ]
                  }
              })             
              //网关详细信息页面
              .state('app.gateway.detailsgate',{
            	  url:'/detailsgate',
            	  params: {details_id:null},            	    
            	  templateUrl:'tpl/gateway_details.html',
            	  resolve:{
                	  deps:['$ocLazyLoad',
                	    function($ocLazyLoad){
                				return $ocLazyLoad.load('js/controllers/gateway_details.js');
                			}	  
                	  ]
                  }
              })   
 
              
                //群组  
              .state('app.workgroup', {
                  url: '/workgroup',
                  template: '<div ui-view></div>'
              })
              
              .state("app.workgroup.workgroup",{
            	  url:'/workgroup',
            	  templateUrl:'tpl/workgroup.html',
            	  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('ngGrid').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/workgroup.js');
                              });
                          }
                      ]
                  }
              }) 
              //创建群组
              .state('app.workgroup.creategroup',{
            	  url:'/creategroup',
            	  templateUrl:'tpl/workgroup_create.html',
            	  resolve:{
                	  deps:['$ocLazyLoad',
                	    function($ocLazyLoad){
                				return $ocLazyLoad.load('js/controllers/workgroup_create.js');
                			}	  
                	  ]
                  }
              })
              //修改群组
              .state('app.workgroup.modifygroup',{
            	  url:'/modifygroup',
            	  params: {modify_id:null},            	    
            	  templateUrl:'tpl/workgroup_modify.html',
            	  resolve:{
                	  deps:['$ocLazyLoad',
                	    function($ocLazyLoad){
                				return $ocLazyLoad.load('js/controllers/workgroup_modify.js');
                			}	  
                	  ]
                  }
              })         
              //详细信息群组
              .state('app.workgroup.detailsgroup',{
            	  url:'/detailsgroup',
            	  params:{details_id:null},
            	  templateUrl:'tpl/workgroup_details.html',
            	  resolve:{
                	  deps:['$ocLazyLoad',
                	    function($ocLazyLoad){
                				return $ocLazyLoad.load('js/controllers/workgroup_details.js');
                			}	  
                	  ]
                  }
              })

              //监控点
              .state('app.point', {
                  url: '/point',
                  template: '<div ui-view></div>',
                  resolve:{
            		  deps:['$ocLazyLoad',
                    	    function($ocLazyLoad){
            			  		return $ocLazyLoad.load('ngGrid').then(
            			  				function(){
            			  					return $ocLazyLoad.load('js/services/iot/pointservice.js');
            			  				}                    				
                    			)}	  
                    	  ]
            	  }
              })
              

              //监控点策略
              .state('app.point.report', {
                  url: '/report',
                  template: '<div ui-view></div>',
                  resolve: {
                	  deps:['$ocLazyLoad',
                    	    function($ocLazyLoad){
	            			  return $ocLazyLoad.load('ngGrid');
            		  		}
            		  ]
                  }
              })
               //上报策略详情
              .state('app.point.report.policy',{
            	  url:'/policy',
            	  params:{id:null},
            	  templateUrl:'tpl/point.report.policy.html',
            	  resolve:{
            		  deps:['$ocLazyLoad',
            		        function($ocLazyLoad){
                          		return $ocLazyLoad.load('js/controllers/point.report.policy.js');
     		  				}
            		  ]
            	  }
              })
             
              //上报策略修改
              .state('app.point.report.modify',{
            	  url:'/modify',
            	  params:{id:null},
            	  templateUrl:'tpl/point.report.modify.html',
            	  resolve:{
            		  deps:['$ocLazyLoad',
            		        function($ocLazyLoad){
            			  		return $ocLazyLoad.load('js/controllers/point.report.modify.js');
            		  			}
            		        ]
            	  }
              })
              
              
              
              .state('app.point.point',{
            	  url:'/point',
            	  templateUrl:'tpl/point.html',
            	  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(['ngGrid']).then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/point.js');
                              });
                          }
                      ]
                  }
              })
              //新建监控点
              .state('app.point.createpoint',{
            	  url:'/createpoint',
            	  templateUrl:'tpl/point_create.html',
            	  resolve:{
            		  deps:['$ocLazyLoad',
                    	    function($ocLazyLoad){
                    				return $ocLazyLoad.load('js/controllers/point_create.js');
                    			}	  
                    	  ]
            	  }
              })
              //修改监控点
               .state('app.point.modifypoint',{
            	  url:'/modifypoint',
            	  params: {modify_id:null},
            	  templateUrl:'tpl/point_modify.html',
            	  resolve:{
            		  deps:['$ocLazyLoad',
            		        function($ocLazyLoad){
            			  		return $ocLazyLoad.load('ngGrid').then(
            			  				function(){
            			  					return $ocLazyLoad.load('js/controllers/point_modify.js');
            			  				}                    				
            			  			)}
            		        ]
            	  }
              })
              //详细信息监控点
              .state('app.point.detailspoint',{
            	  url:'/detailspoint',
            	  params: {details_id:null},
            	  templateUrl:'tpl/point_details.html',
            	  resolve:{
            		  deps:['$ocLazyLoad',
            		        function($ocLazyLoad){
            			  		return $ocLazyLoad.load('js/controllers/point_details.js');
            		  				}
            		        ]
            	  }
              })
              
              // 监控点下属子页面
              .state('app.point.view', {
                  abstract: true,
                  url: '/point/view',
                  templateUrl: 'tpl/iot/monitorpoint.more.html',
                  resolve: {
                	  deps:['$ocLazyLoad',
                    	    function($ocLazyLoad){
	            			  return $ocLazyLoad.load('ngGrid').then(
	                                  function(){
	                                      return $ocLazyLoad.load('js/services/iot/pointservice.js');
	                           });
            		  		}
            		  ]
                  }
              })
              
              //系统变量
              .state('app.point.view.sysvariable', {
                  url: '/sysvariable',
                  template: '<div ui-view></div>'
              })
              //系统变量列表
              .state('app.point.view.sysvariable.list', {
                  url: '/list',
                  templateUrl: 'tpl/iot/sysvariable.list.html',
                  // use resolve to load other dependences
                  resolve: {
                	  deps:['$ocLazyLoad',
                    	    function($ocLazyLoad){
	                            return $ocLazyLoad.load('js/controllers/iot/sysvariable.list.js');
            		  		}
            		  ]
                  }
              })
              
              // 采集变量detail
              .state('app.point.view.sysvariable.detail', {
                  url: '/detail',
                  params: {id:null, sysDefineVariableId:null},
                  templateUrl: 'tpl/iot/sysvariable.detail.html',
                  // use resolve to load other dependences
                  resolve: {
                	  deps:['$ocLazyLoad',
                    	    function($ocLazyLoad){
	                             return $ocLazyLoad.load('js/controllers/iot/sysvariable.detail.js');
            		  		}
            		  ]
                  }
              })
              
     
                                       
              // 采集设备
              .state('app.point.view.collector', {
                  url: '/collector',
                  template: '<div ui-view></div>',
                  resolve: {
                	  deps:['$ocLazyLoad',
                    	    function($ocLazyLoad){
	            			  return $ocLazyLoad.load('ngGrid');
            		  		}
            		  ]
                  }
              })
              
              // 采集设备列表
              .state('app.point.view.collector.list', {
                  url: '/list',
                  templateUrl: 'tpl/iot/collector.list.html',
                  // use resolve to load other dependences
                  resolve: {
                	  deps:['$ocLazyLoad',
                    	    function($ocLazyLoad){
	            			  return $ocLazyLoad.load('ngGrid').then(
	                                  function(){
	                                      return $ocLazyLoad.load('js/controllers/iot/collector.js');
	                                  }
	                              );
            		  		}
            		  ]
                  }
              })
              
              // 采集设备创建
              .state('app.point.view.collector.create', {
                  url: '/create',
                  templateUrl: 'tpl/iot/collector.create.html',
                  // use resolve to load other dependences
                  resolve: {
                	  deps:['$ocLazyLoad',
                    	    function($ocLazyLoad){
	                		  	return $ocLazyLoad.load('ngGrid').then(
	                                  function(){
	                                      return $ocLazyLoad.load('js/controllers/iot/collector.create.js');
	                                  }
	                              );
            		  		}
            		  ]
                  }
              })
              
              // 采集设备修改
              .state('app.point.view.collector.modify', {
                  url: '/modify',
                  params: {id:null,name:null},
                  templateUrl: 'tpl/iot/collector.modify.html',
                  // use resolve to load other dependences
                  resolve: {
                	  deps:['$ocLazyLoad',
                    	    function($ocLazyLoad){
	                		  	return $ocLazyLoad.load('ngGrid').then(
	                                  function(){
	                                      return $ocLazyLoad.load('js/controllers/iot/collector.modify.js');
	                                  }
	                              );
            		  		}
            		  ]
                  }
              })
              
              
               // 采集变量
              .state('app.point.variable', {
                  abstract: true,
                  url: '/variable',
                  templateUrl: 'tpl/iot/collector.more.html',
                  resolve: {
                	  deps:['$ocLazyLoad',
                    	    function($ocLazyLoad){
	            			  return $ocLazyLoad.load('ngGrid').then(
	                                  function(){
	                                      return $ocLazyLoad.load('js/services/iot/pointservice.js');
	                                  }
	                              );
            		  		}
            		  ]
                  }
              })
              
              // 上报策略                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
              .state('app.point.variable.report', {
                  url: '/report',
                  template: '<div ui-view></div>',
                  resolve: {
                	  deps:['$ocLazyLoad',
                    	    function($ocLazyLoad){
	            			  return $ocLazyLoad.load('ngGrid');
            		  		}
            		  ]
                  }
              })
              
               //上报策略详情
              .state('app.point.variable.report.policy',{
            	  url:'/policy',
            	  params:{id:null},
            	  templateUrl:'tpl/iot/variable.report.policy.html',
            	  resolve:{
            		  deps:['$ocLazyLoad',
            		        function($ocLazyLoad){
                          		return $ocLazyLoad.load('js/controllers/iot/variable.report.policy.js');
     		  				}
            		  ]
            	  }
              })
             
              //上报策略修改
              .state('app.point.variable.report.modify',{
            	  url:'/modify',
            	  params:{id:null},
            	  templateUrl:'tpl/iot/variable.report.modify.html',
            	  resolve:{
            		  deps:['$ocLazyLoad',
            		        function($ocLazyLoad){
            			  		return $ocLazyLoad.load('js/controllers/iot/variable.report.modify.js');
            		  			}
            		        ]
            	  }
              })
              
              
              
              
              // 采集变量列表
              .state('app.point.variable.list', {
                  url: '/list',
                  templateUrl: 'tpl/iot/variable.list.html',
                  // use resolve to load other dependences
                  resolve: {
                	  deps:['$ocLazyLoad',
                    	    function($ocLazyLoad){
	            			  return $ocLazyLoad.load('ngGrid').then(
	                                  function(){
	                                      return $ocLazyLoad.load('js/controllers/iot/variable.js');
	                                  }
	                              );
            		  		}
            		  ]
                  }
              })
              // 采集变变量创建
              .state('app.point.variable.create', {
                  url: '/create',
                  templateUrl: 'tpl/iot/variable.create.html',
                  // use resolve to load other dependences
                  resolve: {
                	  deps:['$ocLazyLoad',
                    	    function($ocLazyLoad){
	                             return $ocLazyLoad.load('js/controllers/iot/variable.create.js');
            		  		}
            		  ]
                  }
              })
              
              // 采集变量修改
              .state('app.point.variable.modify', {
                  url: '/modify',
                  params: {id:null},
                  templateUrl: 'tpl/iot/variable.modify.html',
                  // use resolve to load other dependences
                  resolve: {
                	  deps:['$ocLazyLoad',
                    	    function($ocLazyLoad){
	                             return $ocLazyLoad.load('js/controllers/iot/variable.modify.js');
            		  		}
            		  ]
                  }
              })
              //监控设备展示
              .state('app.devices', {
                  url: '/devices',
                  template: '<div ui-view></div>'
              })
              
              .state("app.devices.devices",{
            	  url:'/devices',
            	  templateUrl:'tpl/iot/devices.html',
            	  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(['angularBootstrapNavTree','ngGrid']).then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/iot/devices.js');
                              });
                          }
                      ]
                  }
              }) 
              
              
              
      }
    ]
  );