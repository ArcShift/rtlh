import React, { Component } from "react";
import { api, activeApp, appName } from '../../config/config';
import { Image, Keyboard, AsyncStorage, Dimensions } from "react-native";
import {
  Container,
  View,
  Header,
  Title,
  Content,
  Button,
  Item,
  Label,
  Input,
  Body,
  Left,
  Right,
  Icon,
  Form,
  Text,
  Toast,
  ActionSheet,
  Footer,
  FooterTab
} from "native-base";
import styles from "./styles";
import Spinner from 'react-native-loading-spinner-overlay';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      username: '',
      password: '',
      isLoggingIn: false,
      hidePassword: true,
      iconPassword: 'eye-off',
      api: '',
	  
	  loading: false
    };
  }

  componentWillMount() {
    this.setState({api: api.url});
  }

  _togglePassword = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
    if(this.state.hidePassword) {
      this.setState({iconPassword: 'eye'});
    } else {
      this.setState({iconPassword: 'eye-off'});
    }
  }

  _userLogin = () => { 
    Keyboard.dismiss();
    this.setState({isLoggingIn: true, loading: true});
    if(this.state.username != '' && this.state.password != ''){
      var formBody = {
        username: this.state.username,
        password: this.state.password,
        app_name: activeApp
      }
      
	  console.log(api.url + "auth/login");
	  
	  //formBody = JSON.stringify(formBody);
      console.log(JSON.stringify(formBody));

      var proceed = false;
      var userdata = {};
      try {
        fetch(api.url + "auth/login", {
              method: "POST", 
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',},
              body: JSON.stringify(formBody)
            })
            .then((response) => { console.log(response); return response.json(); } )
            .then((response) => {
              console.log(response);
			  
			  if (response.message == 'success') {
                userdata = response.data;
                proceed = true;
              } else {
                Toast.show({ text: response.message, duration: 3000 })
              }
            })
            .catch(error => {
              console.log(error)
              Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", duration: 3000 })
            })
            .then(() => {
              this.setState({isLoggingIn: false, loading: false});
              if(proceed) {
                this._userRedirect(userdata);
              }
            })
            .done();
      } catch (error) {
        Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", duration: 3000 });
        this.setState({isLoggingIn: false});
      }
    } else {
      Toast.show({ text: "Mohon lengkapi data!", duration: 3000 });
      this.setState({isLoggingIn: false, loading: false});
    }
  }

  _userRedirect = (userdata) => {
    if(!userdata.groupoption) {
	  this._setUserData(userdata);
    } else {
	  var BUTTONS = [];
      userdata.usergroup.map((item, key) => (
        BUTTONS.push({ text: item.nama_group, icon: "person", iconColor: "#2c8ef4"})
      ));
      BUTTONS.push({ text: "Batal", icon: "close", iconColor: "#fa213b" });
      var CANCEL_INDEX = BUTTONS.length - 1;
      ActionSheet.show(
        {
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX,
          title: "Pilih role"
        },
        onSelect = (index) => {
          if(index != CANCEL_INDEX) {
            this._setUserData(userdata, userdata.usergroup[index]);
          }
        }
      )
    }
  }

  _setUserData = (data, group = null) => {
	// data user
    AsyncStorage.multiSet([
      ["iduser", data.id_user],
      ["username", data.username],
      ["realname", data.realname],
      ["email", data.email]
    ]);

    // data group
    if(!data.groupoption) {
      group = data;
    }
    AsyncStorage.multiSet([
      ["idgroup", group.id_group],
      ["namagroup", group.nama_group],
      ["keterangan", group.keterangan],
      ["hak_akses", JSON.stringify(group.hak_akses)]
    ]);
  
    Toast.show({ text: "Login berhasil", duration: 3000 });
	  this.props.screenProps.isLoggedIn();

    // redirect
    //this.props.navigation.navigate("Beranda");
  }
  
  renderBg = () => {
		let width = Dimensions.get('window').width;
		let height = Dimensions.get('window').height - 25;
		
		let image = (<Image style={[styles.imageBG, {width, height}]}
			source={require('../../../assets/login-bg.jpg')}/>);

		return image;
	}

  render() {
	let bg = this.renderBg();
	let cardImage;
	if (activeApp == 'pendataan') {
	    cardImage = require("../../../assets/logo-pendataan/logo-login-2.png");
	} else {
		cardImage = require("../../../assets/logo-pemantauan/logo-login-2.png");
    }	    
	
	return (
      <Container style={styles.container}>
        <Content>
          {
			(this.state.loading) && 
				<View style={{paddingHorizontal: 1, alignItems: 'center'}} >
					<Spinner animation={'fade'} color={'white'} visible={this.state.loading} textContent={"Harap tunggu..."} textStyle={{color: '#FFF'}} />
				</View>
		  }
		  
			{bg}
		  <View style={styles.outsideBG}>
		  
			  {
			    (activeApp == 'pendataan') &&
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20}}>
                    <Image style={{ width: 200, height: 258 }} source={cardImage}/>
                </View>
			  }
			  {
			    (activeApp == 'pemantauan') &&
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20}}>
                    <Image style={{ width: 204, height: 164 }} source={cardImage}/>
                </View>
			  }
			  
			  <Form>
				<Item style={styles.input}>
				  <Icon active name="person" />
				  <Input placeholder="Username / Email" autoCapitalize="none" onChangeText={(username) => this.setState({username})} value={this.state.username}/>
				</Item>
				<Item style={styles.input}>
				  <Icon active name="key" />
				  <Input placeholder="Password" autoCapitalize="none" secureTextEntry={this.state.hidePassword} onChangeText={(password) => this.setState({password})} value={this.state.password}/>
				  <Icon name={this.state.iconPassword} onPress={() => this._togglePassword()}/>
				</Item>
			  </Form>
			  {
			      (activeApp == 'pendataan') &&
                  <Button block style={{ margin: 15, marginTop: 50, backgroundColor: '#E62129' }} onPress={this._userLogin} disabled={this.state.isLoggingIn}>
                    <Text>Login</Text>
                  </Button>
              }
			  {
			      (activeApp == 'pemantauan') &&
                  <Button block style={{ margin: 15, marginTop: 50, backgroundColor: '#DB6E2C' }} onPress={this._userLogin} disabled={this.state.isLoggingIn}>
                    <Text>Login</Text>
                  </Button>
              }
		  </View>
        </Content>
		
      </Container>
    );
  }
}

export default Login;
