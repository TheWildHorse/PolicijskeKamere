import React from 'react';
import {
    Container,
    Button,
    Icon,
} from 'native-base';
import {
    StyleSheet,
} from 'react-native';
import MapView from 'react-native-maps';

let _map = MapView;

const animateToUserLocation = (props) => {
    
    if (props.latitude) {
        let center = {
            latitude: props.latitude,
            longitude: props.longitude,
        };        
        _map.animateCamera({
            heading: 0,
            center: center,
            pitch: 0
        });
    }
};

const generateMarkers = (props) => {    
    if (props.markers.length > 0) {
        console.log("broj markera: " + props.markers.length);
        let content = props.markers.map((data, i) => {
            let lat = parseFloat(data.lat);
            let lng = parseFloat(data.lng);
            let speed = data.speed;
            let city = data.city;
            let address = data.address;
            return (
                    <MapView.Marker
                        key={i}
                        coordinate={{
                            latitude: lat,
                            longitude: lng
                        }}
                        title={city + "\n" + address}
                        description={"Ograničenje: " + speed}
                    />
            );
        });
        return (
            <MapView
                ref={component => (_map = component)}
                style={styles(props).map}
                initialRegion={props.region}
                showsUserLocation={true}
                followsUserLocation={true}
                showsMyLocationButton={true}
                onUserLocationChange={coordinates => animateToUserLocation(coordinates)}
                onMapReady={animateToUserLocation(props)}
            >
            {content}
            </MapView>
        );
    }
};

const MapComponent = props => {
    return (
        <Container style={styles(props).container}>
            {generateMarkers(props)}            
        </Container>
    )
};

const styles = (props) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#56a1ff"
    },
    indicator: {
        color: "#ffffff",
    },
    map: {
        marginBottom: 100,
        marginTop: props.statusBarHeight, // for displaying user location button
        ...StyleSheet.absoluteFillObject,
    },
});
export default MapComponent