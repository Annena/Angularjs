(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('GatewayTypeIotDialogController', GatewayTypeIotDialogController);

    GatewayTypeIotDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'GatewayType', 'Gateway', 'Workgroup'];

    function GatewayTypeIotDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, GatewayType, Gateway, Workgroup) {
        var vm = this;

        vm.gatewayType = entity;
        vm.clear = clear;
        vm.save = save;
        vm.gateways = Gateway.query();
        vm.workgroups = Workgroup.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.gatewayType.id !== null) {
                GatewayType.update(vm.gatewayType, onSaveSuccess, onSaveError);
            } else {
                GatewayType.save(vm.gatewayType, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('gatewayApp:gatewayTypeUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
