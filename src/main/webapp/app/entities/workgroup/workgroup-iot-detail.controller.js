(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('WorkgroupIotDetailController', WorkgroupIotDetailController);

    WorkgroupIotDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Workgroup', 'GatewayType', 'Gateway', 'MonitorPoint'];

    function WorkgroupIotDetailController($scope, $rootScope, $stateParams, previousState, entity, Workgroup, GatewayType, Gateway, MonitorPoint) {
        var vm = this;

        vm.workgroup = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('gatewayApp:workgroupUpdate', function(event, result) {
            vm.workgroup = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
