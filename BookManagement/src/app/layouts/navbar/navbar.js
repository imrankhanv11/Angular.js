(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['authService', '$location', 'tokenService', '$rootScope'];

    function NavbarController(authService, $location, tokenService, $rootScope) {
        var nav = this;

        nav.isLoggedIn = function () {
            return authService.isAuthenticated();
        };

        function updateRole() {
            const decoded = tokenService.decode();
            nav.role = decoded ? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;
        }

        // Listen to login/logout events
        $rootScope.$on('loginSuccess', function () {
            updateRole();
        });

        $rootScope.$on('logoutSuccess', function () {
            nav.role = null;
        });

        nav.hasAdminAccess = function () {
            return nav.isLoggedIn() && (nav.role === 'SPAdmin' || nav.role === 'Admin');
        };

        nav.hasUserAccess = function () {
            return nav.isLoggedIn() && nav.role === 'User';
        };

        nav.logout = function () {
            authService.logout();
            $location.path('/login');
        };

        // Initialize role on page load (refresh or initial load)
        updateRole();
    }
})();
