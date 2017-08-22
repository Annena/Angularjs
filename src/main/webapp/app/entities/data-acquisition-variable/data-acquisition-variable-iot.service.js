(function() {
    'use strict';
    angular
        .module('gatewayApp')
        .factory('DataAcquisitionVariable', DataAcquisitionVariable);

    DataAcquisitionVariable.$inject = ['$resource'];

    function DataAcquisitionVariable ($resource) {
        var resourceUrl =  'config/' + 'api/data-acquisition-variables/:id';

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
