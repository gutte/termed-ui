(function (angular) { 'use strict';

angular.module('termed.nodes', ['ngRoute', 'termed.rest', 'termed.nodes.references', 'termed.nodes.referrers', 'termed.nodes.properties', 'termed.nodes.revisions'])

.config(function($routeProvider) {
  $routeProvider

  .when('/graphs/:graphId/nodes', {
    templateUrl: 'app/nodes/node-list.html',
    controller: 'NodeListCtrl',
    reloadOnSearch: false
  })

  .when('/graphs/:graphId/types/:typeId/nodes', {
    templateUrl: 'app/nodes/node-list-by-type.html',
    controller: 'NodeListByTypeCtrl',
    reloadOnSearch: false
  })

  .when('/graphs/:graphId/nodes-all', {
    templateUrl: 'app/nodes/node-list-all.html',
    controller: 'NodeListAllCtrl',
    reloadOnSearch: false
  })

  .when('/graphs/:graphId/nodes-sparql', {
    templateUrl: 'app/nodes/node-list-sparql.html',
    controller: 'NodeListSparqlCtrl'
  })

  .when('/graphs/:graphId/types/:typeId/nodes/:id', {
    templateUrl: 'app/nodes/node.html',
    controller: 'NodeCtrl'
  })

  .when('/graphs/:graphId/types/:typeId/nodes/:id/revisions/:number', {
    templateUrl: 'app/nodes/node-revision.html',
    controller: 'NodeRevisionCtrl'
  })

  .when('/graphs/:graphId/types/:typeId/nodes/:id/edit', {
    templateUrl: 'app/nodes/node-edit.html',
    controller: 'NodeEditCtrl'
  });
})

.controller('NodeListCtrl', function($scope, $route, $location, $routeParams, $translate, Graph, GraphNodeTreeList, NodeList, Node, TypeList) {

  $scope.lang = $translate.use();

  $scope.query = ($location.search()).q || "";
  $scope.max = 50;

  $scope.graph = Graph.get({
    graphId: $routeParams.graphId
  });

  var typeIndex = {};

  $scope.types = TypeList.query({
    graphId: $routeParams.graphId
  }, function(types) {
    types.forEach(function(c) {
      typeIndex[c.id] = c;
    });
  });

  $scope.typeById = function(typeId) {
    return typeIndex[typeId];
  };

  $scope.loadMoreResults = function() {
    $scope.max += 50;
    $scope.searchNodes(($location.search()).q || "");
  };

  $scope.searchNodes = function(query) {
    var tokens = (query.match(/\S+/g) || []);
    var where = [];

    $scope.types.forEach(function(type) {
      var whereType = [];
      
      whereType.push("graph.id:" + type.graph.id);
      whereType.push("type.id:" + type.id);

      if (tokens.length > 0) {
        var whereTypeProperties = [];
        type.textAttributes.forEach(function(textAttribute) {
          whereTypeProperties.push(tokens.map(function(token) {
            return "properties." + textAttribute.id + ":" + token + "*";
          }).join(" AND "));
        });
        whereType.push("(" + whereTypeProperties.join(" OR ") + ")");
      }

      where.push("(" + whereType.join(" AND ") + ")");
    });

    GraphNodeTreeList.query({
      graphId: $routeParams.graphId,
      select: 'id,code,type,properties.*',
      where: where.join(" OR "),
      max: $scope.max,
      sort: query ? '' : 'properties.prefLabel.' + $scope.lang + '.sortable'
    }, function(nodes) {
      $scope.nodes = nodes;
      $location.search({
        q: query
      }).replace();
    });
  };

  $scope.newNode = function(type) {
    NodeList.save({
      graph: $scope.graph,
      type: type
    }, function(node) {
      $location.path('/graphs/' + node.type.graph.id + '/types/' + node.type.id + '/nodes/' + node.id + '/edit');
    }, function(error) {
      $scope.error = error;
    });
  };

  $scope.searchNodes(($location.search()).q || "");

})

.controller('NodeListByTypeCtrl', function($scope, $route, $location, $routeParams, $translate, Graph, Type, TypeNodeTreeList, TypeList, NodeList) {

  $scope.lang = $translate.use();

  $scope.query = ($location.search()).q || "";
  $scope.max = 50;

  $scope.graph = Graph.get({
    graphId: $routeParams.graphId
  });

  $scope.type = Type.get({
    graphId: $routeParams.graphId,
    typeId: $routeParams.typeId
  }, function(type) {
    $scope.searchNodes(($location.search()).q || "");
  });

  $scope.types = TypeList.query({
    graphId: $routeParams.graphId
  });

  $scope.loadMoreResults = function() {
    $scope.max += 50;
    $scope.searchNodes(($location.search()).q || "");
  };

  $scope.searchNodes = function(query) {
    var where = "";

    var tokens = (query.match(/\S+/g) || []);
    if (tokens.length > 0) {
      var whereProperties = [];
      $scope.type.textAttributes.forEach(function(textAttribute) {
        whereProperties.push(tokens.map(function(token) {
          return "properties." + textAttribute.id + ":" + token + "*";
        }).join(" AND "));
      });
      where = whereProperties.join(" OR ");
    }

    TypeNodeTreeList.query({
      graphId: $routeParams.graphId,
      typeId: $routeParams.typeId,
      select: 'id,code,type,properties.*',
      where: where,
      max: $scope.max,
      sort: query ? '' : 'properties.prefLabel.' + $scope.lang + '.sortable'
    }, function(nodes) {
      $scope.nodes = nodes;
      $location.search({
        q: query
      }).replace();
    });
  };

  $scope.newNode = function() {
    NodeList.save({
      graph: $scope.graph,
      type: $scope.type
    }, function(node) {
      $location.path('/graphs/' + node.type.graph.id + '/types/' + node.type.id + '/nodes/' + node.id + '/edit');
    }, function(error) {
      $scope.error = error;
    });
  };

})

.controller('NodeListAllCtrl', function($scope, $route, $location, $routeParams, $translate, Graph, TypeList, GraphNodeTreeList) {

  $scope.lang = $translate.use();

  var select = $routeParams.select || 'id,code,uri,type,properties.*,references.*';
  var sort = $routeParams.sort || ('properties.prefLabel.' + $scope.lang + '.sortable');

  $scope.graph = Graph.get({
    graphId: $routeParams.graphId
  });

  $scope.typesById = {};

  TypeList.query({
    graphId: $routeParams.graphId
  }, function(types) {
    for (var i = 0; i < types.length; i++) {
      $scope.typesById[types[i].id] = types[i];
    }
  });

  $scope.nodes = GraphNodeTreeList.query({
    graphId: $routeParams.graphId,
    select: select,
    sort: sort,
    max: -1
  });

})

.controller('NodeListSparqlCtrl', function($scope, $route, $location, $routeParams, $translate, Graph, NodeSparqlEndpoint) {

  $scope.lang = $translate.use();

  $scope.graph = Graph.get({
    graphId: $routeParams.graphId
  });

  $scope.queryString =
    "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\nSELECT *\nWHERE {\n  ?s ?p ?o .\n}\n";

  $scope.query = function() {
    NodeSparqlEndpoint.query({
      graphId: $routeParams.graphId
    }, $scope.queryString, function(results) {
      $scope.table = results.data;
    }, function(error) {
      $scope.error = error;
    });
  };

})

.controller('NodeCtrl', function($scope, $routeParams, $location, $translate, Node, NodePaths, NodeList, Type, Graph) {

  $scope.lang = $translate.use();

  $scope.node = Node.get({
    graphId: $routeParams.graphId,
    typeId: $routeParams.typeId,
    id: $routeParams.id
  });

  $scope.type = Type.get({
    graphId: $routeParams.graphId,
    typeId: $routeParams.typeId
  });

  $scope.graph = Graph.get({
    graphId: $routeParams.graphId
  });
  
})

.controller('NodeRevisionCtrl', function($scope, $routeParams, $location, $translate, $q, NodeRevision, Type, Graph) {

  $scope.lang = $translate.use();

  $scope.revision = $routeParams.number;

  $scope.node = NodeRevision.get({
    graphId: $routeParams.graphId,
    typeId: $routeParams.typeId,
    id: $routeParams.id,
    number: $routeParams.number
  });

  $scope.type = Type.get({
    graphId: $routeParams.graphId,
    typeId: $routeParams.typeId
  });

  $scope.graph = Graph.get({
    graphId: $routeParams.graphId
  });

})

.controller('NodeEditCtrl', function($scope, $routeParams, $location, $translate, Node, Type, Graph) {

  $scope.lang = $translate.use();

  $scope.node = Node.get({
    graphId: $routeParams.graphId,
    typeId: $routeParams.typeId,
    id: $routeParams.id
  });

  $scope.type = Type.get({
    graphId: $routeParams.graphId,
    typeId: $routeParams.typeId
  });

  $scope.graph = Graph.get({
    graphId: $routeParams.graphId
  });

  $scope.save = function() {
    $scope.node.$update({
      graphId: $routeParams.graphId,
      typeId: $routeParams.typeId,
      id: $routeParams.id
    }, function(node) {
      $location.path('/graphs/' + node.type.graph.id + '/types/' + node.type.id + '/nodes/' + node.id);
    }, function(error) {
      $scope.error = error;
    });
  };

  $scope.remove = function() {
    $scope.node.$delete({
      graphId: $routeParams.graphId,
      typeId: $routeParams.typeId,
      id: $routeParams.id
    },function() {
      $location.path('/graphs/' + $routeParams.graphId + '/nodes');
    }, function(error) {
      $scope.error = error;
    });
  };

})

.directive('thlNodeTree', function($rootScope, $location, $q, $translate) {
  return {
    scope: {
      node: '=',
      type: '='
    },
    link: function(scope, elem, attrs) {

      function propVal(props, propertyId, defaultValue) {
        if (props[propertyId] && props[propertyId].length > 0) {
          return props[propertyId][0].value;
        }
        return defaultValue;
      }

      var lang = $translate.use();

      $rootScope.$on('$translateChangeEnd', function() {
        lang = $translate.use();
        elem.jstree("refresh");
      });

      $q.all([scope.node.$promise, scope.type.$promise]).then(function() {

        var treeAttributeId = propVal(scope.type.properties, "configTreeAttributeId", "broader");
        var treeInverted = propVal(scope.type.properties, "configTreeInverted", "true");
        var treeSort = propVal(scope.type.properties, "configTreeSort", "true");

        elem.jstree({
          core: {
            themes: {
              variant: "small"
            },
            data: {
              url: function(node) {
                var nodeGraphId;
                var nodeTypeId;
                var nodeId;

                if (node.id === '#') {
                  nodeGraphId = scope.node.type.graph.id;
                  nodeTypeId = scope.node.type.id;
                  nodeId = scope.node.id;
                } else {
                  nodeGraphId = node.li_attr.nodeGraphId;
                  nodeTypeId = node.li_attr.nodeTypeId;
                  nodeId = node.li_attr.nodeId;
                }

                return 'api/graphs/' + nodeGraphId +
                       '/types/' + nodeTypeId +
                       '/nodes/' + nodeId +
                       '/trees' +
                       '?attributeId=' + treeAttributeId +
                       '&context=true' +
                       '&jstree=true' +
                       '&referrers=' + treeInverted +
                       '&lang=' + lang;
              },
              data: function(node) {
                return node;
              }
            }
          },
          sort: function(a, b) {
            var aNode = this.get_node(a).original;
            var bNode = this.get_node(b).original;
            return aNode.text.localeCompare(bNode.text, lang);
          },
          plugins: [treeSort == "true" ? "sort" : ""]
        });
      });

      elem.on('activate_node.jstree', function(e, data) {
        scope.$apply(function() {
          $location.path(data.node.a_attr.href);
        });
      });
    }
  };
});

})(window.angular);
