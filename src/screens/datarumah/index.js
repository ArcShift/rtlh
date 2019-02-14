import React, { Component } from "react";
import { api } from '../../config/config';
import { AsyncStorage, TouchableOpacity } from "react-native";
import PTRView from 'react-native-pull-to-refresh';
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
  Fab,
  List,
  ListItem,
  Text,
  Thumbnail,
  Label,
  Left,
  Body,
  Right,
  Spinner,
  Toast,
  Footer,
  FooterTab
} from "native-base";
import styles from "./styles";
import ModalSelector from 'react-native-modal-selector';
import Collapsible from 'react-native-collapsible';
import { Col, Row, Grid } from "react-native-easy-grid";

const homeImage = require("../../../assets/home.png");

class DataRumah extends Component {
  constructor(props) {
      super(props);
      this.state = {
        loading: true,
        idgroup: '',
        allowCreate: false,
        allowUpdate: false,
        dataRumah: [],
		
		idUser: false,
		idGroup: false,
		
		opsiKecamatan: false,
		opsiDesa: false,
		kecamatan: false,
		desa: false,
		nama: '',
		nik: '',
		bnba: '',
		collapsed: false,
		loaded: false
      };
      this._refresh = this._refresh.bind(this);
  }

  componentWillMount() {
    this.checkAccess();
    this.checkRole();
  }

  checkAccess = async() => {
    try{
      let group_akses = await AsyncStorage.getItem("hak_akses");
      let read = group_akses.indexOf("data_rtlh.read");
      if(read == -1) {
        Toast.show({ text: "Anda tidak memiliki hak untuk mengakses halaman ini", buttonText: "Okay", duration: 3000 });
        this.props.navigation.goBack(); 
      }
      let create = group_akses.indexOf("data_rtlh.create");
      if(create != -1) {
        this.setState({allowCreate: true});
      }
      let update = group_akses.indexOf("data_rtlh.update");
      if(update != -1) {
        this.setState({allowUpdate: true});
      }

    }
    catch(e){
      Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 3000 });
      this.props.navigation.goBack();
    }
  }

  checkRole = async() => {
    try{
      let group = await AsyncStorage.getItem("idgroup");
      this.setState({idgroup: group});
    }
    catch(e){
      Toast.show({ text: "Role User tidak ditemukan", buttonText: "Okay", duration: 3000 });
      this.props.navigation.goBack();
    }
  }
  
  getData = async() => {
	  try {
			await AsyncStorage.getItem('idgroup').then(
				(value) => { 
					
					AsyncStorage.getItem('iduser').then(
						(value2) => { 
							this.setState({idGroup: value, idUser: value2});
							this.filter(value2);
							//this.dataRumah();
						}
					);
					
				}
			);
		} catch (error) {
			console.log(error);
			
			Toast.show({ text: "Role User tidak ditemukan", duration: 3000 });
			// redirect back
			this.props.navigation.navigate("Beranda");
		}
  }

  componentDidMount() {
    this.init();
  }

  init = async() => {
	this.getData();
  }
  
  filter = async(idUser, kecamatan) => {
		var baseUrl = api.url + "data_rumah/filter";
		var url = baseUrl;

		if(!idUser){
			idUser = this.state.idUser;
		}

		if(idUser){
			url += "?id_user=" + idUser;
		}
		
		if(kecamatan){
			if(url == baseUrl){
				url += '?';
			} else {
				url += '&';
			}
			
			url += 'kecamatan=' + kecamatan;
			
			this.setState({opsiDesa: [], desa: false});
		}
		
		console.log(url);
		
		try {
			await fetch(url, {  
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}
			})
            .then(response => response.text())
            .then(body => {
                console.log(body);
                var responseJson = JSON.parse(body);
                console.log(responseJson);
				
				if(responseJson.hasOwnProperty('code')){
					if(responseJson.code == '200'){
						var data = [];
						var lgt = responseJson.data.length;
						
						for(var i = 0; i < lgt; i++){
							var dt = responseJson.data[i];
							
							data.push({
								label: dt['nama'],
								value: dt['id_skpd']									
							});
						}
						
						if(!kecamatan){ // KECAMATAN
							this.setState({opsiKecamatan: data});
							Toast.show({ text: "Silahkan Pilih Lokasi Terlebih Dahulu", duration: 5000 });
						} else { // DESA
							this.setState({opsiDesa: data});
						}
							
						//this.setState({collapsed: true}); // COLLAPSE
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

  dataRumah = async () => {
	var baseUrl = api.url + "data_rumah/data";
	var url = baseUrl;
	
	if(this.state.idUser){
		url += "?id_user=" + this.state.idUser;
	}
	
	if(this.state.kecamatan){
		if(url == baseUrl){
			url += '?';
		} else {
			url += '&';
		}
		
		url += 'kecamatan=' + this.state.kecamatan.value;
	}
	
	if(this.state.desa){
		if(url == baseUrl){
			url += '?';
		} else {
			url += '&';
		}
		
		url += 'desa=' + this.state.desa.value;
	}
	
	if(this.state.nama){
		if(url == baseUrl){
			url += '?';
		} else {
			url += '&';
		}
		
		url += 'nama=' + this.state.nama;
	}
	
	if(this.state.nik){
		if(url == baseUrl){
			url += '?';
		} else {
			url += '&';
		}
		
		url += 'nik=' + this.state.nik;
	}
	
	if(this.state.bnba){
		if(url == baseUrl){
			url += '?';
		} else {
			url += '&';
		}
		
		url += 'bnba=' + this.state.bnba;
	}
	
	console.log(url);
	
	fetch(url , {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.text())
    .then(body => {
      console.log(body);
      var jsonResp = JSON.parse(body);
      console.log(jsonResp);
      if (jsonResp.message == 'success') {
          this.setState({dataRumah: jsonResp.data});
		  if(jsonResp.data.length > 0){
			  this.setState({collapsed: true});
		  }
        }
      })
      .catch(error => {
        console.warn(error)
        Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 3000 });
      })
      .then(() => {
        this.setState({loading: false});
      })
      .done();
  }

  actRedirect(act, id = false) {
    let idgroup = this.state.idgroup;
    let routeCE,routeDetail = '';
    if(idgroup == 10 || idgroup == 11) {
      routeCE = "DataRumahKadesCE";
      routeDetail = "DataRumahKadesDetail";
    } else {
      routeCE = "DataRumahCE";
      routeDetail = "DataRumahDetail";
    }
    if(act == 'create') {
      this.props.navigation.navigate(routeCE, { id_user: this.state.idUser, refresh: this._refresh });
    } else if(act == 'edit') {
      this.props.navigation.navigate(routeCE, { dataId: id, id_user: this.state.idUser, refresh: this._refresh });
    } else if(act == 'detail') {
      this.props.navigation.navigate(routeDetail, { dataId: id, id_user: this.state.idUser });
    }
  }

  _refresh() {
    return new Promise((resolve) => {
      setTimeout(()=>{
        // some refresh process should come here
        this.dataRumah();
        resolve(); 
      }, 2000)
    });
  }
  
	changeOption(data, section){
		switch(section){
			case 'kecamatan':
				this.setState({kecamatan: data});
				this.filter(this.state.idUser, data.value);
				break;
			case 'desa':
				this.setState({desa: data});
				break;
		}
	}
	
	find(){
		this.setState({loaded: true, loading: true, dataRumah: []});
		this.dataRumah();
	}

  render() {
	let optionKecamatan = this._optionHandler(this.state.opsiKecamatan);
	let optionDesa = this._optionHandler(this.state.opsiDesa);
	//console.log("this.state.allowCreate=" + this.state.allowCreate);
	//console.log("this.state.allowUpdate=" + this.state.allowUpdate);
	
	// data rumah
    var dr = this.state.dataRumah;
    if(this.state.loading) {
      return (
        <Container style={styles.container}>
          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back"/>
              </Button>
            </Left>
            <Body>
            <Title>Data Rumah</Title>
            </Body>
            <Right/>
          </Header>
          <Content><Spinner color="blue"/></Content>
        </Container>
      );
    } else {
      return (
        <Container style={styles.container}>
          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back"/>
              </Button>
            </Left>
            <Body>
            <Title>Data Rumah</Title>
            </Body>
            {!this.state.allowCreate && <Right/>}
            {this.state.allowCreate && 
              <Right>
                <Button transparent>
                  <Icon name='add' onPress={() => this.actRedirect('create')}/>
                </Button>
              </Right>}
          </Header>

          <PTRView onRefresh={this._refresh} >
          <Content>
			
			<Collapsible collapsed={this.state.collapsed}>
				<View style={[{paddingHorizontal: 10, marginTop: 20, borderBottomWidth: 2, borderColor: '#bfbfbf'}]}>
					<Text rkType='secondary6 hintColor' style={{alignSelf: 'flex-start', fontWeight: 'bold', marginTop: 10}}>Kecamatan *</Text>
					<View style={{marginVertical: 10}}>
						<ModalSelector
							data={optionKecamatan}
							initValue="Pilih salah satu"
							supportedOrientations={['landscape']}
							accessible={true}
							scrollViewAccessibilityLabel={'Scrollable options'}
							cancelButtonAccessibilityLabel={'Cancel Button'}
							onChange={(option)=>{ this.changeOption(option, 'kecamatan') }}
							animationType={'fade'}
							optionTextStyle={{color: 'gray'}}
							cancelText="Kembali"
							disabled={(this.state.opsiKecamatan.length <= 0)}
							>
							
							<View style={{borderWidth:1, borderColor:'#ccc', padding:10, backgroundColor: (this.state.opsiKecamatan && this.state.opsiKecamatan.length > 0 ? '#ffffff' : '#dfdfdf'), borderRadius: 5}}>
								<Grid>
									<Col size={90}>
										<Text>{this.state.kecamatan ? this.state.kecamatan.label : '-- Pilih Salah Satu --'}</Text>
									</Col>
									<Col size={10}>
										<Text style={{alignSelf: 'flex-end'}}><Icon name="ios-arrow-dropdown" /></Text>
									</Col>
								</Grid>
							</View>

						</ModalSelector>
					</View>
					
					<Text rkType='secondary6 hintColor' style={{alignSelf: 'flex-start', fontWeight: 'bold', marginTop: 10}}>Kelurahan/Desa</Text>
					<View style={{marginVertical: 10}}>
						<ModalSelector
							data={optionDesa}
							initValue="Pilih salah satu"
							supportedOrientations={['landscape']}
							accessible={true}
							scrollViewAccessibilityLabel={'Scrollable options'}
							cancelButtonAccessibilityLabel={'Cancel Button'}
							onChange={(option)=>{ this.changeOption(option, 'desa') }}
							animationType={'fade'}
							optionTextStyle={{color: 'gray'}}
							cancelText="Kembali"
							disabled={(!this.state.kecamatan || this.state.opsiDesa.length <= 0)}
							>
							
							<View style={{borderWidth:1, borderColor:'#ccc', padding:10, backgroundColor: (this.state.kecamatan && this.state.opsiDesa.length > 0 ? '#ffffff' : '#dfdfdf'), borderRadius: 5}}>
								<Grid>
									<Col size={90}>
										<Text>{this.state.desa ? this.state.desa.label : '-- Pilih Salah Satu --'}</Text>
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
					  <Input placeholder="Masukkan Nama Penerima bantuan..." value={this.state.nama}  onChangeText={(event) => { this.setState({nama:event}); } } disabled={!this.state.kecamatan} />
					</Item>
					
					<Item stackedLabel style={{marginVertical: 10}}>
					  <Label style={{fontWeight: 'bold', color: '#000'}}>NIK Penerima Bantuan</Label>
					  <Input placeholder="Masukkan NIK Penerima bantuan..." value={this.state.nik}  onChangeText={(event) => { this.setState({nik:event}); } } disabled={!this.state.kecamatan} />
					</Item>
					
					<Item stackedLabel style={{marginVertical: 10}}>
					  <Label style={{fontWeight: 'bold', color: '#000'}}>Nomor BNBA</Label>
					  <Input placeholder="Nomor BNBA..." value={this.state.bnba} onChangeText={(event) => { this.setState({bnba:event}); } } disabled={!this.state.kecamatan} />
					</Item>
					
					<View style={{marginVertical: 10}}>
						<Button block onPress={() => { this.find() }} disabled={!this.state.kecamatan}>
							<Text>Tampilkan</Text>
						</Button>
					</View>
				</View>
			</Collapsible>
			
			{
						(this.state.collapsed || this.state.dataRumah.length > 0) &&
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
				((this.state.loaded) && this.state.dataRumah.length == 0) &&
				<View style={{paddingHorizontal: 20, paddingVertical: 50, alignItems: 'center', justifyContent: 'center'}}>
					<Text style={{color: 'red', textAlign: 'center'}}>
						Tidak ditemukan data Rumah
					</Text>
				</View>
			}
			
			<List
              dataArray={dr}
              renderRow={data =>
                <ListItem thumbnail onPress={() => this.actRedirect('detail', data.id_data)}>
                  <Left>
                    <Thumbnail square size={55} source={homeImage} style={{justifyContent: 'center'}}/>
                  </Left>
                  <Body style={{paddingBottom: 0}}>
                  <Text>
                    {data.nama_penerima_bantuan}
                  </Text>
                  <Text numberOfLines={1} note>
                    {data.alamat_rumah}
                  </Text>
                  {this.state.allowUpdate && 
                    <View style={{flexDirection: "row"}}>
                      <Button small transparent info style={[styles.btnAct]} onPress={() => this.actRedirect('edit', data.id_data)}>
                        <Text>EDIT</Text>
                      </Button>
                    </View>}
                  </Body>
                  <Right>
                    <Icon name="arrow-forward"/>
                  </Right>
                </ListItem>}
            />
          </Content>
          </PTRView>
          {this.state.allowCreate && 
            <Footer>
              <FooterTab>
                <Button onPress={() => this.actRedirect('create')}>
                  <Icon name="add"/>
                  <Text>Tambah Data</Text>
                </Button>
              </FooterTab>
            </Footer>}
        </Container>
      );
    }
  }
}

export default DataRumah;
