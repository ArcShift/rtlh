import React, { Component } from "react";
import { Image, AsyncStorage, Alert } from "react-native";
import {
  Content,
  View,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge
} from "native-base";
import styles from "./style";
import { activeApp } from '../../config/config';

const drawerCover = require("../../../assets/drawer-cover.png");
const datas = [
  {
    name: "Beranda",
    route: "Beranda",
    icon: "speedometer",
    icontype: "Ionicons",
    bg: "#C5F442"
  },
  {
    name: "Data Rumah",
    route: "DataRumah",
    icon: "home",
    icontype: "Ionicons",
    bg: "#C5F442",
	akses: 'data_rtlh'
  },
  {
    name: "Verifikasi",
    route: "Verifikasi",
    icon: "checkbox",
    icontype: "Ionicons",
    bg: "#477EEA",
    types: "10",
	akses: 'verifikasi_penerima_bantuan'
  },
  {
    name: "Progress Fisik",
    route: "ProgressKondisi",
    icon: "home",
    icontype: "FontAwesome",
    bg: "#477EEA",
    types: "10",
	akses: 'progress_kondisi_rumah'
  },
  {
    name: "Progress Material",
    route: "ProgressMaterial",
    icon: "account-balance",
    icontype: "MaterialIcons",
    bg: "#477EEA",
    types: "10",
	akses: 'progress_material_rumah'
  },
  {
    name: "Progress Keuangan",
    route: "ProgressKeuangan",
    icon: "local-atm",
    icontype: "MaterialIcons",
    bg: "#477EEA",
    types: "10",
	akses: 'progress_keuangan_rumah'
  },
  {
    name: "Logout",
    route: "logout",
    icon: "md-log-out",
    icontype: "Ionicons",
    bg: "#477EEA",
    types: "10"
  }
];

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4,
      name: '',
      group: '',
	  hakAkses: false,
	  
	  data: datas
    };
  }

  progress(route){
	  if(route != 'logout'){
		  this.props.navigation.navigate(route);
	  } else {
		  this.confirmLogout();
	  }
  }
  
  confirmLogout = () => {
		Alert.alert(
			'Konfirmasi',
			'Anda yakin ingin log out?',
			[
				{ text: 'Iya', onPress: () => this._logout() },
				{ text: 'Batal', onPress: () => console.log('Batal Pressed') },
			],
			{ cancelable: false }
		)
	}
	
	_logout = async() => {
		try {
			AsyncStorage.removeItem('iduser');
			AsyncStorage.removeItem('idgroup');

			this.props.screenProps.isLoggedIn();
			//this.props.navigation.navigate(data.route);
		} catch (error) {
			// nothing
		}
	}

  componentWillMount() {
    this.getUser();
  }

  getUser = async() => {
    try{
      let nama = await AsyncStorage.getItem("realname");
      let grup = await AsyncStorage.getItem("namagroup");
	  
	  if(nama == null){
		  nama = await AsyncStorage.getItem("username");
	  }
      
	  this.setState({name: nama, group: grup});
	  
	  await AsyncStorage.getItem('hak_akses').then(
	    (value) => { if(value !== null){ this.setState({hakAkses : JSON.parse(value), data: datas}); } }
	  );
    }
    catch(e){
      console.log(e);
    }
  }

  renderCover = () => {
        if (activeApp == 'pendataan') {
            return require("../../../assets/logo-pendataan/drawer-cover-2.png");
        } else {
            return require("../../../assets/logo-pemantauan/drawer-cover-2.png");
        }
  }
  
  render() {
	let drawerCover2 = this.renderCover();
	
	return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
        >
          <Image style={styles.drawerCover} source={drawerCover2} />

          <List> 
			{ 
				this.state.data.map((data, idx) => {
				
				var isAllowed = false;
				
				if(data.hasOwnProperty('akses')){
					if(this.state.hakAkses && (this.state.hakAkses.indexOf(data.akses + '.read') !== -1 || this.state.hakAkses.indexOf(data.akses + '.read own') !== -1)){
						isAllowed = true;
					}
				} else {
					isAllowed = true;
				}
				
				if(!isAllowed){ return <View key={'rdrRx' + idx} />; }
				
				return (
				  <ListItem key={'rdrRx' + idx} button noBorder onPress={() => this.progress(data.route)}>
						<Left>
						  <Icon type={data.icontype} name={data.icon} style={{ color: "#777", fontSize: 26, width: 30 }}/>
						  <Text style={styles.text}>
							{data.name}
						  </Text>
						</Left>
				  </ListItem>
				  );
				
				 
				} 
				)
			
			}
          </List>
        </Content>
      </Container>
    );
  }
}

export default SideBar;
