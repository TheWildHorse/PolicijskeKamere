import React from 'react';
import {
    Container,
    Button,
    Icon,
} from 'native-base';
import {
    StyleSheet,
    Dimensions,
} from 'react-native';
import MapView from 'react-native-maps';

let _map = '';

const animateToUserLocation = (props) => {
    if (props.latitude) {
        _map.animateCamera({
            heading: 0,
            center: {latitude: props.latitude, longitude: props.longitude},
            pitch: 0
        });
    }
};

const generateMarkers = (props) => {
    console.log("broj markera: " + props.markers.length);

    if (props.markers) {
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
                style={styles.map}
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
        <Container style={styles.container}>
            {generateMarkers(props)}
            <Button style={styles.button} rounded iconLeft transparent
                    onPress={animateToUserLocation(props)}
            >
                <Icon name='compass' />
            </Button>
        </Container>
    )
};

const styles = StyleSheet.create({
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
        marginTop: 100,
        marginBottom: 0,
        flex: 1,
        justifyContent: 'center',
        position: 'absolute',
        height: Dimensions.get('window').height - 200,
        width: Dimensions.get('window').width - 50,
    },
    button: {
        position: "relative",
        bottom: 0,
        right: 0,
    }
});
export default MapComponent