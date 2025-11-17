angular.module('myApp')
    .factory('authGuard', function ($q, $location, authService, tokenService) {

        function checkRole(allowedRoles) {
            if (!authService.isAuthenticated()) {
                $location.path('/login');
                return $q.reject('Not authenticated');
            }

            const decoded = tokenService.decode();
            const role = decoded ? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;

            if (allowedRoles.includes(role)) {
                return true;
            }

            $location.path('/unauthorized');
            return $q.reject('Not authorized');
        }

        return {
            adminOnly: () => checkRole(['Admin', 'SPAdmin']),
            userOnly: () => checkRole(['User']),
            any: (roles) => checkRole(roles)
        };
    });
