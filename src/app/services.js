(function(ngMongo) {
    // function declared on provider is not directly usable by controller, it handles configuration and creation of a factory function
    ngMongo.provider("Mongo", function () {
        //stage 1: configuration
        var connectionString = "";
        this.setConnection = function(conn) {
            connectionString = conn;
        }

        //stage 2: inection
        //created for your with factory and service, but we need to explicitly declare it when using provider
        // $get is used by the injector, so we must inject our deps here
        this.$get = function ($resource) {
            return {
                connection: connectionString, 
                database: $resource('/mongo-api/dbs'),
                collection: $resource('/mongo-api/:database/'),
                document: $resource('/mongo-api/:database/:collection') 
            }
        }
    });

    ngMongo.config(function(MongoProvider) {
        MongoProvider.setConnection("");
    });
    
    // hyper media, solving the URL problem of maintaining route and API urls
    ngMongo.provider("Media", function() {
        //config
        var resources = [];
        this.setResource = function(resourceName, url) {
            var resource = { name: resourceName, url: url };
            resources.push(resource);
        }

        //injected
        this.$get = function($resource) {
            var result = {};
            _.each(resources, function (resource) {
                //note this is the same thing we were doing in the mongo service, it is just not hard-coded anymore. 
                result[resource.name] = $resource(resource.url);
            });
            return result;
        };
    });

    ngMongo.config(function(MediaProvider) {
        if (!TekPub.MongoApiService) throw "Need to have mongo api set";
        for (var key in TekPub.MongoApiService) {
            MediaProvider.setResource(key, TekPub.MongoApiService[key]);
        }
    });
}(angular.module('ngMongo')));