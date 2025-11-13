(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('UserBookController', UserBookController);

    UserBookController.$inject = ['$scope', 'bookService'];
    function UserBookController($scope, bookService) {

        $scope.books = [];

        bookService.getBooks()
            .then(function (data) {
                $scope.books = data;
            });
    }
})();