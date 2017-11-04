(function(angular) {
  'use strict';

  angular.module('termed.nodes.revisions', ['pascalprecht.translate', 'termed.rest'])

  .directive('thlNodeRevisions', function($translate, NodeRevisionList) {
    return {
      restrict: 'E',
      scope: {
        node: '=',
        revision: '@'
      },
      templateUrl: 'app/nodes/revisions/revisions.html',
      controller: function($scope) {
        $scope.lang = $translate.use();

        $scope.node.$promise.then(function(node) {
          $scope.revisions = NodeRevisionList.query({
            graphId: node.type.graph.id,
            typeId: node.type.id,
            id: node.id
          });
        });
      }
    };
  });

})(window.angular);
