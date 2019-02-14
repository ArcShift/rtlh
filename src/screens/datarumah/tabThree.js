import React, { Component } from "react";
import { Content, Spinner, Toast, Text, Icon, Body, Form, ListItem, Item, Label, Input, Button, Picker } from "native-base";
import { api } from '../../config/config';
import styles from "./styles";

export default class TabThree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      namaBantuanPerum: '',
      catatanJenisKawasanRumah: '',
      
      selectedSKRumah: undefined,
      selectedAsetRumahLain: undefined,
      selectedSKTanah: undefined,
      selectedAsetTanahLain: undefined,
      selectedStatusBantuanPerum: undefined,
      
      dataSKRumah: [],
      dataSKTanah: [],
      dataSBPerum: [],
    };
  }

  componentWillMount() {
    this.init();
  }

  componentDidMount() {
    var dataEdit = this.props.data;
    if (dataEdit && dataEdit.length != 0 ) {
      this.setNamaBantuanPerum(dataEdit.nama_bantuan_perumahan);
      //console.log("this.setNamaBantuanPerum");
      
      this.setCatatanJenisKawasanRumah(dataEdit.catatan_jenis_kawasan_rumah);
      //console.log("this.setCatatanJenisKawasanRumah");

      this.setState({selectedSKRumah: dataEdit.id_status_kepemilikan_rumah});
      this.props.updateSKRumah(dataEdit.id_status_kepemilikan_rumah);
      //console.log("this.props.updateSKRumah");
      
      this.setState({selectedAsetRumahLain: dataEdit.aset_rumah_lain});
      this.props.updateAsetRumahLain(dataEdit.aset_rumah_lain);
      //console.log("this.props.updateAsetRumahLain");
      
      this.setState({selectedSKTanah: dataEdit.id_status_kepemilikan_tanah});
      this.props.updateSKTanah(dataEdit.id_status_kepemilikan_tanah);
      //console.log("this.props.updateSKTanah");
      
      this.setState({selectedAsetTanahLain: dataEdit.aset_tanah_lain});
      this.props.updateAsetTanahLain(dataEdit.aset_tanah_lain);
      //console.log("this.props.updateAsetTanahLain");
      
      this.setState({selectedStatusBantuanPerum: dataEdit.id_status_bantuan_perumahan});
      this.props.updateStatusBantuanPerum(dataEdit.id_status_bantuan_perumahan);
      //console.log("this.props.updateStatusBantuanPerum");
    }
  }

  init = async() => {
    this.dataSKRumah();
    this.dataSKTanah();
    this.dataSBPerum();
  }

  dataSKRumah = async () => {
    var url = api.url + "master/status_kepemilikan_rumah";
    //console.log(url);

    fetch(url, {
      method: "GET",
      headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      //console.log(response.data);
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
    .done();
  }

  dataSKTanah = async () => {
    var url = api.url + "master/status_kepemilikan_tanah";
    //console.log(url);

    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      //console.log(response.data);
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

  dataSBPerum = async () => {
    var url = api.url + "master/status_bantuan_perumahan";
    //console.log(url);

    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((response) => {
      //console.log(response.data);
      if (response.message == 'success') {
        this.setState({dataSBPerum: response.data});
        this.setState({loading: false});
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

  setNamaBantuanPerum(text) {
    this.setState({namaBantuanPerum: text});
    this.props.updateNamaBantuanPerum(text);
  }

  setCatatanJenisKawasanRumah(text) {
    this.setState({catatanJenisKawasanRumah: text});
    this.props.updateCatatanJenisKawasanRumah(text);
  }
  
  render() {
    // data sk rumah
    var dskr = this.state.dataSKRumah;
    if (dskr.length == 0) { var dskr_header = "Tidak ada data"; }
    else { var dskr_header = "Pilih"; }
    
    // data sk tanah
    var dskt = this.state.dataSKTanah;
    if (dskt.length == 0) { var dskt_header = "Tidak ada data"; }
    else { var dskt_header = "Pilih"; }
    
    // data sb perum
    var dsbp = this.state.dataSBPerum;
    if (dsbp.length == 0) { var dsbp_header = "Tidak ada data"; }
    else { var dsbp_header = "Pilih"; }
    
    if(this.state.loading) {
      return (<Spinner color="blue"/>);
    } else {
      return (
        <Content style={styles.container}>
          <Form style={{marginBottom: 20}}>
            <Label style={styles.selfLabel}>Status Kepemilikan Rumah</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedSKRumah}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedSKRumah: itemValue});
                    this.props.updateSKRumah(itemValue);
                }}
              >
                <Item label={dskr_header} value={null}/>
                {dskr.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Aset Rumah Lain</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedAsetRumahLain}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedAsetRumahLain: itemValue});
                    this.props.updateAsetRumahLain(itemValue);
                }}
              >
                <Item label="Pilih" value={null}/>
                <Item label="Ada" value="Ada"/>
                <Item label="Tidak Ada" value="Tidak Ada"/>
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Status Kepemilikan Tanah</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedSKTanah}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedSKTanah: itemValue});
                    this.props.updateSKTanah(itemValue);
                }}
              >
                <Item label={dskt_header} value={null}/>
                {dskt.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Aset Tanah Lain</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedAsetTanahLain}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedAsetTanahLain: itemValue});
                    this.props.updateAsetTanahLain(itemValue);
                }}
              >
                <Item label="Pilih" value={null}/>
                <Item label="Ada" value="Ada"/>
                <Item label="Tidak Ada" value="Tidak Ada"/>
              </Picker>
            </ListItem>

            <Label style={styles.selfLabel}>Pernah Menerima Bantuan Perumahan</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedStatusBantuanPerum}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedStatusBantuanPerum: itemValue});
                    this.props.updateStatusBantuanPerum(itemValue);
                }}
              >
                <Item label={dsbp_header} value={null}/>
                {dsbp.map((item) => (
                  <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
                ))}
              </Picker>
            </ListItem>

            <Item stackedLabel>
              <Label>Nama Bantuan Perumahan</Label>
              <Input onChangeText={(e) => this.setNamaBantuanPerum(e)} value={this.state.namaBantuanPerum}/>
            </Item>

            <Item stackedLabel>
              <Label>Catatan Jenis Kawasan Rumah</Label>
              <Input onChangeText={(e) => this.setCatatanJenisKawasanRumah(e)} value={this.state.catatanJenisKawasanRumah}/>
            </Item>
            
          </Form>
        </Content>
      );
    }
  }
}
