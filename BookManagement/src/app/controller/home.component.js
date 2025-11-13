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