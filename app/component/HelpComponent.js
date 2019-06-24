import React from "react";
import {
    Overlay,
    Text,
} from 'react-native-elements';
import {
    Container
} from 'native-base';
import {
    StyleSheet,
} from 'react-native';

const HelpComponent = props => {
    return (
        <Overlay
        isVisible
        onBackdropPress={ () => props.props.closeHelp()}
        >
            <Container style={styles.container}>
                <Text h3>Policijske Kamere</Text>
                <Text style={styles.text}>
                    Aplikacija je namijenjena upozoravanju vozača na blizinu statične
                    kamere.
                    Aplikacija može raditi u pozadini, te zvučnim signalom obaviještava korisnika da je kamera
                    blizu, te prikazuje koliko je ograničenje na toj kameri.
                </Text>
            </Container>
        </Overlay>
    )
};

const styles = () => StyleSheet.create({
    container:{
        flex: 1,
        justifyItems: 'center',
        alignText: 'center',
        padding: 5,
    },
    text:{
        textAlign: 'center'
    }
});
export default HelpComponent