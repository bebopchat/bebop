(function (angular) {
  
  'use strict';
  
  angular.module('bebop.search')
  
  .directive('searchBar', ['$timeout', '$location', 'searchService', 
    
    function ($timeout, $location, searchService) {
    
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'modules/search/views/searchbar.html',
      link: function (scope, element, attrs) {
        
        var $t;
        
        function doSearch() {
          searchService.search(scope.search, 'room').then(function($results) {
            scope.searching = false;
            if ($results) {
              scope.results = $results.hits; 
            }
          }).catch(function (error) {
            console.error(error);
            scope.searching = false;
          });
        }
        
        scope.$watch('search', function (value, lastValue) {
          
          // If there's a previous timeout, cancel it
          if ($t) $timeout.cancel($t);
          
          // Don't preceed unless there is a search, it's new, and it's at least 3 chars
          if (!value || value === lastValue || value.length <= 2) {
            scope.searching = false;
            return;
          }
          
          scope.searching = true;
          
          // Perform the search
          $t = $timeout(doSearch, 500);
          
        });
        
        // Public
        
        scope.results = [];
        scope.searching = false;
        
        scope.goTo = function (nodeId) {
          $timeout(function () {
            $location.path('/n/' + nodeId);  
          }, 300);
        };
      }
    }
  }]);
  
})(angular);