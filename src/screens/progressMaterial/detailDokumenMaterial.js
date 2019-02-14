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

class DetailDokumenMaterial extends Component {
    constructor(props) {
        super(props);
		let {params} = this.props.navigation.state;
		let base = (params && params.base && params.base.dokumen) ? params.base.dokumen : false;
		
		if(base instanceof Array){
			base = false;
		}
		
        this.state = {
            loading: false,
			data: base,
        };
    }
	
	cekFile(path) {
		path = path.split('.');
		var end = path[path.length - 1];
		
		if(end.length <= 4){ // FORMAT FILE
			return true;
		} else {
			return false;
		}
	}
	
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
							<Title>Info Dokumen</Title>
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
									<Text style={{textAlign: 'center', paddingVertical: 120, color: 'red', lineHeight: 30}}>Belum ada Dokumen RAB{'\n'}dan Dokumen Backup Volume</Text>
								</Content>
							</View>
						}
						
						{
							(this.state.data) &&
							<View style={[styles.container, {flex: 1}]}>
								<Content style={styles.container}>
								  <ListItem itemDivider>
										<Body style={{marginLeft: -10}}>
											<Text style={{fontWeight: 'bold', textAlign: 'center'}}>Dokumen RAB</Text>
										</Body>
								  </ListItem>
								  
								  <View style={[{paddingHorizontal: 20, paddingVertical: 20}]}>
										<Button block onPress={() => { openURL(this.state.data.filepath_dokumen_rab) }} disabled={!this.cekFile(this.state.data.filepath_dokumen_rab)} >
											<Text>File Softcopy</Text>
										</Button>
								  </View>
								  
								   <View style={[{paddingHorizontal: 20, paddingVertical: 20}]}>
										<Button block onPress={() => { openURL(this.state.data.filepath_hardcopy_rab) }} disabled={!this.cekFile(this.state.data.filepath_hardcopy_rab)} >
											<Text>Arsip/Hardcopy</Text>
										</Button>
								  </View>
								  
								  <ListItem itemDivider>
										<Body style={{marginLeft: -10}}>
											<Text style={{fontWeight: 'bold', textAlign: 'center'}}>Dokumen Backup Volume</Text>
										</Body>
								  </ListItem>
								  
								  <View style={[{paddingHorizontal: 20, paddingVertical: 20}]}>
										<Button block onPress={() => { openURL(this.state.data.filepath_dokumen_bv) }} disabled={!this.cekFile(this.state.data.filepath_dokumen_bv)} >
											<Text>File Softcopy</Text>
										</Button>
								  </View>
								  
								  <View style={[{paddingHorizontal: 20, paddingVertical: 20}]}>
										<Button block onPress={() => { openURL(this.state.data.filepath_hardcopy_bv) }} disabled={!this.cekFile(this.state.data.filepath_hardcopy_bv)} >
											<Text>Arsip/Hardcopy</Text>
										</Button>
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

export default DetailDokumenMaterial;
