(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('gateway-attribute-iot', {
            parent: 'entity',
            url: '/gateway-attribute-iot?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gatewayApp.gatewayAttribute.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/gateway-attribute/gateway-attributesiot.html',
                    controller: 'GatewayAttributeIotController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('gatewayAttribute');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('gateway-attribute-iot-detail', {
            parent: 'gateway-attribute-iot',
            url: '/gateway-attribute-iot/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gatewayApp.gatewayAttribute.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/gateway-attribute/gateway-attribute-iot-detail.html',
                    controller: 'GatewayAttributeIotDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('gatewayAttribute');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'GatewayAttribute', function($stateParams, GatewayAttribute) {
                    return GatewayAttribute.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'gateway-attribute-iot',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('gateway-attribute-iot-detail.edit', {
            parent: 'gateway-attribute-iot-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/gateway-attribute/gateway-attribute-iot-dialog.html',
                    controller: 'GatewayAttributeIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['GatewayAttribute', function(GatewayAttribute) {
                            return GatewayAttribute.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('gateway-attribute-iot.new', {
            parent: 'gateway-attribute-iot',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/gateway-attribute/gateway-attribute-iot-dialog.html',
                    controller: 'GatewayAttributeIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                value: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('gateway-attribute-iot', null, { reload: 'gateway-attribute-iot' });
                }, function() {
                    $state.go('gateway-attribute-iot');
                });
            }]
        })
        .state('gateway-attribute-iot.edit', {
            parent: 'gateway-attribute-iot',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/gateway-attribute/gateway-attribute-iot-dialog.html',
                    controller: 'GatewayAttributeIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['GatewayAttribute', function(GatewayAttribute) {
                            return GatewayAttribute.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('gateway-attribute-iot', null, { reload: 'gateway-attribute-iot' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('gateway-attribute-iot.delete', {
            parent: 'gateway-attribute-iot',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/gateway-attribute/gateway-attribute-iot-delete-dialog.html',
                    controller: 'GatewayAttributeIotDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['GatewayAttribute', function(GatewayAttribute) {
                            return GatewayAttribute.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('gateway-attribute-iot', null, { reload: 'gateway-attribute-iot' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
