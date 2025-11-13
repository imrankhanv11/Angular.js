"use strict";

angular.module('myApp', ['ngRoute']);
"use strict";

(function () {
  'use strict';

  angular.module('myApp').factory('authInterceptor', authInterceptor);
  authInterceptor.$inject = ['$q', '$window', '$location', '$injector'];
  function authInterceptor($q, $window, $location, $injector) {
    var refreshingToken = false;
    var requestQueue = [];
    return {
      request: function request(config) {
        if (config.url.endsWith('.html')) return config;
        var token = $window.localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = "Bearer ".concat(token);
        }
        return config;
      },
      responseError: function responseError(response) {
        if (response.status === 401 && !refreshingToken) {
          refreshingToken = true;
          var $http = $injector.get('$http');
          var refreshToken = $window.localStorage.getItem('refreshToken');
          if (!refreshToken) {
            handleLogout($injector, $location);
            return $q.reject(response);
          }
          return $http.post('http://localhost:5007/api/Login/RefreshToken', {
            refreshToken: refreshToken
          }).then(function (res) {
            var newToken = res.data.accessToken;
            $window.localStorage.setItem('accessToken', newToken);
            refreshingToken = false;
            requestQueue.forEach(function (req) {
              return req.resolve();
            });
            requestQueue = [];
            var newConfig = response.config;
            newConfig.headers.Authorization = "Bearer ".concat(newToken);
            return $http(newConfig);
          })["catch"](function (err) {
            refreshingToken = false;
            handleLogout($injector, $location);
            return $q.reject(err);
          });
        } else if (response.status === 401 && refreshingToken) {
          var deferred = $q.defer();
          requestQueue.push(deferred);
          return deferred.promise.then(function () {
            var $http = $injector.get('$http');
            var newToken = $window.localStorage.getItem('accessToken');
            response.config.headers.Authorization = "Bearer ".concat(newToken);
            return $http(response.config);
          });
        }
        return $q.reject(response);
      }
    };
    function handleLogout($injector, $location) {
      var authService = $injector.get('authService');
      authService.logout();
      $location.path('/login');
    }
  }
})();
"use strict";

(function () {
  'use strict';

  angular.module('myApp').controller('BookAddController', BookAddController);
  BookAddController.$inject = ['$http', 'bookService', '$location'];
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
    $http.get("http://localhost:5007/api/Categorys/GetAllCategory").then(function (response) {
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
      bookService.addBook(vm.book).then(function () {
        $location.path('/');
      })["catch"](function (error) {
        return console.log(error);
      });
    };
  }
})();
"use strict";

(function () {
  'use strict';

  angular.module('myApp').controller('HomeController', HomeController);
  HomeController.$inject = ['authService', '$rootScope', '$scope', 'bookService'];
  function HomeController(authService, $rootScope, $scope, bookService) {
    $scope.books = [];
    bookService.getBooks().then(function (data) {
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
"use strict";

(function () {
  'use strict';

  angular.module('myApp').controller('LoginController', LoginController);
  LoginController.$inject = ['$location', 'authService'];
  function LoginController($location, authService) {
    var vm = this;
    vm.user = {
      userName: '',
      password: ''
    };
    vm.error = '';
    vm.login = function () {
      if (vm.loginForm && vm.loginForm.$invalid) {
        angular.forEach(vm.loginForm, function (field, fieldName) {
          if (fieldName[0] !== '$' && field.$setTouched) {
            field.$setTouched();
          }
        });
        return;
      }
      authService.login(vm.user).then(function (data) {
        console.log('dfjkl  ');
        $location.path('/');
        vm.error = '';
      })["catch"](function (error) {
        console.error(error);
        vm.error = error;
      });
    };
  }
})();
"use strict";

angular.module('myApp').config(function ($routeProvider, $httpProvider) {
  $routeProvider.when('/', {
    templateUrl: 'app/view/home.html',
    controller: 'HomeController',
    controllerAs: 'vm'
  }).when('/login', {
    templateUrl: 'app/view/login.html',
    controller: 'LoginController',
    controllerAs: 'vm'
  }).when('/addbook', {
    templateUrl: 'app/view/bookAdd.html',
    controller: 'BookAddController',
    controllerAs: 'vm'
  }).otherwise({
    redirectTo: '/'
  });
  $httpProvider.interceptors.push('authInterceptor');
});
"use strict";

(function () {
  'use strict';

  angular.module('myApp').service('authService', function ($http, $window, $rootScope) {
    var baseUrl = "http://localhost:5007/api/";
    this.login = function (credentials) {
      return $http.post("".concat(baseUrl, "Login/LoginUser"), credentials).then(function (response) {
        if (response.data) {
          $window.localStorage.setItem('accessToken', response.data.accessToken);
          $window.localStorage.setItem('refreshToken', response.data.refreshToken);
          // $rootScope.$broadcast('authChanged', true);
        }
        return response.data;
      })["catch"](function (error) {
        throw error.data.message;
      });
    };

    // this.saveToken = function (token) {
    //     $window.localStorage.setItem('accessToken', token);
    //     // $rootScope.$broadcast('authChanged', true);
    // };

    this.getToken = function () {
      return $window.localStorage.getItem('accessToken');
    };
    this.isAuthenticated = function () {
      return !!this.getToken();
    };
    this.logout = function () {
      $window.localStorage.removeItem('accessToken');
      $window.localStorage.removeItem('refreshToken');
      // $rootScope.$broadcast('authChanged', false);
    };
  });
})();
"use strict";

(function () {
  'use strict';

  angular.module('myApp').service('bookService', bookService);
  bookService.$inject = ['$http'];
  function bookService($http) {
    var state = {
      books: []
    };
    this.state = state;
    var baseUrl = "http://localhost:5007/api/";
    this.getBooks = function () {
      return $http.get("".concat(baseUrl, "Books/GellAllBooks")).then(function (response) {
        state.books = response.data;
        return state.books;
      })["catch"](function (error) {
        console.error('Error fetching books:', error);
        throw error;
      });
    };
    this.deleteBook = function (id) {
      return $http["delete"]("".concat(baseUrl, "Books/DeleteBook/").concat(id)).then(function () {
        state.books = state.books.filter(function (book) {
          return book.bookId !== id;
        });
        return state.books;
      })["catch"](function (error) {
        console.error('Error deleting book:', error);
        throw error;
      });
    };
    this.addBook = function (data) {
      return $http.post("".concat(baseUrl, "Books/AddBook"), data).then(function () {
        state.books.push(data);
        return state.books;
      })["catch"](function (error) {
        console.error("Error at Adding", error);
        throw error;
      });
    };
  }
})();
"use strict";

(function () {
  'use strict';

  angular.module('myApp').controller('NavbarController', NavbarController);
  NavbarController.$inject = ['authService', '$location'];
  function NavbarController(authService, $location) {
    var nav4 = this;
    nav4.isLoggedIn = function () {
      return authService.isAuthenticated();
    };
    nav4.logout = function () {
      authService.logout();
      $location.path('/login');
    };
  }
})();