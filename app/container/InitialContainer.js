import React, {Component} from 'react';
import InitialComponent from '../component/InitialComponent';
import {openDatabase} from 'react-native-sqlite-storage';
import {
    Alert,
    PermissionsAndroid
} from 'react-native';

const errorCB = (err) => {
    console.log("SQL Error: " + err);
};

const openCB = () => {
    console.log("Database OPENED");
};

const _database = openDatabase({name: 'cameras.db', createFromLocation: '~www/cameras.db',}, openCB, errorCB(this));


class InitialContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spinner: true,
        };
    }

    requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Policijske Kamere',
                    'message': 'Aplikaciji je potreban pristup vašoj lokaciji'
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("We can use the location");
            } else {
                Alert.alert("Aplikacija ne može pristupiti vašoj lokaciji, moći ćete samo vidjeti lokacije kamera.");
            }
        } catch (err) {
            console.warn(err)
        }
    };

    getData = async () => {
        let promise = new Promise((resolve, reject) => {
            _database.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM cameras;',
                    [],
                    (tx, results) => {
                        let len = results.rows.length;
                        let cameras = [];
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            let lat = `${row.lat}`;
                            let lng = `${row.lng}`;
                            let speed = `${row.speed}`;
                            let city = `${row.city}`;
                            let address = `${row.address}`;
                            let camera = {
                                latitude: lat,
                                longitude: lng,
                                speed: speed,
                                city: city,
                                address: address,
                            };
                            cameras.push(camera);
                        }
                        resolve(cameras);
                    }
                );
            });
        });
        promise.then((data) => {
            this.setState({
                spinner: false,
            });
            this.props.navigation.navigate('Map', {
                data: data
            })
        })
    };

    async componentWillMount(): void {
        await this.requestLocationPermission();
        await this.getData();
    }

    render() {
        return <InitialComponent
            spinner={this.state.spinner}
        />;
    }
}

export default InitialContainer