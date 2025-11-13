(function () {
    'use strict';

    angular
        .module('myApp')
        .service('authService', function ($http, $window, $rootScope) {

            const baseUrl = 'http://localhost:5007/api';

            this.login = function (credentials) {
                return $http.post(`${baseUrl}/Login/LoginUser`, credentials)
                    .then((response) => {
                        if (response.data) {
                            $window.localStorage.setItem('accessToken', response.data.accessToken);
                            // $rootScope.$broadcast('authChanged', true);
                        }
                        return response.data;
                    })
                    .catch((error) => {
                        throw error.data.message;
                    });
            };

            // this.saveToken = function (token) {
            //     $window.localStorage.setItem('accessToken', token);
            //     // $rootScope.$broadcast('authChanged', true);
            // };

            this.getToken = function () {
                return $window.localStorage.getItem('accessToken');
            };

            this.isAuthenticated = function () {
                return !!this.getToken();
            };

            this.logout = function () {
                $window.localStorage.removeItem('accessToken');
                // $rootScope.$broadcast('authChanged', false);
            };
        });
})();
