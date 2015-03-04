var app = angular.module('app', ['ngRoute', 'ngMaterial']);

app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        })
        .when('/tasks', {
            templateUrl: 'views/task/list.html',
            controller: 'TaskListCtrl'
        })
        .when('/tasks/new', {
            templateUrl: 'views/task/edit.html',
            controller: 'TaskNewCtrl'
        })
        .when('/tasks/:id/edit', {
            templateUrl: 'views/task/edit.html',
            controller: 'TaskEditCtrl'
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

app.controller('TaskListCtrl', ['$scope', '$routeParams', '$location', 'morgan',
    function ($scope, $routeParams, $location, morgan) {
        $scope.statusById = _.indexBy(_.find(morgan.specs.tasks.fields, function (field) { return field.name === 'status'; }).options, 'id');
        $scope.tasks = morgan.tables.tasks.query();
        $scope.tasksByStatus = [];

        $scope.resetTasksByStatus = function () {
            $scope.tasksByStatus = _.chain($scope.tasks)
                                    .groupBy(function(t){ return t.get('status'); })
                                    .value();
        }

        $scope.next = function (task) {
            var newStatus = task.get('status')+1;
            if (_.has($scope.statusById, newStatus)) {
                task.set('status', newStatus);
                $scope.resetTasksByStatus();
            }
        }

        $scope.prev = function (task) {
            var newStatus = task.get('status')-1;
            if (_.has($scope.statusById, newStatus)) {
                task.set('status', newStatus);
                $scope.resetTasksByStatus();
            }
        }

        $scope.edit = function (task) {
            $location.path('/tasks/' + task.getId() + '/edit').replace();
        }

        $scope.delete = function (task) {
            task.deleteRecord();
            $scope.tasks = morgan.tables.tasks.query();
            $scope.resetTasksByStatus();
        }

        // setup
        $scope.resetTasksByStatus();
    }
]);

app.controller('TaskNewCtrl', ['$scope', '$location', 'morgan',
    function ($scope, $location, morgan) {
        $scope.fields = morgan.specs.tasks.fields;
        $scope.task = morgan.specs.tasks.fields.reduce(function (memo, me) {
            memo[me.name] = _.isFunction(me.default) ? me.default() : me.default;
            return memo;
        }, {});

        $scope.save = function () {
            morgan.create('tasks', $scope.task);
            $location.path('/tasks').replace();
        }
    }
]);

app.controller('TaskEditCtrl', ['$scope', '$routeParams', '$location', 'morgan',
    function ($scope, $routeParams, $location, morgan) {
        var record = morgan.tables.tasks.get($routeParams.id);

        $scope.task = record ? record.getFields() : {};
        $scope.fields = morgan.specs.tasks.fields;

        $scope.save = function () {
            morgan.update(record, $scope.task);
            $location.path('/tasks');
        }
    }
]);

app.factory('morgan', ['$window',
    function ($window) {
        return $window.morgan; // tad bit overkilled
    }
]);
