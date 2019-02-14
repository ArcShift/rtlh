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
	View
} from "react-native";
import {
  Tabs,
  Tab,
  Label,
  ListItem,
  Text,
  Content,
  ScrollableTab,
  Icon,
  Body
} from "native-base";
import styles from "./styles";
import { Col, Row, Grid } from "react-native-easy-grid";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

class DetailKondisiText extends Component {
    constructor(props) {
        super(props);
    }
	
	render() {
		if(this.props.loading){
			return <View />;
		}
		
		return (
			<View style={[styles.container, {flex: 1}]}>
				<Tabs renderTabBar={() => <ScrollableTab/>}>
				<Tab heading="Data Progress">
				  <Content style={styles.container}>
					  <Label style={styles.selfLabel}>Persentase Progress</Label>
					  <ListItem style={styles.textDetail}>
						<Text>{this.props.data.persentase}%</Text>
					  </ListItem>
					  
					  <ListItem itemDivider style={{marginTop: 20, marginHorizontal: 15}}>
						<Body style={{marginLeft: -10}}>
							<Text style={{fontWeight: 'bold', textAlign: 'left'}}>Kondisi Rumah</Text>
						</Body>
					  </ListItem>
					  
					  <Label style={styles.selfLabel}>Atap</Label>
					  <ListItem style={styles.textDetail}>
						<Text>{this.props.data.atap}</Text>
					  </ListItem>
					  
					  <Label style={styles.selfLabel}>Lantai</Label>
					  <ListItem style={styles.textDetail}>
						<Text>{this.props.data.lantai}</Text>
					  </ListItem>
					  
					  <Label style={styles.selfLabel}>Dinding</Label>
					  <ListItem style={styles.textDetail}>
						<Text>{this.props.data.dinding}</Text>
					  </ListItem>
					  
					  <Label style={styles.selfLabel}>Temuan</Label>
					  <ListItem style={styles.textDetail}>
						<Text>{this.props.data.keterangan != '' ? this.props.data.keterangan : '-'}</Text>
					  </ListItem>
				  </Content>
				</Tab>
				<Tab heading="Foto Kiri">
				  <Content style={styles.container}>
						{
							this.props.kiri &&
							<View>
								<Label style={[styles.selfLabel, {textAlign: 'center'}]}>Daftar Foto pada perspektif Kiri</Label>
								{this.props.kiri}
							</View>
						}
						
						{
							!this.props.kiri &&
							<Label style={[styles.selfLabel, {textAlign: 'center', color: 'red', paddingVertical: 50}]}>Tidak ada foto</Label>
						}
				  </Content>
				</Tab>
				<Tab heading="Foto Kanan">
				  <Content style={styles.container}>
						{
							this.props.kanan &&
							<View>
								<Label style={[styles.selfLabel, {textAlign: 'center'}]}>Daftar Foto pada perspektif Kanan</Label>
								{this.props.kanan}
							</View>
						}
						
						{
							!this.props.kanan &&
							<Label style={[styles.selfLabel, {textAlign: 'center', color: 'red', paddingVertical: 50}]}>Tidak ada foto</Label>
						}
				  </Content>
				</Tab>
				<Tab heading="Foto Depan">
				  <Content style={styles.container}>
						{
							this.props.depan &&
							<View>
								<Label style={[styles.selfLabel, {textAlign: 'center'}]}>Daftar Foto pada perspektif Depan Rumah</Label>
								{this.props.depan}
							</View>
						}
						
						{
							!this.props.depan &&
							<Label style={[styles.selfLabel, {textAlign: 'center', color: 'red', paddingVertical: 50}]}>Tidak ada foto</Label>
						}
				  </Content>
				</Tab>
				<Tab heading="Foto Dalam">
				  <Content style={styles.container}>
						{
							this.props.dalam &&
							<View>
								<Label style={[styles.selfLabel, {textAlign: 'center'}]}>Daftar Foto pada perspektif Dalam Rumah</Label>
								{this.props.dalam}
							</View>
						}
						
						{
							!this.props.dalam &&
							<Label style={[styles.selfLabel, {textAlign: 'center', color: 'red', paddingVertical: 50}]}>Tidak ada foto</Label>
						}
				  </Content>
				</Tab>
			  </Tabs>
			</View>
		);
	}
}

export default DetailKondisiText;
