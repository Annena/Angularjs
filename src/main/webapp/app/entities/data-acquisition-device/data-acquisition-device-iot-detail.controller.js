(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('DataAcquisitionDeviceIotDetailController', DataAcquisitionDeviceIotDetailController);

    DataAcquisitionDeviceIotDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'DataAcquisitionDevice', 'DataAcquisitionVariable', 'MonitorPoint'];

    function DataAcquisitionDeviceIotDetailController($scope, $rootScope, $stateParams, previousState, entity, DataAcquisitionDevice, DataAcquisitionVariable, MonitorPoint) {
        var vm = this;

        vm.dataAcquisitionDevice = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('gatewayApp:dataAcquisitionDeviceUpdate', function(event, result) {
            vm.dataAcquisitionDevice = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
