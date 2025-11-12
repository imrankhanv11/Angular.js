(function () {
    'use strict';

    angular
        .module('myApp')
        .service('authService', function ($http, $window) {

            const baseUrl = 'http://localhost:5007/api';

            this.login = function (credentials) {
                return $http.post(`${baseUrl}/Login/LoginUser`, credentials)
                    .then(function (response) {
                        if (response.data) {
                            $window.localStorage.setItem('accessToken', response.data.accessToken);
                        }
                        return response.data;
                    })
                    .catch(function (error) {
                        console.error('Login failed:', error);
                        throw error;
                    });
            };

            this.saveToken = function (token) {
                $window.localStorage.setItem('accessToken', token);
            };

            this.getToken = function () {
                return $window.localStorage.getItem('accessToken');
            };

            this.isAuthenticated = function () {
                return !!this.getToken();
            };

            this.logout = function () {
                $window.localStorage.removeItem('accessToken');
            };
        });
})();
