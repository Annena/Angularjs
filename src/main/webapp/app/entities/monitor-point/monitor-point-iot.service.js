(function() {
    'use strict';
    angular
        .module('gatewayApp')
        .factory('MonitorPoint', MonitorPoint);

    MonitorPoint.$inject = ['$resource'];

    function MonitorPoint ($resource) {
        var resourceUrl =  'config/' + 'api/monitor-points/:id';

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
