import React, { Component } from "react";
import { api } from '../../config/config';
import { tglIndo } from '../../config/helpers';
import { 
	Image, 
	Keyboard, 
	AsyncStorage, 
	TouchableOpacity, 
	Dimensions, 
	TextInput, 
	Alert,
	View
} from "react-native";
import {
  Label,
  ListItem,
  Text,
  Content,
  Icon,
  Body
} from "native-base";
import styles from "./styles";
import { Col, Row, Grid } from "react-native-easy-grid";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

class DetailVerifikasiText extends Component {
    constructor(props) {
        super(props);
    }
	
	render() {
		if(this.props.loading){
			return <View />;
		}
		
		return (
			<View style={[styles.container, {flex: 1}]}>
			  <Content style={styles.container}>				  
				   <Label style={[styles.selfLabel, {fontWeight: 'bold', marginHorizontal: 15, marginTop: 20}]}>Tanggal Penilaian</Label>
				  <ListItem style={styles.textDetail}>
					<Text>{(this.props.data.data.id_verifikasi != '0' ? tglIndo(this.props.data.tglVerifikasi) : '-')}</Text>
				  </ListItem>
				  
				  <Label style={[styles.selfLabel, {fontWeight: 'bold', marginHorizontal: 15, marginTop: 20}]}>Keterangan</Label>
				  <ListItem style={styles.textDetail}>
					<Text>{this.props.data.keterangan != '' ? this.props.data.keterangan : '-'}</Text>
				  </ListItem>
				  
				  <ListItem itemDivider style={{marginTop: 20, marginHorizontal: 15}}>
					<Body style={{marginLeft: -10}}>
						<Text style={{fontWeight: 'bold', textAlign: 'left'}}>Instrumen Verifikasi</Text>
					</Body>
				  </ListItem>
				  
				  {
					  this.props.instrumen &&
					  this.props.instrumen.map((val, idx) => {
						  var num = idx + 1;
						  
						  return (
							  <View key={'ins' + idx} style={{marginVertical: 20}}>
								  <Label style={[styles.selfLabel, {paddingHorizontal: 15, fontWeight: 'bold'}]}>{num}. {val.pertanyaan}</Label>
								  <ListItem>
									<Text style={{color: (val.jawaban != '' && val.jawaban.toUpperCase().indexOf('BELUM') < 0 ? '#000' : '#ff5c33')}}>{val.jawaban}</Text>
								  </ListItem>
							  </View>
						  );
					  })
				  }
				  
				  <ListItem itemDivider style={{marginTop: 20, marginHorizontal: 15}}>
					<Body style={{marginLeft: -10}}>
						<Text style={{fontWeight: 'bold', textAlign: 'left'}}>Kesimpulan</Text>
					</Body>
				  </ListItem>
				  
				  <ListItem style={[styles.textDetail]}>
					<View style={{marginRight: 15, paddingHorizontal: 15, backgroundColor: ((this.props.data.statusKelayakan != '' && this.props.data.statusKelayakan.toUpperCase().indexOf('BELUM') < 0) ? '#32bc7a' : '#ff5c33') }}>
						<Text style={{fontWeight: 'bold', color: '#fff' }}>{(this.props.data.statusKelayakan != '' && this.props.data.statusKelayakan.toUpperCase().indexOf('BELUM') < 0) ? 'RTLH ' + this.props.data.statusKelayakan : this.props.data.statusKelayakan}</Text>
					</View>
				  </ListItem>
				  
			  </Content>
			</View>
		);
	}
}

export default DetailVerifikasiText;
