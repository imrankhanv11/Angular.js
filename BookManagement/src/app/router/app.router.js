angular.module('myApp')
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider
            // public pages
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
            // admin pages
            .when('/adminbook', {
                templateUrl: 'app/view/adminBookPage.html',
                controller: 'AdminBookController',
                controllerAs: 'vm',
                resolve: {
                    auth: function ($q, $location, authService, tokenService) {
                        if (!authService.isAuthenticated()) {
                            $location.path('/login');
                            return $q.reject('Not authenticated');
                        }

                        const decoded = tokenService.decode();
                        const role = decoded ? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;

                        if (role === 'SPAdmin' || role === 'Admin') {
                            return true;
                        } else {
                            $location.path('/unauthorized');
                            return $q.reject('Not authorized');
                        }
                    }
                }
            })
            .when('/addbook', {
                templateUrl: 'app/view/bookAdd.html',
                controller: 'BookAddController',
                controllerAs: 'vm',
                resolve: {
                    auth: function ($q, $location, authService, tokenService) {
                        if (!authService.isAuthenticated()) {
                            $location.path('/login');
                            return $q.reject('Not authenticated');
                        }

                        const decoded = tokenService.decode();
                        const role = decoded ? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;

                        if (role === 'SPAdmin' || role === 'Admin') {
                            return true;
                        } else {
                            $location.path('/unauthorized');
                            return $q.reject('Not authorized');
                        }
                    }
                }
            })
            // use page
            .when('/userbook', {
                templateUrl: 'app/view/userBookPage.html',
                controller: 'UserBookController',
                controllerAs: 'vm',
                resolve: {
                    auth: function ($q, $location, authService, tokenService) {
                        if (!authService.isAuthenticated()) {
                            $location.path('/login');
                            return $q.reject('Not authenticated');
                        }

                        const decoded = tokenService.decode();
                        const role = decoded ? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;

                        if (role === 'User') {
                            return true;
                        } else {
                            $location.path('/unauthorized');
                            return $q.reject('Not authorized');
                        }
                    }
                }
            })
            // unauthorized
            .when('/unauthorized', {
                templateUrl: 'app/view/unauthorized.html'
            })
            // not found
            .otherwise({
                redirectTo: '/'
            });

        $httpProvider.interceptors.push('authInterceptor');
    });
