(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'authService'];

    function LoginController($location, authService) {
        var vm = this;

        vm.user = {
            userName: '',
            password: ''
        };

        vm.login = function () {
            if (vm.loginForm && vm.loginForm.$invalid) {
                angular.forEach(vm.loginForm, function (field, fieldName) {
                    if (fieldName[0] !== '$' && field.$setTouched) {
                        field.$setTouched();
                    }
                });
                return;
            }

            authService.login(vm.user)
                .then(function () {
                    $location.path('/');
                })
                .catch(function (error) {
                    console.error(error);
                });
        };
    }
})();
