import React, { Component } from "react";
import { Alert } from "react-native";
import { Content, Left, Right, Text, Label, ListItem, Item, Radio, Button, Picker, Spinner } from "native-base";
import { api } from '../../config/config';
import styles from "./styles";

export default class TabFour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedJenisPembangunan: undefined,
      dataJenisPembangunan: []
    };
  }

  componentWillMount() {
    this.init();
  }

  componentDidMount() {
    var dataEdit = this.props.data;
    if (dataEdit && dataEdit.length != 0 ) {
      this.setState({selectedJenisPembangunan: dataEdit.id_jenis_pembangunan});
      this.props.updateJenisPembangunan(dataEdit.id_jenis_pembangunan);
    }
  }

  init = async() => {
    this.dataJenisPembangunan();
  }

  dataJenisPembangunan = async () => {
    fetch(api.url + "master/jenis_pembangunan", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message == 'success') {
          this.setState({dataJenisPembangunan: response.data});
          this.setState({loading: false});
        } else {
          Toast.show({ text: "Data Jenis Pembangunan tidak ditemukan.", buttonText: "Okay", duration: 10000 });
        }
      })
      .catch(error => {
        //console.warn(error)
        Toast.show({ text: "Data Jenis Pembangunan gagal dimuat.", buttonText: "Okay", duration: 10000 });
      })
      .done();
  }

  _confirm() {
    Alert.alert(
      'Konfirmasi', 'Anda yakin akan menyimpan data ini?',
      [
          {text: 'Tidak'},
          {text: 'Ya', onPress: () => this.props.submitData()}
      ],
      { cancelable: false }
    )
  }

  render() {
    // data jenis pembangunan
    var djp = this.state.dataJenisPembangunan;
    if (djp.length == 0) { var djp_header = "Tidak ada data"; }
    else { var djp_header = "Pilih"; }

    if(this.state.loading) {
      return (<Spinner color="blue"/>);
    } else {
      return (
        <Content style={styles.container}>
          <Label style={styles.selfLabel}>Jenis Pembangunan</Label>
          <ListItem style={styles.pickerList}>
            <Picker
              mode="dropdown"
              style={styles.pickerBorder}
              selectedValue={this.state.selectedJenisPembangunan}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({selectedJenisPembangunan: itemValue});
                this.props.updateJenisPembangunan(itemValue);
              }}
            >
              <Item label={djp_header} value={null}/>
              {djp.map((item) => (
                <Item key={item.id_jenis} label={item.nama_jenis} value={item.id_jenis}/>
              ))}
            </Picker>
          </ListItem>

          <Button block style={{margin: 15, marginTop: 50}} onPress={() => this._confirm()}>
            <Text>SIMPAN</Text>
          </Button>

          <Text style={{marginLeft: 15, marginRight: 15, fontStyle: "italic", fontSize: 12}}>*Pastikan data yang anda
            isi sudah sesuai dan benar.</Text>

        </Content>
      );
    }
  }
}
