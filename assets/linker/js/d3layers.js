(function() {
    var d3layers = {
        version: "0.1.0-alpha"
    	dependencies: "d3.v3.js,leaflet.js"
    };

    //Vector Layer constructor Function
    function _VectorLayer(data,func){
    	var self = this,
    		geoData = data,
    		type = 'geojson';

    	self.getData = function() {
    		return geoData;
    	}

    	self.getDrawFunc = function() {
    		return drawFunc;
    	}

    	self.getLayer = function() {
    		return layer;
    	}

    	self.setLayer = function(l) {
    		layer = l;
    	}
    }

    d3layers.VectorLayer = function(data, options) {//func, classes) {
		if (typeof data !== 'undefined') {
			return new VectorLayer(data, options);//func, classes);
		} else {
			throw new ObjectException("You must specify a geo or topojson file");
		}
	}
    this.d3layers = d3layers;
})()

