(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('GatewayTypeIotDeleteController',GatewayTypeIotDeleteController);

    GatewayTypeIotDeleteController.$inject = ['$uibModalInstance', 'entity', 'GatewayType'];

    function GatewayTypeIotDeleteController($uibModalInstance, entity, GatewayType) {
        var vm = this;

        vm.gatewayType = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            GatewayType.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
