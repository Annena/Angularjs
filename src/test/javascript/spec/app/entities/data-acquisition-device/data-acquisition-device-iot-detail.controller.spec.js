'use strict';

describe('Controller Tests', function() {

    describe('DataAcquisitionDevice Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockPreviousState, MockDataAcquisitionDevice, MockDataAcquisitionVariable, MockMonitorPoint;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockPreviousState = jasmine.createSpy('MockPreviousState');
            MockDataAcquisitionDevice = jasmine.createSpy('MockDataAcquisitionDevice');
            MockDataAcquisitionVariable = jasmine.createSpy('MockDataAcquisitionVariable');
            MockMonitorPoint = jasmine.createSpy('MockMonitorPoint');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity,
                'previousState': MockPreviousState,
                'DataAcquisitionDevice': MockDataAcquisitionDevice,
                'DataAcquisitionVariable': MockDataAcquisitionVariable,
                'MonitorPoint': MockMonitorPoint
            };
            createController = function() {
                $injector.get('$controller')("DataAcquisitionDeviceIotDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'gatewayApp:dataAcquisitionDeviceUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
