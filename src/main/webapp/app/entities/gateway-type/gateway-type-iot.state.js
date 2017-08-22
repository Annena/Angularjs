(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('gateway-type-iot', {
            parent: 'entity',
            url: '/gateway-type-iot?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gatewayApp.gatewayType.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/gateway-type/gateway-typesiot.html',
                    controller: 'GatewayTypeIotController',
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
                    $translatePartialLoader.addPart('gatewayType');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('gateway-type-iot-detail', {
            parent: 'gateway-type-iot',
            url: '/gateway-type-iot/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gatewayApp.gatewayType.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/gateway-type/gateway-type-iot-detail.html',
                    controller: 'GatewayTypeIotDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('gatewayType');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'GatewayType', function($stateParams, GatewayType) {
                    return GatewayType.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'gateway-type-iot',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('gateway-type-iot-detail.edit', {
            parent: 'gateway-type-iot-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/gateway-type/gateway-type-iot-dialog.html',
                    controller: 'GatewayTypeIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['GatewayType', function(GatewayType) {
                            return GatewayType.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('gateway-type-iot.new', {
            parent: 'gateway-type-iot',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/gateway-type/gateway-type-iot-dialog.html',
                    controller: 'GatewayTypeIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                bindAttribute: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('gateway-type-iot', null, { reload: 'gateway-type-iot' });
                }, function() {
                    $state.go('gateway-type-iot');
                });
            }]
        })
        .state('gateway-type-iot.edit', {
            parent: 'gateway-type-iot',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/gateway-type/gateway-type-iot-dialog.html',
                    controller: 'GatewayTypeIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['GatewayType', function(GatewayType) {
                            return GatewayType.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('gateway-type-iot', null, { reload: 'gateway-type-iot' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('gateway-type-iot.delete', {
            parent: 'gateway-type-iot',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/gateway-type/gateway-type-iot-delete-dialog.html',
                    controller: 'GatewayTypeIotDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['GatewayType', function(GatewayType) {
                            return GatewayType.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('gateway-type-iot', null, { reload: 'gateway-type-iot' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
