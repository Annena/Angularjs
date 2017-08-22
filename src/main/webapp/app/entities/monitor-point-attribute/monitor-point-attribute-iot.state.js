(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('monitor-point-attribute-iot', {
            parent: 'entity',
            url: '/monitor-point-attribute-iot?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gatewayApp.monitorPointAttribute.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/monitor-point-attribute/monitor-point-attributesiot.html',
                    controller: 'MonitorPointAttributeIotController',
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
                    $translatePartialLoader.addPart('monitorPointAttribute');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('monitor-point-attribute-iot-detail', {
            parent: 'monitor-point-attribute-iot',
            url: '/monitor-point-attribute-iot/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gatewayApp.monitorPointAttribute.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/monitor-point-attribute/monitor-point-attribute-iot-detail.html',
                    controller: 'MonitorPointAttributeIotDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('monitorPointAttribute');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'MonitorPointAttribute', function($stateParams, MonitorPointAttribute) {
                    return MonitorPointAttribute.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'monitor-point-attribute-iot',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('monitor-point-attribute-iot-detail.edit', {
            parent: 'monitor-point-attribute-iot-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/monitor-point-attribute/monitor-point-attribute-iot-dialog.html',
                    controller: 'MonitorPointAttributeIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['MonitorPointAttribute', function(MonitorPointAttribute) {
                            return MonitorPointAttribute.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('monitor-point-attribute-iot.new', {
            parent: 'monitor-point-attribute-iot',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/monitor-point-attribute/monitor-point-attribute-iot-dialog.html',
                    controller: 'MonitorPointAttributeIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                value: null,
                                appId: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('monitor-point-attribute-iot', null, { reload: 'monitor-point-attribute-iot' });
                }, function() {
                    $state.go('monitor-point-attribute-iot');
                });
            }]
        })
        .state('monitor-point-attribute-iot.edit', {
            parent: 'monitor-point-attribute-iot',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/monitor-point-attribute/monitor-point-attribute-iot-dialog.html',
                    controller: 'MonitorPointAttributeIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['MonitorPointAttribute', function(MonitorPointAttribute) {
                            return MonitorPointAttribute.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('monitor-point-attribute-iot', null, { reload: 'monitor-point-attribute-iot' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('monitor-point-attribute-iot.delete', {
            parent: 'monitor-point-attribute-iot',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/monitor-point-attribute/monitor-point-attribute-iot-delete-dialog.html',
                    controller: 'MonitorPointAttributeIotDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['MonitorPointAttribute', function(MonitorPointAttribute) {
                            return MonitorPointAttribute.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('monitor-point-attribute-iot', null, { reload: 'monitor-point-attribute-iot' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
