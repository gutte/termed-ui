(function (angular) { 'use strict';

angular.module('termed.translations', ['pascalprecht.translate', 'ngSanitize'])

.config(function($translateProvider) {
  $translateProvider

  .preferredLanguage('fi')

  .useSanitizeValueStrategy('escapeParameters')

  .translations('fi', {
    termed: 'Termieditori',
    allNodes: 'kaikki tietueet',
    nodes: 'tietueet',
    node: 'tietue',
    type: 'luokka',
    types: 'luokat',
    textAttribute: 'tekstiattribuutti',
    textAttributes: 'tekstiattribuutit',
    referenceAttribute: 'viiteattribuutti',
    referenceAttributes: 'viiteattribuutit',
    code: 'koodi',
    range: 'arvoalue',
    label: 'nimike',
    source: 'lähde',
    graph: 'aineisto',
    graphs: 'aineistot',
    hierarchy: 'hierarkia',
    list: 'lista',
    tree: 'puu',
    example: 'esimerkki',
    concept: 'käsite',
    description: 'kuvaus',
    searchHelp: 'hakuohje',
    referrers: 'viittaukset',
    parentHierarchies: 'hierarkiat',
    searchNodes: 'etsi tietueita',
    searchGraphs: 'etsi aineistoja',
    addNewGraph: 'lisää uusi aineisto',
    addNewType: 'lisää uusi luokka',
    addNewProperty: 'lisää uusi kenttä',
    addNewTextAttribute: 'lisää uusi tekstiattribuutti',
    addNewReferenceAttribute: 'lisää uusi viiteattribuutti',
    additionalProperties: 'lisäominaisuudet',
    showMoreResults: 'näytä lisää hakutuloksia',
    searchValue: 'etsi ja valitse',
    addNewValue: 'lisää uusi',
    add: 'lisää',
    addNew: 'lisää uusi',
    save: 'tallenna',
    remove: 'poista',
    edit: 'muokkaa',
    download: 'lataa',
    updated: 'muokkattu',
    added: 'lisätty',
    unnamed: 'Nimetön',
    warnSlowAllNodesView: 'Huom. näkymän avautuminen voi aineiston koosta riippuen kestää useita minuutteja.',
    warnIdChange: 'Varoitus: ID:n muuttaminen tuhoaa siihen viittaavat tiedot (esim. luokan ilmentymät tai attribuuttien arvot). On suositeltavaa ettei tunnuksia muuteta aineiston tietomallin määrittelyvaiheen jälkeen.'
  })

  .translations('en', {
    termed: 'Termed',
    allNodes: 'all resources',
    nodes: 'resources',
    node: 'resource',
    type: 'type',
    types: 'types',
    textAttribute: 'text attribute',
    textAttributes: 'text attributes',
    referenceAttribute: 'reference attribute',
    referenceAttributes: 'reference attributes',
    code: 'code',
    range: 'range',
    label: 'label',
    source: 'source',
    graph: 'data set',
    graphs: 'data sets',
    hierarchy: 'hierarchy',
    list: 'list',
    tree: 'tree',
    example: 'example',
    concept: 'concept',
    description: 'description',
    searchHelp: 'search help',
    referrers: 'referrers',
    parentHierarchies: 'parent hierarchies',
    searchNodes: 'search resources',
    searchGraphs: 'search data sets',
    addNewGraph: 'add new data set',
    addNewType: 'add new type',
    addNewProperty: 'add new property',
    addNewTextAttribute: 'add new text attribute',
    addNewReferenceAttribute: 'add new reference attribute',
    additionalProperties: 'additional properties',
    showMoreResults: 'show more results',
    searchValue: 'search and select',
    addNewValue: 'add new',
    add: 'add',
    addNew: 'add new',
    save: 'save',
    remove: 'remove',
    edit: 'edit',
    download: 'download',
    updated: 'updated',
    added: 'added',
    unnamed: 'Unnamed',
    warnSlowAllNodesView: 'Note that opening all nodes view might take several minutes.',
    warnIdChange: 'Warning: Changing ID deletes all data referring to the ID (e.g. instances of a type or values of an attribute). It\'s recommended that ID values are not changed after initial graph definition.'
  });

});

})(window.angular);
