angular.module('myApp', ['ngRoute'])
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/view/home.html',
                controller: 'HomeController'
            })
            .when('/login', {
                templateUrl: 'app/view/login.html',
                controller: 'LoginController'
            })
            .otherwise({
                redirectTo: '/'
            });

        $httpProvider.interceptors.push('authInterceptor');
    });

(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = [];
    function HomeController() {
    }
})();
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

(function () {
    'use strict';

    angular
        .module('myApp')
        .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$q', '$window', '$location'];

    function authInterceptor($q, $window, $location) {
        return {
            request: function (config) {
                if (config.url.endsWith('.html')) {
                    return config;
                }

                const token = $window.localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },

            responseError: function (response) {
                if (response.status === 401) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    }
})();
