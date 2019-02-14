import React, { Component } from "react";
import { api } from '../../config/config';
import { Image, Keyboard, AsyncStorage, TouchableOpacity, DeviceEventEmitter } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  View,
  Button,
  Icon,
  IconNB,
  Input,
  Fab,
  List,
  ListItem,
  Item,
  Text,
  Thumbnail,
  Left,
  Body,
  Toast,
  Right
} from "native-base";
import styles from "./styles";
import { Col, Row, Grid } from "react-native-easy-grid";
import Spinner from 'react-native-loading-spinner-overlay';
import ModalSelector from 'react-native-modal-selector';
import Collapsible from 'react-native-collapsible';
import {nominalFormat} from "../../config/helpers";

class ListUpdateMaterial extends Component {
    constructor(props) {
        super(props);
        let {state} = this.props;
		let idUser = state ? state.idUser : false;
		let idGroup = state ? state.idGroup : false;
		let base = state ? state.base : false;
		
		this.state = {
            loading: true, 
			idGroup: idGroup,
			idUser: idUser,
			base: base,
			data: [],
			hakAkses: false
        };
		
    }
	
	componentWillMount() {
		this.init();
		this.hakAkses();
		
		DeviceEventEmitter.addListener('refreshMaterialUpdate', (e)=>{ this.init(true) })
	}
	
	init = async(isNotLoading) => {
		try {
			var url = api.url + '/monitoring/material_detail/' + this.state.idGroup + '/' + this.state.idUser + '/' + this.props.state.idMonitoring;
			
			console.log(url);
			
			if(!isNotLoading){
				this.setState({loading:true});
			}
			try {
				await fetch(url, {  
					method: 'GET',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					}
				}).then((response) => { return response.json(); } )
				.then((responseJson) => {
					console.log(responseJson);
					
					if(responseJson.hasOwnProperty('code')){
						if(responseJson.code == '200'){
							var data = [];
							var lgt = responseJson.data.length;
							this.setState({data: responseJson.data});
						} else {
							var txt = 'Terjadi Kesalahan saat mengambil data.';
							
							if(responseJson.hasOwnProperty('message')){
								txt = responseJson.message;
							}
							
							Toast.show({ text: txt, duration: 5000 });
						}
					}
					
					this.setState({loading:false});
				}).catch((error) => {
					this.setState({loading:false});
					console.log(error);
					
					Toast.show({ text: "Tidak ditemukan Data", duration: 3000 });
				});
			} catch (error) {
				this.setState({loading:false});
				console.log(error);
				
				Toast.show({ text: "Role User tidak ditemukan", duration: 3000 });
				// redirect back
				this.props.navigation.navigate("Beranda");
			}
		} catch (error) {
			this.setState({loading:false});
			console.log(error);
			//this.props.navigation.navigate("ProgressMaterial"); //this.props.navigation.goBack()
		}
	}
	
	hakAkses = async() => {
		try {
			await AsyncStorage.getItem('hak_akses').then(
				(value) => { if(value !== null){ this.setState({hakAkses : JSON.parse(value)}); } }
			);
		} catch (error) {
			console.log(error);
		}
  }
	
	
	detail = async(data) => {
		this.props.navigation.navigate('DetailMaterialUpdate', {idUser: this.state.idUser, idGroup: this.state.idGroup, base: data, editable: (this.state.hakAkses && (this.state.hakAkses.indexOf('progress_material_rumah.update') !== -1 || this.state.hakAkses.indexOf('progress_material_rumah.update own') !== -1)) ? true : false, idMonitoring: this.props.state.idMonitoring});
	}
	
	render() {
		let isCreated = (this.state.hakAkses && (this.state.hakAkses.indexOf('progress_material_rumah.create') !== -1 || this.state.hakAkses.indexOf('progress_material_rumah.create own') !== -1)) ? true : false;
		
		var data = this.state.data;
		var base = this.state.base;
		
		var isCollapsible = false;
		
		return (
			<View style={[styles.container, {flex: 1}]}>
			<Container>
				<Content>
					{
						this.state.loading && 
							<View style={{paddingHorizontal: 1, alignItems: 'center'}} >
								<Spinner color={'white'} visible={this.state.loading} textContent={"Harap tunggu..."} textStyle={{color: '#FFF'}} />
							</View>
					}
					
					<ListItem itemDivider>
						<Body style={{marginLeft: -10}}>
							<Text style={{fontWeight: 'bold', textAlign: 'center'}}>Data Update Material Rumah</Text>
						</Body>
					</ListItem>
					
					{
						(this.state.data && this.state.data.length > 0) &&
							<List
							dataArray={this.state.data}
							renderRow={dt =>
								<ListItem thumbnail onPress={() => this.detail(dt) }>
									<Left>
										<Text><Icon name="checkbox" style={{fontSize: 20}} /></Text>
									</Left>
									<Body>
										<Text>
											{dt.nama_material}
										</Text>
										<Text numberOfLines={1} note>
											Volume: {nominalFormat(dt.volume_saat_ini)}
										</Text>
										<Text numberOfLines={1} note>
											Harga: {nominalFormat(dt.harga_saat_ini)}
										</Text>
									</Body>
									<Right>
										<Icon name="arrow-forward" />
									</Right>
								</ListItem>}
							/>
					}
					
					{
						(this.state.data && this.state.data.length == 0 && !this.state.loading) &&
						<View style={{paddingHorizontal: 20, paddingVertical: 30}}>
						<Text style={{textAlign: 'center', color: 'red'}}>
							Belum ada Data Material untuk Progress ini.
						</Text>
						</View>
					}
				</Content>
			</Container>
			
			</View>
		);
	}
}

export default ListUpdateMaterial;
