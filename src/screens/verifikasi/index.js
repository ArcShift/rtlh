import React, { Component } from "react";
import { api } from '../../config/config';
import { Image, Keyboard, AsyncStorage, TouchableOpacity } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  View,
  Button,
  Icon,
  IconNB,
  Fab,
  Item,
  Input,
  Label,
  List,
  ListItem,
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

class Verifikasi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true, 
			idGroup: false,
			idUser: false,
			tahun: [],
			kegiatan: [],
			data: false,
			
			tahunSelected: false,
			kegiatanSelected: false,
			collapsed: false,
			hakAkses: false,
			nama: '',
			nik: '',
			bnba: ''
        };
		
		this.filter = this.filter.bind(this);
    }
	
	componentWillMount() {
		this.init();
	}
	
	init = async() => {
		try {
			await AsyncStorage.getItem('idgroup').then(
				(value) => { 
					
					AsyncStorage.getItem('iduser').then(
						(value2) => { 
							this.setState({idGroup: value, idUser: value2})
							this.filter();
						}
					);
					
				}
			);
			
			await AsyncStorage.getItem('hak_akses').then(
				(value) => { if(value !== null){ this.setState({hakAkses : JSON.parse(value)}); } }
			);
		} catch (error) {
			this.setState({loading:false});
			console.log(error);
			
			Toast.show({ text: "Role User tidak ditemukan", duration: 3000 });
			// redirect back
			this.props.navigation.navigate("Beranda");
		}
	}
	
	
	filter = async(tahun, kegiatan) => {
		if(this.state.idGroup){
			var url = api.url + '/verifikasi/data/' + this.state.idGroup + '/' + this.state.idUser;
			
			if(tahun){
				url += '/' + tahun;
			}
			
			if(kegiatan){
				url += '/' + kegiatan;
			}
			
			url += '?nama=' + this.state.nama;
			url += '&nik=' + this.state.nik;
			url += '&bnba=' + this.state.bnba;
			
			console.log(url);
			
			try {
				await fetch(url, {  
					method: 'GET',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					}
				}).then((response) => response.json())
				.then((responseJson) => {
					console.log(responseJson);
					
					if(responseJson.hasOwnProperty('code')){
						if(responseJson.code == '200'){
							var data = [];
							var lgt = responseJson.data.length;
							
							if(!tahun && !kegiatan){
								for(var i = 0; i < lgt; i++){
									var dt = responseJson.data[i];
									
									data.push({
										label: dt['tahun_anggaran'],
										value: dt['tahun_anggaran']									
									});
								}
								
								this.setState({tahun: data});
								Toast.show({ text: "Silahkan Pilih Kegiatan Pembangunan Terlebih Dahulu", duration: 5000 });
							} else if(!kegiatan){
								for(var i = 0; i < lgt; i++){
									var dt = responseJson.data[i];
									
									data.push({
										label: dt['nama_kegiatan'],
										value: dt['id_kegiatan']									
									});
								}
								
								this.setState({kegiatan: data});
							} else {
								this.setState({data: responseJson.data, collapsed: true});
							}
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
		}
	}
	
	_optionHandler(data){
		let option = [{ key: 0, section: true, label: 'Pilih Salah Satu' }];
		
		data.map((data, index) => {
			index = (index + 1);
			option.push({key: index, label: data.label, value: data.value});
		});
		
		return option;
	}
	
	changeOption(data, section){
		switch(section){
			case 'tahun':
				this.setState({loading: true, tahunSelected: data, kegiatanSelected: false});
				this.filter(data.value);
				break;
			case 'kegiatan':
				this.setState({kegiatanSelected: data});
				//this.filter(this.state.tahunSelected.value, data.value);
				break;
		}
	}
	
	find(){
		let tahun = this.state.tahunSelected.value;
		let kegiatan = this.state.kegiatanSelected.value;
		
		this.setState({loading: true, data: []});
		
		this.filter(tahun, kegiatan);
	}

	detail = async(data) => {
		console.log(this.state.idUser);
		
		this.setState({loading: true});
		try {
			var url = api.url + '/verifikasi/detail/' + data.id_penerima;
			
			console.log(url);
			
			fetch(url, {  
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}
			}).then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				
				if(responseJson.hasOwnProperty('code')){
					if(responseJson.code == '200'){
						console.log(responseJson);
						
						value = AsyncStorage.setItem('verifikasiDetail', JSON.stringify(responseJson.data)).then(
							() => { this.setState({loading: false}); this.props.navigation.navigate('DetailVerifikasi', {idUser: this.state.idUser, idGroup: this.state.idGroup, editable: (this.state.hakAkses && (this.state.hakAkses.indexOf('verifikasi_penerima_bantuan.update') !== -1 || this.state.hakAkses.indexOf('verifikasi_penerima_bantuan.create') !== -1 || this.state.hakAkses.indexOf('verifikasi_penerima_bantuan.create own') !== -1 || this.state.hakAkses.indexOf('verifikasi_penerima_bantuan.update own') !== -1)) ? true : false}) }
						);
					}
				}
				
				this.setState({loading:false});
			}).catch((error) => {
				this.setState({loading:false});
				console.log(error);
				
				Toast.show({ text: "Gagal Load Data. Silahkan coba lagi.", duration: 3000 });
			});
			
		} catch (error) {
			console.log(error);
			Toast.show({ text: "Gagal Load Data. Silahkan coba lagi.", duration: 3000 });
		}
	}
	
	/*create = async() => {
		try {
			AsyncStorage.removeItem('verifikasiDetail');
			
			this.props.navigation.navigate("DetailVerifikasi");
		} catch (error) {
			// nothing
		}
	}*/
	
	render() {
		let optionTahun = this._optionHandler(this.state.tahun);
		let optionKegiatan = this._optionHandler(this.state.kegiatan);
		
		let isCreated = false;
		
		return (
			<View style={[styles.container, {flex: 1}]}>
			<Container>
				<Header>
					<Left>
						<Button transparent onPress={() => this.props.navigation.goBack()  }>
							<Icon name="arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Verifikasi</Title>
					</Body>
					<Right />
				</Header>

				<Content>
					{
						this.state.loading && 
							<View style={{paddingHorizontal: 1, alignItems: 'center'}} >
								<Spinner color={'white'} visible={this.state.loading} textContent={"Harap tunggu..."} textStyle={{color: '#FFF'}} />
							</View>
					}
					
					<Collapsible collapsed={this.state.collapsed}>
					<View style={[{paddingHorizontal: 10, marginTop: 20, borderBottomWidth: 2, borderColor: '#bfbfbf'}]}>
						<Text rkType='secondary6 hintColor' style={{alignSelf: 'flex-start', fontWeight: 'bold', marginTop: 10}}>Tahun Anggaran</Text>
						<View style={{marginVertical: 10}}>
							<ModalSelector
								data={optionTahun}
								initValue="Pilih salah satu"
								supportedOrientations={['landscape']}
								accessible={true}
								scrollViewAccessibilityLabel={'Scrollable options'}
								cancelButtonAccessibilityLabel={'Cancel Button'}
								onChange={(option)=>{ this.changeOption(option, 'tahun') }}
								animationType={'fade'}
								optionTextStyle={{color: 'gray'}}
								cancelText="Kembali"
								disabled={(this.state.tahun.length <= 0)}
								>
								
								<View style={{borderWidth:1, borderColor:'#ccc', padding:10, backgroundColor: (this.state.tahun && this.state.tahun.length > 0 ? '#ffffff' : '#dfdfdf'), borderRadius: 5}}>
									<Grid>
										<Col size={90}>
											<Text>{this.state.tahunSelected ? this.state.tahunSelected.label : '-- Pilih Salah Satu --'}</Text>
										</Col>
										<Col size={10}>
											<Text style={{alignSelf: 'flex-end'}}><Icon name="ios-arrow-dropdown" /></Text>
										</Col>
									</Grid>
								</View>

							</ModalSelector>
						</View>
						
						<Text rkType='secondary6 hintColor' style={{alignSelf: 'flex-start', fontWeight: 'bold', marginTop: 10}}>Kegiatan Pembangunan</Text>
						<View style={{marginVertical: 10}}>
							<ModalSelector
								data={optionKegiatan}
								initValue="Pilih salah satu"
								supportedOrientations={['landscape']}
								accessible={true}
								scrollViewAccessibilityLabel={'Scrollable options'}
								cancelButtonAccessibilityLabel={'Cancel Button'}
								onChange={(option)=>{ this.changeOption(option, 'kegiatan') }}
								animationType={'fade'}
								optionTextStyle={{color: 'gray'}}
								cancelText="Kembali"
								disabled={(!this.state.tahunSelected || this.state.tahun.length <= 0)}
								>
								
								<View style={{borderWidth:1, borderColor:'#ccc', padding:10, backgroundColor: (this.state.tahunSelected && this.state.tahun.length > 0 ? '#ffffff' : '#dfdfdf'), borderRadius: 5}}>
									<Grid>
										<Col size={90}>
											<Text>{this.state.kegiatanSelected ? this.state.kegiatanSelected.label : '-- Pilih Salah Satu --'}</Text>
										</Col>
										<Col size={10}>
											<Text style={{alignSelf: 'flex-end'}}><Icon name="ios-arrow-dropdown" /></Text>
										</Col>
									</Grid>
								</View>

							</ModalSelector>
						</View>
						
						<Item stackedLabel style={{marginVertical: 10}}>
						  <Label style={{fontWeight: 'bold', color: '#000'}}>Nama Penerima Bantuan</Label>
						  <Input placeholder="Masukkan Nama Penerima bantuan..." value={this.state.nama}  onChangeText={(event) => { this.setState({nama:event}); } } disabled={!this.state.kegiatanSelected} />
						</Item>
						
						<Item stackedLabel style={{marginVertical: 10}}>
						  <Label style={{fontWeight: 'bold', color: '#000'}}>NIK Penerima Bantuan</Label>
						  <Input placeholder="Masukkan NIK Penerima bantuan..." value={this.state.nik}  onChangeText={(event) => { this.setState({nik:event}); } } disabled={!this.state.kegiatanSelected} />
						</Item>
						
						<Item stackedLabel style={{marginVertical: 10}}>
						  <Label style={{fontWeight: 'bold', color: '#000'}}>Nomor BNBA</Label>
						  <Input placeholder="Nomor BNBA..." value={this.state.bnba} onChangeText={(event) => { this.setState({bnba:event}); } } disabled={!this.state.kegiatanSelected} />
						</Item>
						
						<View style={{marginVertical: 10}}>
						
							<Button block onPress={() => { this.find() }} disabled={!this.state.kegiatanSelected}>
								<Text>Tampilkan</Text>
							</Button>
						</View>
					</View>
					</Collapsible>
					
					{
						(this.state.collapsed || (this.state.data && this.state.data.length > 0)) &&
						<TouchableOpacity onPress={() => { this.setState({ collapsed: !this.state.collapsed }); }}>
							<View style={{backgroundColor: '#d9d9d9', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, paddingVertical: 10}}>
								<View style={{alignItems: 'center'}}>
									{
										this.state.collapsed &&
										<Text><Icon name="ios-arrow-dropdown" /></Text>
									}
									{
										!this.state.collapsed &&
										<Text><Icon name="ios-arrow-dropup" /></Text>
									}
								</View>
							</View>
						</TouchableOpacity>
					}
					
					{
						(this.state.data && this.state.data.length > 0) &&
							<List
							dataArray={this.state.data}
							renderRow={data =>
								<ListItem thumbnail onPress={() => this.detail(data) }>
									<Left>
										<Text><Icon name="md-home" style={{fontSize: 20}} /></Text>
									</Left>
									<Body>
										<Text>
											{data.nama_penerima_bantuan}
										</Text>
										<Text numberOfLines={1} note>
											{data.kecamatan} / {data.desa}
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
							Tidak ditemukan data untuk kegiatan pembangunan yang Anda pilih.
						</Text>
						</View>
					}
					
					{
						(this.state.tahun && this.state.tahun.length == 0 && !this.state.loading) &&
						<View style={{paddingHorizontal: 20, paddingVertical: 30}}>
						<Text style={{textAlign: 'center', color: 'red'}}>
							Belum ada data kegiatan pembangunan.
						</Text>
						</View>
					}
				</Content>
			</Container>
			
			{
				(isCreated && this.state.data && this.state.kegiatanSelected) &&
				<View>
					<Fab
					containerStyle={{}}
					style={{ backgroundColor: "#5067FF" }}
					position="bottomRight"
					onPress={() => this.create() }
					>
						<Icon name="add" />
					</Fab>
				</View>
			}
			
			</View>
		);
	}
}

export default Verifikasi;
