
var SOURCES = [
  {
    name: "congo-republic", 
    config:{
      'type': 'vector',
      "tiles": ['https://s3.amazonaws.com/maphubs-osm-roads/congo-republic/latest/tiles/{z}/{x}/{y}.pbf'],
      "minzoom": 1,
      "maxzoom": 12
    }
  },
  {
    name: "gabon", 
    config:{
      'type': 'vector',
      "tiles": ['https://s3.amazonaws.com/maphubs-osm-roads/gabon/latest/tiles/{z}/{x}/{y}.pbf'],
      "minzoom": 1,
      "maxzoom": 12
    }
  },
  {
    name: "congo-democratic-republic", 
    config:{
      'type': 'vector',
      "tiles": ['https://s3.amazonaws.com/maphubs-osm-roads/congo-democratic-republic/latest/tiles/{z}/{x}/{y}.pbf'],
      "minzoom": 1,
      "maxzoom": 12
    }
  },
  {
    name: "cameroon", 
    config:{
      'type': 'vector',
      "tiles": ['https://s3.amazonaws.com/maphubs-osm-roads/cameroon/latest/tiles/{z}/{x}/{y}.pbf'],
      "minzoom": 1,
      "maxzoom": 9
    }
  },
  {
    name: "equatorial-guinea", 
    config:{
      'type': 'vector',
      "tiles": ['https://s3.amazonaws.com/maphubs-osm-roads/equatorial-guinea/latest/tiles/{z}/{x}/{y}.pbf'],
      "minzoom": 1,
      "maxzoom": 12
    }
  }

];

var YEARS = {
  "before2000": {color: "#f8ffcc"},
  "2000": {color: "#f8ffcc"},
  "2001": {color: "#f9f3be"},
  "2002": {color: "#fae8b0"},
  "2003": {color: "#fadea3"},
  "2004": {color: "#fad396"},
  "2005": {color: "#f9c788"},
  "2006": {color: "#f8bc7b"},
  "2007": {color: "#f6b06e"},
  "2008": {color: "#f4a661"},
  "2009": {color: "#f19a54"},
  "2010": {color: "#ef8f47"},
  "2011": {color: "#eb8439"},
  "2012": {color: "#e8782b"},
  "2013": {color: "#e46c1c"},
  "2014": {color: "#cc5506"},
  "2015": {color: "#FF4444"},
  "2016": {color: "#FF0000"}
};


module.exports = {

  getSources(){
    return SOURCES;  
  },

  getUnknown(){
    var _this = this;
    var layers = [];
    SOURCES.forEach(function(source){
      layers.push(_this.getUnknownLayerBySource(source.name));
    });
    return layers;
  },

  getYear(year){
    var _this = this;
    var layers = [];
    SOURCES.forEach(function(source){
      layers.push( _this.getYearLayerBySource(source.name, year, YEARS[year].color));
    });
    return layers;
  },

  getYearLayerBySource(source, year, color){

    return {
      "id": year + '-' + source,
      "type": "line",
      "source": source,
      "source-layer": source,
      "minzoom": 0,
      "maxzoom": 12,
      "filter": [
          "==",
          "start_date",
          year
      ],
      "layout":{
        "visibility": "none",
        "line-cap": "butt",
        "line-join": "miter"
      },
      "paint": {
        "line-color": color,
        "line-opacity": 1,
        "line-width": {
          "base": 1,
          "stops": [[7, 1.5], [8, 2], [9, 3], [10, 3.5], [11, 4], [12, 6]]
        }
      }
    }
  },

  getUnknownLayerBySource(source){
    return {
      "id": "unknown-" + source,
      "type": "line",
      "source": source,
      "source-layer": source,
      "minzoom": 0,
      "maxzoom": 12,
      "filter": [
          "!in","start_date",
          "before 2000",
          "2000",
          "2001",
          "2002",
          "2003",
          "2004",
          "2005",
          "2006",
          "2007",
          "2008",
          "2009",
          "2010",
          "2011",
          "2012",
          "2013",
          "2014",
          "after 2013"
      ],
      "layout": {      
        "line-cap": "butt",
        "line-join": "miter"
      },
      "paint": {
        "line-color": "#999",    
        "line-opacity": 0.5,   
        "line-width": {
          "base": 1,
          "stops": [[7, 1.5], [8, 2], [9, 3], [10, 3.5], [11, 4], [12, 6]]
        }
      }
    }
  }
}