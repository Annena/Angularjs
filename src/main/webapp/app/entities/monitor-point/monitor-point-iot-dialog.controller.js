(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('MonitorPointIotDialogController', MonitorPointIotDialogController);

    MonitorPointIotDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'MonitorPoint', 'MonitorPointAttribute', 'DataAcquisitionDevice', 'Workgroup'];

    function MonitorPointIotDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, MonitorPoint, MonitorPointAttribute, DataAcquisitionDevice, Workgroup) {
        var vm = this;

        vm.monitorPoint = entity;
        vm.clear = clear;
        vm.save = save;
        vm.monitorpointattributes = MonitorPointAttribute.query();
        vm.dataacquisitiondevices = DataAcquisitionDevice.query();
        vm.workgroups = Workgroup.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.monitorPoint.id !== null) {
                MonitorPoint.update(vm.monitorPoint, onSaveSuccess, onSaveError);
            } else {
                MonitorPoint.save(vm.monitorPoint, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('gatewayApp:monitorPointUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
