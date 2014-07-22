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

    ngMongo.factory("Mongo", function($resource) {
        return {
            // RESOURCE GOTCHA: when you use the resource provider,
            // it takes the json response and runs it through angular.copy, 
            // which only works with objects and arrays. The side effect is that
            // you cannot return a list of strings or numbers from your API, instead
            // you will get a list of objects whose members are characters, ex.
            // {"0":"l", "1":"o", "2":"c", "3":"a", "4":"l"}
            // if you need to work with primitive arrays, use $http
            database: $resource('/mongo-api/dbs'),
            collection: $resource('/mongo-api/:database/'),
            document: $resource('/mongo-api/:database/:collection')
        };
    });

    ngMongo.controller("ListCtrl", function ($scope, $routeParams, Mongo) {

        _.extend($scope, $routeParams);
        var context = "database";
        if ($routeParams.database) { context = "collection"; }

        // the result of a resource operation is a promise as well,
        // but this promise returns our data wrapped in a Resource prototype.
        // each resource has the associated $get/$query/$save/etc
        // This is very handy when working with lists/details. 
        $scope.items = Mongo[context].query($routeParams, isArray = true);

        $scope.addItem = function() {
            var newItemName = $scope.newItemName;
            if (newItemName) {
                var newItem = new Mongo[context]({ name: newItemName });
                newItem.$save($routeParams);
                console.log(newItem);
                $scope.items.push(newItem);
            }
        };

        $scope.removeItem = function(item) {
            if (confirm("Delete this " + context + "? There is no undo...")) {
                var params = { name: item.name };
                if ($routeParams.database) params.database = $routeParams.database;
                item.$delete(params);
                $scope.items.splice($scope.items.indexOf(item), 1);
            }
        };
    });

    ngMongo.controller("DocumentCtrl", function($scope, $routeParams, Mongo) {
        _.extend($scope, $routeParams);
        $scope.documents = Mongo.document.query($routeParams);
    });

}(angular.module("ngMongo",['ngResource', 'ngRoute'])));
