(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('MonitorPointAttributeIotDetailController', MonitorPointAttributeIotDetailController);

    MonitorPointAttributeIotDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'MonitorPointAttribute', 'MonitorPoint'];

    function MonitorPointAttributeIotDetailController($scope, $rootScope, $stateParams, previousState, entity, MonitorPointAttribute, MonitorPoint) {
        var vm = this;

        vm.monitorPointAttribute = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('gatewayApp:monitorPointAttributeUpdate', function(event, result) {
            vm.monitorPointAttribute = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
