var React = require('react');

var mapboxgl = require("mapbox-gl");
var mapStyles = require('./mapStyles');

var years = require('./years');
var scenes = require('./scenes');

module.exports = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },


  propTypes:  {
    data: React.PropTypes.object
  },

  getInitialState() {
    return {
      currentYearIndex: -1,
      currentSceneIndex: 0,
      useScenes: !this.props.disableScenes,
      firstLoad: true,
      waitForStyleChange: false,
      ignoreMoveCount: 0,
      styleWaitCallback(){}
    }
  },

  getDefaultProps() {
    return {
      hideUI: false,
      disableScroll: false,
      hideLogo: false,
      disableInteraction: false,
      disableScenes: false,
      showLngLat: false
    }
  },



  componentDidMount() {
    var _this = this;
    mapboxgl.accessToken = 'pk.eyJ1IjoiY3Jvd2Rjb3ZlciIsImEiOiI3akYtNERRIn0.uwBAdtR6Zk60Bp3vTKj-kg';

    var map = new mapboxgl.Map({
      container: 'map',
      //style: mapStyles.dark, //stylesheet location
      style: {
        "version": 8,
        "sources": {
            "simple-tiles": {
                "type": "raster",
                "url": "mapbox://crowdcover.d5b9ef75",
                "tileSize": 256
            }
        },
        "layers": [{
            "id": "simple-tiles",
            "type": "raster",
            "source": "simple-tiles",
            "minzoom": 0,
            "maxzoom": 22
        }]
    },
      zoom: 7.5,
      center: [22.0715, 2.6769],
      interactive: !this.props.disableInteraction
    });
    if(this.props.disableScroll){
      map.scrollZoom.disable();
    }

    map.on('moveend', function () {
      if(_this.state.ignoreMoveCount > 0){
        _this.setState({ignoreMoveCount: _this.state.ignoreMoveCount-1});
      }else{
          var useScenes = _this.state.useScenes;
          if(useScenes){
            useScenes = false;
          }
          _this.setState({lngLat: map.getCenter(), zoom: map.getZoom(), useScenes});
      }

    });


    map.on('style.load', function() {
      map.addSource('logging', {
        'type': 'vector',
        'url': 'mapbox://crowdcover.logging_roads2',
        "minzoom": 6,
        "maxzoom": 12
      });

      //roads with unknown start date
      map.addLayer(mapStyles.unknown);

      if(_this.state.firstLoad){

        _this.setState({firstLoad: false});

        _this.play();
      } else {
        _this.state.styleWaitCallback();
      }



    });

    if(!this.props.hideUI){
      map.addControl(new mapboxgl.Navigation({position: 'top-left'}));
    }


  this.map = map;

  },


  tick(){
    var _this = this;
    if(this.state.playing){
      //increase counters
      var currentYearIndex = this.state.currentYearIndex;
      var currentSceneIndex = this.state.currentSceneIndex;
      var waitForStyleChange = false;
      var scene = null, prevScene = null;

      if(currentYearIndex == (years.length)-1){
        //reset to the beginning
        currentYearIndex = 0;
        this.clearYearLayers();

        if(this.state.useScenes){
          //find previous scene
          if(currentSceneIndex == 0){
            prevScene = scenes[scenes.length -1];
          }else{
            prevScene = scenes[currentSceneIndex];
          }

          if(currentSceneIndex == scenes.length-1){
            currentSceneIndex=0;
          }else{
            currentSceneIndex++;
          }
          scene = scenes[currentSceneIndex];
          this.setState({ignoreMoveCount: 1});
          if(prevScene.style.name != scene.style.name){
            //we need to change the style and wait for it to complete
            this.map.setStyle(scene.style);
            waitForStyleChange = true;
          }else{
            //we can just fly to the next scene
            _this.map.flyTo({
              center: scene.center,
              zoom: scene.zoom,
              pitch: scene.pitch
            });

          }



        }

      }else{
        currentYearIndex++;
      }

      //now update the display
      var currYear = years[currentYearIndex];

      if(waitForStyleChange){

        var waitCallback = function(){
          setTimeout(function(){

            _this.map.flyTo({
              center: scene.center,
              zoom: scene.zoom,
              pitch: scene.pitch
            });
            _this.map.addLayer(mapStyles[currYear.id]);

            //tick again
            setTimeout(function(){ _this.tick() }, 1000);
          }, 2000);


        };
        this.setState({currentYearIndex, currentSceneIndex,
          waitForStyleChange, styleWaitCallback: waitCallback});
      }else{
        this.map.addLayer(mapStyles[currYear.id]);
        this.setState({currentYearIndex, currentSceneIndex, waitForStyleChange});
        //tick again
        setTimeout(function(){ _this.tick() }, 1000);
      }


    }
  },

  pause(){
    this.setState({playing: false});
  },

  play(){
    this.setState({playing: true});
    this.tick();
  },

  clearYearLayers(){
    var _this = this;
    years.forEach(function(year){
      _this.map.removeLayer(year.id);
    });
  },

  componentWillUnmount() {
    this.map.remove();
  },

  render() {
    var logo = '';
    if(!this.props.hideLogo){
      logo = (
        <b className="logo">LOGGING ROADS</b>
      );
    }

    var year = '';
    if(years[this.state.currentYearIndex]){
      year = (<h1 className="year">{years[this.state.currentYearIndex].label}</h1>);
    }

    var lngLat ='';
    if(this.props.showLngLat && this.state.lngLat){
      lngLat = (<p className="lng-lat">Lng: {this.state.lngLat.lng}, Lat:{this.state.lngLat.lat}, Zoom:{this.state.zoom} </p>)
    }

    return <div id="map" className="map" style={{width: '100%', height: '100%'}}>
      {logo}
      {year}
      {lngLat}
    </div>;
  }
});
