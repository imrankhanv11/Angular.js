angular.module('myApp', ['ngRoute'])
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/view/home.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: 'app/view/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'
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
