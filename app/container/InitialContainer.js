import React, {Component} from 'react';
import InitialComponent from '../component/InitialComponent';
import {openDatabase} from 'react-native-sqlite-storage';

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

    getData = async () => {
        let promise = new Promise((resolve, reject) => {
            _database.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM cameras;',
                    [],
                    (tx, results) => {
                        let len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            let lat = `${row.lat}`;
                            let lng = `${row.lng}`;
                            let speed = `${row.speed}`;
                            let address = `${row.address}`;
                            let camera = {
                                lat: lat,
                                lng: lng,
                                speed: speed,
                                address: address,
                            };
                            resolve(camera);
                        }
                    }
                );
            });
        });
        promise.then((data) => {
            this.setState({
                spinner: false,
            });
            this.props.navigation.navigate('MapContainer', {
                data: data
            })
        })
    };

    async componentWillMount(): void {
        await this.getData();
    }

    render() {
        return <InitialComponent
            spinner={this.state.spinner}
        />;
    }
}

export default InitialContainer