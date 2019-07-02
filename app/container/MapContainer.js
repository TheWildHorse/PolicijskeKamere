import React, { Component } from "react";
import MapComponent from "../component/MapComponent";
import { Dimensions, BackHandler, ToastAndroid } from "react-native";
import GeoService from "../service/GeoService";
import Geolocation from '@react-native-community/geolocation';

const window = Dimensions.get("window");
const { width, height } = window;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.28; //0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var Sound = require("react-native-sound");
Sound.setCategory("Playback");

let _geoService = null;

class MapContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			markers: props.navigation.getParam("data", false),
			database: props.navigation.getParam("database", false),
			selectedNotification: props.navigation.getParam(
				"notification",
				false
			),
			exit: 0,
			title: "Učitavanje lokacije",
			menuTop: 49,
			latitude: 0,
			longitude: 0,
			volume: props.navigation.getParam("volume", 50),
			fabStatus: false,
			showHelp: false,
			showOptions: false,
			initialRegion: {
				latitude: 46.3057,
				longitude: 16.3366,
				latitudeDelta: LATITUDE_DELTA,
				longitudeDelta: LONGITUDE_DELTA
			}
		};
		_geoService = new GeoService({
			cameras: this.state.markers,
			selectedNotification: this.state.selectedNotification,
			volume: this.state.volume
		});
	}

	getCurrentPosition = async () => {
		let lat = 0,
			long = 0;
		return new Promise(resolve => {
			Geolocation.getCurrentPosition(
				position => {
					long = position.coords.longitude;
					lat = position.coords.latitude;
					let initialRegion = {
						latitude: lat,
						longitude: long,
						latitudeDelta: LATITUDE_DELTA,
						longitudeDelta: LONGITUDE_DELTA
					};
					resolve(initialRegion);
				},
				error => console.log(error.message),
				{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
			);
		});
	};

	handleBackPress = () => {
		if (this.state.exit === 1) {
			_geoService.stopTask();
			BackHandler.exitApp();
		} else {
			ToastAndroid.show("Pritisnite ponovo za izlaz", ToastAndroid.SHORT);
			this.setState({
				exit: 1
			});
			setTimeout(() => {
				this.setState({
					exit: 0
				});
			}, 3 * 1000); // wait for 3 seconds
		}
		return true;
	};

	handleFabPress = () => {
		this.setState({
			fabStatus: !this.state.fabStatus
		});
	};

	handleFabHelpPress = () => {
		this.setState({
			showHelp: !this.state.showHelp
		});
	};

	handleFabOptionsPress = () => {
		this.setState({
			showOptions: !this.state.showOptions
		});
	};

	handleVolume = volume => {
		this.setState({
			volume: volume
		});
		this.updateDatabase(this.state.selectedNotification, volume);
	};

	changeNotification = notifcation => {
		this.setState({
			selectedNotification: notifcation
		});
		this.updateDatabase(notifcation, this.state.volume);
		this.playNotification(notifcation);
	};

	updateDatabase = (notifcation, volume) => {
		let promise = new Promise((resolve, reject) => {
			this.state.database.transaction(tx => {
				let upit =
					'INSERT INTO notification(name,volume) VALUES("' +
					notifcation +
					'",' +
					volume / 100 +
					");";
				console.log(upit);
				tx.executeSql(upit, [], (tx, results) => {
					console.log(results);
				});
			});
		});
	};

	playNotification = sound => {
		var notification = new Sound(
			sound + ".mp3",
			Sound.MAIN_BUNDLE,
			error => {
				if (error) {
					console.log("failed to load the sound", error);
					return;
				} else {
					// loaded successfully
					console.log(
						"duration in seconds: " +
							notification.getDuration() +
							" number of channels: " +
							notification.getNumberOfChannels()
					);
					let volume = this.state.volume / 100;
					notification.setVolume(volume);
					notification.play();
				}
			}
		);	
	};

	async componentWillMount() {
		let initialRegion = await this.getCurrentPosition();
		this.setState({
			initialRegion: initialRegion,
			latitude: initialRegion.latitude,
			longitude: initialRegion.longitude
		});
		setTimeout(() => this.setState({ menuTop: 0 }), 1000);
		_geoService.initializeTask();
	}

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			this.handleBackPress
		);
	}

	componentWillUnmount() {
		this.backHandler.remove();
	}

	render() {
		return (
			<MapComponent
				region={this.state.initialRegion}
				markers={this.state.markers}
				latitude={this.state.latitude}
				longitude={this.state.longitude}
				menuTop={this.state.menuTop}
				title={this.state.title}
				handleFab={this.handleFabPress.bind()}
				fabStatus={this.state.fabStatus}
				handleHelp={this.handleFabHelpPress.bind()}
				showHelp={this.state.showHelp}
				handleOptions={this.handleFabOptionsPress.bind()}
				showOptions={this.state.showOptions}
				handleVolume={this.handleVolume.bind(this)}
				changeNotification={this.changeNotification.bind(this)}
				selectedNotification={this.state.selectedNotification}
				volume={this.state.volume}
			/>
		);
	}
}

export default MapContainer;
