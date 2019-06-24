import React from 'react';
import {
    Container,
    Header,
    Body,
    Button,
    Icon,
    Title,
    View,
    Fab
} from 'native-base';
import {
    StyleSheet,
} from 'react-native';
import MapView from 'react-native-maps';
import HelpComponent from './HelpComponent';

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
            let lat = parseFloat(data.latitude);
            let lng = parseFloat(data.longitude);
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
        return content;
    }
};

const MapComponent = props => {
    return (
        <Container>
            <Header>
                <Body>
                    <Title>{props.title}</Title>
                </Body>          
            </Header>
            <View style={{ flex: 1 }}>
                
            </View>
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
                {generateMarkers(props)}
            </MapView>
            <Fab
                    active={props.fabStatus}
                    direction="up"
                    containerStyle={{ }}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={ () => props.handleFab() }
                >
                    <Icon name="settings" />                    
                    <Button
                    onPress={ () => props.handleHelp()}
                    >
                        <Icon name="help" />
                    </Button>
                    <Button>
                        <Icon name="musical-note" />
                    </Button>
                </Fab>
            {
                props.showHelp &&
                <HelpComponent
                    props={props}
                />
            }
        </Container>
    )
};

const styles = (props) => StyleSheet.create({
    map: {        
        marginTop: props.menuTop, // for displaying user location button
        ...StyleSheet.absoluteFillObject,
    },
});
export default MapComponent