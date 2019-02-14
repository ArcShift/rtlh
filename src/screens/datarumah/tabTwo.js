import React, { Component } from "react";
import { Content, Spinner, Text, Icon, Body, Form, ListItem, Item, Label, Input, Button, Picker } from "native-base";
import { api } from '../../config/config';
import styles from "./styles";

export default class TabTwo extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: true,
      noUrut: '',
      nikPB: '',
      namaPB: '',
      umur: '',
      alamat: '',
      luasRumah: '',
      jmlPenghuni: '',
      jmlKK: '',
      selectedJK: undefined,
      selectedStatusKawin: undefined,
      selectedStatusFisik: undefined,
      selectedPendidikan: undefined,
      selectedPekerjaan: undefined,
      selectedPenghasilan: undefined,
      nominalPenghasilan: '',
      selectedKesesuaianUMP: undefined,
      selectedApakahKRT: undefined,
      dataPendidikan: [],
      dataPekerjaan: [],
      dataPenghasilan: [],
      dataKesesuaianUMP: [],
    };
  }

  componentWillMount() {
    this.init();
  }

  componentDidMount() {
    var dataEdit = this.props.data;
    if (dataEdit && dataEdit.length != 0 ) {
      this.setNoUrut(dataEdit.no_urut_target);
      this.setNikPB(dataEdit.nik_penerima_bantuan);
      this.setNamaPB(dataEdit.nama_penerima_bantuan);
      this.setUmur(dataEdit.umur);
      this.setAlamat(dataEdit.alamat_rumah);
      this.setLuasRumah(dataEdit.luas_rumah);
      this.setJmlPenghuni(dataEdit.jumlah_penghuni);
      this.setJmlKK(dataEdit.jumlah_kk_dalam_rumah);
      this.setState({selectedJK: dataEdit.jenis_kelamin});
      this.props.updateJK(dataEdit.jenis_kelamin);
      this.setState({selectedStatusKawin: dataEdit.status_perkawinan});
      this.props.updateStatusKawin(dataEdit.status_perkawinan);
      this.setState({selectedStatusFisik: dataEdit.status_fisik});
      this.props.updateStatusFisik(dataEdit.status_fisik);
      this.setState({selectedPendidikan: dataEdit.id_pendidikan});
      this.props.updatePendidikan(dataEdit.id_pendidikan);
      this.setState({selectedPekerjaan: dataEdit.id_pekerjaan});
      this.props.updatePekerjaan(dataEdit.id_pekerjaan);
      this.setState({selectedPenghasilan: dataEdit.id_penghasilan});
      this.props.updatePenghasilan(dataEdit.id_penghasilan);
      this.setNominalPenghasilan(dataEdit.nominal_penghasilan);
      this.setState({selectedKesesuaianUMP: dataEdit.id_kesesuaian_ump});
      this.props.updateIdKesesuaianUMP(dataEdit.id_kesesuaian_ump);
      this.setState({selectedApakahKRT: dataEdit.apakah_kepala_keluarga});
      this.props.updateApakahKRT(dataEdit.apakah_kepala_keluarga);
    } else {
      this.props.updateApakahKRT('Ya');
    }
  }

  init = async() => {
    this.dataPendidikan();
    this.dataPekerjaan();
    this.dataPenghasilan();
    this.dataKesesuaianUMP();
  }

  dataPendidikan = async () => {
    fetch(api.url + "master/pendidikan", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataPendidikan: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Pendidikan tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Pendidikan gagal dimuat.", buttonText: "Okay", duration: 10000 });
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
        this.setState({loading: false});
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

  setNoUrut(text) {
    this.setState({ noUrut: text });
    this.props.updateNoUrut(text);
  }
  
  setNikPB(text) {
    this.setState({nikPB: text});
    this.props.updateNikPB(text);
  }
  
  setNamaPB(text) {
    this.setState({namaPB: text});
    this.props.updateNamaPB(text);
  }
  
  setUmur(text) {
    this.setState({umur: text});
    this.props.updateUmur(text);
  }
  
  setAlamat(text) {
    this.setState({alamat: text});
    this.props.updateAlamat(text);
  }
  
  setLuasRumah(text) {
    this.setState({luasRumah: text});
    this.props.updateLuasRumah(text);
  }
  
  setJmlPenghuni(text) {
    this.setState({jmlPenghuni: text});
    this.props.updateJmlPenghuni(text);
  }
  
  setJmlKK(text) {
    this.setState({jmlKK: text});
    this.props.updateJmlKK(text);
  }
  
  setNominalPenghasilan(text) {
    this.setState({nominalPenghasilan: text});
    this.props.updateNominalPenghasilan(text);
  }

  render() {
    
    // data pendidikan
    var dpend = this.state.dataPendidikan;
    if (dpend.length == 0) { var dpend_header = "Tidak ada data"; }
    else { var dpend_header = "Pilih"; }
    
    // data pekerjaan
    var dpek = this.state.dataPekerjaan;
    if (dpek.length == 0) { var dpek_header = "Tidak ada data"; }
    else { var dpek_header = "Pilih"; }
    
    // data penghasilan
    var dpeng = this.state.dataPenghasilan;
    if (dpeng.length == 0) { var dpeng_header = "Tidak ada data"; }
    else { var dpeng_header = "Pilih"; }

    // data penghasilan
    var dkesu = this.state.dataKesesuaianUMP;
    if (dkesu.length == 0) { var dkesu_header = "Tidak ada data"; }
    else { var dkesu_header = "Pilih"; }
    
    if(this.state.loading) {
      return (<Spinner color="blue"/>);
    } else {
      return (
        <Content style={styles.container}>
          <Form style={{marginBottom: 20}}>
            <Item stackedLabel>
              <Label>No Urut Target</Label>
              <Input onChangeText={(e) => this.setNoUrut(e)} value={this.state.noUrut} keyboardType="phone-pad"/>
            </Item>
            <Item stackedLabel>
              <Label>NIK Penerima Bantuan</Label>
              <Input onChangeText={(e) => this.setNikPB(e)} value={this.state.nikPB} keyboardType="phone-pad"/>
            </Item>
            <Item stackedLabel>
              <Label>Nama Penerima Bantuan *</Label>
              <Input onChangeText={(e) => this.setNamaPB(e)} value={this.state.namaPB}/>
            </Item>

            <Label style={styles.selfLabel}>Jenis Kelamin</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedJK}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedJK: itemValue});
                  this.props.updateJK(itemValue);
                }}
              >
                <Item label="Pilih" value={null}/>
                <Item label="Laki-Laki" value="Laki-Laki"/>
                <Item label="Perempuan" value="Perempuan"/>
              </Picker>
            </ListItem>

            <Item stackedLabel>
              <Label>Umur</Label>
              <Input onChangeText={(e) => this.setUmur(e)} value={this.state.umur}/>
            </Item>

            <Label style={styles.selfLabel}>Status Perkawinan</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedStatusKawin}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedStatusKawin: itemValue});
                  this.props.updateStatusKawin(itemValue);
                }}
              >
                <Item label="Pilih" value={null}/>
                <Item label="Belum Menikah" value="Belum Menikah"/>
                <Item label="Menikah" value="Menikah"/>
                <Item label="Janda/Duda" value="Janda/Duda"/>
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Status Fisik</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedStatusFisik}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedStatusFisik: itemValue});
                  this.props.updateStatusFisik(itemValue);
                }}
              >
                <Item label="Pilih" value={null}/>
                <Item label="Sehat" value="Sehat"/>
                <Item label="Disabilitas" value="Disabilitas"/>
              </Picker>
              </ListItem>

            <Label style={styles.selfLabel}>Pendidikan</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedPendidikan}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedPendidikan: itemValue});
                  this.props.updatePendidikan(itemValue);
                }}
              >
                <Item label={dpend_header} value={null}/>
                {dpend.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>
            
            <Label style={styles.selfLabel}>Pekerjaan</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedPekerjaan}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedPekerjaan: itemValue});
                  this.props.updatePekerjaan(itemValue);
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
                selectedValue={this.state.selectedPenghasilan}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedPenghasilan: itemValue});
                  this.props.updatePenghasilan(itemValue);
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
              <Input onChangeText={(e) => this.setNominalPenghasilan(e)} value={this.state.nominalPenghasilan} keyboardType="numeric"/>
            </Item>

            <Label style={styles.selfLabel}>Kesesuaian UMP</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedKesesuaianUMP}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedKesesuaianUMP: itemValue});
                  this.props.updateIdKesesuaianUMP(itemValue);
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
                selectedValue={this.state.selectedApakahKRT}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedApakahKRT: itemValue});
                  this.props.updateApakahKRT(itemValue);
                }}
              >
                <Item label="Ya" value="Ya"/>
                <Item label="Tidak" value="Tidak"/>
              </Picker>
            </ListItem>

            <Item stackedLabel>
              <Label>Alamat</Label>
              <Input onChangeText={(e) => this.setAlamat(e)} value={this.state.alamat} multiline={true}/>
            </Item>
            <Item stackedLabel>
              <Label>Luas Rumah</Label>
              <Input onChangeText={(e) => this.setLuasRumah(e)} value={this.state.luasRumah}/>
            </Item>
            <Item stackedLabel>
              <Label>Jumlah Penghuni</Label>
              <Input onChangeText={(e) => this.setJmlPenghuni(e)} value={this.state.jmlPenghuni}/>
            </Item>
            <Item stackedLabel>
              <Label>Jumlah Kepala Keluarga</Label>
              <Input onChangeText={(e) => this.setJmlKK(e)} value={this.state.jmlKK}/>
            </Item>
          </Form>
        </Content>
      );
    }
  }
}
