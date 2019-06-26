import React from "react";
import {
    Overlay,
    Text,
    Slider
} from 'react-native-elements';
import {
    Container,
} from 'native-base';
import {
    StyleSheet,
    Picker
} from 'react-native';

const OptionsComponent = props => {
    return (
        <Overlay
            isVisible
            onBackdropPress={() => props.props.handleOptions()}
        >
            <Container style={styles.container}>
                <Text h4>Glasnoća zvuka</Text>
                <Slider
                    value={props.props.volume}
                    onValueChange={value => props.props.handleVolume(value)}
                    minimumValue={0}
                    maximumValue={100}
                />
                <Text h4>Obavijest</Text>
                <Picker
                    note
                    mode="dropdown"
                    selectedValue={props.props.selectedNotification}
                    onValueChange={(notification) => props.props.changeNotification(notification)}
                >
                    <Picker.Item label="Zadano" value="notification"/>
                    <Picker.Item label="Knife" value="notification1"/>
                    <Picker.Item label="Dew" value="notification2"/>
                </Picker>
            </Container>
        </Overlay>
    )
};

const styles = () => StyleSheet.create({
    container: {
        flex: 1,
        justifyItems: 'center',
        alignText: 'center',
        padding: 5,
    },
    text: {
        textAlign: 'center'
    },
});
export default OptionsComponent