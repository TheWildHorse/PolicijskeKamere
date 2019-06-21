import react from 'react';
import {
    Alert
} from 'react-native';
import {
    orderByDistance,
    findNearest,
    getDistance
} from 'geolib';
import BackgroundTimer from 'react-native-background-timer';

let _cameras = null;
let _navigatorWatch = null;
class GeoService {
    constructor(props) {        
        _cameras = props.cameras;
    };

    getCurrentPosition = async () => {
        return new Promise((resolve) => {                
            navigator.geolocation.getCurrentPosition(
                position => {
                    long = position.coords.longitude;
                    lat = position.coords.latitude;
                    let userLocation = {
                        latitude: lat,
                        longitude: long,
                    };
                    resolve(userLocation);
                },
                error => console.log(error.message),
                {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
            );
        });
    };

    startWatching = async (nearestCameras) => {
        return new Promise((resolve) => {                
            let options = {
                'timeout': 10000,
                'maximumAge': 0,
                'enableHighAccuracy': true,
                'distanceFilter': 10,
            };
           _navigatorWatch = navigator.geolocation.watchPosition(
                position => {
                    lng = position.coords.longitude;
                    lat = position.coords.latitude;
                    userLocation = {
                        latitude: lat, //"46.29922"
                        longitude: lng //"16.2"
                    }
                    this.findNearestCamera(userLocation, nearestCameras);
                },
                error => console.log(error.message),
                options
            );
        });
    };

    findNearestCamera = (userLocation,nearestCameras) => {            
        let nearest = findNearest(userLocation, nearestCameras);
        let cameraDistance = getDistance(userLocation, nearest);        
        if(cameraDistance < 500){
            let address = nearest.address;
            if(address){
                Alert.alert("Kamera za 500 metara! \nAdresa: " + nearest.address);
            } else {
                Alert.alert("Kamera za 500 metara!");
            }
            console.log("kamera");
        }        
    };

    sortCameras = async () => {
       navigator.geolocation.clearWatch(_navigatorWatch);
        let userLocation = await this.getCurrentPosition();        
        let orderedCamers = orderByDistance(userLocation, _cameras);
        let nearestCameras = orderedCamers;
        if(orderedCamers.length > 50){
            nearestCameras = orderedCamers.slice(0, 50);
        }
        this.startWatching(nearestCameras);
    };

    initializeTask = () => {
        BackgroundTimer.runBackgroundTimer(() => {     
            this.sortCameras();    
        },15 * 60);        
    };

    stopTask = () => {
        BackgroundTimer.stopBackgroundTimer();
    };
}

export default GeoService;