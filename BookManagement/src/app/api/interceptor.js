(function () {
    'use strict';

    angular
        .module('myApp')
        .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$q', '$window', '$location', '$injector', 'Endpoints'];

    function authInterceptor($q, $window, $location, $injector, Endpoints) {
        let refreshingToken = false;
        let requestQueue = [];

        return {
            request: function (config) {
                if (config.url.endsWith('.html')) return config;

                const token = $window.localStorage.getItem('accessToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },

            responseError: function (response) {
                if (response.status === 401 && !refreshingToken) {
                    refreshingToken = true;

                    const $http = $injector.get('$http');
                    const refreshToken = $window.localStorage.getItem('refreshToken');

                    if (!refreshToken) {
                        handleLogout($injector, $location);
                        return $q.reject(response);
                    }

                    return $http.post(`${Endpoints.BASE_URL}${Endpoints.USER.REFRESH}`, {
                        refreshToken: refreshToken
                    })
                        .then(res => {
                            const newToken = res.data.accessToken;
                            $window.localStorage.setItem('accessToken', newToken);

                            refreshingToken = false;

                            requestQueue.forEach(req => req.resolve());
                            requestQueue = [];

                            const newConfig = response.config;
                            newConfig.headers.Authorization = `Bearer ${newToken}`;
                            return $http(newConfig);
                        })
                        .catch(err => {
                            refreshingToken = false;
                            if (err.status === 401) {
                                handleLogout($injector, $location);
                            }
                            return $q.reject(err);
                        });
                }
                else if (response.status === 401 && refreshingToken) {
                    const deferred = $q.defer();
                    requestQueue.push(deferred);
                    return deferred.promise.then(() => {
                        const $http = $injector.get('$http');
                        const newToken = $window.localStorage.getItem('accessToken');
                        response.config.headers.Authorization = `Bearer ${newToken}`;
                        return $http(response.config);
                    });
                }

                return $q.reject(response);
            }
        };

        function handleLogout($injector, $location) {
            const authService = $injector.get('authService');
            authService.logout();
            $location.path('/login');
        }
    }
})();
