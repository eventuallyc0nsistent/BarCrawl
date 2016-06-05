/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
   
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      function success(pos) {
        var crd = pos.coords;


        var latitude = crd.latitude;
        var longitude = crd.longitude;
        
        require(["esri/urlUtils",
        "esri/config",
        "esri/map",
        "esri/graphic",            
        "esri/tasks/RouteTask",            
        "esri/tasks/RouteParameters",

        "esri/tasks/FeatureSet",            
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",          

        "esri/Color",
        "dojo/_base/array",
        "dojo/on",
        "dojo/dom",
        "dijit/registry",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dijit/form/HorizontalSlider",
        "dijit/form/HorizontalRuleLabels"], function(
              urlUtils, esriConfig, Map, Graphic, RouteTask, RouteParameters,
        FeatureSet, SimpleMarkerSymbol, SimpleLineSymbol,           
        Color, array, on, dom, registry
          ){
          var routeParams = new RouteParameters();
              routeParams.stops = new FeatureSet();
          var routeTask = new RouteTask("http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World");
          var stopSymbol = new SimpleMarkerSymbol().setStyle(SimpleMarkerSymbol.STYLE_CROSS).setSize(15);
            stopSymbol.outline.setWidth(3);
          var map = new Map("map",{
              basemap:"streets",

              center:[longitude, latitude],
              zoom: 16
          });
        });

      };

      function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      };

      // get current location and show on map
      navigator.geolocation.getCurrentPosition(success, error, options);
        
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