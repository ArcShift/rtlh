import React, { Component } from "react";
import { api } from '../../config/config';
import { Image, Keyboard, AsyncStorage, TouchableOpacity, Dimensions, TextInput, Alert } from "react-native";
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
  Item,
  Form,
  List,
  ListItem,
  Text,
  Thumbnail,
  Left,
  Body,
  Right,
  Radio,
  Toast,
  Fab
} from "native-base";
import styles from "./styles";
import { Col, Row, Grid } from "react-native-easy-grid";
import DatePicker from 'react-native-datepicker';
import Spinner from 'react-native-loading-spinner-overlay';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import DetailVerifikasiText from "./detailText";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const radio_props = [
  {label: 'Ya', value: 'Ya' },
  {label: 'Tidak', value: 'Tidak' }
];

class DetailVerifikasi extends Component {
    constructor(props) {
        super(props);
		let {params} = this.props.navigation.state;
		let idUser = params ? params.idUser : false;
		let idGroup = params ? params.idGroup : false;
		let editable = params ? params.editable : false;
		
        this.state = {
            loading: true,
			data: false,
			
			ya: [],
			tidak: [],
			keyYa: [],
			keyTidak: [],
			tglVerifikasi: false,
			keterangan: '',
			infoColor: '#cccccc',
			statusKelayakan: '',
			
			idUser: idUser,
			idGroup: idGroup,
			isAksesForEdit: editable,
			isEditable: true,
        };
		
		this.checkKelayakan = this.checkKelayakan.bind(this);
		this.popultionHasil = this.popultionHasil.bind(this);
    }
	
	componentWillMount() {
		this.init();
	}
	
	getNumPertanyaan(idPertanyaan, base){
		var num = 0;
		if(base.instrumen){
			for(var i=0; i < base.instrumen.length; i++){
				var curr = (i + 1);
				
				if(base.instrumen[i].id_pertanyaan == idPertanyaan){
					num = curr;
				}
			}
		}
		return num;
	}
	
	init = async() => {
		try {
			await AsyncStorage.getItem('verifikasiDetail').then(
			(value) => { 
					if(value !== null){ 
						let data = JSON.parse(value);
						
						let ya = [];
						let tidak = [];
						
						let keyYa = [];
						let keyTidak = [];
						for(var i=0; i<data.instrumen.length; i++){
							let dt = data.instrumen[i];
							
							if(dt.jawaban == 'Ya'){
								ya.push(dt.id_pertanyaan);
								keyYa.push(this.getNumPertanyaan(dt.id_pertanyaan, data));
							} else if(dt.jawaban == 'Tidak'){
								tidak.push(dt.id_pertanyaan);
								keyTidak.push(this.getNumPertanyaan(dt.id_pertanyaan, data));
							}
						}
						
						var clrInfo = '#cccccc';
						if(data.status.indexOf('TIDAK LAYAK') !== -1){
							clrInfo = '#ff5c33';
						} else if(data.status.indexOf('LAYAK') !== -1){
							clrInfo = '#32bc7a';
						}
						
						this.setState({
							data : data, 
							ya: ya, 
							tidak: tidak,
							keyYa: keyYa, 
							keyTidak: keyTidak, 
							tglVerifikasi: this.getTgl(data.tgl_verifikasi), 
							infoColor: clrInfo, 
							statusKelayakan: data.status,
							keterangan: data.keterangan,
							loading: false
							}); 
							
							this.setState({isEditable: false});
						
					} else { 
						this.setState({loading:false});
						this.props.navigation.navigate("Verifikasi") 
					} 
				}
			);
		} catch (error) {
			this.setState({loading:false});
			console.log(error);
			this.props.navigation.navigate("Verifikasi"); //this.props.navigation.goBack()
		}
	}
	
	changeTgl(date){
		date = this.enVertDate(date); // to yyyy-mm-dd
		this.setState({tglVerifikasi: date});
	}
	
	enVertDate(date){ // FROM DD-MM-YYYY TO YYYY-MM-DD
		if(date){
			return date.split("-").reverse().join("-");
		}
	}

	deVertDate(date){ // FROM YYYY-MM-DD TO DD-MM-YYYY
		if(date){
			return date.split("-").reverse().join("-");
		}
	}
	
	getTgl (date){
		var d = new Date();
		
		if(date){
			d = new Date(date);
		}
		
		var month = '' + (d.getMonth() + 1),
			day = '' + d.getDate().toString(),
			year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [year, month, day].join('-');
	};
	
	alert(title, message) {
		Alert.alert(
			title,
			message,
			[
				{text: 'OK', onPress: () => console.log('OK Pressed')},
			],
			{ cancelable: false }
		)
	};
	
	pushJawaban(id, jawaban){
		
		let base = this.state.ya;
		let base2 = this.state.tidak;
		
		if(jawaban == 'Tidak'){
			base = this.state.tidak;
			base2 = this.state.ya;
		}
		
		let replace = [];
		let key1 = [];
		for(var i=0; i<base.length; i++){
			let dt = base[i];
			
			if(dt != id){
				replace.push(dt);
				key1.push(this.getNumPertanyaan(dt, this.state.data));
			}
		}
		
		replace.push(id);
		key1.push(this.getNumPertanyaan(id, this.state.data));
		
		let replace2 = [];
		let key2 = [];
		for(var i=0; i<base2.length; i++){
			let dt = base2[i];
			
			if(dt != id){
				replace2.push(dt);
				key2.push(this.getNumPertanyaan(dt, this.state.data));
			}
		}
		
		if(jawaban == 'Ya'){
			this.setState({ya : replace, tidak : replace2, keyYa: key1, keyTidak: key2});
			this.checkKelayakan(key1, key2);
		} else {
			this.setState({tidak : replace, ya : replace2, keyYa: key2, keyTidak: key1});
			this.checkKelayakan(key2, key1);
		}
		
		
	}
	
	checkKelayakan(ya, tidak){
		let base = this.state.data;
		var jenis = base.data_penerima.jenis_kegiatan;
		//var ya = this.state.ya;
		//var tidak = this.state.tidak;
		
		var clrInfo = '#cccccc';
		var stat = '';
		
		//console.log(ya);
		//console.log(tidak);
		
		if(jenis == 'GAKIN'){
			if(
				ya.indexOf(1) !== -1 &&
				ya.indexOf(2) !== -1 &&
				ya.indexOf(3) !== -1 &&
				ya.indexOf(4) !== -1 &&
				ya.indexOf(5) !== -1 &&
				ya.indexOf(6) !== -1
				){
				
				clrInfo = '#32bc7a';
				stat = 'LAYAK';
				
			} else {
				
				clrInfo = '#ff5c33';
				stat = 'TIDAK LAYAK';
				
			}
			
		} else { // DAK / BSPS
			if(
				ya.indexOf(1) !== -1 &&
				ya.indexOf(2) !== -1 &&
				ya.indexOf(3) !== -1 &&
				ya.indexOf(4) !== -1 &&
				ya.indexOf(5) !== -1 &&
				ya.indexOf(6) !== -1
				){
				
				clrInfo = '#32bc7a';
				stat = 'LAYAK';
				
			} else {
				
				clrInfo = '#ff5c33';
				stat = 'TIDAK LAYAK';
				
			}
		}
		
		console.log(stat);
		
		this.setState({infoColor: clrInfo, statusKelayakan: stat});
	}
	
	popultionHasil() {
		var ya = this.state.ya;
		var tidak = this.state.tidak;
		
		var hasil = [];
		for(var i=0; i<ya.length; i++){
			hasil.push({
				id_pertanyaan: ya[i],
				jawaban: 'Ya'
			});
		}
		for(var i=0; i<tidak.length; i++){
			hasil.push({
				id_pertanyaan: tidak[i],
				jawaban: 'Tidak'
			});
		}
		
		console.log(hasil);
		
		return hasil;
	}
	
	send(){
		let base = this.state.data;
		
		if(this.state.tglVerifikasi && this.state.statusKelayakan != '' && (this.state.ya.length > 0 || this.state.tidak.length > 0)){
			var formBody = {
				id_verifikasi: base.id_verifikasi,
				id_penerima: base.data_penerima.id_penerima,
				tgl_verifikasi: this.state.tglVerifikasi,
				keterangan: this.state.keterangan,
				id_user: this.state.idUser,
				id_group: this.state.idGroup,
				hasil: this.popultionHasil(),
				kesimpulan: this.state.statusKelayakan
			}
			formBody = JSON.stringify(formBody);
			console.log(formBody);

			this.setState({loading: true});
			
			var url = api.url + '/verifikasi/simpan';
			console.log(url);
			
			try {
				fetch(url, {
					method: "POST", 
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					body: formBody
				}).then((response) => response.json())
				.then((responseJson) => {
					console.log(responseJson);
					
					if(responseJson.hasOwnProperty('code') && (responseJson.code == '200' || responseJson.code == '201')){
						this.alert('Berhasil', 'Data verifikasi berhasil disimpan');
						this.props.navigation.goBack();
					} else {
						Toast.show({ text: responseJson.message, duration: 3000 })
					}
				})
				.catch(error => {
					console.log(error);
					Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 3000 })
				})
				.then(() => {
					this.setState({loading: false});
				})
				.done();
			} catch (error) {
				console.log(error);
				Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 3000 });
				this.setState({loading: false});
			}
		} else {
			Toast.show({ text: "Mohon lengkapi jawaban verifikasi Anda!", buttonText: "Okay", duration: 3000 });
		}
	}
	
	changeEditable = () => { this.setState({ isEditable: !this.state.isEditable }) };	
	
	_confirm() {
    Alert.alert(
      'Konfirmasi', 'Anda yakin akan memproses data ini?',
      [
          {text: 'Tidak'},
          {text: 'Ya', onPress: () => this.send()}
      ],
      { cancelable: false }
    )
  }
  
	detailFoto = async() => {
		this.props.navigation.navigate('DetailFotoRumah', {base: this.state.data});
	}

	uploadFoto = async() => {
	    //console.log("this.state.data.data_penerima.id_data_rumah=" + this.state.data.data_penerima.id_data_rumah);
	    //console.log("this.state.idUser=" + this.state.idUser); 
		this.props.navigation.navigate('DataRumahCE', {dataId: this.state.data.data_penerima.id_data_rumah, id_user: this.state.idUser});
	}
	
	render() {
		let data = this.state.data;
		let idx = 1;
		
		return (
			<View style={[styles.container, {flex: 1}]}>
				<Container style={styles.container}>
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
						
						{
							(data) &&
							<Form>
								<View style={[{paddingTop: 20, paddingBottom: 30, borderBottomWidth: 2, borderColor: '#bfbfbf', alignItems: 'center'}]}>
									<View style={{marginBottom: 10}}>
										<Text style={{fontSize: 40}}><Icon name="ios-person-outline" style={{fontSize: 40}} /></Text>
									</View>
									<Text>
										{data.data_penerima.nama_penerima_bantuan}
									</Text>
									<Text numberOfLines={1} note>
										NIK : {data.data_penerima.nik_penerima_bantuan}
									</Text>
									<Text numberOfLines={1} note>
										No BNBA : {data.data_penerima.nomor_bnba}
									</Text>
									<Text numberOfLines={1} note>
										{data.data_penerima.kecamatan} / {data.data_penerima.desa}
									</Text>
									
									<View style={{marginVertical: 10}}>
										<Button onPress={() => { this.detailFoto() }} style={{alignSelf: 'center'}} >
											<Text>Foto Rumah</Text>
										</Button>
									</View>
									
									<View style={{marginVertical: 10}}>
										<Button onPress={() => { this.uploadFoto() }} style={{alignSelf: 'center'}} >
											<Text>Upload Foto Rumah</Text>
										</Button>
									</View>
								</View>
								
								{
									!this.state.isEditable &&
									<DetailVerifikasiText style={{flex: 1}} data={this.state} loading={this.state.loading} instrumen={this.state.data.instrumen} />
								}
								
								{
									this.state.isEditable &&
									<View>
								
										<List
										style={{borderBottomWidth: 2, borderColor: '#bfbfbf'}}
										dataArray={this.state.data.instrumen}
										renderRow={(dt) => {
											return (
											<View>
												<ListItem itemDivider>
													<Body style={{marginLeft: -10}}>
														<Text style={{fontWeight: 'bold'}}>{idx++}. {dt.pertanyaan}</Text>
													</Body>
												</ListItem>
												<ListItem style={{marginLeft: -10}}>
													<Body>
														<View style={{paddingHorizontal: 20, alignItems: 'center'}}>
															<RadioForm
															  radio_props={radio_props}
															  initial={(dt.jawaban == 'Ya' ? 0 : (dt.jawaban == 'Tidak' ? 1 : false))}
															  onPress={(value) => { this.pushJawaban(dt.id_pertanyaan, value) }}
															  formHorizontal={true}
															  labelHorizontal={false}
															  radioStyle={{paddingLeft: 40, paddingRight: 40, width: ((viewportWidth / 2) - 20)}}
															/>
														</View>
													</Body>
												</ListItem>
											</View>
											)
										}
											}
										/>
										
										<View style={[{paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 2, borderColor: '#bfbfbf', backgroundColor: this.state.infoColor}]}>
											{
												(this.state.statusKelayakan != '' && this.state.statusKelayakan.toUpperCase().indexOf('BELUM') < 0) &&
												<Text style={{textAlign: 'center', color: '#ffffff'}}>Berdasarkan jawaban yang diberikan, dapat disimpulkan bahwa: {'\n\n'}<Text style={{fontWeight: 'bold'}}>RTLH {this.state.statusKelayakan}</Text></Text>
											}
											{
												(this.state.statusKelayakan != '' && this.state.statusKelayakan.toUpperCase().indexOf('BELUM') >= 0) &&
												<Text style={{textAlign: 'center', fontWeight: 'bold', color: '#ffffff'}}>{this.state.statusKelayakan}</Text>
											}
											
										</View>
										
										<View style={[{paddingHorizontal: 20, marginTop: 20, paddingBottom: 20}]}>
											<View>
												<Text style={{alignSelf: 'flex-start', fontWeight: 'bold', marginTop: 10, color: 'red'}}>Tanggal Verifikasi</Text>
												<View style={{marginTop: 20}}>
													<DatePicker
													style={{width: viewportWidth - 40}}
													date={this.deVertDate(this.state.tglVerifikasi)}
													mode="date"
													placeholder="mulai"
													format="DD-MM-YYYY"
													minDate="01-01-1970"
													maxDate="30-12-9999"
													confirmBtnText="Confirm"
													cancelBtnText="Cancel"
													iconSource={require('../../../assets/icon-calendar-gray.png')}
													customStyles={{
													  dateInput: {
														marginLeft: 0,
														marginRight: 35,
														borderWidth: 1,
														borderRadius: 5,
														backgroundColor: '#ffffff',
														padding: 0
													  },
													  dateIcon: {
														position: 'absolute',
														right: 4,
														top: 9,
														marginLeft: 0,
														width: 20,
														height: 20
													  },
													  dateText: {
														  //color: '#8a2d24'
													  }
													}}
													onDateChange={(date) => { this.changeTgl(date) }}
													androidMode="default"
												  />
												</View>
											</View>
											
											<View style={[{marginTop: 20}]}>
												<Text style={{alignSelf: 'flex-start', fontWeight: 'bold', marginTop: 10, color: 'red'}}>Keterangan</Text>
												<View style={{marginVertical: 0}}>
													<TextInput multiline = {true} numberOfLines = {8} placeholder='Masukkan Keterangan (jika ada)' onChangeText={(event) => this.setState({keterangan:event})} value={this.state.keterangan} style={styles.textarea} underlineColorAndroid='rgba(0,0,0,0)' />
												</View>
											</View>
										</View>
										
										<View style={[{paddingHorizontal: 20, paddingVertical: 20}]}>
											<Button block onPress={() => { this._confirm() }} >
												<Text>Submit</Text>
											</Button>
										</View>
										
									</View>
								}
								
							</Form>
						}
					</Content>
				</Container>
				
				{
					(!this.state.isEditable && this.state.isAksesForEdit) &&
					<View>
						<Fab
						containerStyle={{}}
						style={{ backgroundColor: "#5067FF", flex: 1, position: 'absolute', bottom: 0, right: 0 }}
						position="bottomRight"
						onPress={() => this.changeEditable() }
						>
							<Icon name="create" />
						</Fab>
					</View>
				}
			</View>
		);
	}
}

export default DetailVerifikasi;
