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
  Body,
  Button
} from "native-base";
import styles from "./styles";
import { Col, Row, Grid } from "react-native-easy-grid";
import ListUpdateMaterial from "./listUpdateMaterial";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

class DetailKondisiText extends Component {
    constructor(props) {
        super(props);
    }
	
	render() {
		if(this.props.loading){
			return <View />;
		}
		
		console.log("this.props.data");
		console.log(this.props.data);
		
		return (
			<View style={[styles.container, {flex: 1}]}>
				<Tabs renderTabBar={() => <ScrollableTab/>} onChangeTab={({i, ref}) => { this.props.updateMaterial(i); this.props.changeTabNow(i) }} page={this.props.tabNow}>
				<Tab heading="Data Progress" isCurrent={this.props.tabNow == 0}>
				  <Content style={styles.container}>
					  <Label style={styles.selfLabel}>Persentase Progress</Label>
					  <ListItem style={styles.textDetail}>
						<Text>{this.props.data.persentase}%</Text>
					  </ListItem>

					  <Label style={styles.selfLabel}>Persentase Progress Real</Label>
					  <ListItem style={styles.textDetail}>
						<Text>{this.props.data.persentaseReal}%</Text>
					  </ListItem>
					  
					  <Label style={styles.selfLabel}>Keterangan</Label>
					  <ListItem style={styles.textDetail}>
						<Text>{this.props.data.keterangan != '' ? this.props.data.keterangan : '-'}</Text>
					  </ListItem>
					  
					  <View style={{marginTop: 40, marginHorizontal: 15}}>
					  <Button onPress={() => { this.props.changeTabNow(3) }} >
							<Text>Update Material</Text>
						</Button>
					  </View>
				  </Content>
				</Tab>
				<Tab heading="Foto" isCurrent={this.props.tabNow == 1}>
				  <Content style={styles.container}>
						{
							this.props.foto &&
							<View>
								<Label style={[styles.selfLabel, {textAlign: 'center'}]}>Daftar Foto</Label>
								{this.props.foto}
							</View>
						}
						
						{
							!this.props.foto &&
							<Label style={[styles.selfLabel, {textAlign: 'center', color: 'red', paddingVertical: 50}]}>Tidak ada foto</Label>
						}
				  </Content>
				</Tab>
				<Tab heading="Dokumen" isCurrent={this.props.tabNow == 2}>
				  <Content style={styles.container}>
						{
							this.props.dokumen &&
							<View>
								<Label style={[styles.selfLabel, {textAlign: 'center'}]}>Lampiran Dokumen Material</Label>
								{this.props.dokumen}
							</View>
						}
						
						{
							!this.props.dokumen &&
							<Label style={[styles.selfLabel, {textAlign: 'center', color: 'red', paddingVertical: 50}]}>Tidak ada dokumen</Label>
						}
				  </Content>
				</Tab>
				<Tab heading="Update Material" isCurrent={this.props.tabNow == 3}>
				  <Content style={styles.container}>
					  <ListUpdateMaterial state={this.props.data} navigation={this.props.navigation} /> 
				  </Content>
				</Tab>
			  </Tabs>
			</View>
		);
	}
}

export default DetailKondisiText;
