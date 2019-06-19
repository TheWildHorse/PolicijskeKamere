import React from 'react';
import {
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import {Container} from 'native-base';
import {
    Text,
} from "react-native-elements";

const InitialComponent = props => {
    return (
        <Container style={styles.container}>
            {
                props.spinner &&
                <ActivityIndicator size="large" color={styles.indicator.color}/>
            }
            <Text h3>Učitavanje</Text>
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
    }
});
export default InitialComponent