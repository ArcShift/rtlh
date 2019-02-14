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
} from "react-native";
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
  Tabs,
  Tab,
  ScrollableTab
} from "native-base";
import styles from "./styles";
import { Col, Row, Grid } from "react-native-easy-grid";
import Spinner from 'react-native-loading-spinner-overlay';
import SafariView from 'react-native-safari-view';
import {openURL} from "../../config/helpers";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');


class DetailKeuangan extends Component {
    constructor(props) {
        super(props);
		let {params} = this.props.navigation.state;
		let idUser = params ? params.idUser : false;
		let idGroup = params ? params.idGroup : false;
		let base = params ? params.base : false;
		let penerima = params ? params.penerima : false;
		
        this.state = {
            loading: true,
			data: base,
			penerima: penerima,
			
			dokumenBase: false,
			persentase: '',
			isResmi: '',
			nominal_progress: '',
			keterangan: '',
			idMonitoring: '0',
			
			idUser: idUser,
			idGroup: idGroup,
        };
    }
	
	componentDidMount() {
		this.init();
	}
	
	init(){
		if(this.state.data){
			var data = this.state.data;
			var per = data.persentase_progress;
			per = per.split('.');
			per = per[0];
			
			this.setState({
				persentase: per,
				isResmi: data.is_persentase_resmi,
				keterangan: data.keterangan,
				nominal_progress: data.nominal_progress,
				idMonitoring: data.id_monitoring,
				dokumenBase: data.filepath_dokumen
			});
		} 
		
		this.setState({loading: false});
	}
	
	renderFileImage = () => {
		let base = this.state.dokumenBase;
		
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
							<Title>Keuangan</Title>
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
						
						<View style={[styles.container, {flex: 1}]}>
							<Tabs renderTabBar={() => <ScrollableTab/>}>
							<Tab heading="Data Progress">
							  <Content style={styles.container}>
								  <Label style={styles.selfLabel}>Persentase Progress</Label>
								  <ListItem style={styles.textDetail}>
									<Text>{this.state.persentase}%</Text>
								  </ListItem>

								  <Label style={styles.selfLabel}>Nominal Progress (Rp)</Label>
								  <ListItem style={styles.textDetail}>
									<Text>{this.state.nominal_progress != '' ? this.state.nominal_progress : '-'}</Text>
								  </ListItem>
								  
								  <Label style={styles.selfLabel}>Keterangan</Label>
								  <ListItem style={styles.textDetail}>
									<Text>{this.state.keterangan != '' ? this.state.keterangan : '-'}</Text>
								  </ListItem>
							  </Content>
							</Tab>
							<Tab heading="Dokumen">
							  <Content style={styles.container}>
									{
										(this.state.dokumenBase && this.state.dokumenBase.length > 0) &&
										<View>
											<Label style={[styles.selfLabel, {textAlign: 'center'}]}>Lampiran Dokumen Keuangan</Label>
											{this.renderFileImage()}
										</View>
									}
									
									{
										(!this.state.dokumenBase || this.state.dokumenBase.length <= 0) &&
										<Label style={[styles.selfLabel, {textAlign: 'center', color: 'red', paddingVertical: 50}]}>Tidak ada dokumen</Label>
									}
							  </Content>
							</Tab>
						  </Tabs>
						</View>
						
					</Content>
				</Container>
			</View>
		);
	}
}

export default DetailKeuangan;
