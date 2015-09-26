var React = require('react');

var mapboxgl = require("mapbox-gl");
var mapStyles = require('./mapStyles');



module.exports = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },


  propTypes:  {
    data: React.PropTypes.object
  },

  getInitialState() {
    return {
      years: [
        {id: 'before2000', label: 'Before 2000'},
        {id: '2000', label: '2000'},
        {id: '2001', label: '2001'},
        {id: '2002', label: '2002'},
        {id: '2003', label: '2003'},
        {id: '2004', label: '2004'},
        {id: '2005', label: '2005'},
        {id: '2006', label: '2006'},
        {id: '2007', label: '2007'},
        {id: '2008', label: '2008'},
        {id: '2009', label: '2009'},
        {id: '2010', label: '2010'},
        {id: '2011', label: '2011'},
        {id: '2012', label: '2012'},
        {id: '2013', label: '2013'},
        {id: 'after2013', label: 'After 2013'}
      ],
      currentYearIndex: 0,
      currentYearLabel: 'Before 2000'
    }
  },

  getDefaultProps() {
    return {
      hideUI: false,
      lockMouse: false,
      hideLogo: false
    }
  },



  componentDidMount() {
    var _this = this;
    mapboxgl.accessToken = 'pk.eyJ1IjoiY3Jvd2Rjb3ZlciIsImEiOiI3akYtNERRIn0.uwBAdtR6Zk60Bp3vTKj-kg';

    var map = new mapboxgl.Map({
      container: 'map',
      style: mapStyles.dark, //stylesheet location
      zoom: 7.5,
      center: [22.192, 1.766]
    });

    map.on('style.load', function() {

      if(_this.props.data){
        _this.initGeoJSON(map, _this.props.data);
      }

      map.addSource('logging', {
        'type': 'vector',
        'url': 'mapbox://crowdcover.logging_roads2',
        "minzoom": 6,
        "maxzoom": 12
      });
/*
      map.addLayer(require('./mapStyles/before2000'));
      map.addLayer(require('./mapStyles/2000'));
      map.addLayer(require('./mapStyles/2001'));
      map.addLayer(require('./mapStyles/2002'));
      map.addLayer(require('./mapStyles/2003'));
      map.addLayer(require('./mapStyles/2004'));
      map.addLayer(require('./mapStyles/2005'));
      map.addLayer(require('./mapStyles/2006'));
      map.addLayer(require('./mapStyles/2007'));
      map.addLayer(require('./mapStyles/2008'));
      map.addLayer(require('./mapStyles/2009'));
      map.addLayer(require('./mapStyles/2010'));
      map.addLayer(require('./mapStyles/2011'));
      map.addLayer(require('./mapStyles/2012'));
      map.addLayer(require('./mapStyles/2013'));
      map.addLayer(require('./mapStyles/after2013'));
      */

      _this.play();

    });

    if(!this.props.hideUI){
      map.addControl(new mapboxgl.Navigation({position: 'top-left'}));
    }


  this.map = map;

  },


  tick(){
    var _this = this;
    if(this.state.playing){
      if(this.state.currentYearIndex >= this.state.years.length){
        //reset to the beginning
        this.clearYearLayers();
        this.setState({currentYearIndex: 0});
      }
      var currYear = this.state.years[this.state.currentYearIndex]
      this.setYear(currYear.id, currYear.label);
      //tick again after 1.5 secs
      setTimeout(function(){ _this.tick() }, 1500);
    }
  },

  pause(){
    this.setState({playing: false});
  },

  play(){
    this.setState({playing: true});
    this.tick();
  },

  setYear(id, label){
    this.map.addLayer(mapStyles[id]);
    this.setState({currentYearLabel: label, currentYearIndex: this.state.currentYearIndex+1});
  },

  clearYearLayers(){
    var _this = this;
    this.state.years.forEach(function(year){
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

    return <div id="map" className="map" style={{width: '100%', height: '100%'}}>
      {logo}
      <h1 className="year">{this.state.currentYearLabel}</h1>
    </div>;
  }
});
