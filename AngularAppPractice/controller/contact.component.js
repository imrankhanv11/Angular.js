(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('ContactController', ControllerController);

    ControllerController.$inject = ['$scope', 'bookService'];
    function ControllerController($scope, bookService) {
        $scope.message = "Contact Us";

        $scope.books = bookService.getState();

        bookService.getBooks()
            .then(function (data) {
                $scope.books = data;
            });

        $scope.deleteBook = function (id) {
            bookService.deleteBook(id).then(function (data) {
                $scope.books = data;
            });
        };
    }
})();