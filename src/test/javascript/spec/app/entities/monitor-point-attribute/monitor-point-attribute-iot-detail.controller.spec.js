'use strict';

describe('Controller Tests', function() {

    describe('MonitorPointAttribute Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockPreviousState, MockMonitorPointAttribute, MockMonitorPoint;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockPreviousState = jasmine.createSpy('MockPreviousState');
            MockMonitorPointAttribute = jasmine.createSpy('MockMonitorPointAttribute');
            MockMonitorPoint = jasmine.createSpy('MockMonitorPoint');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity,
                'previousState': MockPreviousState,
                'MonitorPointAttribute': MockMonitorPointAttribute,
                'MonitorPoint': MockMonitorPoint
            };
            createController = function() {
                $injector.get('$controller')("MonitorPointAttributeIotDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'gatewayApp:monitorPointAttributeUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
