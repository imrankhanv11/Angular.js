(function () {
    'use strict';

    angular
        .module('myApp')
        .service('bookService', bookService);

    bookService.$inject = ['$http', 'Endpoints'];
    function bookService($http, Endpoints) {

        var state = {
            books: []
        };

        this.state = state;

        this.getBookById = function (id) {
            return state.books.find(s => s.bookId === id);
        }

        this.getBooks = function () {
            return $http.get(`${Endpoints.BASE_URL}${Endpoints.BOOK.GET_ALL}`)
                .then((response) => {
                    state.books = response.data;
                    return state.books;
                })
                .catch((error) => {
                    console.error('Error fetching books:', error);
                    throw error;
                });
        };

        this.updateBook = function (data) {
            return $http.put(`${Endpoints.BASE_URL}${Endpoints.BOOK.UPDATE}`, data)
                .then(() => {
                    updateBookInState(data);
                })
                .catch((error) => {
                    console.error('Error deleting book:', error);
                    throw error;
                });
        }

        this.deleteBook = function (id) {
            return $http.delete(`${Endpoints.BASE_URL}${Endpoints.BOOK.DELETE}${id}`)
                .then(() => {
                    state.books = state.books.filter(book => book.bookId !== id);
                    return state.books;
                })
                .catch((error) => {
                    console.error('Error deleting book:', error);
                    throw error;
                });
        };

        this.addBook = function (data) {
            return $http.post(`${Endpoints.BASE_URL}${Endpoints.BOOK.CREATE}`, data)
                .then(() => {
                    state.books.push(data);
                    return state.books;
                })
                .catch((error) => {
                    console.error("Error at Adding", error);
                    throw error;
                })
        };

        function updateBookInState(updatedBook) {
            const index = state.books.findIndex(b => b.bookId === updatedBook.Id);

            if (index !== -1) {
                state.books[index] = updatedBook;
            }
        }
    }
})();
