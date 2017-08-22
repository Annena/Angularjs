(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('MonitorPointIotDetailController', MonitorPointIotDetailController);

    MonitorPointIotDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'MonitorPoint', 'MonitorPointAttribute', 'DataAcquisitionDevice', 'Workgroup'];

    function MonitorPointIotDetailController($scope, $rootScope, $stateParams, previousState, entity, MonitorPoint, MonitorPointAttribute, DataAcquisitionDevice, Workgroup) {
        var vm = this;

        vm.monitorPoint = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('gatewayApp:monitorPointUpdate', function(event, result) {
            vm.monitorPoint = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
