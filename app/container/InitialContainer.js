import React, {Component} from 'react';
import InitialComponent from '../component/InitialComponent';
import {openDatabase} from 'react-native-sqlite-storage';

const errorCB = (err) => {
    console.log("SQL Error: " + err);
};

const openCB = () => {
    console.log("Database OPENED");
};

const _database = openDatabase({name: 'police_cam_radar.db'}, openCB, errorCB(this));


class InitialContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            serverURL: "",
            refresh: false,
            database: _database,
        };
    }

    async componentWillMount(): void {
    }


    render() {
        return <InitialComponent
        />;
    }
}

export default InitialContainer