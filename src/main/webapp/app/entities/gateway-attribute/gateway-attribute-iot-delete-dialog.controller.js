(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('GatewayAttributeIotDeleteController',GatewayAttributeIotDeleteController);

    GatewayAttributeIotDeleteController.$inject = ['$uibModalInstance', 'entity', 'GatewayAttribute'];

    function GatewayAttributeIotDeleteController($uibModalInstance, entity, GatewayAttribute) {
        var vm = this;

        vm.gatewayAttribute = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            GatewayAttribute.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
