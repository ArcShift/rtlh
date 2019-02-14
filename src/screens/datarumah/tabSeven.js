import React, { Component } from "react";
import { Alert, View, Dimensions, Platform } from "react-native";
import { Content, Left, Right, Text, Label, ListItem, Item, Radio, Button, Picker, Container } from "native-base";
import MapView, { AnimatedRegion, Animated, Marker } from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';
import { Constants, Location, Permissions } from 'expo';
import styles from "./styles";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const latDefault = -7.170790;
const lngDefault = 112.599666;

export default class TabSeven extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      latLang: false,
	  lat: false,
	  lng: false,
	  statusMessage: null,
	  isDetail: false
    };
  }

  componentWillMount() {
	var isEdit = false;
	var dataEdit = this.props.data;

	if (dataEdit && dataEdit.length != 0 ) {
	  if((dataEdit.latitude != '' && dataEdit.latitude != null && dataEdit.latitude != 'null' && dataEdit.latitude != '-') && (dataEdit.longitude != '' && dataEdit.longitude != null && dataEdit.longitude != 'null' && dataEdit.longitude != '-')){
		  var lat = parseFloat(dataEdit.latitude);
		  var lng = parseFloat(dataEdit.longitude);

          console.log("lat=" + lat);
          console.log("lng=" + lng);
		  
		  this.bindCoordinate(lat, lng);
		  this.props.updateLokasi(lat, lng);
	  }
	  
	  isEdit = true;
	  this.setState({loading: false, statusMessage: 'Lokasi yang tersimpan saat ini.'});
	}
	
	var isDetail = this.props.isDetail;
	if (isDetail) {
		this.setState({isDetail: true});
		
		//this.bindCoordinate(this.props.lat, this.props.lng);
		//isEdit = true;
		//this.setState({loading: false, statusMessage: 'Lokasi yang tersimpan saat ini.', isDetail: true});
	}
	
	if(!isEdit){
		this.initiateLokasi();
	}
	
  }

	initiateLokasi = () => {
		if (Platform.OS === 'android' && !Constants.isDevice) {
			this.setState({
				statusMessage: 'Maps tidak dapat dijalankan di Android emulator!',
			});
		} else {
			if((!this.props.lat || this.props.lat == '' || this.props.lat == null || this.props.lat == 'null' || this.props.lat == '-') && (!this.props.lng || this.props.lng == '' || this.props.lng == null || this.props.lng == 'null' || this.props.lng == '-')){
				this._getLocationAsync();
			}
		}

		//DEFAULT
		var load = false;
		var lat = false;//latDefault;
		var lng = false;//lngDefault;
		
		if(this.props.lat && this.props.lat != '' && this.props.lat != null && this.props.lat != 'null' && this.props.lat != '-'){
			lat = parseFloat(this.props.lat);
			load = true;
		}
		if(this.props.lng && this.props.lng != '' && this.props.lng != null && this.props.lng != 'null' && this.props.lng != '-'){
			lng = parseFloat(this.props.lng);
			load = true;
		}
		
		//console.log(lat);
		//console.log(lng);
		
		if(lat && lng){
			this.bindCoordinate(lat, lng, load);
		}
	}
  
	_getLocationAsync = async () => {
		//this.setState({loading: false});
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				statusMessage: 'Permission to access location was denied',
			});
		}
		
		let check = await Location.getProviderStatusAsync();
		
		if(check && check.locationServicesEnabled == true && check.gpsAvailable == true && check.networkAvailable == true){
			let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});

			//console.log(location);
			if(location){
				//this.setState({loading: true});
				var lat = location.coords.latitude;
				var lng = location.coords.longitude;

				this.bindCoordinate(lat, lng, true);
			} else {
				this.setState({
					statusMessage: 'GPS/Network Error. Silahkan periksa pengaturan Anda!',
					loading: false
				});
			}
			
			Location.watchPositionAsync({enableHighAccuracy: true}, (location) => { var lat = location.coords.latitude; var lng = location.coords.longitude; this.bindCoordinate(lat, lng); } );
		} else {
			this.setState({
				statusMessage: 'GPS/Network Error. Silahkan periksa pengaturan Anda!',
				loading: false
			});
		}

		
	};
  
	bindCoordinate = (lat, lng, isLoading) => {
		let initiate = new AnimatedRegion({
			latitude: lat,
			longitude: lng,
			latitudeDelta: 0.5,
			longitudeDelta: 0.5,
		});
		
		this.setState({latLang: initiate, lat: lat, lng: lng});
		if(isLoading){
			this.setState({loading: false, statusMessage: 'Lokasi berhasil ditentukan & disimpan'});
		}
		
		const duration = 500;
		
		console.log(lat);
		console.log(lng);
		
		if (Platform.OS === 'android') {
			
		  /*if (this.marker) {
			this.marker._component.animateMarkerToCoordinate(
				{ latitude: lat, longitude: lng },
				duration
			);
		  }*/
		}
		
		if(lat != latDefault && lng != lngDefault){
			this.props.updateLokasi(lat, lng);
		}
	}
  
	_refresh = () => {
		this.setState({loading: true});
		this._getLocationAsync();
	}

	render() {
		return (
			<Container style={styles.container}>
				<Content style={styles.container}>
                {
                    (!this.state.loading && this.state.lat && this.state.lng) &&
                    <View style={styles.mapContainer}>
                        <Animated
                          region={this.state.latLang}
                          style={styles.mapStyle}
                        >
                        <Marker.Animated
                            ref={marker => { this.marker = marker }}
                            coordinate={{ latitude: this.state.lat, longitude: this.state.lng }}
                          />
                        </Animated>
                    </View>
                }
				
				<Text style={{color: (this.state.loading ? 'red' : 'transparent'), paddingVertical: (!this.state.isDetail && !this.state.loading ? (viewportHeight / 3.2) : (viewportHeight / 2)), textAlign: 'center'}}>{(this.state.isDetail ? 'Mendapatkan detail lokasi...' : 'Mengambil lokasi...')}</Text>
				
				{
					!this.state.isDetail &&
					<View style={styles.footer}>
					{
						this.state.statusMessage != null &&
						<View style={{alignItems: 'center', marginBottom: 10, paddingVertical: 10, backgroundColor: '#ffffff', borderRadius: 20}}>
							<Text style={{color: '#B22222', fontSize: 12}}>{this.state.statusMessage}</Text>
						</View>
					}
					
					{ !this.state.loading && 
						<Button block style={{paddingHorizontal: 20}} onPress={() => this._refresh()}>
							<Text>REFRESH LOKASI</Text>
						</Button>
					}
					</View>	
				}
				
				</Content>
			</Container>
		);
	}
}
