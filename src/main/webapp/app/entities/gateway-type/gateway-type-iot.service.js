(function() {
    'use strict';
    angular
        .module('gatewayApp')
        .factory('GatewayType', GatewayType);

    GatewayType.$inject = ['$resource'];

    function GatewayType ($resource) {
        var resourceUrl =  'config/' + 'api/gateway-types/:id';

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
