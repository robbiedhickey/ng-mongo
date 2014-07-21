(function (ngMongo) {

    ngMongo.factory("Mongo", function($resource) {
        return {
            // RESOURCE GOTCHA: when you use the resource provider,
            // it takes the json response and runs it through angular.copy, 
            // which only works with objects and arrays. The side effect is that
            // you cannot return a list of strings or numbers from your API, instead
            // you will get a list of objects whose members are characters, ex.
            // {"0":"l", "1":"o", "2":"c", "3":"a", "4":"l"}
            // if you need to work with primitive arrays, use $http
            database: $resource('/mongo-api/dbs')
        };
    });

    ngMongo.directive("deleteButton", function() {
        return {
            //default is attribute
            restrict: "E", 
            //replace the html content
            replace: true, 
            //NOTE: this is not the scope itself! It is a definition object that tells the injected scope what to do.
            scope: {
                // tell angular to peel text attribute value and set a variable named 'text' on the scope
                text: "@", 
                // & tells angular to delegate whatefver the setting is to the parent scope
                action: "&", 
            },  
            // notice we are setting the ng-click to action, which is a delegate that is inherited from the parent scope.
            // this allows us to decouple our directive from our controller. 
            template: "<button class='btn btn-danger' ng-click='action()'><span class='glyphicon glyphicon-remove'></span> {{text}}</button>"
        }
    });


    ngMongo.controller("ListCtrl", function ($scope, Mongo) {

        // the result of a resource operation is a promise as well,
        // but this promise returns our data wrapped in a Resource prototype.
        // each resource has the associated $get/$query/$save/etc
        // This is very handy when working with lists/details. 
        $scope.items = Mongo.database.query({}, isArray = true);

        $scope.addDb = function() {
            var dbName = $scope.newDbName;
            if (dbName) {
                var newDb = new Mongo.database({ name: dbName });
                newDb.$save();
                $scope.items.push(newDb);
            }
        };

        $scope.removeDb = function(db) {
            if (confirm("Delete this database?")) {
                db.$delete({name: db.name});
                $scope.items.splice($scope.items.indexOf(db), 1);
            }
        };
    });

}(angular.module("ngMongo",['ngResource'])));
