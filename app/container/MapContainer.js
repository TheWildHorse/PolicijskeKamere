import React, {Component} from 'react';
import MapComponent from '../component/MapComponent';
import {Dimensions} from "react-native";

class MapContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            markers: props.navigation.getParam('data', false),
            spinner: true,
            latitude: 0,
            longitude: 0,
            initialRegion: {
                latitude: 46.3057,
                longitude: 16.3366,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }

    getCurrentPosition = async () => {
        let lat = 0,
            long = 0;
        return new Promise((resolve) => {
            const window = Dimensions.get('window');
            const { width, height }  = window;
            let LATITUDE_DELTA = 0.0922;
            let LONGITUDE_DELTA = LATITUDE_DELTA + (width / height);
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

    async componentWillMount(): void {
        let initialRegion = await this.getCurrentPosition();
        this.setState({
            initialRegion: initialRegion,
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude,
        });
    }

    render() {
        return <MapComponent
            spinner={this.state.spinner}
            initialRegion={this.state.initialRegion}
            markers={this.state.markers}
            latitude={this.state.latitude}
            longitude={this.state.longitude}
        />;
    }
}

export default MapContainer