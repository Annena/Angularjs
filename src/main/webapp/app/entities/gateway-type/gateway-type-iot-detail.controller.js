(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('GatewayTypeIotDetailController', GatewayTypeIotDetailController);

    GatewayTypeIotDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'GatewayType', 'Gateway', 'Workgroup'];

    function GatewayTypeIotDetailController($scope, $rootScope, $stateParams, previousState, entity, GatewayType, Gateway, Workgroup) {
        var vm = this;

        vm.gatewayType = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('gatewayApp:gatewayTypeUpdate', function(event, result) {
            vm.gatewayType = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
