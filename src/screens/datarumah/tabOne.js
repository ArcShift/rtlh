import React, { Component } from "react";
import { Content, Spinner, View, List, Text, Form, ListItem, Item, Label, Input, Picker } from "native-base";
import DatePicker from 'react-native-datepicker';
import { api } from '../../config/config';
import styles from "./styles";

export default class TabOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tglSurvey: '',
      nikResponden: '',
      namaResponden: '',
      nohpResponden: '',
      keterangan: '',
      selectedKecamatan: undefined,
      selectedDesa: undefined,
      dataKecamatan: [],
      dataDesa: [],
      
      data_source: '',
      last_modified_time: '',
      last_modified_username: ''
    };
  }

  componentWillMount() {
    this.init();
  }

  componentDidMount() {
    var dataEdit = this.props.data;
    if (dataEdit && dataEdit.length != 0 ) {
      this.setTglSurvey(dataEdit.tgl_survey);
      this.setNikResponden(dataEdit.nik_responden);
      this.setNamaResponden(dataEdit.nama_responden);
      this.setNohpResponden(dataEdit.no_hp_responden);
      this.setKecamatan(dataEdit.id_skpd_kecamatan);
      this.setDesa(dataEdit.id_skpd_desa);
      this.setKeterangan(dataEdit.keterangan);
      
      this.setState({data_source: dataEdit.data_source});
      this.setState({last_modified_time: dataEdit.last_modified_time});
      this.setState({last_modified_username: dataEdit.last_modified_username});
    }
  }

  init = async() => {
    this.dataKecamatan();
  }

  dataKecamatan = async () => {
    fetch(api.url + "master/kecamatan", {
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
        this.setState({loading: false});
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
    fetch(api.url + "master/desa?idkec=" + idkec, {
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
        this.setState({loading: false});
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

  setNikResponden(text) {
    this.setState({nikResponden: text});
    this.props.updateNikResponden(text);
  }
  
  setNamaResponden(text) {
    this.setState({namaResponden: text});
    this.props.updateNamaResponden(text);
  }
  
  setNohpResponden(text) {
    this.setState({nohpResponden: text});
    this.props.updateNohpResponden(text);
  }
  
  setTglSurvey(date) {
    this.setState({tglSurvey: date});
    this.props.updateTglSurvey(date);
  }
  
  setKecamatan(value) {
    if(value !== null) {
      this.setState({loading: true});
      this.setState({ selectedKecamatan: value });
      this.props.updateKecamatan(value);
      this.dataDesa(value);
    }
  }
  
  setDesa(value) {
    this.setState({ selectedDesa: value });
    this.props.updateDesa(value);
  }
  
  setKeterangan(value) {
    this.setState({ keterangan: value });
    this.props.updateKeterangan(value);
  }
  
  render() {
    // data kecamatan
    var dk = this.state.dataKecamatan;
    if (dk.length == 0) { var dk_header = "Tidak ada data"; }
    else { var dk_header = "Pilih"; }
    // data desa
    var dd = this.state.dataDesa;

    if(this.state.loading) {
      return (<Spinner color="blue"/>);
    } else {
      return (
        <Content style={styles.container}>
          <Form style={{marginBottom: 20}}>
            {this.state.data_source == 'data_rumah_update' && 
                <View>
                <Item stackedLabel>
                  <Label style={styles.selfLabel}>Waktu Terakhir Diubah</Label>
                  <ListItem style={styles.textDetail}>
                  <Text>{this.state.last_modified_time}</Text>
                  </ListItem>
                </Item>
                <Item stackedLabel>
                  <Label style={styles.selfLabel}>Terakhir Diubah Oleh</Label>
                  <ListItem style={styles.textDetail}>
                  <Text>{this.state.last_modified_username}</Text>
                  </ListItem>
                </Item>
                <View
                  style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                  }}
                />
                </View>
            }
            <Label style={styles.selfLabel}>Tanggal Survey *</Label>
            <ListItem style={styles.pickerList}>
              <DatePicker
                date={this.state.tglSurvey}
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
                onDateChange={(date) => {this.setTglSurvey(date)}}
              />
            </ListItem>

            <Label style={styles.selfLabel}>Kecamatan *</Label>
            <ListItem style={styles.pickerList}>
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedKecamatan}
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
              <Picker
                mode="dropdown"
                style={styles.pickerBorder}
                selectedValue={this.state.selectedDesa}
                onValueChange={this.setDesa.bind(this)}
              >
                <Item label='Pilih' value={null}/>
                {dd.map((item) => (
                  <Item key={item.id_skpd} label={item.nama} value={item.id_skpd}/>
                ))}
              </Picker>
            </ListItem>

            <Item stackedLabel>
              <Label>NIK Responden</Label>
              <Input onChangeText={(e) => this.setNikResponden(e)} value={this.state.nikResponden} keyboardType="phone-pad"/>
            </Item>
            <Item stackedLabel>
              <Label>Nama Responden</Label>
              <Input onChangeText={(e) => this.setNamaResponden(e)} value={this.state.namaResponden}/>
            </Item>
            <Item stackedLabel>
              <Label>No HP Responden</Label>
              <Input onChangeText={(e) => this.setNohpResponden(e)} value={this.state.nohpResponden} keyboardType="phone-pad"/>
            </Item>
            <Item stackedLabel>
              <Label>Keterangan</Label>
              <Input onChangeText={(e) => this.setKeterangan(e)} value={this.state.keterangan} />
            </Item>
          </Form>
        </Content>
      );
    }
  }
}
