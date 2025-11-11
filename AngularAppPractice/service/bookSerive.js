(function () {
    'use strict';

    angular
        .module('myApp')
        .service('bookService', Service);

    Service.$inject = ['$http'];
    function Service($http) {

        var state = {
            books: []
        };

        this.getBooks = function () {
            return $http.get(`http://localhost:5007/api/Books/GellAllBooks`)
                .then(function (response) {
                    state.books = response.data;
                    return state.books;
                });
        };

        this.getState = function () {
            return state.books;
        }

        this.deleteBook = function (id) {
            return $http.delete(`http://localhost:5007/api/Books/DeleteBook/${id}`)
                .then(function () {
                    state.books = state.books.filter(book => book.bookId !== id);
                    return state.books;
                });
        };
    }
})();
