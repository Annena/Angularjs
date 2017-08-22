(function() {
    'use strict';
    angular
        .module('gatewayApp')
        .factory('MonitorPointAttribute', MonitorPointAttribute);

    MonitorPointAttribute.$inject = ['$resource'];

    function MonitorPointAttribute ($resource) {
        var resourceUrl =  'config/' + 'api/monitor-point-attributes/:id';

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
