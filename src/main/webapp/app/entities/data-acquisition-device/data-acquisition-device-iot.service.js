(function() {
    'use strict';
    angular
        .module('gatewayApp')
        .factory('DataAcquisitionDevice', DataAcquisitionDevice);

    DataAcquisitionDevice.$inject = ['$resource'];

    function DataAcquisitionDevice ($resource) {
        var resourceUrl =  'config/' + 'api/data-acquisition-devices/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
