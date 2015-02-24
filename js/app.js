var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl',
            controllerAs: 'home'
        })
        .when('/tasks', {
            templateUrl: 'views/task/list.html',
            controller: 'TaskCtrl',
            controllerAs: 'task'
        })
        .when('/tasks/new', {
            templateUrl: 'views/task/new.html',
            controller: 'TaskCtrl',
            controllerAs: 'task'
        })
    }
]);

app.controller('MainCtrl', ['$scope', '$routeParams',
    function ($scope, $routeParams) {
    }
]);

app.controller('HomeCtrl', ['$scope', '$routeParams',
    function ($scope, $routeParams) {
    }
]);

app.controller('TaskCtrl', ['$scope', '$routeParams', '$location', 'morgan',
    function ($scope, $routeParams, $location, morgan) {
        $scope.tasks = morgan.tables.tasks.query();
        $scope.newTask = {};

        $scope.create = function () {
            morgan.create('tasks', $scope.newTask);
            $location.path('/tasks').replace();
        }

        $scope.delete = function (task) {
            task.deleteRecord();
            $scope.tasks.splice($scope.tasks.indexOf(task), 1);
        }
    }
]);

app.factory('morgan', ['$window',
    function ($window) {
        return $window.morgan; // tad bit overkilled
    }
]);
