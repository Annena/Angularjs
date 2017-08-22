(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('GatewayIotDialogController', GatewayIotDialogController);

    GatewayIotDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Gateway', 'GatewayAttribute', 'Workgroup', 'GatewayType'];

    function GatewayIotDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Gateway, GatewayAttribute, Workgroup, GatewayType) {
        var vm = this;

        vm.gateway = entity;
        vm.clear = clear;
        vm.save = save;
        vm.gatewayattributes = GatewayAttribute.query();
        vm.workgroups = Workgroup.query();
        vm.gatewaytypes = GatewayType.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.gateway.id !== null) {
                Gateway.update(vm.gateway, onSaveSuccess, onSaveError);
            } else {
                Gateway.save(vm.gateway, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('gatewayApp:gatewayUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
