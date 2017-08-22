(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('workgroup-iot', {
            parent: 'entity',
            url: '/workgroup-iot?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gatewayApp.workgroup.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/workgroup/workgroupsiot.html',
                    controller: 'WorkgroupIotController',
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
                    $translatePartialLoader.addPart('workgroup');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('workgroup-iot-detail', {
            parent: 'workgroup-iot',
            url: '/workgroup-iot/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gatewayApp.workgroup.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/workgroup/workgroup-iot-detail.html',
                    controller: 'WorkgroupIotDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('workgroup');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Workgroup', function($stateParams, Workgroup) {
                    return Workgroup.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'workgroup-iot',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('workgroup-iot-detail.edit', {
            parent: 'workgroup-iot-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/workgroup/workgroup-iot-dialog.html',
                    controller: 'WorkgroupIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Workgroup', function(Workgroup) {
                            return Workgroup.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('workgroup-iot.new', {
            parent: 'workgroup-iot',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/workgroup/workgroup-iot-dialog.html',
                    controller: 'WorkgroupIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                description: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('workgroup-iot', null, { reload: 'workgroup-iot' });
                }, function() {
                    $state.go('workgroup-iot');
                });
            }]
        })
        .state('workgroup-iot.edit', {
            parent: 'workgroup-iot',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/workgroup/workgroup-iot-dialog.html',
                    controller: 'WorkgroupIotDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Workgroup', function(Workgroup) {
                            return Workgroup.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('workgroup-iot', null, { reload: 'workgroup-iot' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('workgroup-iot.delete', {
            parent: 'workgroup-iot',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/workgroup/workgroup-iot-delete-dialog.html',
                    controller: 'WorkgroupIotDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Workgroup', function(Workgroup) {
                            return Workgroup.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('workgroup-iot', null, { reload: 'workgroup-iot' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
