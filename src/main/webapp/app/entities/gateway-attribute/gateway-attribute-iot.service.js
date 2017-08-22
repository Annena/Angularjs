(function() {
    'use strict';
    angular
        .module('gatewayApp')
        .factory('GatewayAttribute', GatewayAttribute);

    GatewayAttribute.$inject = ['$resource'];

    function GatewayAttribute ($resource) {
        var resourceUrl =  'config/' + 'api/gateway-attributes/:id';

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
