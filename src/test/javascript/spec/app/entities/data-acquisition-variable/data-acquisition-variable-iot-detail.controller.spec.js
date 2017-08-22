'use strict';

describe('Controller Tests', function() {

    describe('DataAcquisitionVariable Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockPreviousState, MockDataAcquisitionVariable, MockDataAcquisitionDevice;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockPreviousState = jasmine.createSpy('MockPreviousState');
            MockDataAcquisitionVariable = jasmine.createSpy('MockDataAcquisitionVariable');
            MockDataAcquisitionDevice = jasmine.createSpy('MockDataAcquisitionDevice');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity,
                'previousState': MockPreviousState,
                'DataAcquisitionVariable': MockDataAcquisitionVariable,
                'DataAcquisitionDevice': MockDataAcquisitionDevice
            };
            createController = function() {
                $injector.get('$controller')("DataAcquisitionVariableIotDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'gatewayApp:dataAcquisitionVariableUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
