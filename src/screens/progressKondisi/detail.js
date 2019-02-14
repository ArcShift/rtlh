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
	DeviceEventEmitter
} from "react-native";
import Exponent, { Constants, ImagePicker, registerRootComponent, Permissions, ImageManipulator } from 'expo';
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
  Label,
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
import DetailKondisiText from "./detailText";
import {openURL} from "../../config/helpers";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const radio_props = [
  {label: 'Ya', value: 'Ya' },
  {label: 'Tidak', value: 'Tidak' }
];

class DetailKondisi extends Component {
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
			
			kiriBase: [],
			kananBase: [],
			depanBase: [],
			dalamBase: [],
			kiri: [],
			kanan: [],
			depan: [],
			dalam: [],
			persentase: '',
			isResmi: '',
			atap: '',
			lantai: '',
			dinding: '',
			keterangan: '',
			idMonitoring: '0',
			
			idUser: idUser,
			idGroup: idGroup,
			opsiPersentase: false,
			opsiLainnya: false,
			persentaseSelected: false,
			
			opsiFoto: [{label: 'Ambil dari Kamera', value: 'camera'}, {label: 'Pilih dari Galeri', value: 'gallery'}],
			isEditable: true,
			isAksesForEdit: editable
        };
    }
	
	componentDidMount() {
		this.init();
	}
	
	componentWillUnmount() {
		DeviceEventEmitter.emit('refreshKondisi',  {});
	}
	
	init(){
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
				keterangan: data.keterangan,
				idMonitoring: data.id_monitoring,
				atap: data.atap,
				lantai: data.lantai,
				dinding: data.dinding,
				kiriBase: data.foto_kiri,
				kananBase: data.foto_kanan,
				depanBase: data.foto_depan,
				dalamBase: data.foto_dalam,
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
		var jenis = this.state.penerima.jenis_kegiatan;
		console.log("this.state.penerima.jenis_kegiatan=" + this.state.penerima.jenis_kegiatan);
		
		if (jenis == 'GAKIN'){
			opsi.push({label: '0', value: '0'});
			opsi.push({label: '25', value: '25'});
			opsi.push({label: '50', value: '50'});
			opsi.push({label: '75', value: '75'});
			opsi.push({label: '100', value: '100'});
			
			// UNTUK MATERIAL GUNAKAN :
			// opsi.push({label: '50', value: '50'});
			// opsi.push({label: '100', value: '100'});
			
		} else {
			opsi.push({label: '0', value: '0'});
			opsi.push({label: '30', value: '30'});
			opsi.push({label: '100', value: '100'});
			
			// UNTUK MATERIAL GUNAKAN :
			// opsi.push({label: '50', value: '50'});
			// opsi.push({label: '100', value: '100'});
		}
		
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
	
	
	// UPLOAD GAMBAR
	uploadGambar = async(perspektif, metode) => {
		
		switch(metode){
			case 'camera':
				this.ambilKamera(perspektif); // PERSPEKTIF DISINI ADL PERSP. FOTO MONITORING KONDISI RUMAH ('KIRI','KANAN','DEPAN','DALAM')
				break;
			default:
				this.ambilGaleri(perspektif);
				break;
		}
	}
	
	ambilKamera = async(perspektif) => {
		let check = await this.permission(); // CHECK PERMISSIONS
		if(check){
			let pickerResult = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				//aspect: [4, 3], // tentukan aspect ratio / crop
			});

			this._handleImagePicked(pickerResult, perspektif);
		}
	}
	
	ambilGaleri = async (perspektif) => {
		let check = await this.permission(); // CHECK PERMISSIONS
		if(check){
			let pickerResult = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				//aspect: [4, 3], // tentukan aspect ratio / crop
			});

			this._handleImagePicked(pickerResult, perspektif);
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

	_handleImagePicked = async(pickerResult, perspektif) => {
		let uploadResponse, uploadResult, uploadRaw;

		try {
			this.setState({ loading: true });

			if (!pickerResult.cancelled) {
				uploadResponse = await this.uploadImageAsync(pickerResult.uri, perspektif);
				//console.log('uploadResponse=' + uploadResponse);
				if (uploadResponse != null) {
                    uploadRaw = await uploadResponse;
                    uploadResult = await uploadResponse.json();
                    //console.log(uploadRaw);
                    this.pushImage(uploadResult, perspektif);
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

	uploadImageAsync = async(imgUri, perspektif) => {
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
                
                formData.append('section', 'KONDISI');
                formData.append('perspektif', perspektif);
        
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
	
	pushImage = async(uploadResult, perspektif) => {
		let base = this.state.kiri;
		switch(perspektif){
			case 'kanan':
				base = this.state.kanan;
				break;
			case 'depan':
				base = this.state.depan;
				break;
			case 'dalam':
				base = this.state.dalam;
				break;
			default:
				break;
		}
		
		base.push({
			dir_path: uploadResult.path,
			filepath_foto: uploadResult.webpath,
			is_foto_utama: '0'
		});
		
		switch(perspektif){
			case 'kanan':
				this.setState({ kanan: base });
				break;
			case 'depan':
				this.setState({ depan: base });
				break;
			case 'dalam':
				this.setState({ dalam: base });
				break;
			case 'kiri':
				this.setState({ kiri: base });
				break;
			default:
				break;
		}
	}
	
	renderImage = (perspektif) => {
		let base = this.state.kiri;
		switch(perspektif){
			case 'kanan':
				base = this.state.kanan;
				break;
			case 'depan':
				base = this.state.depan;
				break;
			case 'dalam':
				base = this.state.dalam;
				break;
			case 'kiriBase':
				base = this.state.kiriBase;
				break;
			case 'kananBase':
				base = this.state.kananBase;
				break;
			case 'depanBase':
				base = this.state.depanBase;
				break;
			case 'dalamBase':
				base = this.state.dalamBase;
				break;
			default:
				break;
		}
		
		if (!base || base.length == 0) {
			return;
		}
		
		let dataImage = base.map((val, idx) => {
			var key = perspektif + (Math.floor(Math.random() * 100) + idx);
			
			return (
				<View key={{key}}
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
					onPress = {() => openURL(val.filepath_foto) }
					>
						<Image source={{ uri: val.filepath_foto }} style={{ width: 250, height: 200 }} />
					</TouchableOpacity>

					{
						this.state.isEditable &&
						<View>
							<View style={{marginTop: 10, paddingHorizontal: 10}}>
								<Button block info onPress={() => { this.setGambar(val, perspektif) }} disabled={(("is_foto_utama" in val) && val.is_foto_utama == '1')} ><Text><Icon name="checkmark" style={{fontSize: 22, color: '#ffffff'}} /> { ("is_foto_utama" in val) && val.is_foto_utama == '1' ? 'Foto Utama' : 'Jadikan Utama' } </Text></Button>
							</View>
							
							<View style={{marginTop: 10, paddingHorizontal: 10, marginBottom: 10}}>
								<Button block danger onPress={() => { this.hapusGambar(val, perspektif) }} ><Text><Icon name="ios-trash" style={{fontSize: 22, color: '#ffffff'}} /> Hapus Foto</Text></Button>
							</View>
						</View>
					}
					
				</View>
			);
		});

		var keyParent = perspektif + (Math.floor(Math.random() * 100) + 1);
		
		return (
			<View key={{keyParent}} style={{ alignItems: 'center' }}>
				{dataImage}
			</View>
		);
	};
	
	setGambar = (value, perspektif) => {
		console.log(perspektif);
		this.setState({loading: true});
		
		let base = this.state.kiriBase;
		let temp = this.state.kiri;
		
		switch(perspektif){
			case 'kanan':
			case 'kananBase':
				base = this.state.kananBase;
				temp = this.state.kanan;
				break;
			case 'depan':
			case 'depanBase':
				base = this.state.depanBase;
				temp = this.state.depan;
				break;
			case 'dalam':
			case 'dalamBase':
				base = this.state.dalamBase;
				temp = this.state.dalam;
				break;
			default:
				break;
		}
		
		let isEdit = false;
		
		switch(perspektif){
			case 'kiriBase':
			case 'kananBase':
			case 'depanBase':
			case 'dalamBase':
				isEdit = true;
				break;
			default:
				break;
		}
		
		let replaceBase = [];
		let replaceTemp = [];
		
		if(isEdit){
			
			for(var i = 0; i < base.length; i++){
				var data = base[i];
				
				var isUtama = '0';
				
				console.log(value.id_foto);
				console.log(data.id_foto);
				if(value.id_foto == data.id_foto){
					isUtama = '1';
					
					// UPDATE TO SERVER
					this.setUtamaToServer(value.id_foto);
				}
				
				replaceBase.push({
					filepath_foto: data.filepath_foto,
					id_foto: data.id_foto,
					is_foto_utama: isUtama,
					perspektif: data.perspektif
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
					perspektif: data.perspektif
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
		
		switch(perspektif){
			case 'kanan':
			case 'kananBase':
				this.setState({kananBase: replaceBase, kanan: replaceTemp});
				break;
			case 'depan':
			case 'depanBase':
				this.setState({depanBase: replaceBase, depan: replaceTemp});
				break;
			case 'dalam':
			case 'dalamBase':
				this.setState({dalamBase: replaceBase, dalam: replaceTemp});
				break;
			default:
				this.setState({kiriBase: replaceBase, kiri: replaceTemp});
				break;
		}
		
		this.setState({loading: false});
	}
	
	hapusGambar = (value, perspektif) => {
		
		this.setState({loading: true});
		
		let isEdit = false;
		let base = this.state.kiri;
		switch(perspektif){
			case 'kanan':
				base = this.state.kanan;
				break;
			case 'depan':
				base = this.state.depan;
				break;
			case 'dalam':
				base = this.state.dalam;
				break;
			case 'kiriBase':
				base = this.state.kiriBase;
				isEdit = true;
				break;
			case 'kananBase':
				base = this.state.kananBase;
				isEdit = true;
				break;
			case 'depanBase':
				base = this.state.depanBase;
				isEdit = true;
				break;
			case 'dalamBase':
				base = this.state.dalamBase;
				isEdit = true;
				break;
			default:
				break;
		}
		
		let replace = [];
		
		for(var i = 0; i < base.length; i++){
			var data = base[i];
			
			console.log(value.filepath_foto);
			console.log(data.filepath_foto);
			if(value.filepath_foto != data.filepath_foto){
				
				if(isEdit){
					replace.push({
						filepath_foto: data.filepath_foto,
						id_foto: data.id_foto,
						is_foto_utama: data.is_foto_utama,
						perspektif: data.perspektif
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
				
		console.log(path);
		
		// UPDATE TO SERVER
		this.hapusInServer(path);
		
		switch(perspektif){
			case 'kanan':
				this.setState({kanan: replace, loading: false});
				break;
			case 'depan':
				this.setState({depan: replace, loading: false});
				break;
			case 'dalam':
				this.setState({dalam: replace, loading: false});
				break;
			case 'kiriBase':
				this.setState({kiriBase: replace, loading: false});
				break;
			case 'kananBase':
				this.setState({kananBase: replace, loading: false});
				break;
			case 'depanBase':
				this.setState({depanBase: replace, loading: false});
				break;
			case 'dalamBase':
				this.setState({dalamBase: replace, loading: false});
				break;
			default:
				this.setState({kiri: replace, loading: false});
				break;
		}
		
	}

	hapusInServer(path){
		if(!path || path == ''){
			return;
		}
		
		this.setState({loading: true});
		
		path = path.substring(path.indexOf('files'));
		
		var formBody = {
			path: path
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
				id_foto: idFoto
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
	
	popultionImage(perspektif){
		let result = [];
		let base = this.state.kiri;
		
		switch(perspektif){
			case 'kanan':
				base = this.state.kanan;
				break;
			case 'depan':
				base = this.state.depan;
				break;
			case 'dalam':
				base = this.state.dalam;
				break;
			default:
				break;
		}
		
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

	send(){ // SUBMIT FORM
		
		if(this.state.persentase != '' && this.state.atap != '' && this.state.lantai != '' && this.state.dinding != ''){
			
			if(this.state.idMonitoring == '0' && (this.state.kiri.length == 0 && this.state.kanan.length == 0 && this.state.depan.length == 0 && this.state.dalam.length == 0)){
				Toast.show({ text: "Harap sertakan foto kondisi rumah!", duration: 3000 });
				return;
			}
			
			var fotoKiri = this.popultionImage('kiri');
			var fotoKanan = this.popultionImage('kanan');
			var fotoDepan = this.popultionImage('depan');
			var fotoDalam = this.popultionImage('dalam');
			var persentase = this.state.persentase;
			var atap = this.state.atap;
			var lantai = this.state.lantai;
			var dinding = this.state.dinding;
			var keterangan = this.state.keterangan;
			
			var idMonitoring = this.state.idMonitoring;
			var idPenerima = this.state.penerima.id_penerima;
			var idUser = this.state.idUser;
			var idGroup = this.state.idGroup;
			
			var formBody = {
				id_monitoring: idMonitoring,
				id_penerima: idPenerima,
				persentase_progress: persentase,
				atap: atap,
				lantai: lantai,
				dinding: dinding,
				keterangan: keterangan,
				foto_kiri: fotoKiri,
				foto_kanan: fotoKanan,
				foto_depan: fotoDepan,
				foto_dalam: fotoDalam,
				id_user: idUser,
				id_group: idGroup,
			}
			formBody = JSON.stringify(formBody);

			this.setState({loading: true});

			var url = api.url + '/monitoring/simpan_kondisi';
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
				})
                .then(response => response.text())
                .then(body => {
                    console.log(body);
                    var responseJson = JSON.parse(body);
					console.log(responseJson);
					
					if (responseJson.hasOwnProperty('code') && (responseJson.code == '200' || responseJson.code == '201')){
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
		
		/*const {goBack} = this.props.navigation;
		goBack();
		setTimeout(function(){ goBack() }, 100);*/
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
	
	
	changeEditable = () => { this.setState({ isEditable: !this.state.isEditable }) };
	
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
							<Title>Kondisi Fisik</Title>
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
							<DetailKondisiText style={{flex: 1}} data={this.state} loading={this.state.loading} kiri={this.renderImage('kiriBase')} kanan={this.renderImage('kananBase')} depan={this.renderImage('depanBase')} dalam={this.renderImage('dalamBase')} />
						}
						
						{
							this.state.isEditable &&
							<Form>
								<View style={[{paddingHorizontal: 20, marginTop: 20, paddingBottom: 20, borderBottomWidth: 2, borderColor: '#bfbfbf'}]}>
									<View>
										<Label style={{fontSize: 15, color: 'gray', fontWeight: 'bold', marginBottom: 10}}>Persentase Progress</Label>
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
								
								<ListItem itemDivider>
									<Body style={{marginLeft: -10}}>
										<Text style={{fontWeight: 'bold', textAlign: 'center'}}>Kondisi Rumah</Text>
									</Body>
								</ListItem>
								
								<View style={[{paddingHorizontal: 20, marginTop: 20, paddingBottom: 40, borderBottomWidth: 2, borderColor: '#bfbfbf'}]}>
									<Item stackedLabel>
										<Label style={{fontWeight: 'bold'}}>Kondisi Atap</Label>
										<Input placeholder="Masukkan Kondisi Atap..." value={this.state.atap} onChangeText={(event) => this.setState({atap:event})} />
									</Item>
									
									<Item stackedLabel style={[{marginTop: 20}]}>
										<Label style={{fontWeight: 'bold'}}>Kondisi Lantai</Label>
										<Input placeholder="Masukkan Kondisi Lantai..." value={this.state.lantai}  onChangeText={(event) => this.setState({lantai:event})} />
									</Item>
									
									<Item stackedLabel style={[{marginTop: 20}]}>
										<Label style={{fontWeight: 'bold'}}>Kondisi Dinding</Label>
										<Input placeholder="Masukkan Kondisi Dinding..." value={this.state.dinding}  onChangeText={(event) => this.setState({dinding:event})} />
									</Item>
									
									<View style={[{marginTop: 20}]}>
										<Label style={{fontSize: 15, color: 'gray', fontWeight: 'bold'}}>Temuan</Label>
										<TextInput multiline = {true} numberOfLines = {8} placeholder='Masukkan Temuan (jika ada)' onChangeText={(event) => this.setState({keterangan:event})} value={this.state.keterangan} style={styles.textarea} underlineColorAndroid='rgba(0,0,0,0)' />
									</View>
									
								</View>
								
								<View style={{borderBottomWidth: 2, borderColor: '#bfbfbf', paddingBottom: 20}}>
									<ListItem itemDivider style={{backgroundColor: '#bfbfbf'}}>
										<Body style={{marginLeft: -10}}>
											<Text style={{fontWeight: 'bold', textAlign: 'center', color: '#ffffff'}}>Foto Tampak Kiri</Text>
										</Body>
									</ListItem>
									{
										(this.state.kiriBase && this.state.kiriBase.length > 0) &&
										<View style={{alignItems: 'center', paddingBottom: 20, borderBottomWidth: 2, borderColor: '#bfbfbf'}}>
											
											{this.renderImage('kiriBase')}
											
										</View>
									}
									{
										((!this.state.kiriBase || this.state.kiriBase.length == 0)) &&
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
											onChange={(option)=>{ this.uploadGambar('kiri', option.value) }}
											animationType={'fade'}
											optionTextStyle={{color: 'gray'}}
											cancelText="Kembali"
											>
											
											<Button success><Text style={{color: '#ffffff'}}><Icon name="camera" style={{color: '#ffffff', fontSize: 24}} /> Upload Foto Kiri</Text></Button>
											
										</ModalSelector>
									</View>
									
									{this.renderImage('kiri')}
								</View>
								
								<View style={{borderBottomWidth: 2, borderColor: '#bfbfbf', paddingBottom: 20}}>
									<ListItem itemDivider style={{backgroundColor: '#bfbfbf'}}>
										<Body style={{marginLeft: -10}}>
											<Text style={{fontWeight: 'bold', textAlign: 'center', color: '#ffffff'}}>Foto Tampak Kanan</Text>
										</Body>
									</ListItem>
									{
										(this.state.kananBase && this.state.kananBase.length > 0) &&
										<View style={{alignItems: 'center', paddingBottom: 20, borderBottomWidth: 2, borderColor: '#bfbfbf'}}>
											
											{this.renderImage('kananBase')}
											
										</View>
									}
									{
										((!this.state.kananBase || this.state.kananBase.length == 0)) &&
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
											onChange={(option)=>{ this.uploadGambar('kanan', option.value) }}
											animationType={'fade'}
											optionTextStyle={{color: 'gray'}}
											cancelText="Kembali"
											>
											
											<Button warning><Text style={{color: '#ffffff'}}><Icon name="camera" style={{color: '#ffffff', fontSize: 24}} /> Upload Foto Kanan</Text></Button>
											
										</ModalSelector>
									</View>
									
									{this.renderImage('kanan')}
								</View>
								
								<View style={{borderBottomWidth: 2, borderColor: '#bfbfbf', paddingBottom: 20}}>
									<ListItem itemDivider style={{backgroundColor: '#bfbfbf'}}>
										<Body style={{marginLeft: -10}}>
											<Text style={{fontWeight: 'bold', textAlign: 'center', color: '#ffffff'}}>Foto Tampak Depan</Text>
										</Body>
									</ListItem>
									{
										(this.state.depanBase && this.state.depanBase.length > 0) &&
										<View style={{alignItems: 'center', paddingBottom: 20, borderBottomWidth: 2, borderColor: '#bfbfbf'}}>
											
											{this.renderImage('depanBase')}
											
										</View>
									}
									{
										((!this.state.depanBase || this.state.depanBase.length == 0)) &&
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
											onChange={(option)=>{ this.uploadGambar('depan', option.value) }}
											animationType={'fade'}
											optionTextStyle={{color: 'gray'}}
											cancelText="Kembali"
											>
											
											<Button info><Text style={{color: '#ffffff'}}><Icon name="camera" style={{color: '#ffffff', fontSize: 24}} /> Upload Foto Depan</Text></Button>
											
										</ModalSelector>
									</View>
									
									{this.renderImage('depan')}
								</View>
								
								<View style={{borderBottomWidth: 2, borderColor: '#bfbfbf', paddingBottom: 20}}>
									<ListItem itemDivider style={{backgroundColor: '#bfbfbf'}}>
										<Body style={{marginLeft: -10}}>
											<Text style={{fontWeight: 'bold', textAlign: 'center', color: '#ffffff'}}>Foto Tampak Dalam</Text>
										</Body>
									</ListItem>
									{
										(this.state.dalamBase && this.state.dalamBase.length > 0) &&
										<View style={{alignItems: 'center', paddingBottom: 20, borderBottomWidth: 2, borderColor: '#bfbfbf'}}>
											
											{this.renderImage('dalamBase')}
											
										</View>
									}
									{
										((!this.state.dalamBase || this.state.dalamBase.length == 0)) &&
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
											onChange={(option)=>{ this.uploadGambar('dalam', option.value) }}
											animationType={'fade'}
											optionTextStyle={{color: 'gray'}}
											cancelText="Kembali"
											>
											
											<Button success><Text style={{color: '#ffffff'}}><Icon name="camera" style={{color: '#ffffff', fontSize: 24}} /> Upload Foto Dalam</Text></Button>
											
										</ModalSelector>
									</View>
									
									{this.renderImage('dalam')}
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

export default DetailKondisi;
