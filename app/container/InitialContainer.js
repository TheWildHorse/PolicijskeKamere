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
                let notification = null;
                let volume = 50;              
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS "notification" ('+
                        'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,'+
                        'volume FLOAT DEFAULT 0.5,' +
                        'name TEXT);',
                    [],
                    (tx, results) => {                                
                    }
                );

                tx.executeSql(
                    'SELECT * FROM notification;',
                    [],
                    (tx, results) => {
                        let len = results.rows.length;
                        if(len > 0){
                            let row = results.rows.item(--len);
                            notification = `${row.name}`;
                            volume = `${row.volume}` * 100;
                        }                        
                    }
                );

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
                        resolve({cameras, notification, volume});
                    }
                );                
            });
        });
        promise.then((data) => {
            this.setState({
                spinner: false,
            });
            this.props.navigation.navigate('Map', {
                data: data.cameras,
                notification: data.notification,
                volume: data.volume,
                database: _database
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