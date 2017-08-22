(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('WorkgroupIotDeleteController',WorkgroupIotDeleteController);

    WorkgroupIotDeleteController.$inject = ['$uibModalInstance', 'entity', 'Workgroup'];

    function WorkgroupIotDeleteController($uibModalInstance, entity, Workgroup) {
        var vm = this;

        vm.workgroup = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Workgroup.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
