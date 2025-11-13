(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('BookAddController', BookAddController);

    BookAddController.$inject = ['$http', 'bookService','$location'];
    function BookAddController($http, bookService, $location) {
        var vm = this;

        vm.book = {
            title: '',
            author: '',
            price: '',
            stock: '',
            categoryId: ''
        };

        vm.error = '';
        vm.category = [];

        $http.get(`http://localhost:5007/api/Categorys/GetAllCategory`)
            .then((response) => {
                vm.category = response.data;
            });

        vm.AddBook = function () {
            if (vm.addBookForm && vm.addBookForm.$invalid) {
                angular.forEach(vm.addBookForm, function (field, fieldName) {
                    if (fieldName[0] !== '$' && field.$setTouched) {
                        field.$setTouched();
                    }
                });
                return;
            }

            bookService.addBook(vm.book)
                .then(() => {
                    $location.path('/');
                })
                .catch((error) => console.log(error));
        };
    }
})();