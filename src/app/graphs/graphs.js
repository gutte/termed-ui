(function (angular) { 'use strict';

angular.module('termed.graphs', ['ngRoute', 'termed.rest', 'termed.graphs.properties'])

.config(function($routeProvider) {
  $routeProvider

  .when('/graphs/', {
    templateUrl: 'app/graphs/graph-list.html',
    controller: 'GraphListCtrl',
    reloadOnSearch: false
  })

  .when('/graphs/:graphId/edit', {
    templateUrl: 'app/graphs/graph-edit.html',
    controller: 'GraphEditCtrl'
  });
})

.controller('GraphListCtrl', function($scope, $location, $translate, GraphList, NodeList) {

  $scope.lang = $translate.use();

  $scope.query = ($location.search()).q || "";
  $scope.max = 50;

  $scope.loadMoreResults = function() {
    $scope.max += 50;
    $scope.searchNodes(($location.search()).q || "");
  };

  $scope.searchNodes = function(query) {
    NodeList.query({
      query: query,
      max: $scope.max
    }, function(nodes) {
      $scope.nodes = nodes;
      $location.search({
        q: $scope.query
      }).replace();
    });
  };

  var graphIndex = {};

  $scope.graphs = GraphList.query({
    orderBy: 'prefLabel.fi'
  }, function(graphs) {
    graphs.forEach(function(s) {
      graphIndex[s.id] = s;
    });
  });

  $scope.graphById = function(graphId) {
    return graphIndex[graphId];
  };

  $scope.newGraph = function() {
    GraphList.save({
      properties: {
        prefLabel: [
          {
            lang: "fi",
            value: "Uusi aineisto"
          }
        ]
      }
    }, function(graph) {
      $location.path('/graphs/' + graph.id + '/edit');
    });
  };

  $scope.searchNodes(($location.search()).q || "");

})

.controller('GraphEditCtrl', function($scope, $routeParams, $location, $translate, Graph, Type, TypeList, PropertyList, GraphNodeList, TypeNodeList) {

  $scope.lang = $translate.use();

  $scope.graph = Graph.get({
    graphId: $routeParams.graphId
  }, function(graph) {
    $scope.types = TypeList.query({ graphId: graph.id });
  });

  $scope.properties = PropertyList.query();

  $scope.save = function() {
    $scope.graph.$save(function() {
      TypeList.save({ graphId: $routeParams.graphId, batch: true }, $scope.types, function() {
        $location.path('/graphs/' + $routeParams.graphId + '/nodes');
      }, function(error) {
        $scope.error = error;
      });
    }, function(error) {
      $scope.error = error;
    });
  };

  $scope.remove = function() {
    GraphNodeList.remove({ graphId: $routeParams.graphId }).$promise
    .then(function() {
      return TypeList.remove({ graphId: $routeParams.graphId }).$promise;
    }).then(function() {
      return $scope.graph.$delete({ graphId: $routeParams.graphId}).$promise;
    }).then(function() {
      $location.path('/graphs');
    }, function(error) {
      $scope.error = error;
    });
  };

  $scope.newType = function() {
    var newType = {
      id: "NewType_" + new Date().getTime(),
      properties: {
        prefLabel: [
          {
            lang: "fi",
            value: "Uusi luokka"
          }
        ]
      },
      textAttributes: [
        {
          id: "prefLabel",
          regex: "(?s)^.*$",
          properties: {
            prefLabel: [
              {
                lang: "fi",
                value: "Nimike"
              }
            ]
          }
        }
      ]
    };

    TypeList.save({ graphId: $routeParams.graphId }, newType, function() {
      $scope.types = TypeList.query({ graphId: $routeParams.graphId });
    }, function(error) {
      $scope.error = error;
    });
  };

  $scope.selectType = function(type) {
    $scope.type = type;
  };

  $scope.removeType = function(type) {
    TypeNodeList.remove({ graphId: $routeParams.graphId, typeId: type.id }, function() {
      Type.remove({ graphId: $routeParams.graphId, typeId: type.id }, function() {
        $scope.types = TypeList.query({ graphId: $routeParams.graphId });
      }, function(error) {
        $scope.error = error;
      });
    }, function(error) {
      $scope.error = error;
    });
  };

  $scope.newTextAttribute = function(type) {
    if (!type.textAttributes) {
      type.textAttributes = [];
    }
    type.textAttributes.push({
      id: "newTextAttribute",
      regex: "(?s)^.*$",
      properties: {
        prefLabel: [
          {
            lang: "fi",
            value: "Uusi tekstiattribuutti"
          }
        ]
      }
    });
  };

  $scope.selectTextAttribute = function(textAttribute) {
    $scope.textAttribute = textAttribute;
  };

  $scope.removeTextAttribute = function(type, textAttribute) {
    var i = type.textAttributes.indexOf(textAttribute);
    type.textAttributes.splice(i, 1);
  };

  $scope.newReferenceAttribute = function(type) {
    if (!type.referenceAttributes) {
      type.referenceAttributes = [];
    }
    type.referenceAttributes.push({
      id: "newReferenceAttribute",
      properties: {
        prefLabel: [
          {
            lang: "fi",
            value: "Uusi viiteattribuutit"
          }
        ]
      }
    });
  };

  $scope.selectReferenceAttribute = function(referenceAttribute) {
    $scope.referenceAttribute = referenceAttribute;
  };

  $scope.removeReferenceAttribute = function(type, referenceAttribute) {
    var i = type.referenceAttributes.indexOf(referenceAttribute);
    type.referenceAttributes.splice(i, 1);
  };

});

})(window.angular);
