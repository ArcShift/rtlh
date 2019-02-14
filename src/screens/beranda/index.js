import React, { Component } from "react";
import { Platform, AsyncStorage, TouchableOpacity, Dimensions, Image, Alert } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  View,
  Grid, 
  Col,
  Card,
  CardItem,
  Button,
  Icon,
  ListItem,
  Text,
  Badge,
  Left,
  Right,
  Body,
  Switch,
  Radio,
  Picker,
  Footer
} from "native-base";
import styles from "./styles";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {slider1, slider2} from './sliderData';
import { activeApp, appName } from '../../config/config';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

class Beranda extends Component {
  constructor(props) {
    super(props);

	let slider;
	if (activeApp == 'pendataan') {
	    slider = slider1;
    } else {
	    slider = slider2;
	}
	
	this.state = {
		hakAkses: false,
		name: '',
		group: '',
		
		index: 0, 
		slider: slider
	}
  }
  
  componentDidMount(){
	  this.hakAkses();
  }
  
  hakAkses = async() => {
		try {
			let nama = await AsyncStorage.getItem("realname");
			let grup = await AsyncStorage.getItem("namagroup");
			  
			if(nama == null){
				nama = await AsyncStorage.getItem("username");
			}

			this.setState({name: nama, group: grup});
			
			await AsyncStorage.getItem('hak_akses').then(
				(value) => { if(value !== null){ this.setState({hakAkses : JSON.parse(value)}); } }
			);
		} catch (error) {
			console.log(error);
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
  
  slider = () => {
	  if(this.state.slider && this.state.slider.length > 0){
		  let pagination = <View style={{marginTop: 10, marginBottom: 20}} />;
		  
		  return (
			<View>
				<View style={{paddingHorizontal: 1, alignItems: 'center', height: 148}}>
					<Carousel
					  ref={(c) => { this._slider = c; }}
					  data={this.state.slider}
					  renderItem={this.renderSlider}
					  sliderWidth={(viewportWidth)}
					  itemWidth={(viewportWidth)}
					  onSnapToItem={(index) => this.changeIndex(index) }
					  loop={true}
					  autoplay={true}
					  autoplayDelay={500}
					  autoplayInterval={7000}
					/>
				</View>
				
				{
					(this.state.slider.length > 1) && 
					<View style={{paddingHorizontal: 1, alignItems: 'center', marginTop:5, marginBottom:10}}>
						<Pagination
						  dotsLength={this.state.slider.length}
						  activeDotIndex={this.state.index}
						  containerStyle={styles.paginationContainer}
						  dotColor={'#334393'}
						  dotStyle={styles.paginationDot}
						  inactiveDotColor={'#1a1917'}
						  inactiveDotOpacity={0.4}
						  inactiveDotScale={0.6}
						  carouselRef={this._slider}
						  tappableDots={!!this._slider}
						/>
					</View>
				}
			</View>
		  ); 
	  }
	  
	  return <View />;
  }
  
  renderSlider ({item, index}){
		return (
			<TouchableOpacity key={index} style={{height: 148, alignItems: 'center', justifyContent: 'center'}} disabled={true}>
				<Image style={{borderRadius: 2, flex: 1, resizeMode: 'contain', width: (viewportWidth)}} source={item.source} />
			</TouchableOpacity>
		);
	}
	
	changeIndex(index) {
		this.setState({index})
	}
  
  render() {
    let slider = this.slider();
	
	return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate("DrawerOpen")}>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>{appName[activeApp]}</Title>
          </Body>
          <Right />
        </Header>
        
        <Content>
		
		<Grid style={[styles.contentGrid, {paddingVertical: 20, paddingHorizontal: 20}]}>
			<Col size={70} style={{justifyContent: 'center'}}>
				<Text style={{fontSize: 14, fontWeight: 'bold', color: '#334393'}}>{this.state.name}</Text>
				<Text style={{fontSize: 12, color: 'gray'}}>{this.state.group}</Text>
			</Col>
			
			<Col size={30} style={{justifyContent: 'center'}}>
			    {
                    activeApp == 'pendataan' &&
                    <View style={{alignItems: 'flex-end'}}>
                        <Image source={require('../../../assets/logo-pendataan/app-icon.png')} style={{width: 60, height: 60, borderRadius: 50}} />
                    </View>
                }
			    {
                    activeApp == 'pemantauan' &&
                    <View style={{alignItems: 'flex-end'}}>
                        <Image source={require('../../../assets/logo-pemantauan/app-icon.png')} style={{width: 60, height: 60, borderRadius: 50}} />
                    </View>
                }
			</Col>
			
		</Grid>
		
		
		{slider}
		
		{
			activeApp == 'pendataan' &&
			<View style={{alignItems:'center', justifyContent: 'center', paddingVertical: 15, paddingHorizontal: 15, backgroundColor: '#fff', marginHorizontal: 15, borderRadius: 5, marginBottom: 5}}>
				<Text style={[styles.cardText, {textAlign: 'center', color: '#6d6d6d', fontWeight: 'bold'}]}>SISTEM INFORMASI PROGRAM PENDATAAN{'\n'}RUMAH TIDAK LAYAK HUNI KABUPATEN GRESIK</Text>
			</View>
		}
		{
			activeApp == 'pemantauan' &&
			<View style={{alignItems:'center', justifyContent: 'center', paddingVertical: 15, paddingHorizontal: 15, backgroundColor: '#fff', marginHorizontal: 15, borderRadius: 5, marginBottom: 5}}>
				<Text style={[styles.cardText, {textAlign: 'center', color: '#6d6d6d', fontWeight: 'bold'}]}>MONITORING RUMAH SWADAYA ELEKTRONIK{'\n'}RUMAH TIDAK LAYAK HUNI KABUPATEN GRESIK</Text>
			</View>
		}
		
        <Grid style={{paddingVertical: 0, paddingHorizontal: 10}}>
          
		  {
			  (this.state.hakAkses && (this.state.hakAkses.indexOf('data_rtlh.read') !== -1 || this.state.hakAkses.indexOf('data_rtlh.read own') !== -1)) &&
			  <Col style={styles.contentGrid}>
				<TouchableOpacity onPress={() => this.props.navigation.navigate("DataRumah")} style={styles.boxModified}>
					<Icon name="home" style={[styles.cardIcon, {color: '#334393', alignSelf: 'center'}]}/>
					<Text style={[styles.cardText, {textAlign: 'center', color: '#334393'}]}>Data Rumah</Text>
				</TouchableOpacity>
			  </Col>
		  }
		  
		  {
			  (this.state.hakAkses && (this.state.hakAkses.indexOf('verifikasi_penerima_bantuan.read') !== -1 || this.state.hakAkses.indexOf('verifikasi_penerima_bantuan.read own') !== -1)) &&
			  <Col style={styles.contentGrid}>
				<TouchableOpacity onPress={() => this.props.navigation.navigate("Verifikasi")} style={styles.boxModified}>
					<Icon name="checkbox" style={[styles.cardIcon, {color: '#B22222', alignSelf: 'center'}]}/>
					<Text style={[styles.cardText, {textAlign: 'center', color: '#B22222'}]}>Verifikasi</Text>
				</TouchableOpacity>
			  </Col>
		  }
		  
		  </Grid>
		
		  <Grid style={{paddingVertical: 0, paddingHorizontal: 10}}>

		  {
			  (this.state.hakAkses && (this.state.hakAkses.indexOf('progress_kondisi_rumah.read') !== -1 || this.state.hakAkses.indexOf('progress_kondisi_rumah.read own') !== -1)) &&
			  <Col style={styles.contentGrid}>
				<TouchableOpacity onPress={() => this.props.navigation.navigate("ProgressKondisi")} style={styles.boxModified}>
					<Icon type="FontAwesome" name="home" style={[styles.cardIcon, {color: '#228B22', alignSelf: 'center'}]}/>
					<Text style={[styles.cardText, {textAlign: 'center', color: '#228B22'}]}>Progress Fisik</Text>
				</TouchableOpacity>				
			  </Col>
		  }
		  
		  {
			  (this.state.hakAkses && (this.state.hakAkses.indexOf('progress_material_rumah.read') !== -1 || this.state.hakAkses.indexOf('progress_material_rumah.read own') !== -1)) &&
			  <Col style={styles.contentGrid}>
				<TouchableOpacity onPress={() => this.props.navigation.navigate("ProgressMaterial")} style={styles.boxModified}>
					<Icon type="MaterialIcons" name="account-balance" style={[styles.cardIcon, {color: '#DAA520', alignSelf: 'center'}]}/>
					<Text style={[styles.cardText, {textAlign: 'center', color: '#DAA520'}]}>Progress Material</Text>
				</TouchableOpacity>				
			  </Col>
		  }
		  
		  {
			  (this.state.hakAkses && (this.state.hakAkses.indexOf('progress_keuangan_rumah.read') !== -1 || this.state.hakAkses.indexOf('progress_keuangan_rumah.read own') !== -1)) &&
			  <Col style={styles.contentGrid}>
				<TouchableOpacity onPress={() => this.props.navigation.navigate("ProgressKeuangan") } style={styles.boxModified}>
					<Icon type="MaterialIcons" name="local-atm" style={[styles.cardIcon, {color: '#8B4513', alignSelf: 'center'}]}/>
					<Text style={[styles.cardText, {textAlign: 'center', color: '#8B4513'}]}>Progress Keuangan</Text>
				</TouchableOpacity>				
			  </Col>
		  }
		  
        </Grid>
		
        </Content>
		<Footer style={{height: 5, backgroundColor: '#3F51B5', justifyContent: 'flex-end'}} />
      </Container>
    );
  }
}

export default Beranda;
