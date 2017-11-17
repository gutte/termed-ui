(function (angular) { 'use strict';

angular.module('termed', ['ngRoute', 'pascalprecht.translate', 'termed.rest', 'termed.filters', 'termed.directives', 'termed.translations', 'termed.graphs', 'termed.nodes', 'termed.admin'])

.config(function($routeProvider) {
  $routeProvider.otherwise({
    redirectTo: '/graphs'
  });
})

.config(function($httpProvider) {
  if (!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {};
  }

  // disable caches for IE
  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
  $httpProvider.defaults.headers.get.Pragma = 'no-cache';
})

.controller('HeaderCtrl', function($scope, $translate) {
  $scope.changeLang = function(langKey) {
    $translate.use(langKey);
  };
});

})(window.angular);
