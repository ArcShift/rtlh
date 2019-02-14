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
import Exponent, { Constants, ImagePicker, DocumentPicker, registerRootComponent, Permissions, ImageManipulator } from 'expo';
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

const radio_props = [
  {label: 'Ya', value: 'Ya' },
  {label: 'Tidak', value: 'Tidak' }
];

class DetailMaterial extends Component {
    constructor(props) {
        super(props);
		let {params} = this.props.navigation.state;
		let idUser = params ? params.idUser : false;
		let idGroup = params ? params.idGroup : false;
		let base = params ? params.base : false;
		let penerima = params ? params.penerima : false;
		let editable = params ? params.editable : false;
		
        this.state = {
            loading: true,
			data: base,
			penerima: penerima,
			
			dokumenBase: false,
			dokumen: false,
			persentase: '',
			isResmi: '',
			persentaseReal: '',
			keterangan: '',
			idMonitoring: '0',
			
			idUser: idUser,
			idGroup: idGroup,
			opsiPersentase: false,
			opsiLainnya: false,
			persentaseSelected: false,
			isEditable: true,
			isUpdateMaterial: false,
			tabNow: 0,
			
			opsiFoto: [{label: 'Ambil dari Kamera', value: 'camera'}, {label: 'Pilih dari Galeri', value: 'gallery'}],
			foto: [],
			fotoBase: [],
			isAksesForEdit: editable
        };
    }
	
	componentDidMount() {
		this.init();
	}
	
	componentWillUnmount() {
		DeviceEventEmitter.emit('refreshMaterial',  {});
	}
	
	init(){
	    console.log("INIT");
	    console.log(this.state.data);
		var persentase = this.opsiPersentase();
		
		if(this.state.data){
			var data = this.state.data;
			var per = data.persentase_progress;
			per = per.split('.');
			per = per[0];
			
			var opsiLainnya = false;
			var persentaseSelected = {label: per, value: per}
			if(data.is_persentase_resmi == '0'){
				opsiLainnya = true;
				var persentaseSelected = {label: 'Lainnya', value: 'Lainnya'}
			}
			
			this.setState({
				persentase: per,
				isResmi: data.is_persentase_resmi,
				persentaseReal: nominalFormat(data.persentase_progress_real),
				keterangan: data.keterangan,
				idMonitoring: data.id_monitoring,
				dokumenBase: data.filepath_dokumen,
				fotoBase: data.foto,
				opsiLainnya: opsiLainnya,
				persentaseSelected: persentaseSelected
			});
			
			if(data.id_monitoring != '0'){
				this.setState({isEditable: false});
			}
		} 
		
		this.setState({loading: false, opsiPersentase: persentase});
	}
	
	opsiPersentase(){
		var opsi = [];
		
        opsi.push({label: '0', value: '0'});
        opsi.push({label: '50', value: '50'});
        opsi.push({label: '100', value: '100'});
		opsi.push({label: 'Lainnya', value: 'Lainnya'});
		
		return opsi;
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
		
		if(data.value == 'Lainnya'){
			this.setState({persentaseSelected: data, opsiLainnya: true, persentase: ''});
		} else {
			this.setState({persentaseSelected: data, opsiLainnya: false, persentase: data.value});
		}
		
	}
	
	
	// UPLOAD FILE
	uploadFile = async() => {
		let pickerResult = await DocumentPicker.getDocumentAsync({
			type: 'application/*'
		});
		
		this._handleFilePicked(pickerResult);
	}
	
	_handleFilePicked = async(pickerResult) => {
		let uploadResponse, uploadResult;

		try {
			this.setState({ loading: true });

			if (!pickerResult.cancelled) {
				uploadResponse = await this.uploadFileAsync(pickerResult);
				uploadResult = await uploadResponse.json();
				
				this.setState({ dokumen: uploadResult.webpath });
			}
		} catch (e) {
			console.log({ uploadResponse });
			console.log({ uploadResult });
			console.log({ e });
			this.alert('Gagal', 'Maaf, file gagal di upload!');
		} finally {
			this.setState({ loading: false });
		}
	};

	uploadFileAsync = async(file) => {
		let apiUrl = api.url + 'monitoring/upload_file';
		
		let name = file.name;
		let uri = file.uri;
		let uriParts = name.split('.');
		let fileType = uriParts[uriParts.length - 1];

		let formData = new FormData();
		formData.append('file', {
			uri,
			name: `${name}`,
			type: `application/${fileType}`,
		});
		
		formData.append('section', 'MATERIAL');

		let options = {
			method: 'POST',
			body: formData,
			headers: {
			Accept: 'application/json',
				'Content-Type': 'multipart/form-data',
			},
		};
		
		console.log(apiUrl);
		console.log(options);

		return fetch(apiUrl, options);
	}
	
	renderFileImage = (section) => {
		let base = this.state.dokumen;
		if(section == 'dokumenBase'){
			base = this.state.dokumenBase;
		}
		
		if (!base) {
			return;
		}
		
		var name = base.replace('\\','/').replace('\\\\','/').split('/');
		name = name[name.length - 1];
		
		return (
			<View style={{ alignItems: 'center' }}>
				<View
				style={{
					marginTop: 30,
					width: 250,
					borderRadius: 3,
					elevation: 2,
					shadowColor: 'rgba(0,0,0,1)',
					shadowOpacity: 0.2,
					shadowOffset: { width: 4, height: 4 },
					shadowRadius: 5,
				}}>
					<View
					style={{
					borderTopRightRadius: 3,
					borderTopLeftRadius: 3,
					overflow: 'hidden'
					}}>
						<Image source={require('../../../assets/docs.png')} style={{ width: 250, height: 200 }} />
					</View>

					<View style={{marginTop: 10, paddingHorizontal: 10}}>
						<Text style={{textAlign: 'center'}}>{name}</Text>
					</View>
					
					<View style={{marginTop: 10, paddingHorizontal: 10, marginBottom: 10}}>
						<Button iconLeft block danger onPress={() => { this.lihatFile(base) }} ><Icon name="ios-eye" /><Text>Lihat File</Text></Button>
					</View>
				</View>
			</View>
		);
	};
	
	renderImage = (section) => {
		let base = this.state.fotoBase;
		if(section == 'foto'){
			base = this.state.foto;
		}
		
		if (!base || base.length == 0) {
			return;
		}
		
		let dataImage = base.map((val, idx) => {
			var key = 'iMage' + (Math.floor(Math.random() * 100) + idx);
			
			return (
				<View key={key}
				style={{
					marginTop: 30,
					width: 250,
					borderRadius: 3,
					elevation: 2,
					shadowColor: 'rgba(0,0,0,1)',
					shadowOpacity: 0.2,
					shadowOffset: { width: 4, height: 4 },
					shadowRadius: 5,
				}}>
					<TouchableOpacity
					style={{
					borderTopRightRadius: 3,
					borderTopLeftRadius: 3,
					overflow: 'hidden'
					}}
					onPress = {() => this.lihatFile(val.filepath_foto) }
					>
						<Image source={{ uri: val.filepath_foto }} style={{ width: 250, height: 200 }} />
					</TouchableOpacity>

					{
						this.state.isEditable &&
						<View>
							<View style={{marginTop: 10, paddingHorizontal: 10}}>
								<Button block info onPress={() => { this.setGambar(val, section) }} disabled={(("is_foto_utama" in val) && val.is_foto_utama == '1')} ><Text><Icon name="checkmark" style={{fontSize: 22, color: '#ffffff'}} /> { ("is_foto_utama" in val) && val.is_foto_utama == '1' ? 'Foto Utama' : 'Jadikan Utama' } </Text></Button>
							</View>
							
							<View style={{marginTop: 10, paddingHorizontal: 10, marginBottom: 10}}>
								<Button block danger onPress={() => { this.hapusGambar(val, section) }} ><Text><Icon name="ios-trash" style={{fontSize: 22, color: '#ffffff'}} /> Hapus Foto</Text></Button>
							</View>
						</View>
					}
					
				</View>
			);
		});

		var keyParent = 'iMages' + (Math.floor(Math.random() * 100) + 1);
		
		return (
			<View key={keyParent} style={{ alignItems: 'center' }}>
				{dataImage}
			</View>
		);
	};
	
	setGambar = (value, section) => {
		this.setState({loading: true});
		
		let base = this.state.fotoBase;
		let temp = this.state.foto;
		
		let isEdit = false;
		if(section != 'foto'){
			isEdit = true;
		}
		
		let replaceBase = [];
		let replaceTemp = [];
		
		if(isEdit){
			
			for(var i = 0; i < base.length; i++){
				var data = base[i];
				
				var isUtama = '0';
				
				if(value.id_foto == data.id_foto){
					isUtama = '1';
					
					// UPDATE TO SERVER
					this.setUtamaToServer(value.id_foto);
				}
				
				replaceBase.push({
					filepath_foto: data.filepath_foto,
					id_foto: data.id_foto,
					is_foto_utama: isUtama,
				});
			}
			
			for(var i = 0; i < temp.length; i++){
				var data = temp[i];
				
				replaceTemp.push({
					dir_path: data.dir_path,
					filepath_foto: data.filepath_foto,
					is_foto_utama: '0'
				});
			}
			
		} else {
			
			for(var i = 0; i < base.length; i++){
				var data = base[i];
				
				replaceBase.push({
					filepath_foto: data.filepath_foto,
					id_foto: data.id_foto,
					is_foto_utama: '0',
				});
			}
			
			for(var i = 0; i < temp.length; i++){
				var data = temp[i];
				
				var isUtama = '0';
				if(value.filepath_foto == data.filepath_foto){
					isUtama = '1';
				}
				
				replaceTemp.push({
					dir_path: data.dir_path,
					filepath_foto: data.filepath_foto,
					is_foto_utama: isUtama
				});
			}
		}
		
		this.setState({fotoBase: replaceBase, foto: replaceTemp, loading: false});
	}
	
	hapusGambar = (value, section) => {
		
		this.setState({loading: true});
		
		let isEdit = false;
		let base = this.state.fotoBase;
		
		if(section == 'foto'){
			base = this.state.foto;
		}
		
		let replace = [];
		
		for(var i = 0; i < base.length; i++){
			var data = base[i];
			
			if(value.filepath_foto != data.filepath_foto){
				
				if(isEdit){
					replace.push({
						filepath_foto: data.filepath_foto,
						id_foto: data.id_foto,
						is_foto_utama: data.is_foto_utama
					});
					
				} else {
					replace.push({
						dir_path: data.dir_path,
						filepath_foto: data.filepath_foto,
						is_foto_utama: data.is_foto_utama
					});
					
				}
				
			} 
		}
		
		var path = value.filepath_foto;
				
		// UPDATE TO SERVER
		this.hapusInServer(path);
		
		this.setState({foto: replace, loading: false});
		
	}

	hapusInServer(path){
		if(!path || path == ''){
			return;
		}
		
		this.setState({loading: true});
		
		path = path.substring(path.indexOf('files'));
		
		var formBody = {
			path: path,
			other: 'material'
		}
		formBody = JSON.stringify(formBody);
		console.log(formBody);

		var url = api.url + '/monitoring/remove_file';
		
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
					Toast.show({ text: 'Foto berhasil dihapus.', duration: 3000 })
				} else {
					//Toast.show({ text: responseJson.message, duration: 3000 })
				}
			})
			.catch(error => {
				console.log(error);
				//Toast.show({ text: "Terjadi kesalahan pada server. Mohon ulang kembali.", duration: 3000 })
			})
			.then(() => {
				this.setState({loading: false});
			})
			.done();
		} catch (error) {
			console.log(error);
			//Toast.show({ text: "Terjadi kesalahan pada server. Mohon ulang kembali.", duration: 3000 });
			this.setState({loading: false});
		}
	}
	
	setUtamaToServer(idFoto){
		let idMonitoring = this.state.idMonitoring;
		
		if(idMonitoring){
			var formBody = {
				id_monitoring: idMonitoring,
				id_foto: idFoto,
				other: 'material'
			}
			formBody = JSON.stringify(formBody);
			console.log(formBody);

			var url = api.url + '/monitoring/set_foto_utama';
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
						Toast.show({ text: 'Foto Utama Berhasil diperbarui', duration: 3000 })
					} else {
						Toast.show({ text: responseJson.message, duration: 3000 })
					}
				})
				.catch(error => {
					console.log(error);
					Toast.show({ text: "Terjadi kesalahan pada server. Mohon ulang kembali.", duration: 3000 })
				})
				.then(() => {
					this.setState({loading: false});
				})
				.done();
			} catch (error) {
				console.log(error);
				Toast.show({ text: "Terjadi kesalahan pada server. Mohon ulang kembali.", duration: 3000 });
				this.setState({loading: false});
			}
		}
	}
	
	popultionImage(){
		let result = [];
		let base = this.state.foto;
		
		for(var i = 0; i < base.length; i++){
			var data = base[i];
			var path = data.dir_path.substring(data.dir_path.indexOf('files'));
			
			
			result.push({
				path: path,
				is_utama: data.is_foto_utama
			});
		}
		
		return result;
		
	}
	
	lihatFile = (url) => {
		if (Platform.OS === 'ios') {
			SafariView.show({
				url: url,
				fromBottom: true,
			});
		}
		else {
			Linking.openURL(url);
		}
	};
	
	// UPLOAD GAMBAR
	uploadGambar = async(metode) => {
		
		switch(metode){
			case 'camera':
				this.ambilKamera(); 
				break;
			default:
				this.ambilGaleri();
				break;
		}
	}
	
	ambilKamera = async() => {
		let check = await this.permission(); // CHECK PERMISSIONS
		if(check){
			let pickerResult = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				//aspect: [4, 3], // tentukan aspect ratio / crop
			});

			this._handleImagePicked(pickerResult);
		}
	}
	
	ambilGaleri = async () => {
		let check = await this.permission(); // CHECK PERMISSIONS
		if(check){
			let pickerResult = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				//aspect: [4, 3], // tentukan aspect ratio / crop
			});

			this._handleImagePicked(pickerResult);
		}
	};
	
	permission = async() => {
		const result = await Promise.all([
			Permissions.askAsync(Permissions.CAMERA),
			Permissions.askAsync(Permissions.CAMERA_ROLL)
		]);
		if(result.some(({status}) => status != 'granted')){
			return false;
		} else {
			return true;
		}
	}

	_handleImagePicked = async(pickerResult) => {
		let uploadResponse, uploadResult, uploadRaw;

		try {
			this.setState({ loading: true });

			if (!pickerResult.cancelled) {
				uploadResponse = await this.uploadImageAsync(pickerResult.uri);
				if (uploadResponse != null) {
                    uploadRaw = await uploadResponse;
                    uploadResult = await uploadResponse.json();
                    //console.log(uploadRaw);
                    this.pushImage(uploadResult);
                    //this.setState({ image: uploadResult.location });
                }
			}
		} catch (e) {
			console.log({ uploadResponse });
			console.log({ uploadResult });
			console.log({ e });
			this.alert('Gagal', 'Maaf, gambar gagal di upload!');
		} finally {
			this.setState({ loading: false });
		}
	};

	uploadImageAsync = async(imgUri) => {
		let apiUrl = api.url + 'monitoring/upload_file';
		let result = null;
		
        console.log('imgUri=' + imgUri);
    
        let origWidth;
        let origHeight;
        await Image.getSize(imgUri, (width, height) => {
          origWidth = width;
          origHeight = height;
          console.log('origWidth=' + origWidth);
          console.log('origHeight=' + origHeight);
        }, (error) => {
          console.error(`Couldn't get the image size: ${error.message}`);
        });
		
        if (origWidth != null && origHeight != null) {
            let ratio = 1;
            let maxWidth = 1000;
            let maxHeight = 1000;
            if (origWidth >= maxWidth || origHeight >= maxHeight) {
                if (origWidth >= origHeight) {
                    ratio = maxWidth / origWidth;
                } else {
                    ratio = maxHeight / origHeight;
                }
            }
            console.log('ratio=' + ratio);
            let newWidth = Math.round(ratio * origWidth);
            let newHeight = Math.round(ratio * origHeight);
            
            response = await ImageManipulator.manipulate(
              imgUri,
              [{ resize: { width: newWidth, height: newHeight } }],
              { compress: 0.25, format: 'png' }
            )
            .catch(error => {
              console.log(error);
              Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 3000 });
            })
            console.log('response.uri=' + response.uri);
            console.log('response.width=' + response.width);
            console.log('response.height=' + response.height);
            
            let uri = response.uri;
            if (uri != null) { 
                console.log('uri=' + uri);
                let uriParts = uri.split('.');
                let fileType = uriParts[uriParts.length - 1];
        
                let formData = new FormData();
                formData.append('file', {
                    uri,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`,
                });
                
                formData.append('section', 'MATERIAL');
        
                let options = {
                    method: 'POST',
                    body: formData,
                    headers: {
                    Accept: 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                };
                
                console.log(apiUrl);
                console.log(options);
                result = fetch(apiUrl, options);
            }
        }

        return result;
	}
	
	pushImage = async(uploadResult) => {
		let base = this.state.foto;
		
		base.push({
			dir_path: uploadResult.path,
			filepath_foto: uploadResult.webpath,
			is_foto_utama: '0'
		});
		
		this.setState({ foto: base });
	}
	

	send(){ // SUBMIT FORM
		
		if(this.state.persentase != ''){
			
			/*if(this.state.idMonitoring == '0' && !this.state.dokumen){
				Toast.show({ text: "Harap sertakan file bukti serah terima!", duration: 3000 });
				return;
			}*/
			
			var persentase = this.state.persentase;
			var fileDokumen = this.state.dokumen != false ? this.state.dokumen.substring(this.state.dokumen.indexOf('files')) : '';
			var keterangan = this.state.keterangan;
			
			var idMonitoring = this.state.idMonitoring;
			var idPenerima = this.state.penerima.id_penerima;
			var idUser = this.state.idUser;
			var idGroup = this.state.idGroup;
			
			var foto = this.popultionImage();
			
			if(idMonitoring == '0' && foto.length == 0){ Toast.show({ text: "Mohon lengkapi Form yang disajikan!", duration: 3000 }); return false; }
			
			var formBody = {
				id_monitoring: idMonitoring,
				id_penerima: idPenerima,
				persentase_progress: persentase,
				keterangan: keterangan,
				file: fileDokumen,
				id_user: idUser,
				id_group: idGroup,
				foto: foto
			}
			formBody = JSON.stringify(formBody);

			this.setState({loading: true});

			var url = api.url + '/monitoring/simpan_material';
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
						this.alert('Berhasil', 'Data progress berhasil disimpan');
						this._gobackTwice();
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
	changeUpdateSection = (index) => { this.setState({ isUpdateMaterial: (index == 3 ? true : false) }) };
	changeTabNow = (index) => { this.setState({ tabNow: index }) };
	
	createMaterialUpdate = async() => {
		this.props.navigation.navigate("DetailMaterialUpdate", {idUser: this.state.idUser, idGroup: this.state.idGroup, base: false, editable: false, idPenerima: this.state.penerima.id_penerima, idMonitoring: this.state.idMonitoring});
	}
	
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
		console.log(this.state);
		
		let data = this.state.data;
		let idx = 1;
		
		let optionPersentase = this._optionHandler(this.state.opsiPersentase); 
		let optionFoto = this._optionHandler(this.state.opsiFoto); 
		
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
							<Title>Material</Title>
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
							<DetailKondisiText style={{flex: 1}} data={this.state} loading={this.state.loading} foto={this.renderImage('base')} dokumen={this.renderFileImage('dokumenBase')} updateMaterial={this.changeUpdateSection} tabNow={this.state.tabNow} changeTabNow={ this.changeTabNow } navigation={this.props.navigation} />
						}
						
						{
							this.state.isEditable &&
							<Form>
								<View style={[{paddingHorizontal: 20, marginTop: 20, paddingBottom: 20, borderBottomWidth: 2, borderColor: '#bfbfbf'}]}>
									<View>
										<Label style={{fontSize: 15, color: 'gray', fontWeight: 'bold', marginBottom: 10}}>Persentase Progress (wajib)</Label>
										<View style={{marginVertical: 0}}>
											<ModalSelector
												data={optionPersentase}
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
															<Text>{this.state.persentaseSelected ? this.state.persentaseSelected.label : '-- Pilih Salah Satu --'}</Text>
														</Col>
														<Col size={10}>
															<Text style={{alignSelf: 'flex-end'}}><Icon name="ios-arrow-dropdown" /></Text>
														</Col>
													</Grid>
												</View>

											</ModalSelector>
										</View>
									</View>
									
									{
										this.state.opsiLainnya && 
										<Item stackedLabel style={[{marginTop: 20}]}>
											<Label style={{fontWeight: 'bold'}}>Persentase</Label>
											<Input placeholder="Masukkan Persentase Progress..." value={this.state.persentase}  onChangeText={(event) => this.setState({persentase:event})} keyboardType="phone-pad" />
										</Item>
									}
								</View>
								
								<View style={[{paddingHorizontal: 20, marginTop: 20, paddingBottom: 20, borderBottomWidth: 2, borderColor: '#bfbfbf'}]}>
									<View style={[{paddingBottom: 20}]}>
										<Label style={{fontSize: 15, color: 'gray', fontWeight: 'bold'}}>Keterangan</Label>
										<TextInput multiline = {true} numberOfLines = {8} placeholder='Masukkan Keterangan (jika ada)' onChangeText={(event) => this.setState({keterangan:event})} value={this.state.keterangan} style={styles.textarea} underlineColorAndroid='rgba(0,0,0,0)' />
									</View>
								</View>
								
								<View style={{borderBottomWidth: 2, borderColor: '#bfbfbf', paddingBottom: 20}}>
									<ListItem itemDivider style={{backgroundColor: '#bfbfbf'}}>
										<Body style={{marginLeft: -10}}>
											<Text style={{fontWeight: 'bold', textAlign: 'center', color: '#ffffff'}}>Foto Material (wajib)</Text>
										</Body>
									</ListItem>
									{
										(this.state.fotoBase && this.state.fotoBase.length > 0) &&
										<View style={{alignItems: 'center', paddingBottom: 20, borderBottomWidth: 2, borderColor: '#bfbfbf'}}>
											
											{this.renderImage('base')}
											
										</View>
									}
									{
										((!this.state.fotoBase || this.state.fotoBase.length == 0)) &&
										<View style={{paddingHorizontal: 20, paddingVertical: 30}}>
											<Text style={{textAlign: 'center', color: 'red'}}>
												Belum ada foto.
											</Text>
										</View>
									}
									
									<View style={{alignSelf: 'center', paddingVertical: 20}}>
										<ModalSelector
											data={optionFoto}
											initValue="Pilih salah satu"
											supportedOrientations={['landscape']}
											accessible={true}
											scrollViewAccessibilityLabel={'Scrollable options'}
											cancelButtonAccessibilityLabel={'Cancel Button'}
											onChange={(option)=>{ this.uploadGambar(option.value) }}
											animationType={'fade'}
											optionTextStyle={{color: 'gray'}}
											cancelText="Kembali"
											>
											
											<Button info><Text style={{color: '#ffffff'}}><Icon name="camera" style={{color: '#ffffff', fontSize: 24}} /> Upload Foto</Text></Button>
											
										</ModalSelector>
									</View>
									
									{this.renderImage('foto')}
								</View>
								
								<View style={{borderBottomWidth: 2, borderColor: '#bfbfbf', paddingBottom: 20}}>
									<ListItem itemDivider>
										<Body style={{marginLeft: -10}}>
											<Text style={{fontWeight: 'bold', textAlign: 'center'}}>File Dokumen</Text>
										</Body>
									</ListItem>
									
									{
										(this.state.dokumenBase && this.state.dokumenBase != '') &&
										<View style={{alignItems: 'center', paddingBottom: 20, borderBottomWidth: 0, borderColor: '#bfbfbf'}}>
											
											{this.renderFileImage('dokumenBase')}
											
										</View>
									}
									{
										((!this.state.dokumenBase || this.state.dokumenBase == '')) &&
										<View style={{paddingHorizontal: 20, paddingVertical: 30}}>
											<Text style={{textAlign: 'center', color: 'red'}}>
												Belum ada file.
											</Text>
										</View>
									}
									
									<View style={{alignSelf: 'center', paddingVertical: 20}}>
										<Button iconLeft light onPress={() => this.uploadFile() }><Icon name="copy" /><Text>{this.state.idMonitoring != '0' ? 'Ubah File' : 'Upload File' }</Text></Button>
									</View>
									
									{this.renderFileImage('dokumen')}
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
					(!this.state.isEditable && this.state.isAksesForEdit && !this.state.isUpdateMaterial) &&
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
				
				{
					/* // TAMBAH UPDATE MONITORING MATERIAL DETAIL -- TIDAK JADI DIGUNAKAN
					(!this.state.isEditable && this.state.isAksesForEdit && this.state.isUpdateMaterial) &&
					<View>
						<Fab
						containerStyle={{}}
						style={{ backgroundColor: "#5067FF" }}
						position="bottomRight"
						onPress={() => this.createMaterialUpdate() }
						>
							<Icon name="add" />
						</Fab>
					</View>*/
				}
			</View>
		);
	}
}

export default DetailMaterial;
