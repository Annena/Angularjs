(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('DataAcquisitionVariableIotDialogController', DataAcquisitionVariableIotDialogController);

    DataAcquisitionVariableIotDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'DataAcquisitionVariable', 'DataAcquisitionDevice'];

    function DataAcquisitionVariableIotDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, DataAcquisitionVariable, DataAcquisitionDevice) {
        var vm = this;

        vm.dataAcquisitionVariable = entity;
        vm.clear = clear;
        vm.save = save;
        vm.dataacquisitiondevices = DataAcquisitionDevice.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.dataAcquisitionVariable.id !== null) {
                DataAcquisitionVariable.update(vm.dataAcquisitionVariable, onSaveSuccess, onSaveError);
            } else {
                DataAcquisitionVariable.save(vm.dataAcquisitionVariable, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('gatewayApp:dataAcquisitionVariableUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
