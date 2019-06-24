import react from 'react';
import {
    ToastAndroid
} from 'react-native';
import {
    orderByDistance,
    findNearest,
    getDistance
} from 'geolib';
import BackgroundTimer from 'react-native-background-timer';
var Sound = require('react-native-sound');

/**
 * Every 2 minutes sort cameras, and get 50 closest,
 * if camera's inside 7km range, check every 100m meters, 
 * when user's in 500m range, notifiy him with sound and toast notification for every 100m.
 * Stop notifiying user if cameraDistance > oldCameraDistance.
 */


Sound.setCategory('Playback');
var notification = new Sound('notification.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    // loaded successfully
    console.log('duration in seconds: ' + notification.getDuration() + 'number of channels: ' + notification.getNumberOfChannels());    
  });

let _cameras = null;
let _navigatorWatch = null;
let oldCameraDistance = 0;

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
                'distanceFilter': 100,
            };
           _navigatorWatch = navigator.geolocation.watchPosition(
                position => {
                    lng = position.coords.longitude;
                    lat = position.coords.latitude;
                    userLocation = {
                        latitude: lat, //"46.29922" lat
                        longitude: lng //"16.2" lng
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
        if(cameraDistance < 500 && cameraDistance < oldCameraDistance){
            let speed = nearest.speed;
            if(speed !== 'null'){
                ToastAndroid.show("Kamera za " + cameraDistance + " metara!  \nOgraničenje: " + speed, ToastAndroid.SHORT);                                           
            } else {                
                ToastAndroid.show("Kamera za " + cameraDistance + " metara!", ToastAndroid.SHORT);
            }
            notification.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
            oldCameraDistance = cameraDistance;
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
        let cameraDistance = getDistance(userLocation, nearestCameras[0]);
        if(cameraDistance < 7000){
            this.startWatching(nearestCameras);
        }
    };

    initializeTask = () => {
        BackgroundTimer.runBackgroundTimer(() => {     
            this.sortCameras();    
        },2 * 60 * 1000);
    };

    stopTask = () => {
        BackgroundTimer.stopBackgroundTimer();
    };
}

export default GeoService;