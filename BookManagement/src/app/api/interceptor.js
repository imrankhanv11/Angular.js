(function () {
    'use strict';

    angular
        .module('myApp')
        .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$q', '$window', '$location', '$injector'];

    function authInterceptor($q, $window, $location, $injector) {
        return {
            request: function (config) {
                if (config.url.endsWith('.html')) {
                    return config;
                }

                const token = $window.localStorage.getItem('accessToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },

            responseError: function (response) {
                if (response.status === 401) {
                    const authService = $injector.get('authService');
                    authService.logout();

                    $location.path('/login');
                }

                return $q.reject(response);
            }
        };
    }
})();
