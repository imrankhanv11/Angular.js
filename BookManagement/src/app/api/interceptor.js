(function () {
    'use strict';

    angular
        .module('myApp')
        .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$q', '$window', '$location'];

    function authInterceptor($q, $window, $location) {
        return {
            request: function (config) {
                if (config.url.endsWith('.html')) {
                    return config;
                }

                const token = $window.localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },

            responseError: function (response) {
                if (response.status === 401) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    }
})();
