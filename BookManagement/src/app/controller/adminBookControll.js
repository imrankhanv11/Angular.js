(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('AdminBookController', AdminBookController);

    AdminBookController.$inject = ['$scope', 'bookService', '$location'];
    function AdminBookController($scope, bookService, $location) {

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

        $scope.editBook = function (id) {
            $location.path('addbook/' + id);
        }
    }
})();