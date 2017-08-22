(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('DataAcquisitionVariableIotDetailController', DataAcquisitionVariableIotDetailController);

    DataAcquisitionVariableIotDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'DataAcquisitionVariable', 'DataAcquisitionDevice'];

    function DataAcquisitionVariableIotDetailController($scope, $rootScope, $stateParams, previousState, entity, DataAcquisitionVariable, DataAcquisitionDevice) {
        var vm = this;

        vm.dataAcquisitionVariable = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('gatewayApp:dataAcquisitionVariableUpdate', function(event, result) {
            vm.dataAcquisitionVariable = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
