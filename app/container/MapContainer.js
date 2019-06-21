import React, {Component} from 'react';
import MapComponent from '../component/MapComponent';
import {
    Dimensions, 
    BackHandler,    
    ToastAndroid
} from "react-native";
import GeoService from '../service/GeoService';

const window = Dimensions.get('window');
const { width, height }  = window;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.28; //0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let _geoService = null;

class MapContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            markers: props.navigation.getParam('data', false),
            exit: 0,            
            statusBarHeight: 0,
            latitude: 0,
            longitude: 0,
            initialRegion: {
                latitude: 46.3057,
                longitude: 16.3366,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
        };
        _geoService = new GeoService({
            cameras: this.state.markers,
        });
    };

    getCurrentPosition = async () => {
        let lat = 0,
            long = 0;
        return new Promise((resolve) => {                
            navigator.geolocation.getCurrentPosition(
                position => {
                    long = position.coords.longitude;
                    lat = position.coords.latitude;
                    let initialRegion = {
                        latitude: lat,
                        longitude: long,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    };
                    resolve(initialRegion);
                },
                error => console.log(error.message),
                {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
            );
        });
    };

    handleBackPress = () => {
        if(this.state.exit == 1){
            _geolibService.stopTask();
            BackHandler.exitApp();
        } else {
            ToastAndroid.show("Pritisnite ponovo za izlaz", ToastAndroid.SHORT);
            this.setState({
                exit: 1
            });
            setTimeout( () => {
                this.setState({
                    exit: 0
                }); 
            }, 3 * 1000); // wait for 3 seconds
        }
        return true;
      }

    async componentWillMount() {
        let initialRegion = await this.getCurrentPosition();
        this.setState({
            initialRegion: initialRegion,
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude,            
        });
        setTimeout(()=>this.setState({statusBarHeight: 1}), 1000);        
        _geoService.initializeTask();
    };

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    };

    componentWillUnmount() {
        this.backHandler.remove()
    };

    render() {
        return <MapComponent            
            region={this.state.initialRegion}
            markers={this.state.markers}
            latitude={this.state.latitude}
            longitude={this.state.longitude}
            statusBarHeight={this.state.statusBarHeight}
        />;
    }
}

export default MapContainer