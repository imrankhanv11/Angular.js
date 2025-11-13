(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['authService', '$location'];

    function NavbarController(authService, $location) {
        var nav4 = this;

        nav4.isLoggedIn = function () {
            return authService.isAuthenticated();
        };

        nav4.logout = function () {
            authService.logout();
            $location.path('/login');
        };
    }
})();
