import React, { Component } from "react";
import { api } from '../../config/config';
import { 
	Image, 
	Keyboard, 
	AsyncStorage, 
	TouchableOpacity, 
	Dimensions, 
	TextInput, 
	Alert,
	Linking,
	Platform,
	DeviceEventEmitter
} from "react-native";
import Exponent, { Constants, ImagePicker, DocumentPicker, registerRootComponent, Permissions } from 'expo';
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
  Label,
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
import ModalSelector from 'react-native-modal-selector';
import SafariView from 'react-native-safari-view';
import DetailKondisiText from "./detailText";
import {openURL, nominalFormat} from "../../config/helpers";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

class DetailMaterialUpdate extends Component {
    constructor(props) {
        super(props);
		let {params} = this.props.navigation.state;
		let idUser = params ? params.idUser : false;
		let idGroup = params ? params.idGroup : false;
		let base = params ? params.base : false;
		let editable = params ? params.editable : false;
		let idPenerima = params ? params.idPenerima : false;
		let idMonitoring = params ? params.idMonitoring : false;
		
        this.state = {
            loading: true,
			data: base,
			
			idPenerima: idPenerima,
			
			opsiMaterial: [],
			volume: '',
			harga: '',
			keterangan: '',
			material: '',
			persentaseVolume: '',
			persentaseHarga: '',
			namaSatuan: '',
			materialSelected: false,
			idMonitoringDetail: '0',
			idMonitoring: idMonitoring,
			
			idUser: idUser,
			idGroup: idGroup,
			isEditable: true,
			isAksesForEdit: editable
        };
    }
	
	componentDidMount() {
		this.init();
		
		console.log('detail');
		console.log(this.state);
	}
	
	componentWillUnmount() {
		DeviceEventEmitter.emit('refreshMaterialUpdate',  {});
	}
	
	init = async() => {
		console.log("INIT");
		console.log(this.state.data);
		
		if(this.state.data){
			var data = this.state.data;
			
			this.setState({
				idMonitoringDetail: data.id_monitoring_detail,
				volume: data.volume_saat_ini,
				harga: data.harga_saat_ini,
				material: data.id_material,
				namaSatuan: data.nama_satuan,
				idPenerima: data.id_penerima_bantuan,
				
				persentaseVolume: data.persentase_volume,
				persentaseHarga: data.persentase_harga
			}, () => { this.getOpsiMaterial(); });
			
			if(data.id_monitoring_detail != '0'){
				this.setState({isEditable: false});
			}
		} else {
			this.getOpsiMaterial();
		} 
	}
	
	getOpsiMaterial = async() => {
		var url = api.url + '/monitoring/get_opsi_material/' + this.state.idGroup + '/' + this.state.idUser + '/' + this.state.idPenerima;
			
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
						var selected = false;
						
						for(var i = 0; i < lgt; i++){
							var dt = responseJson.data[i];
							
							data.push({
								label: dt['nama_material'],
								value: dt['id_material']									
							});
							
							if(this.state.data && this.state.data.id_material == dt['id_material']){
								this.setState({ materialSelected: { label: dt['nama_material'], value: dt['id_material'] } });
							}
						}
						
						this.setState({opsiMaterial: data});
						
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
	
	_optionHandler(data){
		let option = [{ key: 0, section: true, label: 'Pilih Salah Satu' }];
		
		if(data){
			data.map((data, index) => {
				index = (index + 1);
				option.push({key: index, label: data.label, value: data.value});
			});
		}
		
		return option;
	}
	
	changeOption(data){
		this.setState({materialSelected: data, material: data.value});
	}

	send(){ // SUBMIT FORM
		
		if(this.state.material != '' && this.state.volume != '' && this.state.harga != ''){
			
			var idMonitoringDetail = this.state.idMonitoringDetail;
			var idMonitoring = this.state.idMonitoring;
			var material = this.state.material;
			var volume = this.state.volume;
			var harga = this.state.harga;
			var keterangan = this.state.keterangan;
			
			var idUser = this.state.idUser;
			var idGroup = this.state.idGroup;
			
			var formBody = {
				id_monitoring_detail: idMonitoringDetail,
				id_monitoring: idMonitoring,
				id_material: material,
				volume: nominalFormat(volume),
				harga: nominalFormat(harga),
				keterangan: keterangan,
				id_user: idUser,
				id_group: idGroup,
			}
			formBody = JSON.stringify(formBody);

			this.setState({loading: true});

			var url = api.url + '/monitoring/simpan_material_detail';
			console.log(url);
			console.log(formBody);
			
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
						this.alert('Berhasil', 'Data material berhasil disimpan');
						this.props.navigation.goBack();
					} else {
						Toast.show({ text: responseJson.message, duration: 3000 })
					}
				})
				.catch(error => {
					console.log(error);
					Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", duration: 3000 })
				})
				.then(() => {
					this.setState({loading: false});
				})
				.done();
			} catch (error) {
				console.log(error);
				Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", duration: 3000 });
				this.setState({loading: false});
			}
		} else {
			Toast.show({ text: "Mohon lengkapi Form yang disajikan!", duration: 3000 });
		}
	}
	
	_gobackTwice(){
		this.props.navigation.pop(2);
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
	
	render() {
		let data = this.state.data;		
		let optionMaterial = this._optionHandler(this.state.opsiMaterial); 
		
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
							<Title>Update Material</Title>
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
							!this.state.isEditable &&
							<View style={[styles.container, {flex: 1}]}>
								<Content style={styles.container}>
								  <Label style={styles.selfLabel}>Nama Material</Label>
								  <ListItem style={styles.textDetail}>
									<Text>{this.state.materialSelected ? this.state.materialSelected.label : '-'}</Text>
								  </ListItem>

								  <Label style={styles.selfLabel}>Nama Satuan</Label>
								  <ListItem style={styles.textDetail}>
									<Text>{this.state.namaSatuan}</Text>
								  </ListItem>
								  
								  <Label style={styles.selfLabel}>Volume saat ini</Label>
								  <ListItem style={styles.textDetail}>
									<Text>{nominalFormat(this.state.volume)}</Text>
								  </ListItem>
								  
								  <Label style={styles.selfLabel}>Harga saat ini</Label>
								  <ListItem style={styles.textDetail}>
									<Text>{nominalFormat(this.state.harga)}</Text>
								  </ListItem>
								  
								  <Label style={styles.selfLabel}>Persentase Volume</Label>
								  <ListItem style={styles.textDetail}>
									<Text>{nominalFormat(this.state.persentaseVolume)}%</Text>
								  </ListItem>
								  
								  <Label style={styles.selfLabel}>Persentase Harga</Label>
								  <ListItem style={styles.textDetail}>
									<Text>{nominalFormat(this.state.persentaseHarga)}%</Text>
								  </ListItem>
								  
								  <Label style={styles.selfLabel}>Keterangan</Label>
								  <ListItem style={styles.textDetail}>
									<Text>{this.state.keterangan != '' ? this.state.data.keterangan : '-'}</Text>
								  </ListItem>
							  </Content>
							</View>
						}
						
						{
							this.state.isEditable &&
							<Form>
								<View style={[{paddingHorizontal: 20, marginTop: 20, paddingBottom: 20, borderBottomWidth: 2, borderColor: '#bfbfbf'}]}>
									<View>
										<Label style={{fontSize: 15, color: 'gray', fontWeight: 'bold', marginBottom: 10}}>Material *</Label>
										<View style={{marginVertical: 0}}>
											<ModalSelector
												data={optionMaterial}
												initValue="Pilih salah satu"
												supportedOrientations={['landscape']}
												accessible={true}
												scrollViewAccessibilityLabel={'Scrollable options'}
												cancelButtonAccessibilityLabel={'Cancel Button'}
												onChange={(option)=>{ this.changeOption(option) }}
												animationType={'fade'}
												optionTextStyle={{color: 'gray'}}
												cancelText="Kembali"
												>
												
												<View style={{borderWidth:1, borderColor:'#ccc', padding:10, backgroundColor: '#ffffff', borderRadius: 5}}>
													<Grid>
														<Col size={90}>
															<Text>{this.state.materialSelected ? this.state.materialSelected.label : '-- Pilih Salah Satu --'}</Text>
														</Col>
														<Col size={10}>
															<Text style={{alignSelf: 'flex-end'}}><Icon name="ios-arrow-dropdown" /></Text>
														</Col>
													</Grid>
												</View>

											</ModalSelector>
										</View>
									</View>
									
									<Item stackedLabel style={[{marginTop: 20}]}>
										<Label style={{fontWeight: 'bold'}}>Volume Saat ini *</Label>
										<Input placeholder="Masukkan Volume saat ini..." value={nominalFormat(this.state.volume)}  onChangeText={(event) => this.setState({volume:event})} keyboardType="phone-pad" />
									</Item>
									
								</View>
								
								<View style={[{paddingHorizontal: 20, marginTop: 20, paddingBottom: 20, borderBottomWidth: 2, borderColor: '#bfbfbf'}]}>
									<View style={[{paddingBottom: 20}]}>
										<Label style={{fontSize: 15, color: 'gray', fontWeight: 'bold'}}>Keterangan</Label>
										<TextInput multiline = {true} numberOfLines = {8} placeholder='Masukkan Keterangan (jika ada)' onChangeText={(event) => this.setState({keterangan:event})} value={this.state.keterangan} style={styles.textarea} underlineColorAndroid='rgba(0,0,0,0)' />
									</View>
								</View>
								
								<View style={[{paddingHorizontal: 20, paddingVertical: 20}]}>
									<Button block onPress={() => { this._confirm() }} >
										<Text>Submit</Text>
									</Button>
								</View>
								
								
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

export default DetailMaterialUpdate;
