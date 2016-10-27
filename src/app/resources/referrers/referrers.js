(function(angular) {
  'use strict';

  angular.module('termed.resources.referrers', ['pascalprecht.translate', 'termed.rest'])

  .directive('thlResourceReferrers', function($translate, ResourceReferrerList) {
    return {
      restrict: 'E',
      scope: {
        resource: '='
      },
      templateUrl: 'app/resources/referrers/referrers.html',
      controller: function($scope) {
        $scope.lang = $translate.use();

        $scope.resource.$promise.then(function(resource) {
          for ( var attrId in resource.referrers) {
            resource.referrers[attrId] = ResourceReferrerList.query({
              schemeId: resource.type.scheme.id,
              typeId: resource.type.id,
              id: resource.id,
              attributeId: attrId
            });
          }
        });

        $scope.isEmpty = function(obj) {
          for ( var i in obj) {
            if (obj.hasOwnProperty(i)) {
              return false;
            }
          }
          return true;
        };
      }
    };
  });

})(window.angular);
