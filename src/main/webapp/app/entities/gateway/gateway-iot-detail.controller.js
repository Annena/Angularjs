(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('GatewayIotDetailController', GatewayIotDetailController);

    GatewayIotDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Gateway', 'GatewayAttribute', 'Workgroup', 'GatewayType'];

    function GatewayIotDetailController($scope, $rootScope, $stateParams, previousState, entity, Gateway, GatewayAttribute, Workgroup, GatewayType) {
        var vm = this;

        vm.gateway = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('gatewayApp:gatewayUpdate', function(event, result) {
            vm.gateway = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
