(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('GatewayIotDeleteController',GatewayIotDeleteController);

    GatewayIotDeleteController.$inject = ['$uibModalInstance', 'entity', 'Gateway'];

    function GatewayIotDeleteController($uibModalInstance, entity, Gateway) {
        var vm = this;

        vm.gateway = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Gateway.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
