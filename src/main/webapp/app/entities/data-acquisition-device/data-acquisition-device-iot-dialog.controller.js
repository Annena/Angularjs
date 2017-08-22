(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('DataAcquisitionDeviceIotDialogController', DataAcquisitionDeviceIotDialogController);

    DataAcquisitionDeviceIotDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'DataAcquisitionDevice', 'DataAcquisitionVariable', 'MonitorPoint'];

    function DataAcquisitionDeviceIotDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, DataAcquisitionDevice, DataAcquisitionVariable, MonitorPoint) {
        var vm = this;

        vm.dataAcquisitionDevice = entity;
        vm.clear = clear;
        vm.save = save;
        vm.dataacquisitionvariables = DataAcquisitionVariable.query();
        vm.monitorpoints = MonitorPoint.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.dataAcquisitionDevice.id !== null) {
                DataAcquisitionDevice.update(vm.dataAcquisitionDevice, onSaveSuccess, onSaveError);
            } else {
                DataAcquisitionDevice.save(vm.dataAcquisitionDevice, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('gatewayApp:dataAcquisitionDeviceUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
