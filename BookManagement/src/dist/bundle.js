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

    HomeController.$inject = ['authService', '$rootScope', '$scope', 'bookService'];
    function HomeController(authService, $rootScope, $scope, bookService) {

        $scope.books = [];

        bookService.getBooks()
            .then(function (data) {
                $scope.books = data;
            });

        $scope.deleteBook = function (id) {
            if (confirm("Do you Want to delete?")) {
                bookService.deleteBook(id).then(function (data) {
                    $scope.books = data;
                });
            }
        };

        $scope.isLoggedIn = function () {
            return authService.isAuthenticated();
        };

        // var deregister = $rootScope.$on('authChanged', function (event, status) {
        //     home.loggedIn = status;
        // });

        // $scope.$on('$destroy', function () {
        //     deregister();
        // });
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

        vm.error = '';

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
                    vm.error = '';
                })
                .catch(function (error) {
                    console.error(error);
                    vm.error = error;
                });
        };
    }
})();

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

(function () {
    'use strict';

    angular
        .module('myApp')
        .service('bookService', bookService);

    bookService.$inject = ['$http'];
    function bookService($http) {
        const baseUrl = 'http://localhost:5007/api';

        var state = {
            books: []
        };

        this.state = state;

        this.getBooks = function () {
            return $http.get(`${baseUrl}/Books/GellAllBooks`)
                .then((response) => {
                    state.books = response.data;
                    return state.books;
                })
                .catch((error) => {
                    console.error('Error fetching books:', error);
                    throw error;
                });
        };

        this.deleteBook = function (id) {
            return $http.delete(`${baseUrl}/Books/DeleteBook/${id}`)
                .then(() => {
                    state.books = state.books.filter(book => book.bookId !== id);
                    return state.books;
                })
                .catch((error) => {
                    console.error('Error deleting book:', error);
                    throw error;
                });
        };
    }
})();

(function () {
    'use strict';

    angular
        .module('myApp')
        .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$q', '$window', '$location', '$injector'];

    function authInterceptor($q, $window, $location, $injector) {
        return {
            request: function (config) {
                if (config.url.endsWith('.html')) {
                    return config;
                }

                const token = $window.localStorage.getItem('accessToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },

            responseError: function (response) {
                if (response.status === 401) {
                    const authService = $injector.get('authService');
                    authService.logout();

                    $location.path('/login');
                }

                return $q.reject(response);
            }
        };
    }
})();

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
