(function (angular) { 'use strict';

angular.module('termed.rest', ['ngResource'])

.factory('GraphList', function($resource) {
  return $resource('api/graphs');
})

.factory('Graph', function($resource) {
  return $resource('api/graphs/:graphId');
})

.factory('TypeList', function($resource) {
  return $resource('api/graphs/:graphId/types');
})

.factory('Type', function($resource) {
  return $resource('api/graphs/:graphId/types/:typeId');
})

.factory('TextAttributeList', function($resource) {
  return $resource('api/graphs/:graphId/types/:typeId/textAttributes');
})

.factory('ReferenceAttributeList', function($resource) {
  return $resource('api/graphs/:graphId/types/:typeId/referenceAttributes');
})

.factory('NodeList', function($resource) {
  return $resource('api/nodes');
})

.factory('GraphNodeList', function($resource) {
  return $resource('api/graphs/:graphId/nodes');
})

.factory('FullNodeList', function($resource) {
  return $resource('api/ext');
})

.factory('TypeNodeList', function($resource) {
  return $resource('api/graphs/:graphId/types/:typeId/nodes');
})

.factory('Node', function($resource) {
  return $resource('api/graphs/:graphId/types/:typeId/nodes/:id', null, { 'update': { method : 'PUT' }});
})

.factory('NodeReferenceList', function($resource) {
  return $resource('api/graphs/:graphId/types/:typeId/nodes/:id/references/:attributeId');
})

.factory('NodeReferrerList', function($resource) {
  return $resource('api/graphs/:graphId/types/:typeId/nodes/:id/referrers/:attributeId');
})

.factory('NodeTrees', function($resource) {
  return $resource('api/graphs/:graphId/types/:typeId/nodes/:id/trees/:attributeId');
})

.factory('NodePaths', function($resource) {
  return $resource('api/graphs/:graphId/types/:typeId/nodes/:id/paths/:attributeId');
})

.factory('PropertyList', function($resource) {
  return $resource('api/properties');
});

})(window.angular);
