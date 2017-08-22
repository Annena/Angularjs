(function() {
    'use strict';
    angular
        .module('gatewayApp')
        .factory('Gateway', Gateway);

    Gateway.$inject = ['$resource'];

    function Gateway ($resource) {
        var resourceUrl =  'config/' + 'api/gateways/:id';

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
