
(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('BookAddController', BookAddController);

    BookAddController.$inject = ['$http', 'bookService', '$location', '$routeParams'];
    function BookAddController($http, bookService, $location, $routeParams) {
        var vm = this;

        vm.book = {
            title: '',
            author: '',
            price: '',
            stock: '',
            categoryId: ''
        };

        vm.isEditMode = false;

        vm.error = '';
        vm.category = [];

        $http.get(`http://localhost:5007/api/Categorys/GetAllCategory`)
            .then((response) => {
                vm.category = response.data;
            });

        if ($routeParams.id) {
            vm.isEditMode = true;
            const updateBook = bookService.getBookById(Number($routeParams.id));
            vm.book.title = updateBook.title;
            vm.book.author = updateBook.author;
            vm.book.price = updateBook.price;
            vm.book.stock = updateBook.stock;
            vm.book.categoryId = updateBook.categoryId;
        }

        vm.AddBook = function () {
            if (vm.addBookForm && vm.addBookForm.$invalid) {
                angular.forEach(vm.addBookForm, function (field, fieldName) {
                    if (fieldName[0] !== '$' && field.$setTouched) {
                        field.$setTouched();
                    }
                });
                return;
            }

            if (vm.isEditMode) {
                bookService.updateBook({ ...vm.book, Id: Number($routeParams.id) })
                    .then(() => {
                        $location.path('/');
                    })
                    .catch((error) => console.log(error));
            }
            else {
                bookService.addBook(vm.book)
                    .then(() => {
                        $location.path('/');
                    })
                    .catch((error) => console.log(error));
            }
        };
    }
})();