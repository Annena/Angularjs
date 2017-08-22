// A RESTful factory for retreiving mails from 'mails.json'

app.factory('point', [function () {
  
  var factory = {};

  factory.getpoint = function(){
	  var point = {};
	  point.id = window.sessionStorage.getItem("point_id");
	  point.name = window.sessionStorage.getItem("point_name");
	  return point;
  };
  
  factory.setpoint = function(point){
	  window.sessionStorage.setItem("point_id",point.id);
	  window.sessionStorage.setItem("point_name",point.name);
  };
  
  factory.getcollector = function(){
	  var collector = {};
	  collector.id = window.sessionStorage.getItem("collector_id");
	  collector.name = window.sessionStorage.getItem("collector_name");
	  collector.template=window.sessionStorage.getItem("collector_template");
	  collector.daDevModelId=window.sessionStorage.getItem("collector_daDevModelId");
	  return collector;
  };
  
  factory.setcollector = function(collector){
	  window.sessionStorage.setItem("collector_id",collector.id);
	  window.sessionStorage.setItem("collector_name",collector.name);
	  window.sessionStorage.setItem("collector_template",collector.template);
	  window.sessionStorage.setItem("collector_daDevModelId",collector.daDevModelId);
  };
  
  return factory;
}]);