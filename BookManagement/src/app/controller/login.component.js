(function () {
    'use strict';

    // const Swal = require('sweetalert2');

    angular
        .module('myApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$window'];

    function LoginController($window) {
        var vm = this;

        vm.user = {
            username: '',
            password: ''
        };

        vm.login = function () {
            if (vm.loginForm) {
                angular.forEach(vm.loginForm, function (field, fieldName) {
                    if (fieldName[0] !== '$' && field.$setTouched) {
                        field.$setTouched();
                    }
                });
            }

            if (vm.loginForm.$valid) {
                alert("Login Succesfully");

            } else {
                console.warn('Form invalid!');
            }
        };
    }
})();
