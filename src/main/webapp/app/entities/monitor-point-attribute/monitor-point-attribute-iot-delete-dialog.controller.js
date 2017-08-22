(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('MonitorPointAttributeIotDeleteController',MonitorPointAttributeIotDeleteController);

    MonitorPointAttributeIotDeleteController.$inject = ['$uibModalInstance', 'entity', 'MonitorPointAttribute'];

    function MonitorPointAttributeIotDeleteController($uibModalInstance, entity, MonitorPointAttribute) {
        var vm = this;

        vm.monitorPointAttribute = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            MonitorPointAttribute.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
