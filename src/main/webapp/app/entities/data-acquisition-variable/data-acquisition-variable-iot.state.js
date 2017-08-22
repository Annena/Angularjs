(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('data-acquisition-variable-iot', {
            parent: 'entity',
            url: '/data-acquisition-variable-iot?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gatewayApp.dataAcquisitionVariable.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/data-acquisition-variable/data-acquisition-variablesiot.html',
                    controller: 'DataAcquisitionVariableIotController',
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
                    $translatePartialLoader.addPart('dataAcquisitionVariable');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('data-acquisition-variable-iot-detail', {
            parent: 'data-acquisition-variable-iot',
            url: '/data-acquisition-variable-iot/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gatewayApp.dataAcquisitionVariable.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/data-acquisition-variable/data-acquisition-variable-iot-detail.html',
                    controller: 'DataAcquisitionVariableIotDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('dataAcquisitionVariable');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'DataAcquisitionVariable', function($stateParams, DataAcquisitionVariable) {
                    return DataAcquisitionVariable.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'data-acquisition-variable-iot',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('data-acquisition-variable-iot-detail.edit', {
            parent: 'data-acquisition-variable-iot-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/data-acquisition-variable/data-acquisition-variable-iot-dialog.html',
                    controller: 'DataAcquisitionVariableIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['DataAcquisitionVariable', function(DataAcquisitionVariable) {
                            return DataAcquisitionVariable.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('data-acquisition-variable-iot.new', {
            parent: 'data-acquisition-variable-iot',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/data-acquisition-variable/data-acquisition-variable-iot-dialog.html',
                    controller: 'DataAcquisitionVariableIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                description: null,
                                uint: null,
                                getCycle: null,
                                dcAddrMapId: null,
                                dcAddrMapName: null,
                                offsetAddr: null,
                                startAddr: null,
                                endAddr: null,
                                valueType: null,
                                dataType: null,
                                dataBits: null,
                                readWriteType: null,
                                byteCode: null,
                                funcCode: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('data-acquisition-variable-iot', null, { reload: 'data-acquisition-variable-iot' });
                }, function() {
                    $state.go('data-acquisition-variable-iot');
                });
            }]
        })
        .state('data-acquisition-variable-iot.edit', {
            parent: 'data-acquisition-variable-iot',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/data-acquisition-variable/data-acquisition-variable-iot-dialog.html',
                    controller: 'DataAcquisitionVariableIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['DataAcquisitionVariable', function(DataAcquisitionVariable) {
                            return DataAcquisitionVariable.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('data-acquisition-variable-iot', null, { reload: 'data-acquisition-variable-iot' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('data-acquisition-variable-iot.delete', {
            parent: 'data-acquisition-variable-iot',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/data-acquisition-variable/data-acquisition-variable-iot-delete-dialog.html',
                    controller: 'DataAcquisitionVariableIotDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['DataAcquisitionVariable', function(DataAcquisitionVariable) {
                            return DataAcquisitionVariable.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('data-acquisition-variable-iot', null, { reload: 'data-acquisition-variable-iot' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
