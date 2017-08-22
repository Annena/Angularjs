(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('MonitorPointAttributeIotDialogController', MonitorPointAttributeIotDialogController);

    MonitorPointAttributeIotDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'MonitorPointAttribute', 'MonitorPoint'];

    function MonitorPointAttributeIotDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, MonitorPointAttribute, MonitorPoint) {
        var vm = this;

        vm.monitorPointAttribute = entity;
        vm.clear = clear;
        vm.save = save;
        vm.monitorpoints = MonitorPoint.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.monitorPointAttribute.id !== null) {
                MonitorPointAttribute.update(vm.monitorPointAttribute, onSaveSuccess, onSaveError);
            } else {
                MonitorPointAttribute.save(vm.monitorPointAttribute, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('gatewayApp:monitorPointAttributeUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
