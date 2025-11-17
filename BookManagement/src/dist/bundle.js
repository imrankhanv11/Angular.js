"use strict";

angular.module('myApp', ['ngRoute']);
"use strict";

(function () {
  'use strict';

  angular.module('myApp').constant('Endpoints', {
    BASE_URL: "http://localhost:5007/api",
    BOOK: {
      GET_ALL: "/Books/GellAllBooks",
      CREATE: "/Books/AddBook",
      UPDATE: "/Books/UpdateBook",
      DELETE: "/Books/DeleteBook/"
    },
    USER: {
      LOGIN: "/Login/LoginUser",
      REGISTER: "/Login/RegisterUser"
    }
  });
})();
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

  angular.module('myApp').controller('AdminBookController', AdminBookController);
  AdminBookController.$inject = ['$scope', 'bookService', '$location'];
  function AdminBookController($scope, bookService, $location) {
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
    $scope.editBook = function (id) {
      $location.path('addbook/' + id);
    };
  }
})();
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function () {
  'use strict';

  angular.module('myApp').controller('BookAddController', BookAddController);
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
    $http.get("http://localhost:5007/api/Categorys/GetAllCategory").then(function (response) {
      vm.category = response.data;
    });
    if ($routeParams.id) {
      vm.isEditMode = true;
      var updateBook = bookService.getBookById(Number($routeParams.id));
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
        bookService.updateBook(_objectSpread(_objectSpread({}, vm.book), {}, {
          Id: Number($routeParams.id)
        })).then(function () {
          $location.path('/');
        })["catch"](function (error) {
          return console.log(error);
        });
      } else {
        bookService.addBook(vm.book).then(function () {
          $location.path('/');
        })["catch"](function (error) {
          return console.log(error);
        });
      }
    };
  }
})();
"use strict";

(function () {
  'use strict';

  angular.module('myApp').controller('HomeController', HomeController);
  HomeController.$inject = [];
  function HomeController() {}
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

(function () {
  'use strict';

  angular.module('myApp').controller('UserBookController', UserBookController);
  UserBookController.$inject = ['$scope', 'bookService'];
  function UserBookController($scope, bookService) {
    $scope.books = [];
    bookService.getBooks().then(function (data) {
      $scope.books = data;
    });
  }
})();
"use strict";

angular.module('myApp').config(function ($routeProvider, $httpProvider) {
  $routeProvider
  // public pages
  .when('/', {
    templateUrl: 'app/view/home.html',
    controller: 'HomeController',
    controllerAs: 'vm'
  }).when('/login', {
    templateUrl: 'app/view/login.html',
    controller: 'LoginController',
    controllerAs: 'vm'
  })
  // admin pages
  .when('/adminbook', {
    templateUrl: 'app/view/adminBookPage.html',
    controller: 'AdminBookController',
    controllerAs: 'vm',
    resolve: {
      auth: function auth(authGuard) {
        authGuard.adminOnly();
      }
    }
  }).when('/addbook', {
    templateUrl: 'app/view/bookAdd.html',
    controller: 'BookAddController',
    controllerAs: 'vm',
    resolve: {
      auth: function auth(authGuard) {
        authGuard.adminOnly();
      }
    }
  }).when('/addbook/:id', {
    templateUrl: 'app/view/bookAdd.html',
    controller: 'BookAddController',
    controllerAs: 'vm',
    resolve: {
      auth: function auth(authGuard) {
        authGuard.adminOnly();
      }
    }
  })
  // use page
  .when('/userbook', {
    templateUrl: 'app/view/userBookPage.html',
    controller: 'UserBookController',
    controllerAs: 'vm',
    resolve: {
      auth: function auth(authGuard) {
        authGuard.userOnly();
      }
    }
  })
  // unauthorized
  .when('/unauthorized', {
    templateUrl: 'app/view/unauthorized.html'
  })
  // not found
  .otherwise({
    redirectTo: '/'
  });
  $httpProvider.interceptors.push('authInterceptor');
});
"use strict";

angular.module('myApp').factory('authGuard', function ($q, $location, authService, tokenService) {
  function checkRole(allowedRoles) {
    if (!authService.isAuthenticated()) {
      $location.path('/login');
      return $q.reject('Not authenticated');
    }
    var decoded = tokenService.decode();
    var role = decoded ? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;
    if (allowedRoles.includes(role)) {
      return true;
    }
    $location.path('/unauthorized');
    return $q.reject('Not authorized');
  }
  return {
    adminOnly: function adminOnly() {
      return checkRole(['Admin', 'SPAdmin']);
    },
    userOnly: function userOnly() {
      return checkRole(['User']);
    },
    any: function any(roles) {
      return checkRole(roles);
    }
  };
});
"use strict";

(function () {
  'use strict';

  angular.module('myApp').service('authService', function ($http, $window, $rootScope, Endpoints) {
    this.login = function (credentials) {
      return $http.post("".concat(Endpoints.BASE_URL).concat(Endpoints.USER.LOGIN), credentials).then(function (response) {
        if (response.data) {
          $window.localStorage.setItem('accessToken', response.data.accessToken);
          $window.localStorage.setItem('refreshToken', response.data.refreshToken);
          $rootScope.$emit('loginSuccess');
        }
        return response.data;
      })["catch"](function (error) {
        throw error.data.message;
      });
    };
    this.getToken = function () {
      return $window.localStorage.getItem('accessToken');
    };
    this.isAuthenticated = function () {
      return !!this.getToken();
    };
    this.logout = function () {
      $window.localStorage.removeItem('accessToken');
      $window.localStorage.removeItem('refreshToken');
      $rootScope.$emit('logoutSuccess');
    };
  });
})();
"use strict";

(function () {
  'use strict';

  angular.module('myApp').service('bookService', bookService);
  bookService.$inject = ['$http', 'Endpoints'];
  function bookService($http, Endpoints) {
    var state = {
      books: []
    };
    this.state = state;
    this.getBookById = function (id) {
      return state.books.find(function (s) {
        return s.bookId === id;
      });
    };
    this.getBooks = function () {
      return $http.get("".concat(Endpoints.BASE_URL).concat(Endpoints.BOOK.GET_ALL)).then(function (response) {
        state.books = response.data;
        return state.books;
      })["catch"](function (error) {
        console.error('Error fetching books:', error);
        throw error;
      });
    };
    this.updateBook = function (data) {
      return $http.put("".concat(Endpoints.BASE_URL).concat(Endpoints.BOOK.UPDATE), data).then(function () {
        updateBookInState(data);
      })["catch"](function (error) {
        console.error('Error deleting book:', error);
        throw error;
      });
    };
    this.deleteBook = function (id) {
      return $http["delete"]("".concat(Endpoints.BASE_URL).concat(Endpoints.BOOK.DELETE).concat(id)).then(function () {
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
      return $http.post("".concat(Endpoints.BASE_URL).concat(Endpoints.BOOK.CREATE), data).then(function () {
        state.books.push(data);
        return state.books;
      })["catch"](function (error) {
        console.error("Error at Adding", error);
        throw error;
      });
    };
    function updateBookInState(updatedBook) {
      var index = state.books.findIndex(function (b) {
        return b.bookId === updatedBook.Id;
      });
      if (index !== -1) {
        state.books[index] = updatedBook;
      }
    }
  }
})();
"use strict";

(function () {
  'use strict';

  angular.module('myApp').factory('tokenService', tokenService);
  tokenService.$inject = ['$window'];
  function tokenService($window) {
    return {
      decode: function decode() {
        var token = $window.localStorage.getItem('accessToken');
        if (!token) return null;
        try {
          return jwt_decode(token);
        } catch (err) {
          console.error('Invalid token:', err);
          return null;
        }
      }
    };
  }
})();
"use strict";

(function () {
  'use strict';

  angular.module('myApp').component('heroSection', {
    templateUrl: 'app/component/heroSection/hero.html',
    controller: HeroController,
    controllerAs: 'hero'
  });
  HeroController.$inject = ['$location'];
  function HeroController($location) {
    var hero = this;
    hero.title = "Book Management System";
    hero.subtitle = "Easily manage your books, add new titles, track availability, and keep everything organized.";
    hero.ctaText = "Get Started";
    hero.goToAddBook = function () {
      $location.path('/addbook');
    };
  }
})();
"use strict";

(function () {
  'use strict';

  angular.module('myApp').component('appFooter', {
    templateUrl: 'app/layouts/footer/footer.html',
    controller: FooterController
  });
  FooterController.$inject = [];
  function FooterController() {}
})();
"use strict";

(function () {
  'use strict';

  angular.module('myApp').controller('NavbarController', NavbarController);
  NavbarController.$inject = ['authService', '$location', 'tokenService', '$rootScope'];
  function NavbarController(authService, $location, tokenService, $rootScope) {
    var nav = this;
    nav.isLoggedIn = function () {
      return authService.isAuthenticated();
    };
    function updateRole() {
      var decoded = tokenService.decode();
      nav.role = decoded ? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;
    }

    // Listen to login/logout events
    $rootScope.$on('loginSuccess', function () {
      updateRole();
    });
    $rootScope.$on('logoutSuccess', function () {
      nav.role = null;
    });
    nav.hasAdminAccess = function () {
      return nav.isLoggedIn() && (nav.role === 'SPAdmin' || nav.role === 'Admin');
    };
    nav.hasUserAccess = function () {
      return nav.isLoggedIn() && nav.role === 'User';
    };
    nav.logout = function () {
      authService.logout();
      $location.path('/login');
    };

    // Initialize role on page load (refresh or initial load)
    updateRole();
  }
})();