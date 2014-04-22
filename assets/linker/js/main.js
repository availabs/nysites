var map, boroughSearch = [],
    theaterSearch = [],
    museumSearch = [];

/* Basemap Layers */
var mapquestOSM = L.tileLayer("http://{s}.tiles.mapbox.com/v3/am3081.map-lkbhqenw/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["a", "b", "c"] 
});
var mapquestOAM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
});
var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
}), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
})]);



/* Overlay Layers */
// var parcels = L.geoJson(null, {
//   style: function (feature) {
//     return {
//       color: "black",
//       fill: false,
//       opacity: 1,
//       clickable: false
//     };
//   },
//   onEachFeature: function (feature, layer) {
//     boroughSearch.push({
//       name: layer.feature.properties.PIN_SBL,
//       source: "Albany County Parcels",
//       id: L.stamp(layer),
//       bounds: layer.getBounds()
//     });
//   }
// });


map = L.map("map", {
  zoom: 10,
  center: [42.6525, -73.7572],
  layers: [mapquestOSM]
});
L.control.scale({position:'bottomright'}).addTo(map);
var parcels,counties;
$.getJSON('/geodata/parcels')
  .done(function(data){
    $('.controls__slider_value.num_parcels').html(data.features.length);
    parcels = new L.GeoJSON.d3(data,{layerId:'parcels'});
    map.addLayer(parcels);
  });
$.getJSON('/geodata/counties')
  .done(function(data){
    console.log('counties',data);
    counties = new L.GeoJSON.d3(data,{layerId:'counties'});
    map.addLayer(counties);
  });

/* Larger screens get expanded layer control */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": mapquestOSM,
  "Aerial Imagery": mapquestOAM,
  "Imagery with Streets": mapquestHYB
};

var overlays = {};
//   "Albany Parcels": parcels
// };

var layerControl = L.control.layers(baseLayers, overlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Add overlay layers to map after defining layer control to preserver order */

var sidebar = L.control.sidebar("sidebar", {
  closeButton: true,
  position: "left"
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Onload */
// $(document).one("ajaxStop", function () {
//   console.log('hola')
 
//   $("#loading").hide();
// });
function sliderChange(w,x){ 
  
  var deg2miles = ((x.value*111120)/1609).toFixed(4);
  $('.controls__slider_value.travel_time').html(deg2miles);
};
function sliderStop(w,x){
  console.log('get data for'+x.value);
  $('.controls__slider_value.travel_time').html( ((x.value*111120)/1609).toFixed(4));
  $('.loading-indicator').show()
  $.getJSON('/geodata/parcels',{degrees:x.value})
  .done(function(data){
    $('.loading-indicator').hide()
    console.log('stop get data',data)
    $('.controls__slider_value.num_parcels').html(data.features.length);
    console.time('renderData');
    parcels.externalUpdate(data);
    console.timeEnd('renderData');
  })
   
}
$(function(){
    $( ".controls__slider" ).slider({max: 0.09,min: 0.0001,value: 0.001,step: 0.0001,slide: sliderChange,stop:sliderStop});
    var initmiles = ((0.001*111,120)/1609).toFixed(4);
    $('.controls__slider_value.travel_time').html( initmiles );
    $('#county_select').select2({data:[{id:'Albany',text:"Albany"},{id:"Saratoga",text:"Saratoga"}],value:'Albany',multiple: true,width:"80%"});
    sidebar.toggle();
  });
/* Typeahead search functionality */



/* Placeholder hack for IE */
if (navigator.appName == "Microsoft Internet Explorer") {
  $("input").each(function () {
    if ($(this).val() === "" && $(this).attr("placeholder") !== "") {
      $(this).val($(this).attr("placeholder"));
      $(this).focus(function () {
        if ($(this).val() === $(this).attr("placeholder")) $(this).val("");
      });
      $(this).blur(function () {
        if ($(this).val() === "") $(this).val($(this).attr("placeholder"));
      });
    }
  });
}
