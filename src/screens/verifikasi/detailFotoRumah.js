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
import Spinner from 'react-native-loading-spinner-overlay';
import SafariView from 'react-native-safari-view';
import {openURL, nominalFormat} from "../../config/helpers";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

class DetailFotoRumah extends Component {
    constructor(props) {
        super(props);
		let {params} = this.props.navigation.state;
		let base = (params && params.base && params.base.foto_rumah) ? params.base.foto_rumah : false;
		
        this.state = {
            loading: false,
			data: base,
        };
    }
	
	renderImage = () => {
		var base = this.state.data;
		var imgTime;
		
		if (!base || base.length == 0) {
			return;
		}
		
		let dataImage = base.map((val, idx) => {
			var key = 'iMage' + (Math.floor(Math.random() * 100) + idx);
			console.log("val.filepath=" + val.filepath);
			console.log("val.last_modified_time=" + val.last_modified_time);
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
					onPress = {() => openURL(val.filepath) }
					>
						<Image source={{ uri: val.filepath }} style={{ width: 250, height: 200 }} />
						<Label style={{ alignItems: 'center' }}>Update: {val.last_modified_time} WIB</Label>
					</TouchableOpacity>					
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
	
	render() {
		let data = this.state.data;	
		
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
							<Title>Foto Rumah</Title>
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
							(!this.state.data) &&
							<View style={[styles.container, {flex: 1}]}>
								<Content style={styles.container}>
									<Text style={{textAlign: 'center', paddingVertical: 120, color: 'red', lineHeight: 30}}>Belum ada Foto Rumah untuk{'\n'}Penerima Bantuan ini{'\n\n'}Silahkan upload foto rumah{'\n'}melalui dashboard.</Text>
								</Content>
							</View>
						}
						
						{
							(this.state.data) &&
							<View style={[styles.container, {flex: 1}]}>
								<Content style={styles.container}>
								  <View style={{alignItems: 'center', paddingBottom: 20, borderColor: '#bfbfbf'}}>
									{this.renderImage()}
								  </View>
							  </Content>
							</View>
						}
					</Content>
				</Container>
			</View>
		);
	}
}

export default DetailFotoRumah;
