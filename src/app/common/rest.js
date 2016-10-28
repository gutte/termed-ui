(function (angular) { 'use strict';

angular.module('termed.rest', ['ngResource'])

.factory('SchemeList', function($resource) {
  return $resource('api/schemes');
})

.factory('Scheme', function($resource) {
  return $resource('api/schemes/:schemeId');
})

.factory('ClassList', function($resource) {
  return $resource('api/schemes/:schemeId/classes');
})

.factory('Class', function($resource) {
  return $resource('api/schemes/:schemeId/classes/:classId');
})

.factory('TextAttributeList', function($resource) {
  return $resource('api/schemes/:schemeId/classes/:classId/textAttributes');
})

.factory('ReferenceAttributeList', function($resource) {
  return $resource('api/schemes/:schemeId/classes/:classId/referenceAttributes');
})

.factory('ResourceList', function($resource) {
  return $resource('api/resources');
})

.factory('SchemeResourceList', function($resource) {
  return $resource('api/schemes/:schemeId/resources');
})

.factory('TypeResourceList', function($resource) {
  return $resource('api/schemes/:schemeId/classes/:typeId/resources');
})

.factory('Resource', function($resource) {
  return $resource('api/schemes/:schemeId/classes/:typeId/resources/:id', null, { 'update': { method : 'PUT' }});
})

.factory('ResourceReferenceList', function($resource) {
  return $resource('api/schemes/:schemeId/classes/:typeId/resources/:id/references/:attributeId');
})

.factory('ResourceReferrerList', function($resource) {
  return $resource('api/schemes/:schemeId/classes/:typeId/resources/:id/referrers/:attributeId');
})

.factory('ResourceTrees', function($resource) {
  return $resource('api/schemes/:schemeId/classes/:typeId/resources/:id/trees/:attributeId');
})

.factory('ResourcePaths', function($resource) {
  return $resource('api/schemes/:schemeId/classes/:typeId/resources/:id/paths/:attributeId');
})

.factory('PropertyList', function($resource) {
  return $resource('api/properties');
});

})(window.angular);
