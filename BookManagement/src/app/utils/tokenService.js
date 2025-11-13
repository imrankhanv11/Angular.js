(function () {
    'use strict';

    angular
        .module('myApp')
        .factory('tokenService', tokenService);

    tokenService.$inject = ['$window'];

    function tokenService($window) {
        return {
            decode: function () {
                const token = $window.localStorage.getItem('accessToken');
                if (!token) return null;

                try {
                    return jwt_decode(token);
                } catch (err) {
                    console.error('Invalid token:', err);
                    return null;
                }
            }
        };
    }
})();
