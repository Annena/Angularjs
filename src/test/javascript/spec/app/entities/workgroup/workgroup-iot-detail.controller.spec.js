'use strict';

describe('Controller Tests', function() {

    describe('Workgroup Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockPreviousState, MockWorkgroup, MockGatewayType, MockGateway, MockMonitorPoint;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockPreviousState = jasmine.createSpy('MockPreviousState');
            MockWorkgroup = jasmine.createSpy('MockWorkgroup');
            MockGatewayType = jasmine.createSpy('MockGatewayType');
            MockGateway = jasmine.createSpy('MockGateway');
            MockMonitorPoint = jasmine.createSpy('MockMonitorPoint');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity,
                'previousState': MockPreviousState,
                'Workgroup': MockWorkgroup,
                'GatewayType': MockGatewayType,
                'Gateway': MockGateway,
                'MonitorPoint': MockMonitorPoint
            };
            createController = function() {
                $injector.get('$controller')("WorkgroupIotDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'gatewayApp:workgroupUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
