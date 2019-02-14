import React, { Component } from "react";
import { Alert, Image } from "react-native";
import {
  Container,
  Header,
  Content,
  View,
  Form,
  Title,
  Label,
  Text,
  List,
  ListItem,
  Item,
  Thumbnail,
  Button,
  Icon,
  Tabs,
  Tab,
  Right,
  Left,
  Body,
  ScrollableTab,
  Toast,
  Spinner,
  Picker,
  Input
} from "native-base";
import { api } from '../../config/config';
import Exponent, { Constants, ImagePicker, registerRootComponent, Permissions, ImageManipulator } from 'expo';
import Modal from "react-native-modal";
import styles from "./styles";
import mstyles from "./modal.styles";

export default class TabEight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadingFile: false,
      isModalVisible: false,

      file_ktp: [],
      file_kk: [],
      file_rumah: [],
      file_bukti_sk_rumah: [],
      
      file_removes: [],
      folder_temp: '',
      filename_temp: null,
      type_temp: '',
      index_temp: '',
      id_user: '',
    };
  }

  componentWillMount() {
    this.setFolderTemp('temp_' + Date.now());
  }

  componentDidMount() {
    var dataEdit = this.props.data;
    if (dataEdit && dataEdit.length != 0 ) {
      this.setFileKtp(dataEdit.file_ktp);
      this.setFileKk(dataEdit.file_kk);
      this.setFileRumah(dataEdit.file_rumah);
      this.setFileBuktiSkRumah(dataEdit.file_bukti_sk_rumah);
      this.setState({
        loading: true
      });          
    }
  }

  setFolderTemp(txt) {
    this.setState({folder_temp: txt});
    this.props.updateFolderTemp(txt);
    console.log("[2] this.state.folder_temp=" + this.state.folder_temp);
  }
  
  setFileRemoves(fr) {
    this.setState({file_removes: fr});
    this.props.updateFileRemoves(fr);
    console.log("[2] this.state.file_removes=" + this.state.file_removes);
  }

  setFileKtp(fr) {
    this.setState({file_ktp: fr});
    this.props.updateFileKtp(fr);
    console.log("[2] this.state.file_ktp=" + this.state.file_ktp);
  }

  setFileKk(fr) {
    this.setState({file_kk: fr});
    this.props.updateFileKk(fr);
    console.log("[2] this.state.file_kk=" + this.state.file_kk);
  }

  setFileRumah(fr) {
    this.setState({file_rumah: fr});
    this.props.updateFileRumah(fr);
    console.log("[2] this.state.file_rumah=" + this.state.file_rumah);
  }

  setFileBuktiSkRumah(fr) {
    this.setState({file_bukti_sk_rumah: fr});
    this.props.updateFileBuktiSkRumah(fr);
    console.log("[2] this.state.file_bukti_sk_rumah=" + this.state.file_bukti_sk_rumah);
  }
  
  _browseUpload = async(type) => {
    Alert.alert(
      'Upload File', 'Pilih file gambar dari?',
      [
          {text: 'Kamera', onPress: () => this.openImageBrowser(type,'camera')},
          {text: 'Galeri', onPress: () => this.openImageBrowser(type,'gallery')}
      ],
      { cancelable: true }
    )
  }

  permission = async() => {
		const result = await Promise.all([
			Permissions.askAsync(Permissions.CAMERA),
			Permissions.askAsync(Permissions.CAMERA_ROLL)
		]);
		if(result.some(({status}) => status != 'granted')){
			return false;
		} else {
			return true;
		}
  }
  
  openImageBrowser = async(type,media) => {
    let allowed = await this.permission(); // CHECK PERMISSIONS
		if (allowed){
      let pickerResult = {};
      if(media == 'camera') {
        pickerResult = await ImagePicker.launchCameraAsync({
          allowsEditing: true
        });
      } else {
        pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true
        });
      }
      // result
      if(pickerResult && !pickerResult.cancelled) {
        if(pickerResult.type == 'image') {
          this._uploadImage(type,pickerResult);
        } else {
          Toast.show({ text: "File harus berjenis gambar.", buttonText: "Okay", duration: 3000 });
        }
      }
    }
  }

  _uploadImage = async(type,data) => {
    this.setState({loadingFile: true});

    let imgUri = data.uri;
    console.log('imgUri=' + imgUri);

    let origWidth;
    let origHeight;
    await Image.getSize(imgUri, (width, height) => {
      origWidth = width;
      origHeight = height;
      console.log('origWidth=' + origWidth);
      console.log('origHeight=' + origHeight);
    }, (error) => {
      console.error(`Couldn't get the image size: ${error.message}`);
    });
    
    if (origWidth != null && origHeight != null) {
        let ratio = 1;
        let maxWidth = 1000;
        let maxHeight = 1000;
        if (origWidth >= maxWidth || origHeight >= maxHeight) {
            if (origWidth >= origHeight) {
                ratio = maxWidth / origWidth;
            } else {
                ratio = maxHeight / origHeight;
            }
        }
        console.log('ratio=' + ratio);
        let newWidth = Math.round(ratio * origWidth);
        let newHeight = Math.round(ratio * origHeight);
        
        response = await ImageManipulator.manipulate(
          imgUri,
          [{ resize: { width: newWidth, height: newHeight } }],
          { compress: 0.25, format: 'png' }
        )
        .catch(error => {
          console.log(error);
          Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 3000 });
        })
        console.log('response.uri=' + response.uri);
        console.log('response.width=' + response.width);
        console.log('response.height=' + response.height);
    
        let uri = response.uri;
        if (uri != null) { 
            console.log('uri=' + uri);
            let uriParts = uri.split('.');
            let fileType = uriParts[uriParts.length - 1];
        
            let formData = new FormData();
            formData.append('data', type);
            formData.append('folder_temp', this.state.folder_temp);
                formData.append('file', {
                    uri,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`,
            });
            
            try {
              url = api.url + "data_rumah/upload";
              console.log(url);
              fetch(url, {
                method: "POST",
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'multipart/form-data',},
                body: formData
              })
                .then((response) => response.json())
                .then((response) => {
                  if (response.message == 'success') {
                    var res_data = response.data;
                    var value = { nama_dokumen: null, uri: data.uri, path: res_data.path };
                    if(type == 'ktp') {
                      var joined = this.state.file_ktp.concat(value);
                      this.setState({ file_ktp: joined });
                      this.setFileKtp(joined);
                    } else if(type == 'kk') {
                      var joined = this.state.file_kk.concat(value);
                      this.setState({ file_kk: joined });
                      this.setFileKk(joined);
                    } else if(type == 'rumah') {
                      var joined = this.state.file_rumah.concat(value);
                      this.setState({ file_rumah: joined });
                      this.setFileRumah(joined);
                    } else if(type == 'bukti') {
                      var joined = this.state.file_bukti_sk_rumah.concat(value);
                      this.setState({ file_bukti_sk_rumah: joined });
                      this.setFileBuktiSkRumah(joined);
                    }
                  } else {
                    Toast.show({ text: response.message, buttonText: "Okay", duration: 3000 })
                  }
                })
                .catch(error => {
                  console.log(error);
                  Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 3000 });
                  this.setState({loadingFile: false});
                })
                .then(() => {
                  this.setState({loadingFile: false});
                })
                .done();
            } catch (error) {
              Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 3000 });
            }
        }
    }
  }

  _changeOrder = (type, index, direction) => {
    this.setState({loadingFile: true});
    if(type == 'ktp') var data = this.state.file_ktp;
    else if(type == 'kk') var data = this.state.file_kk;
    else if(type == 'rumah') var data = this.state.file_rumah;
    else if(type == 'bukti') var data = this.state.file_bukti_sk_rumah;

    if(direction == 'up') var indexExchange = parseInt(index) - 1;
    else var indexExchange = parseInt(index) + 1;
    
    var newData = JSON.parse(JSON.stringify(data));
    newData[indexExchange] = data[index];
    newData[index] = data[indexExchange];
    
    if(type == 'ktp') this.setState({ file_ktp: newData });
    else if(type == 'kk') this.setState({ file_kk: newData });
    else if(type == 'rumah') this.setState({ file_rumah: newData });
    else if(type == 'bukti') this.setState({ file_bukti_sk_rumah: newData });

    this.setState({loadingFile: false});
  }

  _removeImage = (type, index) => {
    Alert.alert(
      'Hapus File', 'Anda yakin ingin menghapus file / gambar ini?',
      [
          {text: 'Tidak'},
          {text: 'Ya', onPress: () => this.deleteImage(type, index)}
      ],
      { cancelable: true }
    )
  }

  deleteImage = (type, index) => {
    if(type == 'ktp') var data = this.state.file_ktp;
    else if(type == 'kk') var data = this.state.file_kk;
    else if(type == 'rumah') var data = this.state.file_rumah;
    else if(type == 'bukti') var data = this.state.file_bukti_sk_rumah;

    var newDataFile = this.state.file_removes;
    newDataFile.push(data[index].path);
    this.setState({file_removes: newDataFile});
    console.log("[3] file_removes=" + newDataFile);
    this.setFileRemoves(newDataFile);

    data.splice(index,1);
    var newData = JSON.parse(JSON.stringify(data));

    if(type == 'ktp') {
      this.setState({ file_ktp: newData });
      this.setFileKtp(newData);
    } else if(type == 'kk') {
      this.setState({ file_kk: newData });
      this.setFileKk(newData);
    } else if(type == 'rumah') {
      this.setState({ file_rumah: newData});
      this.setFileRumah(newData);
    } else if(type == 'bukti') {
      this.setState({ file_bukti_sk_rumah: newData });
      this.setFileBuktiSkRumah(newData);
    }
    Toast.show({ text: 'File berhasil dihapus.', duration: 3000 });
  }

  _confirm() {
    Alert.alert(
      'Konfirmasi', 'Anda yakin akan menyimpan data ini?',
      [
          {text: 'Tidak'},
          {text: 'Ya', onPress: () => this._submit()}
      ],
      { cancelable: false }
    )
  }
  
  render() {
    var fktp = this.state.file_ktp;
    var fkk = this.state.file_kk;
    var fr = this.state.file_rumah;
    var fbukti = this.state.file_bukti_sk_rumah;
    
    if (!this.state.loading) {
      return (<Spinner color="blue"/>);
    } else {
      return (
        <Content style={styles.container}>
          <Form style={{marginBottom: 20}}>
              <Label style={styles.selfLabel}>File KTP</Label>
              <Button iconLeft light style={{margin: 15, marginTop: 5}} onPress={() => this._browseUpload('ktp')}>
                <Icon name="cloud-upload"/>
                <Text>Upload</Text>
              </Button>
              {fktp.length > 0 && <Text style={{marginLeft: 15, fontSize: 11, fontWeight: 'bold'}}>URUTAN FILE KTP</Text>}
              <List
                dataArray={fktp}
                renderRow={(rowData, sectionID, rowID, highlightRow) =>
                  <ListItem thumbnail style={{borderBottomWidth:1, borderBottomColor: '#aaa', height:55, marginLeft: 0}}>
                    <Left>
                      <Thumbnail square source={{uri: rowData.uri}} style={{justifyContent: 'center', marginLeft: 15, width: 40, height: 40}}/>
                    </Left>
                    <Body style={{borderBottomWidth: 0}}>
                      {rowData.nama_dokumen !== null && <Text>{rowData.nama_dokumen}</Text>}
                    </Body>
                    <Right style={{flexDirection: "row", alignItems: 'center', paddingRight: 0}}>
                      {fktp.length > 1 && rowID != 0 && 
                        <Button transparent onPress={() => this._changeOrder('ktp',rowID,'up')}><Icon name="arrow-up"/></Button>}
                      {fktp.length > 1 && rowID != (fktp.length-1) && 
                        <Button transparent onPress={() => this._changeOrder('ktp',rowID,'down')}><Icon name="arrow-down"/></Button>}
                      <Button transparent onPress={() => this._removeImage('ktp',rowID)}>
                        <Icon type="MaterialIcons" name="delete" style={{color: 'red'}}/>
                      </Button>
                    </Right>
                  </ListItem>
                  }
              />
              
              <Label style={styles.selfLabel}>File KK</Label>
              <Button iconLeft light style={{margin: 15, marginTop: 5}} onPress={() => this._browseUpload('kk')}>
                <Icon name="cloud-upload"/>
                <Text>Upload</Text>
              </Button>
              {fkk.length > 0 && <Text style={{marginLeft: 15, fontSize: 11, fontWeight: 'bold'}}>URUTAN FILE KK</Text>}
              <List
                dataArray={fkk}
                renderRow={(rowData, sectionID, rowID, highlightRow) =>
                  <ListItem thumbnail style={{borderBottomWidth:1, borderBottomColor: '#aaa', height:55, marginLeft: 0}}>
                    <Left>
                      <Thumbnail square source={{uri: rowData.uri}} style={{justifyContent: 'center', marginLeft: 15, width: 40, height: 40}}/>
                    </Left>
                    <Body style={{borderBottomWidth: 0}}>
                      {rowData.nama_dokumen !== null && <Text>{rowData.nama_dokumen}</Text>}
                    </Body>
                    <Right style={{flexDirection: "row", alignItems: 'center', paddingRight: 0}}>
                      {fkk.length > 1 && rowID != 0 && 
                        <Button transparent onPress={() => this._changeOrder('kk',rowID,'up')}><Icon name="arrow-up"/></Button>}
                      {fkk.length > 1 && rowID != (fkk.length-1) && 
                        <Button transparent onPress={() => this._changeOrder('kk',rowID,'down')}><Icon name="arrow-down"/></Button>}
                      <Button transparent onPress={() => this._removeImage('kk',rowID)}>
                        <Icon type="MaterialIcons" name="delete" style={{color: 'red'}}/>
                      </Button>
                    </Right>
                  </ListItem>
                  }
              />
              
              <Label style={styles.selfLabel}>Foto Rumah</Label>
              <Button iconLeft light style={{margin: 15, marginTop: 5}} onPress={() => this._browseUpload('rumah')}>
                <Icon name="cloud-upload"/>
                <Text>Upload</Text>
              </Button>
              {fr.length > 0 && <Text style={{marginLeft: 15, fontSize: 11, fontWeight: 'bold'}}>URUTAN FILE FOTO RUMAH</Text>}
              <List
                dataArray={fr}
                renderRow={(rowData, sectionID, rowID, highlightRow) =>
                  <ListItem thumbnail style={{borderBottomWidth:1, borderBottomColor: '#aaa', height:55, marginLeft: 0}}>
                    <Left>
                      <Thumbnail square source={{uri: rowData.uri}} style={{justifyContent: 'center', marginLeft: 15, width: 40, height: 40}}/>
                    </Left>
                    <Body style={{borderBottomWidth: 0}}>
                      {rowData.nama_dokumen !== null && <Text>{rowData.nama_dokumen}</Text>}
                    </Body>
                    <Right style={{flexDirection: "row", alignItems: 'center', paddingRight: 0}}>
                      {fr.length > 1 && rowID != 0 && 
                        <Button transparent onPress={() => this._changeOrder('rumah',rowID,'up')}><Icon name="arrow-up"/></Button>}
                      {fr.length > 1 && rowID != (fr.length-1) && 
                        <Button transparent onPress={() => this._changeOrder('rumah',rowID,'down')}><Icon name="arrow-down"/></Button>}
                      <Button transparent onPress={() => this._removeImage('rumah',rowID)}>
                        <Icon type="MaterialIcons" name="delete" style={{color: 'red'}}/>
                      </Button>
                    </Right>
                  </ListItem>
                  }
              />

              <Label style={styles.selfLabel}>File Bukti Kepemilikan Rumah</Label>
              <Button iconLeft light style={{margin: 15, marginTop: 5}} onPress={() => this._browseUpload('bukti')}>
                <Icon name="cloud-upload"/>
                <Text>Upload</Text>
              </Button>
              {fbukti.length > 0 && <Text style={{marginLeft: 15, fontSize: 11, fontWeight: 'bold'}}>URUTAN FILE BUKTI KEPEMILIKAN</Text>}
              <List
                dataArray={fbukti}
                renderRow={(rowData, sectionID, rowID, highlightRow) =>
                  <ListItem thumbnail style={{borderBottomWidth:1, borderBottomColor: '#aaa', height:55, marginLeft: 0}}>
                    <Left>
                      <Thumbnail square source={{uri: rowData.uri}} style={{justifyContent: 'center', marginLeft: 15, width: 40, height: 40}}/>
                    </Left>
                    <Body style={{borderBottomWidth: 0}}>
                      {rowData.nama_dokumen !== null && <Text>{rowData.nama_dokumen}</Text>}
                    </Body>
                    <Right style={{flexDirection: "row", alignItems: 'center', paddingRight: 0}}>
                      {fbukti.length > 1 && rowID != 0 && 
                        <Button transparent onPress={() => this._changeOrder('bukti',rowID,'up')}><Icon name="arrow-up"/></Button>}
                      {fbukti.length > 1 && rowID != (fbukti.length-1) && 
                        <Button transparent onPress={() => this._changeOrder('bukti',rowID,'down')}><Icon name="arrow-down"/></Button>}
                      <Button transparent onPress={() => this._removeImage('bukti',rowID)}>
                        <Icon type="MaterialIcons" name="delete" style={{color: 'red'}}/>
                      </Button>
                    </Right>
                  </ListItem>
                  }
              />
              
          </Form>
        </Content>
      );
    }
  }
}
