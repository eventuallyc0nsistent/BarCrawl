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

        console.log(longitude, latitude);
        
        require(['esri/urlUtils','esri/map','esri/tasks/RouteTask', 'dojo/domReady!', 'dijit/layout/ContentPane'], function(
              urlUtils,Map
          ){
          var map = new Map("map",{
              basemap:"streets",
              center:[longitude, latitude],
              zoom: 18
          });
        });

        require(["esri/tasks/RouteTask"], function(RouteTask) {
          
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