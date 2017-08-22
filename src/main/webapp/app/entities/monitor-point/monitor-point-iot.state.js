(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('monitor-point-iot', {
            parent: 'entity',
            url: '/monitor-point-iot?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gatewayApp.monitorPoint.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/monitor-point/monitor-pointsiot.html',
                    controller: 'MonitorPointIotController',
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
                    $translatePartialLoader.addPart('monitorPoint');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('monitor-point-iot-detail', {
            parent: 'monitor-point-iot',
            url: '/monitor-point-iot/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gatewayApp.monitorPoint.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/monitor-point/monitor-point-iot-detail.html',
                    controller: 'MonitorPointIotDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('monitorPoint');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'MonitorPoint', function($stateParams, MonitorPoint) {
                    return MonitorPoint.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'monitor-point-iot',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('monitor-point-iot-detail.edit', {
            parent: 'monitor-point-iot-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/monitor-point/monitor-point-iot-dialog.html',
                    controller: 'MonitorPointIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['MonitorPoint', function(MonitorPoint) {
                            return MonitorPoint.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('monitor-point-iot.new', {
            parent: 'monitor-point-iot',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/monitor-point/monitor-point-iot-dialog.html',
                    controller: 'MonitorPointIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                description: null,
                                samplingPeriod: null,
                                isChangeSample: null,
                                reportItemsNum: null,
                                reportPeriod: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('monitor-point-iot', null, { reload: 'monitor-point-iot' });
                }, function() {
                    $state.go('monitor-point-iot');
                });
            }]
        })
        .state('monitor-point-iot.edit', {
            parent: 'monitor-point-iot',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/monitor-point/monitor-point-iot-dialog.html',
                    controller: 'MonitorPointIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['MonitorPoint', function(MonitorPoint) {
                            return MonitorPoint.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('monitor-point-iot', null, { reload: 'monitor-point-iot' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('monitor-point-iot.delete', {
            parent: 'monitor-point-iot',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/monitor-point/monitor-point-iot-delete-dialog.html',
                    controller: 'MonitorPointIotDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['MonitorPoint', function(MonitorPoint) {
                            return MonitorPoint.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('monitor-point-iot', null, { reload: 'monitor-point-iot' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
