(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('data-acquisition-device-iot', {
            parent: 'entity',
            url: '/data-acquisition-device-iot?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gatewayApp.dataAcquisitionDevice.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/data-acquisition-device/data-acquisition-devicesiot.html',
                    controller: 'DataAcquisitionDeviceIotController',
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
                    $translatePartialLoader.addPart('dataAcquisitionDevice');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('data-acquisition-device-iot-detail', {
            parent: 'data-acquisition-device-iot',
            url: '/data-acquisition-device-iot/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gatewayApp.dataAcquisitionDevice.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/data-acquisition-device/data-acquisition-device-iot-detail.html',
                    controller: 'DataAcquisitionDeviceIotDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('dataAcquisitionDevice');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'DataAcquisitionDevice', function($stateParams, DataAcquisitionDevice) {
                    return DataAcquisitionDevice.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'data-acquisition-device-iot',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('data-acquisition-device-iot-detail.edit', {
            parent: 'data-acquisition-device-iot-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/data-acquisition-device/data-acquisition-device-iot-dialog.html',
                    controller: 'DataAcquisitionDeviceIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['DataAcquisitionDevice', function(DataAcquisitionDevice) {
                            return DataAcquisitionDevice.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('data-acquisition-device-iot.new', {
            parent: 'data-acquisition-device-iot',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/data-acquisition-device/data-acquisition-device-iot-dialog.html',
                    controller: 'DataAcquisitionDeviceIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                code: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('data-acquisition-device-iot', null, { reload: 'data-acquisition-device-iot' });
                }, function() {
                    $state.go('data-acquisition-device-iot');
                });
            }]
        })
        .state('data-acquisition-device-iot.edit', {
            parent: 'data-acquisition-device-iot',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/data-acquisition-device/data-acquisition-device-iot-dialog.html',
                    controller: 'DataAcquisitionDeviceIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['DataAcquisitionDevice', function(DataAcquisitionDevice) {
                            return DataAcquisitionDevice.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('data-acquisition-device-iot', null, { reload: 'data-acquisition-device-iot' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('data-acquisition-device-iot.delete', {
            parent: 'data-acquisition-device-iot',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/data-acquisition-device/data-acquisition-device-iot-delete-dialog.html',
                    controller: 'DataAcquisitionDeviceIotDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['DataAcquisitionDevice', function(DataAcquisitionDevice) {
                            return DataAcquisitionDevice.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('data-acquisition-device-iot', null, { reload: 'data-acquisition-device-iot' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
