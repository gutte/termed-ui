(function (angular) { 'use strict';

angular.module('termed.admin', ['ngRoute'])

.config(function($routeProvider) {
  $routeProvider

  .when('/admin', {
    templateUrl: 'app/admin/admin.html',
    controller: 'AdminCtrl'
  });
})

.controller('AdminCtrl', function($scope, $http) {

  $scope.reindex = function() {
    $scope.indexing = true;

    $http({
      method: 'POST',
      url: 'api/admin/reindex'
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
      url: 'api/admin/revisions'
    }).then(function(success) {
      $scope.purging = false;
    }, function(error) {
      $scope.error = error;
      $scope.purging = false;
    });
  };

})

})(window.angular);
