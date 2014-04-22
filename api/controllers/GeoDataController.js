/**
 * GeoDataController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var topojson = require("topojson");

module.exports = {
    
  albanyParcels : function(req,res){
  	var deg = 0.001;
  	if(typeof req.param('degrees') != 'undefined')
  		deg = +req.param('degrees');

  	sql = 'SELECT sbl,ST_AsGeoJSON(geom) as geo FROM nys_parcel_geo JOIN newyork2012 '
  		  + 'ON ST_DWithin(newyork2012.the_geom, nys_parcel_geo.geom, '+deg+') '
		  + 'where newyork2012.f_system_v = 1 and St_Area(geom)/POWER(0.3048,2) > .0001 limit 25000';
    console.time('query');
    GeoData.query(sql,{},function(err,data){
      console.timeEnd('query');
      console.time('process');
  		var geoData = {type:'FeatureCollection',features:[]};
  		data.rows.forEach(function(parcel,index){
  			var feature = {type:'Feature',properties:{}};
  			feature.geometry = JSON.parse(parcel.geo);
  			feature.id = parcel.sbl;
  			geoData.features.push(feature);
  		}); 
      console.timeEnd('process');
      // console.time('topify');
      // var topology = topojson.topology({features: geoData},{"property-transform":preserveProperties});
      // console.timeEnd('topify');
      console.time('send');
  		res.send(geoData);
      console.timeEnd('send');
  	});
  },
  nyCounties : function(req,res){
  	var sql = "SELECT ST_AsGeoJSON(ST_Transform(geom,4326)) as geo FROM counties where name in ('Albany','Saratoga')";
  	GeoData.query(sql,{},function(err,data){
  		var geoData = {type:'FeatureCollection',features:[]};
  		data.rows.forEach(function(parcel,index){
  			var feature = {type:'Feature',properties:{}};
  			feature.geometry = JSON.parse(parcel.geo);
        feature.id = index;
  			geoData.features.push(feature);
  		});
  		res.send(geoData);
  	});
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to GeoDataController)
   */
  _config: {}

  
};

var preserveProperties = function(properties, key, value) {
  properties[key] = value;
  return true;
};