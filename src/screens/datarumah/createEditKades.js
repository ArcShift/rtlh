import React, { Component } from "react";
import { Alert, AsyncStorage, Image } from "react-native";
import { api } from '../../config/config';
import Exponent, { Constants, ImagePicker, registerRootComponent, Permissions, ImageManipulator } from 'expo';
import Modal from "react-native-modal";
import DatePicker from 'react-native-datepicker';
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
import styles from "./styles";
import mstyles from "./modal.styles";
import TabSeven from "./tabSeven";

class createEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadingDesa: false,
      loadingFile: false,
      isModalVisible: false,
      tgl_survey: '',
      kecamatan: '',
      desa: '',
      nama_pb: '',
      nik_pb: '',
      jk: '',
      umur: '',
      status: '',
      apakah_krt: '',
      alamat: '',
      jml_penghuni: '',
      pekerjaan: '',
      penghasilan: '',
      nominal_penghasilan: '',
      id_kesesuaian_ump: '',
      sk_rumah: '',
      aset_rumah_lain: '',
      sk_tanah: '',
      status_bantuan_perum: '',
      lat: '',
      long: '',
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
      
      dataKecamatan : [],
      dataDesa: [],
      dataPekerjaan: [],
      dataPenghasilan: [],
      dataKesesuaianUMP: [],
      dataSBPerum: [],
      dataSKTanah: [],
      dataSKRumah: [],
      dataId: '',
      dataLoaded: false,
      edit: false
    };
  }

  update_lat = (text) => {this.setState({ lat: text })};
  update_long = (text) => {this.setState({ long: text })};
  update_lokasi = (lat, lng) => {this.setState({ lat: lat, long: lng })};
  
  componentWillMount() {
    this.init();
    this.setState({folder_temp: 'temp_' + Date.now()});
    // if edit
    if(this._getId() !== false) {
      this.setState({dataId: this._getId()});
      this.setState({edit: true});
      this.dataEdit();
    }
  }

  componentDidMount() {
    AsyncStorage.getItem("iduser").then((value) => {
      this.setState({id_user: value});
    });
  }

  init = async() => {
    this.dataKecamatan();
    this.dataPekerjaan();
    this.dataPenghasilan();
    this.dataKesesuaianUMP();
    this.dataSBPerum();
    this.dataSKTanah();
    this.dataSKRumah();
  }

  _getId() {
    let id = false;
    if(this.props.navigation.state.params.dataId) {
      id = this.props.navigation.state.params.dataId;
    }
    return id;
  }

  _getUserId() {
    let userId = false;
    if(this.props.navigation.state.params) {
      userId = this.props.navigation.state.params.id_user;
    }
    return userId;
  }
  
  dataEdit = async () => {
      var baseUrl = api.url + "data_rumah/detail";
      var url = baseUrl;

      url = url + "?id=" + this._getId() + "&id_user=" + this._getUserId();
      console.log(url);

      fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message == 'success') {
          console.log(response.data);
          let d = response.data;
          this.dataDesa(d.id_skpd_kecamatan);
          this.update_lat(d.latitude);
          this.update_long(d.longitude);
          this.update_lokasi(d.latitude, d.longitude);
          this.setState({
            tgl_survey: d.tgl_survey,
            kecamatan: d.id_skpd_kecamatan,
            desa: d.id_skpd_desa,
            nama_pb: d.nama_penerima_bantuan,
            nik_pb: d.nik_penerima_bantuan,
            jk: d.jenis_kelamin,
            umur: d.umur,
            status: d.status_perkawinan,
            apakah_krt: d.apakah_kepala_keluarga,
            alamat: d.alamat_rumah,
            jml_penghuni: d.jumlah_penghuni,
            pekerjaan: d.id_pekerjaan,
            penghasilan: d.id_penghasilan,
            nominal_penghasilan: d.nominal_penghasilan,
            id_kesesuaian_ump: d.id_kesesuaian_ump,
            sk_rumah: d.id_status_kepemilikan_rumah,
            aset_rumah_lain: d.aset_rumah_lain,
            sk_tanah: d.id_status_kepemilikan_tanah,
            status_bantuan_perum: d.id_status_bantuan_perumahan,
            file_ktp: d.file_ktp,
            file_kk: d.file_kk,
            file_rumah: d.file_rumah,
            file_bukti_sk_rumah: d.file_bukti_sk_rumah,
          });
          this.setState({dataLoaded: true});
        }
      })
      .catch(error => {
        //console.warn(error)
        Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 3000 });
      })
      .done();
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
              .then(response => response.text())
              .then(body => {
                  console.log(body);
                  var jsonResp = JSON.parse(body);
                  console.log(jsonResp);
                  if (jsonResp.message == 'success') {
                    var res_data = jsonResp.data;
                    var value = { nama_dokumen: null, uri: data.uri, path: res_data.path };
                    if(type == 'ktp') {
                      var joined = this.state.file_ktp.concat(value);
                      this.setState({ file_ktp: joined });
                    } else if(type == 'kk') {
                      var joined = this.state.file_kk.concat(value);
                      this.setState({ file_kk: joined });
                    } else if(type == 'rumah') {
                      var joined = this.state.file_rumah.concat(value);
                      this.setState({ file_rumah: joined });
                    } else if(type == 'bukti') {
                      var joined = this.state.file_bukti_sk_rumah.concat(value);
                      this.setState({ file_bukti_sk_rumah: joined });
                    }
                  } else {
                    Toast.show({ text: jsonResp.message, buttonText: "Okay", duration: 3000 })
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

  _toggleModal = (type, index) => {
    this.setState({ isModalVisible: true });
    this.setState({ type_temp: type });
    this.setState({ index_temp: index });

    if(type == 'ktp') var data = this.state.file_ktp;
    else if(type == 'kk') var data = this.state.file_kk;
    else if(type == 'rumah') var data = this.state.file_rumah;
    else if(type == 'bukti') var data = this.state.file_bukti_sk_rumah;
    this.setState({ filename_temp: data[index].nama_dokumen });
  }
  
  _changeName = () => {
    this.setState({ isModalVisible: false });
    var type = this.state.type_temp;
    var index = this.state.index_temp;
    var value = this.state.filename_temp;

    if(type == 'ktp') var data = this.state.file_ktp;
    else if(type == 'kk') var data = this.state.file_kk;
    else if(type == 'rumah') var data = this.state.file_rumah;
    else if(type == 'bukti') var data = this.state.file_bukti_sk_rumah;
    
    console.log(data);
    var newData = JSON.parse(JSON.stringify(data));
    newData[index].nama_dokumen = value;
    console.log(newData);

    if(type == 'ktp') this.setState({ file_ktp: newData });
    else if(type == 'kk') this.setState({ file_kk: newData });
    else if(type == 'rumah') this.setState({ file_rumah: newData });
    else if(type == 'bukti') this.setState({ file_bukti_sk_rumah: newData });

    // reset temp value
    this.setState({ type_temp: '' });
    this.setState({ index_temp: '' });
    this.setState({ filename_temp: null });

    Toast.show({ text: 'Nama File berhasil disimpan.', duration: 3000 });
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

    data.splice(index,1);
    var newData = JSON.parse(JSON.stringify(data));

    if(type == 'ktp') this.setState({ file_ktp: newData });
    else if(type == 'kk') this.setState({ file_kk: newData });
    else if(type == 'rumah') this.setState({ file_rumah: newData });
    else if(type == 'bukti') this.setState({ file_bukti_sk_rumah: newData });
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

  _submit = () => {
    var formBody = this.state;
    
    if (formBody.tgl_survey == '') {
        Toast.show({ text: "Tanggal Survey harus diisi.", buttonText: "Okay", duration: 3000 });
    } else if (formBody.kecamatan == '') {
        Toast.show({ text: "Kecamatan harus diisi.", buttonText: "Okay", duration: 3000 });
    } else if (formBody.desa == '') {
        Toast.show({ text: "Desa/Kelurahan harus diisi.", buttonText: "Okay", duration: 3000 });
    } else if (formBody.nama_pb == '') {
        Toast.show({ text: "Nama Penerima Bantuan harus diisi.", buttonText: "Okay", duration: 3000 });
    } else {
        var proceed = false;
        if (this.state.edit) {
          var act = 'update';
        } else {
          var act = 'create';
        }
    
        url = api.url + "data_rumah/" + act + "?id_user=" + this.state.id_user;
        console.log("URL = " + url);
        console.log("JSON = " + JSON.stringify(formBody));
        
        try {
          fetch(url, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',},
            body: JSON.stringify(formBody)
          })
            .then(response => response.text())
            .then(body => {
              console.log(body);
              var jsonResp = JSON.parse(body);
              console.log(jsonResp);
              if (jsonResp.message == 'success') {
                proceed = true;
              } else {
                Toast.show({ text: jsonResp.message, buttonText: "Okay", duration: 3000 })
              }
            })
            .catch(error => {
              console.log(error);
              Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 3000 })
            })
            .then(() => {
              if(proceed) {
                Toast.show({ text: 'Data berhasil disimpan.', buttonText: "Okay", duration: 3000 });
                this.props.navigation.state.params.refresh();
                this.props.navigation.goBack();
              }
            })
            .done();
        } catch (error) {
          Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 3000 });
        }
     }
  }

  setKecamatan(value) {
    if(value !== null) {
      this.setState({loadingDesa: true});
      this.setState({ kecamatan: value });
      this.dataDesa(value);
    }
  }

  dataKecamatan = async () => {
    var url = api.url + "data_rumah/filter?id_user=" + this._getUserId();
    console.log(url);
    
    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataKecamatan: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Kecamatan tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Kecamatan Rumah gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }

  dataDesa = async (idkec) => {
    var url = api.url + "data_rumah/filter?id_user=" + this._getUserId() + "&kecamatan=" + idkec;
    console.log(url);
    
    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataDesa: response.data});
        this.setState({loadingDesa: false});
      } else {
        Toast.show({ text: "Data Desa tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Desa gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }

  dataPekerjaan = async () => {
    fetch(api.url + "master/pekerjaan", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataPekerjaan: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Pekerjaan tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Pekerjaan gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }

  dataPenghasilan = async () => {
    fetch(api.url + "master/penghasilan", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataPenghasilan: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Penghasilan tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Penghasilan gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }

  dataKesesuaianUMP = async () => {
    fetch(api.url + "master/kesesuaian_ump", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataKesesuaianUMP: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Kesesuaian UMP tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Kesesuaian UMP gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }
  
  dataSBPerum = async () => {
    fetch(api.url + "master/status_bantuan_perumahan", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataSBPerum: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Status Bantuan Perumahan rumah gagal dimuat.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Status Bantuan Perumahan gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }

  dataSKTanah = async () => {
    fetch(api.url + "master/status_kepemilikan_tanah", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataSKTanah: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Status Kepemilikan Tanah gagal dimuat.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Status Kepemilikan Tanah gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }

  dataSKRumah = async () => {
    fetch(api.url + "master/status_kepemilikan_rumah", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataSKRumah: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Status Kepemilikan Rumah gagal dimuat.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Status Kepemilikan Rumah gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .then(() => {
      this.setState({loading: false});
    })
    .done();
  }

  render() {
    // data kecamatan
    var dk = this.state.dataKecamatan;
    if (dk.length == 0) { var dk_header = "Tidak ada data"; }
    else { var dk_header = "Pilih"; }
    // data desa
    var dd = this.state.dataDesa;
    
    // data pekerjaan
    var dpek = this.state.dataPekerjaan;
    if (dpek.length == 0) { var dpek_header = "Tidak ada data"; }
    else { var dpek_header = "Pilih"; }
    
    // data penghasilan
    var dpeng = this.state.dataPenghasilan;
    if (dpeng.length == 0) { var dpeng_header = "Tidak ada data"; }
    else { var dpeng_header = "Pilih"; }

    // data kesesuaian ump
    var dkesu = this.state.dataKesesuaianUMP;
    if (dkesu.length == 0) { var dkesu_header = "Tidak ada data"; }
    else { var dkesu_header = "Pilih"; }
    
    // data sb perum
    var dsbp = this.state.dataSBPerum;
    if (dsbp.length == 0) { var dsbp_header = "Tidak ada data"; }
    else { var dsbp_header = "Pilih"; }
    
    // data sk tanah
    var dskt = this.state.dataSKTanah;
    if (dskt.length == 0) { var dskt_header = "Tidak ada data"; }
    else { var dskt_header = "Pilih"; }
    
    // data sk rumah
    var dskr = this.state.dataSKRumah;
    if (dskr.length == 0) { var dskr_header = "Tidak ada data"; }
    else { var dskr_header = "Pilih"; }

    // lampiran
    var fktp = this.state.file_ktp;
    var fkk = this.state.file_kk;
    var fr = this.state.file_rumah;
    var fbukti = this.state.file_bukti_sk_rumah;

    if(this.state.edit && !this.state.dataLoaded || this.state.loading) {
      return (
        <Container>
          <Header hasTabs>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back"/>
              </Button>
            </Left>
            <Body>
            <Title>{this.state.edit ? 'Edit' : 'Tambah'} Data Rumah </Title>
            </Body>
            <Right/>
          </Header>
          <Content><Spinner color="blue"/></Content>
        </Container>
      );
    } else {
      return (
        <Container>
          <Header hasTabs>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back"/>
              </Button>
            </Left>
            <Body>
            <Title>{this.state.edit ? 'Edit' : 'Tambah'} Data Rumah </Title>
            </Body>
            <Right/>
          </Header>

          <Tabs renderTabBar={() => <ScrollableTab/>}>
            <Tab heading="Data Survey">
              <Content style={styles.container}>
                <Form style={{marginBottom: 20}}>

                  <Label style={styles.selfLabel}>Tanggal Survey *</Label>
                  <ListItem style={styles.pickerList}>
                    <DatePicker
                      date={this.state.tgl_survey}
                      mode="date"
                      placeholder="Pilih Tanggal"
                      format="YYYY-MM-DD"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      showIcon={false}
                      style={{ width: '100%' }}
                      customStyles={{
                        dateInput: styles.dateInput,
                        dateText: styles.dateText,
                        placeholderText: styles.datePlaceholder
                      }}
                      onDateChange={(date) => {this.setState({tgl_survey: date})}}
                    />
                  </ListItem>
                
                  <Label style={styles.selfLabel}>Kecamatan *</Label>
                  <ListItem style={styles.pickerList}>
                    <Picker
                      mode="dropdown"
                      style={styles.pickerBorder}
                      selectedValue={this.state.kecamatan}
                      onValueChange={this.setKecamatan.bind(this)}
                    >
                      <Item label={dk_header} value={null}/>
                      {dk.map((item) => (
                        <Item key={item.id_skpd} label={item.nama} value={item.id_skpd}/>
                      ))}
                    </Picker>
                  </ListItem>

                  <Label style={styles.selfLabel}>Desa/Kelurahan *</Label>
                  <ListItem style={styles.pickerList}>
                    {this.state.loadingDesa && <Spinner size={20} color="blue" style={{height:50}}/>}
                    {!this.state.loadingDesa && 
                      <Picker
                        mode="dropdown"
                        style={styles.pickerBorder}
                        selectedValue={this.state.desa}
                        onValueChange={(itemValue, itemIndex) => {
                          this.setState({desa: itemValue});
                      }}
                      >
                        <Item label='Pilih' value={null}/>
                        {dd.map((item) => (
                          <Item key={item.id_skpd} label={item.nama} value={item.id_skpd}/>
                        ))}
                      </Picker>
                    }
                  </ListItem>
                </Form>
              </Content>
            </Tab>

            <Tab heading="Identitas Penerima Bantuan">
              <Content style={styles.container}>
                <Form style={{marginBottom: 20}}>
                  <Item stackedLabel>
                    <Label>Nama Penerima Bantuan *</Label>
                    <Input onChangeText={(e) => this.setState({nama_pb: e})} value={this.state.nama_pb}/>
                  </Item>

                  <Item stackedLabel>
                    <Label>KTP / NIK Penerima Bantuan</Label>
                    <Input onChangeText={(e) => this.setState({nik_pb: e})} value={this.state.nik_pb}/>
                  </Item>

                  <Label style={styles.selfLabel}>Jenis Kelamin</Label>
                  <ListItem style={styles.pickerList}>
                    <Picker
                      mode="dropdown"
                      style={styles.pickerBorder}
                      selectedValue={this.state.jk}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({jk: itemValue});
                      }}
                    >
                      <Item label="Pilih" value={null}/>
                      <Item label="Laki-Laki" value="Laki-Laki"/>
                      <Item label="Perempuan" value="Perempuan"/>
                    </Picker>
                  </ListItem>

                  <Item stackedLabel>
                    <Label>Umur</Label>
                    <Input onChangeText={(e) => this.setState({umur: e})} value={this.state.umur} keyboardType="numeric"/>
                  </Item>

                  <Item stackedLabel>
                    <Label>Alamat</Label>
                    <Input onChangeText={(e) => this.setState({alamat: e})} value={this.state.alamat} multiline={true}/>
                  </Item>

                  <Label style={styles.selfLabel}>Status Perkawinan</Label>
                  <ListItem style={styles.pickerList}>
                    <Picker
                      mode="dropdown"
                      style={styles.pickerBorder}
                      selectedValue={this.state.status}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({status: itemValue});
                      }}
                    >
                      <Item label="Pilih" value={null}/>
                      <Item label="Belum Menikah" value="Belum Menikah"/>
                      <Item label="Menikah" value="Menikah"/>
                      <Item label="Janda/Duda" value="Janda/Duda"/>
                    </Picker>
                  </ListItem>

                  <Label style={styles.selfLabel}>Pekerjaan</Label>
                  <ListItem style={styles.pickerList}>
                    <Picker
                      mode="dropdown"
                      style={styles.pickerBorder}
                      selectedValue={this.state.pekerjaan}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({pekerjaan: itemValue});
                      }}
                    >
                      <Item label={dpek_header} value={null}/>
                      {dpek.map((item) => (
                        <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                      ))}
                    </Picker>
                  </ListItem>
                  
                  <Label style={styles.selfLabel}>Penghasilan</Label>
                  <ListItem style={styles.pickerList}>
                    <Picker
                      mode="dropdown"
                      style={styles.pickerBorder}
                      selectedValue={this.state.penghasilan}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({penghasilan: itemValue});
                      }}
                    >
                      <Item label={dpeng_header} value={null}/>
                      {dpeng.map((item) => (
                        <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                      ))}
                    </Picker>
                  </ListItem>

                  <Item stackedLabel>
                    <Label>Nominal Penghasilan</Label>
                    <Input onChangeText={(e) => this.setState({nominal_penghasilan: e})} value={this.state.nominal_penghasilan} keyboardType="numeric"/>
                  </Item>

                  <Label style={styles.selfLabel}>Kesesuaian UMP</Label>
                  <ListItem style={styles.pickerList}>
                    <Picker
                      mode="dropdown"
                      style={styles.pickerBorder}
                      selectedValue={this.state.id_kesesuaian_ump}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({id_kesesuaian_ump: itemValue});
                      }}
                    >
                      <Item label={dkesu_header} value={null}/>
                      {dkesu.map((item) => (
                        <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                      ))}
                    </Picker>
                  </ListItem>
                  
                  <Label style={styles.selfLabel}>Apakah Kepala Keluarga?</Label>
                  <ListItem style={styles.pickerList}>
                    <Picker
                      mode="dropdown"
                      style={styles.pickerBorder}
                      selectedValue={this.state.apakah_krt}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({apakah_krt: itemValue});
                      }}
                    >
                      <Item label="Pilih" value={null}/>
                      <Item label="Ya" value="Ya"/>
                      <Item label="Tidak" value="Tidak"/>
                    </Picker>
                  </ListItem>

                  <Item stackedLabel>
                    <Label>Jumlah Anggota Keluarga</Label>
                    <Input onChangeText={(e) => this.setState({jml_penghuni: e})} value={this.state.jml_penghuni}/>
                  </Item>

                  <Label style={styles.selfLabel}>Menempati Rumah satu-satunya?</Label>
                  <ListItem style={styles.pickerList}>
                    <Picker
                      mode="dropdown"
                      style={styles.pickerBorder}
                      selectedValue={this.state.aset_rumah_lain}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({aset_rumah_lain: itemValue});
                      }}
                    >
                      <Item label="Pilih" value={null}/>
                      <Item label="Ya" value="Tidak Ada"/>
                      <Item label="Tidak" value="Ada"/>
                    </Picker>
                  </ListItem>

                </Form>
              </Content>
            </Tab>

            <Tab heading="Status Rumah">
              <Content style={styles.container}>
                <Form style={{marginBottom: 20}}>
                  <Label style={styles.selfLabel}>Pernah Menerima Bantuan Perumahan</Label>
                  <ListItem style={styles.pickerList}>
                    <Picker
                      mode="dropdown"
                      style={styles.pickerBorder}
                      selectedValue={this.state.status_bantuan_perum}
                      onValueChange={(itemValue, itemIndex) => {
                          this.setState({status_bantuan_perum: itemValue});
                      }}
                    >
                      <Item label={dsbp_header} value={null}/>
                      {dsbp.map((item) => (
                        <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                      ))}
                    </Picker>
                  </ListItem>

                  <Label style={styles.selfLabel}>Status Kepemilikan Tanah</Label>
                  <ListItem style={styles.pickerList}>
                    <Picker
                      mode="dropdown"
                      style={styles.pickerBorder}
                      selectedValue={this.state.sk_tanah}
                      onValueChange={(itemValue, itemIndex) => {
                          this.setState({sk_tanah: itemValue});
                      }}
                    >
                      <Item label={dskt_header} value={null}/>
                      {dskt.map((item) => (
                        <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                      ))}
                    </Picker>
                  </ListItem>

                  <Label style={styles.selfLabel}>Status Kepemilikan Rumah</Label>
                  <ListItem style={styles.pickerList}>
                    <Picker
                      mode="dropdown"
                      style={styles.pickerBorder}
                      selectedValue={this.state.sk_rumah}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({sk_rumah: itemValue});
                      }}
                    >
                      <Item label={dskr_header} value={null}/>
                      {dskr.map((item) => (
                        <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                      ))}
                    </Picker>
                  </ListItem>
                </Form>
              </Content>
            </Tab>

            <Tab heading="Lokasi">
              <TabSeven
                updateLokasi={this.update_lokasi}
				lat={this.state.lat}
				lng={this.state.long}
              />
            </Tab>
            
            <Tab heading="Lampiran">
              <Content style={styles.container}>
              {this.state.loadingFile && <Spinner color="blue"/>}
              {!this.state.loadingFile && 
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
                          {/* <Input placeholder="Masukkan nama file" placeholderTextColor='#bbb' style={{height: 40}} value={rowData.nama_dokumen} onBlur={this._toggleModal('ktp',rowID)}/> */}
                          {rowData.nama_dokumen !== null && <Text onPress={() => this._toggleModal('ktp', rowID)}>{rowData.nama_dokumen}</Text>}
                          {rowData.nama_dokumen === null && 
                            <Button transparent onPress={() => this._toggleModal('ktp', rowID)} ><Text>EDIT NAMA FILE</Text></Button>}
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
                          {/* <Input placeholder="Masukkan nama file" placeholderTextColor='#bbb' style={{height: 40}} value={rowData.nama_dokumen} onBlur={this._toggleModal('ktp',rowID)}/> */}
                          {rowData.nama_dokumen !== null && <Text onPress={() => this._toggleModal('kk', rowID)}>{rowData.nama_dokumen}</Text>}
                          {rowData.nama_dokumen === null && 
                            <Button transparent onPress={() => this._toggleModal('kk', rowID)} ><Text>EDIT NAMA FILE</Text></Button>}
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
                          {/* <Input placeholder="Masukkan nama file" placeholderTextColor='#bbb' style={{height: 40}} value={rowData.nama_dokumen} onBlur={this._toggleModal('ktp',rowID)}/> */}
                          {rowData.nama_dokumen !== null && <Text onPress={() => this._toggleModal('rumah', rowID)}>{rowData.nama_dokumen}</Text>}
                          {rowData.nama_dokumen === null && 
                            <Button transparent onPress={() => this._toggleModal('rumah', rowID)} ><Text>EDIT NAMA FILE</Text></Button>}
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
                          {/* <Input placeholder="Masukkan nama file" placeholderTextColor='#bbb' style={{height: 40}} value={rowData.nama_dokumen} onBlur={this._toggleModal('ktp',rowID)}/> */}
                          {rowData.nama_dokumen !== null && <Text onPress={() => this._toggleModal('bukti', rowID)}>{rowData.nama_dokumen}</Text>}
                          {rowData.nama_dokumen === null && 
                            <Button transparent onPress={() => this._toggleModal('bukti', rowID)} ><Text>EDIT NAMA FILE</Text></Button>}
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
                  
                  <Button block style={{margin: 15, marginTop: 50}} onPress={() => this._confirm()}>
                    <Text>SIMPAN</Text>
                  </Button>
                  <Text style={{marginLeft: 15, marginRight: 15, fontStyle: "italic", fontSize: 12}}>*Pastikan data yang anda
                    isi sudah sesuai dan benar.</Text>

                </Form>
              }
              </Content>
            </Tab>
          </Tabs>
          <View style={mstyles.container}>
          <Modal 
            isVisible={this.state.isModalVisible} 
            onBackButtonPress={() => this.setState({ isModalVisible: false })}
            style={mstyles.bottomModal}>
            <View style={{backgroundColor: 'white'}}>
              <Form>
                <Item stackedLabel>
                  <Label>Nama File</Label>
                  <Input placeholder="Masukkan Nama File" placeholderTextColor="#bbb" onChangeText={(text) => this.setState({filename_temp: text})} value={this.state.filename_temp}/>
                </Item>
              </Form>

              <View style={{flexDirection: "row"}}>
                <Button transparent style={{flex:1,justifyContent:'center'}} onPress={() => this.setState({ isModalVisible: false }) }>
                  <Text>Tutup</Text>
                </Button>
                <Button transparent style={{flex:1,justifyContent:'center'}} onPress={() => this._changeName() }>
                  <Text>Simpan</Text>
                </Button>
              </View>
            </View>
          </Modal>
          </View>
        </Container>
      );
    }
  }
}

export default createEdit;
