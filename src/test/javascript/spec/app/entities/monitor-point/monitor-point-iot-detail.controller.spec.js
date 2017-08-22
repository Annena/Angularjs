'use strict';

describe('Controller Tests', function() {

    describe('MonitorPoint Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockPreviousState, MockMonitorPoint, MockMonitorPointAttribute, MockDataAcquisitionDevice, MockWorkgroup;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockPreviousState = jasmine.createSpy('MockPreviousState');
            MockMonitorPoint = jasmine.createSpy('MockMonitorPoint');
            MockMonitorPointAttribute = jasmine.createSpy('MockMonitorPointAttribute');
            MockDataAcquisitionDevice = jasmine.createSpy('MockDataAcquisitionDevice');
            MockWorkgroup = jasmine.createSpy('MockWorkgroup');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity,
                'previousState': MockPreviousState,
                'MonitorPoint': MockMonitorPoint,
                'MonitorPointAttribute': MockMonitorPointAttribute,
                'DataAcquisitionDevice': MockDataAcquisitionDevice,
                'Workgroup': MockWorkgroup
            };
            createController = function() {
                $injector.get('$controller')("MonitorPointIotDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'gatewayApp:monitorPointUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
