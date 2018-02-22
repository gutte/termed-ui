(function (angular) { 'use strict';

angular.module('termed.admin', ['ngRoute'])

.config(function($routeProvider) {
  $routeProvider

  .when('/admin', {
    templateUrl: 'app/admin/admin.html',
    controller: 'AdminCtrl'
  })

  .when('/admin/users', {
    templateUrl: 'app/admin/users.html',
    controller: 'UsersCtrl'
  });
})

.controller('AdminCtrl', function($scope, $http) {

  $scope.reindex = function() {
    $scope.indexing = true;

    $http({
      method: 'DELETE',
      url: 'api/index'
    }).then(function(success) {
      $scope.indexing = false;
    }, function(error) {
      $scope.error = error;
      $scope.indexing = false;
    });
  };

  $scope.remote = {
    url: "http://localhost:8080/api/dump",
    username: "admin",
    password: "admin"
  };

  $scope.restore = function() {
    $scope.restoring = true;

    $http({
      method: 'POST',
      url: 'api/restore?remote=true',
      data: $scope.remote
    }).then(function(success) {
      $scope.restoring = false;
    }, function(error) {
      $scope.error = error;
      $scope.restoring = false;
    });
  };

  $scope.purgeRevisions = function() {
    $scope.purging = true;

    $http({
      method: 'DELETE',
      url: 'api/revisions'
    }).then(function(success) {
      $scope.purging = false;
    }, function(error) {
      $scope.error = error;
      $scope.purging = false;
    });
  };

})

.controller('UsersCtrl', function($scope, UserList, GraphList) {

  $scope.users = UserList.query();

  $scope.graphsById = {};
  $scope.graphs = GraphList.query({}, function(graphs) {
    for (var i = 0; i < graphs.length; i++) {
      $scope.graphsById[graphs[i].id] = graphs[i];
    }
  });

  $scope.newUser = function() {
    $scope.user = {
      updatePassword: true,
      graphRoles: []
    };
  };

  $scope.editUser = function(user) {
    $scope.user = angular.copy(user);
  };

  $scope.newGraphRole = function(user) {
    $scope.user.graphRoles.push({});
  };

  $scope.removeGraphRole = function(user, graphRole) {
    var i = user.graphRoles.indexOf(graphRole);
    user.graphRoles.splice(i, 1);
  };

  $scope.saveUser = function(user) {
    UserList.save({'updatePassword': !!user.updatePassword}, user, function() {
      $scope.users = UserList.query();
    }, function(error) {
      $scope.error = error;
    });
  };

  $scope.removeUser = function(user) {
    UserList.remove({'username': user.username}, function() {
      $scope.users = UserList.query();
    }, function(error) {
      $scope.error = error;
    });
  };

});

})(window.angular);
