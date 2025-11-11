// app.js
angular.module('myApp', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'view/home.html',
                controller: 'HomeController'
            })
            .when('/about', {
                templateUrl: 'view/about.html',
                controller: 'AboutController'
            })
            .when('/contact', {
                templateUrl: 'view/contact.html',
                controller: 'ContactController'
            })
            .when('/practice', {
                templateUrl: 'view/practice.html',
                controller: 'PracticeController',
                // controllerAs: 'pc'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('AboutController', aboutController);

    aboutController.$inject = ['$scope'];
    function aboutController($scope) {
        $scope.message = "Hello About";
    }
})();
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
angular.module('myApp').controller('HomeController', function ($scope) {
    $scope.message = "Hello 6 Home";

    var vm = this;

    vm.users = [
        { name: 'Imran Khan', email: 'imran@example.com', role: 'Developer' },
        { name: 'Aisha', email: 'aisha@example.com', role: 'Designer' },
        { name: 'Rahul', email: 'rahul@example.com', role: 'Tester' }
    ];
});

angular.module('myApp').controller('PracticeController', function ($scope) {
    $scope.msg = "Hello Practice";

    $scope.users = [
        { name: 'Imran Khan', email: 'imran@example.com', role: 'Developer' },
        { name: 'Aisha', email: 'aisha@example.com', role: 'Designer' },
        { name: 'Rahul', email: 'rahul@example.com', role: 'Tester' }
    ];
});

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

angular.module('myApp')
    .component('practiceUse', {
        bindings: { user: '<' },
        templateUrl: 'component/practice/practiceUse.html',
        controller: function () {
        }
    });
