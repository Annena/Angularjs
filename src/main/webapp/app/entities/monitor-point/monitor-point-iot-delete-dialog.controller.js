(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('MonitorPointIotDeleteController',MonitorPointIotDeleteController);

    MonitorPointIotDeleteController.$inject = ['$uibModalInstance', 'entity', 'MonitorPoint'];

    function MonitorPointIotDeleteController($uibModalInstance, entity, MonitorPoint) {
        var vm = this;

        vm.monitorPoint = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            MonitorPoint.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
