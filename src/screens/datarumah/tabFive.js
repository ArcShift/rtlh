import React, { Component } from "react";
import { Content, Spinner, Text, Icon, Body, Form, ListItem, Item, Label, Input, Button, Picker } from "native-base";
import { api } from '../../config/config';
import styles from "./styles";

export default class TabFour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedPencahayaan: undefined,
      selectedVentilasi: undefined,
      catatanPintuJendela: '',
      selectedKondisiPintuJendela: undefined,
      catatanKondisiPintuJendela: '',
      selectedKepemilikanKMJamban: undefined,
      selectedKondisiKMJamban: undefined,
      catatanKMJamban: '',
      selectedPenggunaanFasilitasBab: undefined,
      selectedPembuanganAkhirTinja: undefined,
      selectedSumberAirMinum: undefined,
      selectedJarakSumberAir: undefined,
      selectedSumberListrik: undefined,
      selectedDrainase: undefined,
      selectedTempatSampah: undefined,
      
      dataKepemilikanKMJamban: [],
      dataPenggunaanFasilitasBab: [],
      dataPembuanganAkhirTinja: [],
      dataSumberAirMinum: [],
      dataSumberListrik: [],
      dataKondisi: []
    };
  }

  componentWillMount() {
    this.init();
  }

  componentDidMount() {
    var dataEdit = this.props.data;
    if (dataEdit && dataEdit.length != 0 ) {
      this.setState({selectedPencahayaan: dataEdit.pencahayaan});
      this.props.updatePencahayaan(dataEdit.pencahayaan);
      this.setState({selectedVentilasi: dataEdit.ventilasi});
      this.props.updateVentilasi(dataEdit.ventilasi);
      this.setCatatanPintuJendela(dataEdit.catatan_pintu_jendela);
      this.setState({selectedKondisiPintuJendela: dataEdit.id_kondisi_pintu_jendela});
      this.props.updateKondisiPintuJendela(dataEdit.id_kondisi_pintu_jendela);
      this.setCatatanKondisiPintuJendela(dataEdit.catatan_kondisi_pintu_jendela);
      this.setState({selectedKepemilikanKMJamban: dataEdit.id_kepemilikan_km_jamban});
      this.props.updateKepemilikanKMJamban(dataEdit.id_kepemilikan_km_jamban);
      this.setState({selectedKondisiKMJamban: dataEdit.id_kondisi_km_jamban});
      this.props.updateKondisiKMJamban(dataEdit.id_kondisi_km_jamban);
      this.setCatatanKondisiKMJamban(dataEdit.catatan_kondisi_km_jamban);
      this.setState({selectedPenggunaanFasilitasBab: dataEdit.id_penggunaan_fasilitas_bab});
      this.props.updatePenggunaanFasilitasBab(dataEdit.id_penggunaan_fasilitas_bab);
      this.setState({selectedPembuanganAkhirTinja: dataEdit.id_pembuangan_akhir_tinja});
      this.props.updatePembuanganAkhirTinja(dataEdit.id_pembuangan_akhir_tinja);
      this.setState({selectedSumberAirMinum: dataEdit.id_sumber_air_minum});
      this.props.updateSumberAirMinum(dataEdit.id_sumber_air_minum);
      this.setState({selectedJarakSumberAir: dataEdit.jarak_sumber_air_minum});
      this.props.updateJarakSumberAir(dataEdit.jarak_sumber_air_minum);
      this.setState({selectedSumberListrik: dataEdit.id_sumber_listrik});
      this.props.updateSumberListrik(dataEdit.id_sumber_listrik);
      this.setState({selectedDrainase: dataEdit.drainase});
      this.props.updateDrainase(dataEdit.drainase);
      this.setState({selectedIdKondisiDrainase: dataEdit.id_kondisi_drainase});
      this.props.updateIdKondisiDrainase(dataEdit.id_kondisi_drainase);
      this.setState({selectedTempatSampah: dataEdit.tempat_sampah});
      this.props.updateTempatSampah(dataEdit.tempat_sampah);
    }
  }

  init = async() => {
    this.dataKepemilikanKMJamban();
    this.dataPenggunaanFasilitasBab();
    this.dataPembuanganAkhirTinja();
    this.dataSumberAirMinum();
    this.dataSumberListrik();
    this.dataKondisi();
  }

  dataKepemilikanKMJamban = async () => {
    fetch(api.url + "master/kepemilikan_km_jamban", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataKepemilikanKMJamban: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Kepemilikan Kamar Mandi & Jamban tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Kepemilikan Kamar Mandi & Jamban gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }

  dataPenggunaanFasilitasBab = async () => {
    fetch(api.url + "master/penggunaan_fasilitas_bab", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataPenggunaanFasilitasBab: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Penggunaan Fasilitas BAB tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Penggunaan Fasilitas BAB gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }

  dataPembuanganAkhirTinja = async () => {
    fetch(api.url + "master/pembuangan_akhir_tinja", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataPembuanganAkhirTinja: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Pembuangan Akhir Tinja tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Pembuangan Akhir Tinja gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }

  dataSumberAirMinum = async () => {
    fetch(api.url + "master/sumber_air_minum", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataSumberAirMinum: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Sumber Air Minum tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Sumber Air Minum gagal dimuat.", buttonText: "Okay", duration: 10000 });
    })
    .done();
  }

  dataSumberListrik = async () => {
    fetch(api.url + "master/sumber_listrik", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == 'success') {
        this.setState({dataSumberListrik: response.data});
        //this.setState({loading: false});
      } else {
        Toast.show({ text: "Data Sumber Listrik tidak ditemukan.", buttonText: "Okay", duration: 10000 });
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Data Sumber Listrik gagal dimuat.", buttonText: "Okay", duration: 10000 });
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

  setCatatanPintuJendela(text) {
    this.setState({catatanPintuJendela: text});
    this.props.updateCatatanPintuJendela(text);
  }

  setCatatanKondisiPintuJendela(text) {
    this.setState({catatanKondisiPintuJendela: text});
    this.props.updateCatatanKondisiPintuJendela(text);
  }

  setCatatanKondisiKMJamban(text) {
    this.setState({catatanKMJamban: text});
    this.props.updateCatatanKMJamban(text);
  }

  render() {
    // data kepemilikan km jamban
    var dkkmj = this.state.dataKepemilikanKMJamban;
    if (dkkmj.length == 0) { var dkkmj_header = "Tidak ada data"; }
    else { var dkkmj_header = "Pilih"; }
    // data penggunaan fasilitas bab
    var dpfb = this.state.dataPenggunaanFasilitasBab;
    if (dpfb.length == 0) { var dpfb_header = "Tidak ada data"; }
    else { var dpfb_header = "Pilih"; }
    // data pembuangan akhir tinja
    var dpat = this.state.dataPembuanganAkhirTinja;
    if (dpat.length == 0) { var dpat_header = "Tidak ada data"; }
    else { var dpat_header = "Pilih"; }
    // data sumber air minum
    var dsam = this.state.dataSumberAirMinum;
    if (dsam.length == 0) { var dsam_header = "Tidak ada data"; }
    else { var dsam_header = "Pilih"; }
    // data sumber listrikdsam
    var dsl = this.state.dataSumberListrik;
    if (dsl.length == 0) { var dsl_header = "Tidak ada data"; }
    else { var dsl_header = "Pilih"; }
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
            <Label style={styles.selfLabel}>Pencahayaan</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedPencahayaan}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedPencahayaan: itemValue});
                    this.props.updatePencahayaan(itemValue);
                }}
              >
                <Item label="Pilih" value={null}/>
                <Item label="Memenuhi" value="Memenuhi"/>
                <Item label="Tidak Memenuhi" value="Tidak Memenuhi"/>
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Ventilasi</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedVentilasi}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedVentilasi: itemValue});
                    this.props.updateVentilasi(itemValue);
                }}
              >
                <Item label="Pilih" value={null}/>
                <Item label="Memenuhi" value="Memenuhi"/>
                <Item label="Tidak Memenuhi" value="Tidak Memenuhi"/>
              </Picker>
            </ListItem>

            <Item stackedLabel>
              <Label>Catatan Pintu Jendela</Label>
              <Input onChangeText={(e) => this.setCatatanPintuJendela(e)} value={this.state.catatanPintuJendela} multiline={true}/>
            </Item>

            <Label style={styles.selfLabel}>Kondisi Pintu Jendela</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedKondisiPintuJendela}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedKondisiPintuJendela: itemValue});
                    this.props.updateKondisiPintuJendela(itemValue);
                }}
              >
                <Item label={dk_header} value={null}/>
                {dk.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Item stackedLabel>
              <Label>Catatan Kondisi Pintu Jendela</Label>
              <Input onChangeText={(e) => this.setCatatanKondisiPintuJendela(e)} value={this.state.catatanKondisiPintuJendela} multiline={true}/>
            </Item>

            <Label style={styles.selfLabel}>Kamar Mandi & Jamban</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedKepemilikanKMJamban}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedKepemilikanKMJamban: itemValue});
                    this.props.updateKepemilikanKMJamban(itemValue);
                }}
              >
                <Item label={dkkmj_header} value={null}/>
                {dkkmj.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Kondisi Kamar Mandi & Jamban</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedKondisiKMJamban}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedKondisiKMJamban: itemValue});
                    this.props.updateKondisiKMJamban(itemValue);
                }}
              >
                <Item label={dk_header} value={null}/>
                {dk.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Item stackedLabel>
              <Label>Catatan Kondisi Kamar Mandi & Jamban</Label>
              <Input onChangeText={(e) => this.setCatatanKondisiKMJamban(e)} value={this.state.catatanKMJamban} multiline={true}/>
            </Item>

            <Label style={styles.selfLabel}>Fasilitas Buang Air Besar</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedPenggunaanFasilitasBab}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedPenggunaanFasilitasBab: itemValue});
                    this.props.updatePenggunaanFasilitasBab(itemValue);
                }}
              >
                <Item label={dpfb_header} value={null}/>
                {dpfb.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Tempat Pembuangan Akhir</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedPembuanganAkhirTinja}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedPembuanganAkhirTinja: itemValue});
                    this.props.updatePembuanganAkhirTinja(itemValue);
                }}
              >
                <Item label={dpat_header} value={null}/>
                {dpat.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Sumber Air Minum</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedSumberAirMinum}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedSumberAirMinum: itemValue});
                    this.props.updateSumberAirMinum(itemValue);
                }}
              >
                <Item label={dsam_header} value={null}/>
                {dsam.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Jarak Sumber Air</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedJarakSumberAir}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedJarakSumberAir: itemValue});
                    this.props.updateJarakSumberAir(itemValue);
                }}
              >
                <Item label="Pilih" value={null}/>
                <Item label="Lebih dari 10 Meter" value="Lebih dari 10 Meter"/>
                <Item label="Kurang dari 10 Meter" value="Kurang dari 10 Meter"/>
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Sumber Listrik</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedSumberListrik}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedSumberListrik: itemValue});
                    this.props.updateSumberListrik(itemValue);
                }}
              >
                <Item label={dsl_header} value={null}/>
                {dsl.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Drainase</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedDrainase}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedDrainase: itemValue});
                    this.props.updateDrainase(itemValue);
                }}
              >
                <Item label="Pilih" value={null}/>
                <Item label="Ada" value="Ada"/>
                <Item label="Tidak Ada" value="Tidak Ada"/>
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Kondisi Drainase</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedIdKondisiDrainase}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedIdKondisiDrainase: itemValue});
                    this.props.updateIdKondisiDrainase(itemValue);
                }}
              >
                <Item label={dk_header} value={null}/>
                {dk.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>
            
            <Label style={styles.selfLabel}>Tempat Sampah</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedTempatSampah}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedTempatSampah: itemValue});
                    this.props.updateTempatSampah(itemValue);
                }}
              >
                <Item label="Pilih" value={null}/>
                <Item label="Ada" value="Ada"/>
                <Item label="Tidak Ada" value="Tidak Ada"/>
              </Picker>
            </ListItem>
            
          </Form>
        </Content>
      );
    }
  }
}
