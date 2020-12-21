import React,{Component} from 'react';
import axios from 'axios';

import {
    GoogleMap,
    Marker,
    InfoWindow,
    LoadScript,
}from "@react-google-maps/api";

import usePlacesAutocomplete,{
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
  } from "@reach/combobox";
  import "@reach/combobox/styles.css";


import compass from "../../img/compass.svg";
const mapContainerStyle = {
    height: "100vh",
    width: "100vw",
}

const center = {
    lat:37.774929,
    lng:-122.419418,
}

const options = {
    disableDefaultUI:true,
    zoomControl:true,
}

const libraries = ["places"];
const url= "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
const PlacesAutocomplete  = props =>{
    const{
        ready,
        value,
        suggestions:{status,data},
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions:{
            location:{ lat:()=>37.774929,lng:()=>-122.419418},
            radius:200*1000,
        },
    });
    return (
        <div className='search'>
            <Combobox onSelect={ async (address)=>{
                setValue(address,false);
                clearSuggestions();

                try{
                    const results = await getGeocode({address});
                    const {lat, lng} = await getLatLng(results[0]);
                    props.panTo({lat,lng});
                }catch(err){
                    console.log(err);
                }
                
                }}>
                <ComboboxInput 
                    value={value} 
                    onChange={(e)=>{setValue(e.target.value);}} 
                    disabled={!ready}
                    placeholder="Enter an address"
                    />
                    <ComboboxPopover>
                        <ComboboxList>
                        {status==="OK" && data.map(({id,description})=>(
                            <ComboboxOption key={id} value={description}/>
                        ))}
                       </ComboboxList>
                    </ComboboxPopover>
            </Combobox>
        </div>
        
    )
}


const Locate  = props =>{
   return <button className="locate" onClick={()=>{
       navigator.geolocation.getCurrentPosition((
            position)=>{
                props.panTo({
                    lat: position.coords.latitude,
                    lng:position.coords.longitude
                });
            }
            ,()=>null
        );
   }}>
            <img src={compass} alt="compass - locate me" style={{width:"40px", height:"40px"}}></img>
          </button>
}
class RideMap extends Component{
    
    constructor(props){
        super(props);
        this.onMapLoad = this.onMapLoad.bind(this);
        this.panTo = this.panTo.bind(this);
        this.state = {
                        selected:null,
                        map:{},
                        rides:[],
                        currlat:null,
                        currlong:null,
                        currSelected:false,
                    };
    }

    componentDidMount(){
        axios.get('/api/rides')
            .then(response =>{this.setState({rides: response.data});
            })
            .catch((error)=> console.log(error));
    }

    onMapLoad(map){
        this.setState({
            map:map
        })
    }

  

   panTo({lat,lng}){
        this.state.map.panTo({lat,lng});
        this.state.map.setZoom(15);
        this.setState({currlat:lat,currlong:lng});
   }
    render(){
        
        return(
            <div>
                <LoadScript 
                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_KEY}
                    libraries={libraries}
                >
                    <PlacesAutocomplete panTo={this.panTo}/>
                    <Locate panTo={this.panTo}/>

                    <h2>Rides Locations</h2>
                    <GoogleMap mapContainerStyle={mapContainerStyle} 
                        zoom={8}
                        center={center}
                        options={options}
                        onLoad={this.onMapLoad}
                    >
                        {this.state.rides.map(currRide => 
                            <Marker key={currRide.id} 
                                    position={{lat:currRide.lat,lng:currRide.lng}}
                                    onClick={()=>this.setState({selected:currRide})}
                                    />)}
                        {this.state.currlat?
                            <Marker key={1} 
                                   position={{lat:this.state.currlat,lng:this.state.currlong}}
                                   icon={{url:url}}
                                   onClick={()=>this.setState({currSelected:true})}
                                    />:""}

                        {this.state.currSelected?(
                        <InfoWindow 
                            position={{lat:this.state.currlat,lng:this.state.currlong}} 
                            onCloseClick={()=>this.setState({currSelected:false})}
                            >
                                <h4>You are here!</h4>
                        </InfoWindow>):null}

                        
                        {this.state.selected? 
                        (<InfoWindow 
                            position={{lat:this.state.selected.lat,lng:this.state.selected.lng}} 
                            onCloseClick={()=>this.setState({selected:null})}>
                            <div>
                                <h4>Seats:{this.state.selected.seats}</h4>
                                <h3>{this.state.selected.group_Name}</h3>
                                <h4>Where:{this.state.selected.location}</h4>
                                <h4>Pickup:</h4>
                                <h5>{this.state.selected.pickup}</h5>
                                <h4>When:</h4>
                                <h5>{this.state.selected.date.substring(0,10) + " "+ this.state.selected.time}</h5>
                                
                            </div>
                        </InfoWindow>):null}
                    </GoogleMap>
                </LoadScript>
            </div>
        )
    }
}




export default RideMap;