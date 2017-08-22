(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('DataAcquisitionVariableIotDeleteController',DataAcquisitionVariableIotDeleteController);

    DataAcquisitionVariableIotDeleteController.$inject = ['$uibModalInstance', 'entity', 'DataAcquisitionVariable'];

    function DataAcquisitionVariableIotDeleteController($uibModalInstance, entity, DataAcquisitionVariable) {
        var vm = this;

        vm.dataAcquisitionVariable = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            DataAcquisitionVariable.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
