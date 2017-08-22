'use strict';

describe('Controller Tests', function() {

    describe('GatewayType Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockPreviousState, MockGatewayType, MockGateway, MockWorkgroup;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockPreviousState = jasmine.createSpy('MockPreviousState');
            MockGatewayType = jasmine.createSpy('MockGatewayType');
            MockGateway = jasmine.createSpy('MockGateway');
            MockWorkgroup = jasmine.createSpy('MockWorkgroup');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity,
                'previousState': MockPreviousState,
                'GatewayType': MockGatewayType,
                'Gateway': MockGateway,
                'Workgroup': MockWorkgroup
            };
            createController = function() {
                $injector.get('$controller')("GatewayTypeIotDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'gatewayApp:gatewayTypeUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
