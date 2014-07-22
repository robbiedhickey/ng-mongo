(function(ngMongo) {

    //// revealing module pattern
    //// factories return an object with a $get method, which maps to our
    //// factory method. It is the constructor for the service singleton
    //ngMongo.factory("Mongo", function ($resource) {
    //    return {
    //        // RESOURCE GOTCHA: when you use the resource provider,
    //        // it takes the json response and runs it through angular.copy, 
    //        // which only works with objects and arrays. The side effect is that
    //        // you cannot return a list of strings or numbers from your API, instead
    //        // you will get a list of objects whose members are characters, ex.
    //        // {"0":"l", "1":"o", "2":"c", "3":"a", "4":"l"}
    //        // if you need to work with primitive arrays, use $http
    //        database: $resource('/mongo-api/dbs'),
    //        collection: $resource('/mongo-api/:database/'),
    //        document: $resource('/mongo-api/:database/:collection')
    //    };
    //});

    // constructor pattern
    ngMongo.service("Mongo", function ($resource) {
        this.database = $resource('/mongo-api/dbs');
        this.collection = $resource('/mongo-api/:database/');
        this.document = $resource('/mongo-api/:database/:collection');
    });
}(angular.module('ngMongo')));