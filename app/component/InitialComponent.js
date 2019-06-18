import React from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator
} from 'react-native';

const InitialComponent = props => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="small" color="#00ff00" />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
});
export default InitialComponent