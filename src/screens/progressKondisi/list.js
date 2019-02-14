import React, { Component } from "react";
import { api } from '../../config/config';
import { Image, Keyboard, AsyncStorage, TouchableOpacity } from "react-native";
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
  Fab,
  List,
  ListItem,
  Item,
  Text,
  Thumbnail,
  Left,
  Body,
  Toast,
  Right
} from "native-base";
import styles from "./styles";
import { Col, Row, Grid } from "react-native-easy-grid";
import Spinner from 'react-native-loading-spinner-overlay';
import ModalSelector from 'react-native-modal-selector';
import Collapsible from 'react-native-collapsible';

class ListKondisi extends Component {
    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
		let idUser = params ? params.idUser : false;
		let idGroup = params ? params.idGroup : false;
		let base = params ? params.base : false;
		
		this.state = {
            loading: true, 
			idGroup: idGroup,
			idUser: idUser,
			base: base,
			data: [],
			collapsed: false,
			hakAkses: false
        };
		
    }
	
	componentWillMount() {
		this.init();
	}
  
	init = async() => {
		try {
			await AsyncStorage.getItem('kondisiList').then(
			(value) => { 
					if(value !== null){ 
						let data = JSON.parse(value);
						
						this.setState({data: data.data_monitoring, loading: false});
						
						console.log(data);
						console.log(this.state.base);
					} else { 
						this.setState({loading:false});
						//this.props.navigation.navigate("ProgressKondisi") 
					} 
				}
			);
			
			await AsyncStorage.getItem('hak_akses').then(
				(value) => { if(value !== null){ this.setState({hakAkses : JSON.parse(value)}); /*console.log(value);*/ } }
			);
		} catch (error) {
			this.setState({loading:false});
			console.log(error);
			//this.props.navigation.navigate("ProgressKondisi"); //this.props.navigation.goBack()
		}
	}
	
	
	detail = async(data) => {
		this.props.navigation.navigate('DetailKondisi', {idUser: this.state.idUser, idGroup: this.state.idGroup, base: data, penerima: this.state.base, editable: (this.state.hakAkses && (this.state.hakAkses.indexOf('progress_kondisi_rumah.update') !== -1 || this.state.hakAkses.indexOf('progress_kondisi_rumah.update own') !== -1)) ? true : false});
	}
	
	create = async() => {
		this.props.navigation.navigate("DetailKondisi", {idUser: this.state.idUser, idGroup: this.state.idGroup, base: false, penerima: this.state.base, editable: false});
	}
	
	render() {
		let isCreated = (this.state.hakAkses && (this.state.hakAkses.indexOf('progress_kondisi_rumah.create') !== -1 || this.state.hakAkses.indexOf('progress_kondisi_rumah.create own') !== -1)) ? true : false;
		
		var data = this.state.data;
		var base = this.state.base;
		
		var isCollapsible = false;
		
		return (
			<View style={[styles.container, {flex: 1}]}>
			<Container>
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
					
					<Collapsible collapsed={this.state.collapsed}>
						<View style={[{paddingTop: 20, paddingBottom: 30, borderBottomWidth: 2, borderColor: '#bfbfbf', alignItems: 'center'}]}>
							<View style={{marginBottom: 10}}>
								<Text style={{fontSize: 40}}><Icon name="ios-person-outline" style={{fontSize: 40}} /></Text>
							</View>
							<Text>
								{base.nama_penerima_bantuan}
							</Text>
							<Text numberOfLines={1} note>
								NIK. {base.nik_penerima_bantuan}
							</Text>
							<Text numberOfLines={1} note>
								{base.kecamatan} / {base.desa}
							</Text>
							
						</View>
					
					</Collapsible>
					
					<ListItem itemDivider>
						<Body style={{marginLeft: -10}}>
							<Text style={{fontWeight: 'bold', textAlign: 'center'}}>Data Progress Kondisi Rumah</Text>
						</Body>
					</ListItem>
					
					{
						isCollapsible &&
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
						(this.state.data && this.state.data.length > 0) &&
							<List
							dataArray={this.state.data}
							renderRow={dt =>
								<ListItem thumbnail onPress={() => this.detail(dt) }>
									<Left>
										<Text><Icon name="stats" style={{fontSize: 20}} /></Text>
									</Left>
									<Body>
										<Text>
											{dt.persentase_progress}%
										</Text>
										<Text numberOfLines={1} note>
											{dt.keterangan}
										</Text>
									</Body>
									<Right>
										<Icon name="arrow-forward" />
									</Right>
								</ListItem>}
							/>
					}
					
					{
						(this.state.data && this.state.data.length == 0 && !this.state.loading) &&
						<View style={{paddingHorizontal: 20, paddingVertical: 30}}>
						<Text style={{textAlign: 'center', color: 'red'}}>
							Silakan input Progress 0% lebih dahulu
						</Text>
						</View>
					}
				</Content>
			</Container>
			
			{
				(isCreated && this.state.data) &&
				<View>
					<Fab
					containerStyle={{}}
					style={{ backgroundColor: "#5067FF" }}
					position="bottomRight"
					onPress={() => this.create() }
					>
						<Icon name="add" />
					</Fab>
				</View>
			}
			
			</View>
		);
	}
}

export default ListKondisi;
