(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('DataAcquisitionDeviceIotDeleteController',DataAcquisitionDeviceIotDeleteController);

    DataAcquisitionDeviceIotDeleteController.$inject = ['$uibModalInstance', 'entity', 'DataAcquisitionDevice'];

    function DataAcquisitionDeviceIotDeleteController($uibModalInstance, entity, DataAcquisitionDevice) {
        var vm = this;

        vm.dataAcquisitionDevice = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            DataAcquisitionDevice.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
