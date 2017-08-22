'use strict';

describe('Controller Tests', function() {

    describe('Gateway Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockPreviousState, MockGateway, MockGatewayAttribute, MockWorkgroup, MockGatewayType;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockPreviousState = jasmine.createSpy('MockPreviousState');
            MockGateway = jasmine.createSpy('MockGateway');
            MockGatewayAttribute = jasmine.createSpy('MockGatewayAttribute');
            MockWorkgroup = jasmine.createSpy('MockWorkgroup');
            MockGatewayType = jasmine.createSpy('MockGatewayType');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity,
                'previousState': MockPreviousState,
                'Gateway': MockGateway,
                'GatewayAttribute': MockGatewayAttribute,
                'Workgroup': MockWorkgroup,
                'GatewayType': MockGatewayType
            };
            createController = function() {
                $injector.get('$controller')("GatewayIotDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'gatewayApp:gatewayUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
