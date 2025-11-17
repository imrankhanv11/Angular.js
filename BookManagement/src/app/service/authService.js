
(function () {
    'use strict';

    angular
        .module('myApp')
        .service('authService', function ($http, $window, $rootScope, Endpoints) {

            this.login = function (credentials) {
                return $http.post(`${Endpoints.BASE_URL}${Endpoints.USER.LOGIN}`, credentials)
                    .then((response) => {
                        if (response.data) {
                            $window.localStorage.setItem('accessToken', response.data.accessToken);
                            $window.localStorage.setItem('refreshToken', response.data.refreshToken);
                            $rootScope.$emit('loginSuccess');
                        }
                        return response.data;
                    })
                    .catch((error) => {
                        throw error.data.message;
                    });
            };

            this.getToken = function () {
                return $window.localStorage.getItem('accessToken');
            };

            this.isAuthenticated = function () {
                return !!this.getToken();
            };

            this.logout = function () {
                $window.localStorage.removeItem('accessToken');
                $window.localStorage.removeItem('refreshToken');
                $rootScope.$emit('logoutSuccess');
            };
        });
})();
