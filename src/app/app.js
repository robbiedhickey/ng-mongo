(function (ngMongo) {
    ngMongo.config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/list.html",
                // notice that this allows us to decouple a template from a controller, 
                // and instead define it based on an application state!
                controller: "ListCtrl"
            })
            .when("/:database", {
                templateUrl: "views/list.html",
                controller: "ListCtrl"
            })
            .when("/:database/:collection", {
                templateUrl: "views/document.html",
                controller: "DocumentCtrl"
            })
            .otherwise({
                template: "<h1>Not Found</h1>"
            });
    });

    ngMongo.controller("ListCtrl", function ($scope, $routeParams, Media) {

        // parameter whitelist
        var params = {
            database: $routeParams.database,
            collection: $routeParams.collection
        };

        var context = "root";
        if (params.database) context = "database"; 
        if (params.collection) context = "collection"; 

        // the result of a resource operation is a promise as well,
        // but this promise returns our data wrapped in a Resource prototype.
        // each resource has the associated $get/$query/$save/etc
        // This is very handy when working with lists/details. 
        $scope.items = Media[context].query(params);

        $scope.addItem = function() {
            var newItemName = $scope.newItemName;
            if (newItemName) {
                var newItem = new Media[context]({ name: newItemName });
                newItem.$save(params);
                console.log(newItem);
                $scope.items.push(newItem);
            }
        };

        $scope.removeItem = function(item) {
            if (confirm("Delete this " + context + "? There is no undo...")) {
                var removeParams = { name: item.name };
                if (params.database) removeParams.database = params.database;
                item.$delete(removeParams);
                $scope.items.splice($scope.items.indexOf(item), 1);
            }
        };
    });

    ngMongo.controller("DocumentCtrl", function($scope, $routeParams, Media) {
        $scope.documents = Media.document.query($routeParams);
    });

}(angular.module("ngMongo",['ngResource', 'ngRoute'])));
