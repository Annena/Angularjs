(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('GatewayAttributeIotDetailController', GatewayAttributeIotDetailController);

    GatewayAttributeIotDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'GatewayAttribute', 'Gateway'];

    function GatewayAttributeIotDetailController($scope, $rootScope, $stateParams, previousState, entity, GatewayAttribute, Gateway) {
        var vm = this;

        vm.gatewayAttribute = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('gatewayApp:gatewayAttributeUpdate', function(event, result) {
            vm.gatewayAttribute = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
