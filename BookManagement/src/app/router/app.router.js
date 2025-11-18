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
                    auth: function (authGuard) {
                        authGuard.adminOnly()
                    }
                }
            })
            .when('/admincat', {
                template: '<app-admincat></app-admincat>',
                resolve: {
                    auth: function (authGuard) {
                        authGuard.adminOnly()
                    }
                }
            })
            .when('/catadd', {
                template: '<app-catadd></app-catadd>',
                resolve: {
                    auth: function (authGuard) {
                        authGuard.adminOnly()
                    }
                }
            })
            .when('/catadd/:id', {
                template: '<app-catadd></app-catadd>',
                resolve: {
                    auth: function (authGuard) {
                        authGuard.adminOnly()
                    }
                }
            })
            .when('/addbook', {
                templateUrl: 'app/view/bookAdd.html',
                controller: 'BookAddController',
                controllerAs: 'vm',
                resolve: {
                    auth: function (authGuard) {
                        authGuard.adminOnly()
                    }
                }
            })
            .when('/addbook/:id', {
                templateUrl: 'app/view/bookAdd.html',
                controller: 'BookAddController',
                controllerAs: 'vm',
                resolve: {
                    auth: function (authGuard) {
                        authGuard.adminOnly()
                    }
                }
            })
            // use page
            .when('/userbook', {
                templateUrl: 'app/view/userBookPage.html',
                controller: 'UserBookController',
                controllerAs: 'vm',
                resolve: {
                    auth: function (authGuard) {
                        authGuard.userOnly()
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
