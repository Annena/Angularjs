(function() {
    'use strict';
    angular
        .module('gatewayApp')
        .factory('Workgroup', Workgroup);

    Workgroup.$inject = ['$resource'];

    function Workgroup ($resource) {
        var resourceUrl =  'config/' + 'api/workgroups/:id';

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
