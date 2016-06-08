// get query variables from URL
function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0; i<vars.length; i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

var app = {

    // Application Constructor
    initialize: function() {
      this.bindEvents();

    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        // set current geo position on map
        navigator.geolocation.getCurrentPosition(success, error, options);
        
        var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };

        
        function error(err){
          console.log(err);
        }
        
        function success(pos) {
          
            var crd = pos.coords;
            var latitude = crd.latitude;
            var longitude = crd.longitude;

            require([
              "esri/urlUtils",
              "esri/config",
              "esri/map",
              "esri/graphic",
              "esri/geometry/Point",
              "esri/tasks/RouteTask",
              "esri/tasks/RouteParameters",

              "esri/IdentityManager",

              "esri/tasks/FeatureSet",
              "esri/symbols/SimpleMarkerSymbol",
              "esri/symbols/SimpleLineSymbol",

              "esri/Color",
              "dojo/_base/array",
              "dojo/on",
              "dojo/dom",
              "dijit/registry",
              "esri/arcgis/OAuthInfo",
              "esri/IdentityManager",
              "dijit/layout/BorderContainer",
              "dijit/layout/ContentPane",
              "dijit/form/HorizontalSlider",
              "dijit/form/HorizontalRuleLabels"], function(urlUtils, esriConfig, Map, Graphic, Point, RouteTask, 
                                                           RouteParameters, IdentityManager, FeatureSet, SimpleMarkerSymbol, SimpleLineSymbol,
                                                           Color, array, on, dom, registry, OAuthInfo, esriId){

                // the route API costs money. GO FREE CREDITS!
                esriConfig.defaults.io.corsEnabledServers.push("https://route.arcgis.com");

                var map = new Map("map", {
                                      basemap: "streets",
                                      center: [longitude, latitude],
                                      zoom: 16
                                  });
                var bars = [];
                var routeParams = new RouteParameters();
                routeParams.stops = new FeatureSet();
                var routeTask = new RouteTask("https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World");
                var stopSymbol = new SimpleMarkerSymbol().setStyle(SimpleMarkerSymbol.STYLE_CIRCLE).setSize(12).setColor(new Color([255, 153, 0, 1]));
                var routeSymbol = {
                    "Beer Route": new SimpleLineSymbol().setColor(new Color([0, 0, 255, 0.5])).setWidth(5)
                };
                routeParams.outSpatialReference = {"wkid": 102100};
                map.on('load', onMapLoad);

                function onMapLoad(){
                    var barCount = getQueryVariable('bars');
                    var url = 'http://localhost:3000/search?latitude=' + latitude + '&longitude=' + longitude +'&size=' + barCount;
                    jQuery.ajax({
                        url: url,
                        success: function (response) {

                            var point = new Point(longitude, latitude);
                            var symbol = stopSymbol;
                            var startGraphic = new Graphic(point, stopSymbol);
                            startGraphic.symbol = stopSymbol;
                            bars.push(startGraphic);

                            response.businesses.forEach(function (business) {

                                var lat = business.location.coordinate.latitude;
                                var lon = business.location.coordinate.longitude;
                                
                                var geom = new Point(lon, lat);
                                var graphic = new Graphic(geom, stopSymbol);
                                graphic.symbol = stopSymbol;
                                bars.push(graphic);

                            });

                            // add points on the map
                            for (var i = 0; i < bars.length; ++i) {
                                map.graphics.add(bars[i]);
                            };


                            // add routes to plot
                            for (var i = 1; i < bars.length; ++i) {
                                map.graphics.add(bars[i]);
                                routeParams.stops.features.push(
                                    map.graphics.add(bars[i])
                                );
                            }

                            // the routeTask API will show all routes when ready 
                            routeTask.solve(routeParams, showRoute, function (err) {
                                console.log(err);
                            });
                        },
                        async: false //we wait for a response
                    });
                }

                function showRoute(evt) {
                      array.forEach(evt.routeResults, function (routeResult, i) {
                          bars.push(
                              map.graphics.add(
                                  routeResult.route.setSymbol(routeSymbol['Beer Route'])
                              )
                          );
                      });
                }

            });

            function error(err) {
              console.warn('ERROR(' + err.code + '): ' + err.message);
            };
        }
      },
        
    // Update DOM on a Received Event
    receivedEvent: function(id) {
          var listeningElement = $(id + ' .listening');
          var receivedElement = $(id + ' .received');
          listeningElement.hide();
          receivedElement.show();
    }
  
};

app.initialize();
