(function(ngMongo) {
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
                // also see how we are adding update method to our resources
                result[resource.name] = $resource(resource.url, {}, {update: {method: 'PUT'}});
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