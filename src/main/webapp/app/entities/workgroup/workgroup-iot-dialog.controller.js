(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('WorkgroupIotDialogController', WorkgroupIotDialogController);

    WorkgroupIotDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Workgroup', 'GatewayType', 'Gateway', 'MonitorPoint'];

    function WorkgroupIotDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Workgroup, GatewayType, Gateway, MonitorPoint) {
        var vm = this;

        vm.workgroup = entity;
        vm.clear = clear;
        vm.save = save;
        vm.gatewaytypes = GatewayType.query();
        vm.gateways = Gateway.query();
        vm.monitorpoints = MonitorPoint.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.workgroup.id !== null) {
                Workgroup.update(vm.workgroup, onSaveSuccess, onSaveError);
            } else {
                Workgroup.save(vm.workgroup, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('gatewayApp:workgroupUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
