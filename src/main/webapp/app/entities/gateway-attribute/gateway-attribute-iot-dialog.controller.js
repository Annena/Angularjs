(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('GatewayAttributeIotDialogController', GatewayAttributeIotDialogController);

    GatewayAttributeIotDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'GatewayAttribute', 'Gateway'];

    function GatewayAttributeIotDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, GatewayAttribute, Gateway) {
        var vm = this;

        vm.gatewayAttribute = entity;
        vm.clear = clear;
        vm.save = save;
        vm.gateways = Gateway.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.gatewayAttribute.id !== null) {
                GatewayAttribute.update(vm.gatewayAttribute, onSaveSuccess, onSaveError);
            } else {
                GatewayAttribute.save(vm.gatewayAttribute, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('gatewayApp:gatewayAttributeUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
