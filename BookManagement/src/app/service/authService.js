angular.module('myApp')
    .service('authService', function ($window) {
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
