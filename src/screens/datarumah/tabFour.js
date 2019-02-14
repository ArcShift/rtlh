import React, { Component } from "react";
import { Content, Spinner, Text, Icon, Body, Form, ListItem, Item, Label, Input, Button, Picker } from "native-base";
import { api } from '../../config/config';
import styles from "./styles";

export default class TabFour extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading: true,
        dataKondisi: [],
        
        selectedMaterialPondasi: undefined,
        selectedKondisiPondasi: undefined,
        catatanKondisiPondasi: '',
        selectedMaterialKolomBalok: undefined,
        selectedKondisiKolomBalok: undefined,
        catatanKondisiKolomBalok: '',
        selectedMaterialKonstruksiAtap: undefined,
        selectedKondisiKonstruksiAtap: undefined,
        catatanKondisiKonstruksiAtap: '',
        selectedProteksiKebakaran: undefined,
        saranaProteksiKebakaranLainnya: '',
        prasaranaProteksiKebakaranLainnya: '',
        
        dataMaterialPondasi: [],
        dataMaterialKolomBalok: [],
        dataMaterialKonstruksiAtap: [],
        
        selectedMaterialAtap: undefined,
        selectedKondisiAtap: undefined,
        catatanKondisiAtap: '',
        selectedMaterialDinding: undefined,
        selectedKondisiDinding: undefined,
        catatanKondisiDinding: '',
        selectedMaterialLantai: undefined,
        selectedKondisiLantai: undefined,
        catatanKondisiLantai: '',
        dataMaterialAtap: [],
        dataMaterialDinding: [],
        dataMaterialLantai: [],
    };
  }

  componentWillMount() {
    this.init();
  }

  componentDidMount() {
    var dataEdit = this.props.data;
    if (dataEdit && dataEdit.length != 0 ) {
      this.setState({selectedMaterialPondasi: dataEdit.id_material_pondasi});
      this.props.updateMaterialPondasi(dataEdit.id_material_pondasi);
      this.setState({selectedKondisiPondasi: dataEdit.id_kondisi_pondasi});
      this.props.updateKondisiPondasi(dataEdit.id_kondisi_pondasi);
      this.setState({catatanKondisiPondasi: dataEdit.catatan_kondisi_pondasi});
      this.props.updateCatatanPondasi(dataEdit.catatan_kondisi_pondasi);

      this.setState({selectedMaterialKolomBalok: dataEdit.id_material_kolom_balok});
      this.props.updateMaterialKolomBalok(dataEdit.id_material_kolom_balok);
      this.setState({selectedKondisiKolomBalok: dataEdit.id_kondisi_kolom_balok});
      this.props.updateKondisiKolomBalok(dataEdit.id_kondisi_kolom_balok);
      this.setState({catatanKondisiKolomBalok: dataEdit.catatan_kondisi_kolom_balok});
      this.props.updateCatatanKolomBalok(dataEdit.catatan_kondisi_kolom_balok);
      
      this.setState({selectedMaterialKonstruksiAtap: dataEdit.id_material_konstruksi_atap});
      this.props.updateMaterialKonstruksiAtap(dataEdit.id_material_konstruksi_atap);
      this.setState({selectedKondisiKonstruksiAtap: dataEdit.id_kondisi_konstruksi_atap});
      this.props.updateKondisiKonstruksiAtap(dataEdit.id_kondisi_konstruksi_atap);
      this.setState({catatanKondisiKonstruksiAtap: dataEdit.catatan_kondisi_konstruksi_atap});
      this.props.updateCatatanKonstruksiAtap(dataEdit.catatan_kondisi_konstruksi_atap);

      this.setState({selectedProteksiKebakaran: dataEdit.proteksi_kebakaran});
      this.props.updateProteksiKebakaran(dataEdit.proteksi_kebakaran);
      this.setSaranaProteksiKebakaranLainnya(dataEdit.sarana_proteksi_kebakaran_lainnya);
      this.setPrasaranaProteksiKebakaranLainnya(dataEdit.prasarana_proteksi_kebakaran_lainnya);
      
      this.setState({selectedMaterialAtap: dataEdit.id_material_atap});
      this.props.updateMaterialAtap(dataEdit.id_material_atap);
      this.setState({selectedKondisiAtap: dataEdit.id_kondisi_atap});
      this.props.updateKondisiAtap(dataEdit.id_kondisi_atap);
      this.setState({catatanKondisiAtap: dataEdit.catatan_kondisi_atap});
      this.props.updateCatatanAtap(dataEdit.catatan_kondisi_atap);

      this.setState({selectedMaterialDinding: dataEdit.id_material_dinding});
      this.props.updateMaterialDinding(dataEdit.id_material_dinding);
      this.setState({selectedKondisiDinding: dataEdit.id_kondisi_dinding});
      this.props.updateKondisiDinding(dataEdit.id_kondisi_dinding);
      this.setState({catatanKondisiDinding: dataEdit.catatan_kondisi_dinding});
      this.props.updateCatatanDinding(dataEdit.catatan_kondisi_dinding);

      this.setState({selectedMaterialLantai: dataEdit.id_material_lantai});
      this.props.updateMaterialLantai(dataEdit.id_material_lantai);
      this.setState({selectedKondisiLantai: dataEdit.id_kondisi_lantai});
      this.props.updateKondisiLantai(dataEdit.id_kondisi_lantai);
      this.setState({catatanKondisiLantai: dataEdit.catatan_kondisi_lantai});
      this.props.updateCatatanLantai(dataEdit.catatan_kondisi_lantai);
    }
  }

  init = async() => {
    this.dataMaterialPondasi();
    this.dataMaterialKolomBalok();
    this.dataMaterialKonstruksiAtap();
    this.dataMaterialAtap();
    this.dataMaterialDinding();
    this.dataMaterialLantai();
    this.dataKondisi();
  }

  dataMaterialPondasi = async () => {
    fetch(api.url + "master/material_pondasi", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataMaterialPondasi: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Material Pondasi tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Material Pondasi gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }

  dataMaterialKolomBalok = async () => {
    fetch(api.url + "master/material_kolom_balok", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataMaterialKolomBalok: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Material Kolom Balok tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Material Kolom Balok gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }

  dataMaterialKonstruksiAtap = async () => {
    fetch(api.url + "master/material_konstruksi_atap", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataMaterialKonstruksiAtap: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Material Konstruksi Atap tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Material Konstruksi Atap gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }

  dataMaterialAtap = async () => {
    fetch(api.url + "master/material_atap", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataMaterialAtap: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Material Atap tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Material Atap gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }

  dataMaterialDinding = async () => {
    fetch(api.url + "master/material_dinding", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataMaterialDinding: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Material Dinding tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Material Dinding gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }

  dataMaterialLantai = async () => {
    fetch(api.url + "master/material_lantai", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataMaterialLantai: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Material Lantai tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Material Lantai gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }

  dataKondisi = async () => {
    fetch(api.url + "master/kondisi", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataKondisi: response.data});
        this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Kondisi tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Kondisi gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .then(() => {
      this.setState({loading: false});
    })
    .done();
  }

  setCatatanKondisiPondasi(text) {
    this.setState({catatanKondisiPondasi: text});
    this.props.updateCatatanPondasi(text);
  }

  setCatatanKondisiKolomBalok(text) {
    this.setState({catatanKondisiKolomBalok: text});
    this.props.updateCatatanKolomBalok(text);
  }

  setCatatanKondisiKonstruksiAtap(text) {
    this.setState({catatanKondisiKonstruksiAtap: text});
    this.props.updateCatatanKonstruksiAtap(text);
  }

  setSaranaProteksiKebakaranLainnya(text) {
    this.setState({saranaProteksiKebakaranLainnya: text});
    this.props.updateSaranaProteksiKebakaranLainnya(text);
  }

  setPrasaranaProteksiKebakaranLainnya(text) {
    this.setState({prasaranaProteksiKebakaranLainnya: text});
    this.props.updatePrasaranaProteksiKebakaranLainnya(text);
  }
  
  setCatatanKondisiAtap(text) {
    this.setState({catatanKondisiAtap: text});
    this.props.updateCatatanAtap(text);
  }

  setCatatanKondisiDinding(text) {
    this.setState({catatanKondisiDinding: text});
    this.props.updateCatatanDinding(text);
  }

  setCatatanKondisiLantai(text) {
    this.setState({catatanKondisiLantai: text});
    this.props.updateCatatanLantai(text);
  }

  render() {
    // data material pondasi
    var dmp = this.state.dataMaterialPondasi;
    if (dmp.length == 0) { var dmp_header = "Tidak ada data"; }
    else { var dmp_header = "Pilih"; }
    // data material kolom balok
    var dmkb = this.state.dataMaterialKolomBalok;
    if (dmkb.length == 0) { var dmkb_header = "Tidak ada data"; }
    else { var dmkb_header = "Pilih"; }
    // data material konstruksi atap
    var dmka = this.state.dataMaterialKonstruksiAtap;
    if (dmka.length == 0) { var dmka_header = "Tidak ada data"; }
    else { var dmka_header = "Pilih"; }
    // data material atap
    var dma = this.state.dataMaterialAtap;
    if (dma.length == 0) { var dma_header = "Tidak ada data"; }
    else { var dma_header = "Pilih"; }
    // data material dinding
    var dmd = this.state.dataMaterialDinding;
    if (dmd.length == 0) { var dmd_header = "Tidak ada data"; }
    else { var dmd_header = "Pilih"; }
    // data material lantai
    var dml = this.state.dataMaterialLantai;
    if (dml.length == 0) { var dml_header = "Tidak ada data"; }
    else { var dml_header = "Pilih"; }
    // data kondisi
    var dk = this.state.dataKondisi;
    if (dk.length == 0) { var dk_header = "Tidak ada data"; }
    else { var dk_header = "Pilih"; }
    
    if(this.state.loading) {
      return (<Spinner color="blue"/>);
    } else {
      return (
        <Content style={styles.container}>
          <Form style={{marginBottom: 20}}>
            <Label style={styles.selfLabel}>Material Pondasi</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedMaterialPondasi}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedMaterialPondasi: itemValue});
                    this.props.updateMaterialPondasi(itemValue);
                }}
              >
                <Item label={dmp_header} value={null}/>
                {dmp.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Kondisi Pondasi</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedKondisiPondasi}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedKondisiPondasi: itemValue});
                    this.props.updateKondisiPondasi(itemValue);
                }}
              >
                <Item label={dk_header} value={null}/>
                {dk.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Item stackedLabel>
              <Label>Catatan Kondisi Pondasi</Label>
              <Input onChangeText={(e) => this.setCatatanKondisiPondasi(e)} value={this.state.catatanKondisiPondasi} multiline={true}/>
            </Item>

            <Label style={styles.selfLabel}>Material Kolom Balok</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedMaterialKolomBalok}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedMaterialKolomBalok: itemValue});
                    this.props.updateMaterialKolomBalok(itemValue);
                }}
              >
                <Item label={dmkb_header} value={null}/>
                {dmkb.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Kondisi Kolom Balok</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedKondisiKolomBalok}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedKondisiKolomBalok: itemValue});
                    this.props.updateKondisiKolomBalok(itemValue);
                }}
              >
                <Item label={dk_header} value={null}/>
                {dk.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Item stackedLabel>
              <Label>Catatan Kondisi Kolom Balok</Label>
              <Input onChangeText={(e) => this.setCatatanKondisiKolomBalok(e)} value={this.state.catatanKondisiKolomBalok} multiline={true}/>
            </Item>

            <Label style={styles.selfLabel}>Material Konstruksi Atap</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedMaterialKonstruksiAtap}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedMaterialKonstruksiAtap: itemValue});
                    this.props.updateMaterialKonstruksiAtap(itemValue);
                }}
              >
                <Item label={dmka_header} value={null}/>
                {dmka.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Kondisi Konstruksi Atap</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedKondisiKonstruksiAtap}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedKondisiKonstruksiAtap: itemValue});
                    this.props.updateKondisiKonstruksiAtap(itemValue);
                }}
              >
                <Item label={dk_header} value={null}/>
                {dk.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Item stackedLabel>
              <Label>Catatan Kondisi Konstruksi Atap</Label>
              <Input onChangeText={(e) => this.setCatatanKondisiKonstruksiAtap(e)} value={this.state.catatanKondisiKonstruksiAtap} multiline={true}/>
            </Item>

            <Label style={styles.selfLabel}>Proteksi Kebakaran</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedProteksiKebakaran}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedProteksiKebakaran: itemValue});
                  this.props.updateProteksiKebakaran(itemValue);
                }}
              >
                <Item label="Pilih" value={null}/>
                <Item label="Ada" value="Ada"/>
                <Item label="Tidak Ada" value="Tidak Ada"/>
              </Picker>
            </ListItem>
            
            <Item stackedLabel>
              <Label>Sarana Proteksi Kebakaran</Label>
              <Input onChangeText={(e) => this.setSaranaProteksiKebakaranLainnya(e)} value={this.state.saranaProteksiKebakaranLainnya} multiline={true}/>
            </Item>

            <Item stackedLabel>
              <Label>Prasarana Proteksi Kebakaran</Label>
              <Input onChangeText={(e) => this.setPrasaranaProteksiKebakaranLainnya(e)} value={this.state.prasaranaProteksiKebakaranLainnya} multiline={true}/>
            </Item>

            
            
            <Label style={styles.selfLabel}>Material Atap</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedMaterialAtap}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedMaterialAtap: itemValue});
                    this.props.updateMaterialAtap(itemValue);
                }}
              >
                <Item label={dma_header} value={null}/>
                {dma.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Kondisi Atap</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedKondisiAtap}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedKondisiAtap: itemValue});
                    this.props.updateKondisiAtap(itemValue);
                }}
              >
                <Item label={dk_header} value={null}/>
                {dk.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Item stackedLabel>
              <Label>Catatan Kondisi Atap</Label>
              <Input onChangeText={(e) => this.setCatatanKondisiAtap(e)} value={this.state.catatanKondisiAtap} multiline={true}/>
            </Item>

            <Label style={styles.selfLabel}>Material Dinding</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedMaterialDinding}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedMaterialDinding: itemValue});
                    this.props.updateMaterialDinding(itemValue);
                }}
              >
                <Item label={dmd_header} value={null}/>
                {dmd.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Kondisi Dinding</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedKondisiDinding}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedKondisiDinding: itemValue});
                    this.props.updateKondisiDinding(itemValue);
                }}
              >
                <Item label={dk_header} value={null}/>
                {dk.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Item stackedLabel>
              <Label>Catatan Kondisi Dinding</Label>
              <Input onChangeText={(e) => this.setCatatanKondisiDinding(e)} value={this.state.catatanKondisiDinding} multiline={true}/>
            </Item>

            <Label style={styles.selfLabel}>Material Lantai</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedMaterialLantai}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedMaterialLantai: itemValue});
                    this.props.updateMaterialLantai(itemValue);
                }}
              >
                <Item label={dml_header} value={null}/>
                {dml.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Kondisi Lantai</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedKondisiLantai}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedKondisiLantai: itemValue});
                    this.props.updateKondisiLantai(itemValue);
                }}
              >
                <Item label={dk_header} value={null}/>
                {dk.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Item stackedLabel>
              <Label>Catatan Kondisi Lantai</Label>
              <Input onChangeText={(e) => this.setCatatanKondisiLantai(e)} value={this.state.catatanKondisiLantai} multiline={true}/>
            </Item>

          </Form>
        </Content>
      );
    }
  }
}
