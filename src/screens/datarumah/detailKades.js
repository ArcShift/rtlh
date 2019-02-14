import React, { Component } from "react";
import { api } from '../../config/config';
import { AsyncStorage } from "react-native";
import {
  Container,
  Header,
  View,
  Title,
  Button,
  Icon,
  Tabs,
  Tab,
  Right,
  Left,
  Body,
  Content,
  Form,
  Label,
  ListItem,
  Text,
  ScrollableTab,
  Toast,
  Spinner,
  Fab
} from "native-base";
import styles from "./styles";

class detailKades extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      jml_kk: 1,
      pekerjaan: '',
      penghasilan: '',
      nominal_penghasilan: '',
      sk_rumah: '',
      aset_rumah_lain: '',
      sk_tanah: '',
      status_bantuan_perum: '',
      id_user: '',
      dataDetail: [],
      dataId: '',
      dataLoaded: false,
      edit: false,
      allowUpdate: false
    };
    this._refresh = this._refresh.bind(this);
  }

  _getId() {
    let id = false;
    if(this.props.navigation.state.params) {
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
  
  _refresh() {
    this.setState({dataLoaded: false});
    this.dataDetail();
  }

  componentWillMount() {
    this.checkAccess();
    
    AsyncStorage.getItem("iduser").then((value) => {
      this.setState({"id_user": value});
    });
    
    if(this._getId() !== false) {
      this.setState({dataId: this._getId()});
      this.setState({edit: true});
      this.dataDetail();
    }
  }

  checkAccess = async() => {
    try{
      let group_akses = await AsyncStorage.getItem("hak_akses");
      let update = group_akses.indexOf("data_rtlh.update");
      if(update != -1) {
        this.setState({allowUpdate: true});
      }
    }
    catch(e){
      Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 3000 });
      this.props.navigation.goBack();
    }
  }

  dataDetail = async () => {
	var baseUrl = api.url + "data_rumah/detail";
	var url = baseUrl;

	url = url + "?id=" + this._getId() + "&id_user=" + this._getUserId();
	console.log(url);

	fetch(url , {
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
          this.setState({dataDetail: response.data});
          var d = response.data;
          this.setState({
            tgl_survey: d.tgl_survey,
            kecamatan: d.kecamatan,
            desa: d.desa,
            nama_pb: d.nama_penerima_bantuan,
            nik_pb: d.nik_penerima_bantuan,
            jk: d.jenis_kelamin,
            umur: d.umur,
            status: d.status_perkawinan,
            apakah_krt: d.apakah_kepala_keluarga,
            alamat: d.alamat_rumah,
            jml_penghuni: d.jumlah_penghuni,
            pekerjaan: d.jumlah_kk_dalam_rumah,
            penghasilan: d.id_penghasilan,
            nominal_penghasilan: d.nominal_penghasilan,
            kesesuaian_ump: d.kesesuaian_ump,
            sk_rumah: d.status_kepemilikan_rumah,
            aset_rumah_lain: d.aset_rumah_lain,
            sk_tanah: d.status_kepemilikan_tanah,
            status_bantuan_perum: d.status_bantuan_perumahan,
          });
          this.setState({dataLoaded: true});
        }
      })
      .catch(error => {
        console.log(error)
        Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 3000 });
      })
      .done();
  }

  render() {
    if(this.state.edit && !this.state.dataLoaded) {
      return (
        <Container>
          <Header hasTabs>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back"/>
              </Button>
            </Left>
            <Body>
            <Title>Detail Data Rumah </Title>
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
            <Title>Detail Data Rumah </Title>
            </Body>
            <Right/>
          </Header>

          <View style={{ flex: 1 }}>

          <Tabs renderTabBar={() => <ScrollableTab/>}>
            <Tab heading="Data Survey">
              <Content style={styles.container}>
                <Form style={{marginBottom: 20}}>
                  <Label style={styles.selfLabel}>Tanggal Survey</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.tgl_survey}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Kecamatan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.kecamatan}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Desa</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.desa}</Text>
                  </ListItem>
                </Form>
              </Content>
            </Tab>
            <Tab heading="Identitas Penerima Bantuan">
              <Content style={styles.container}>
                <Form style={{marginBottom: 20}}>

                  <Label style={styles.selfLabel}>Nama Penerima Bantuan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.nama_pb}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>KTP / NIK Penerima Bantuan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.nik_pb}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Jenis Kelamin</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.jk}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Umur</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.umur}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Alamat</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.alamat}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Status Perkawinan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.status}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Pekerjaan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.pekerjaan}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Penghasilan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.penghasilan}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Nominal Penghasilan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.nominal_penghasilan}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Kesesuaian UMP</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.kesesuaian_ump}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Apakah Kepala Keluarga?</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.apakah_krt}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Jumlah Anggota Keluarga</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.jml_penghuni}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Menempati Rumah satu-satunya?</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.aset_rumah_lain=='Ada' ? 'Tidak' : 'Ya' }</Text>
                  </ListItem>
                </Form>
              </Content>
            </Tab>
            <Tab heading="Status Rumah">
              <Content style={styles.container}>
                <Form style={{marginBottom: 20}}>
                  <Label style={styles.selfLabel}>Pernah Menerima Bantuan Perumahan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.status_bantuan_perum}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Status Kepemilikan Tanah</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.sk_tanah}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Status Kepemilikan Rumah</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.sk_rumah}</Text>
                  </ListItem>
                </Form>
              </Content>
            </Tab>
          </Tabs>
          {this.state.allowUpdate && 
            <Fab
              active={this.state.active}
              style={{ backgroundColor: '#5067FF' }}
              position="bottomRight"
              onPress={() => this.props.navigation.navigate("DataRumahKadesCE", { dataId: this.state.dataId, id_user: this.state.id_user, refresh: this._refresh })}>
              <Icon name="create" />
            </Fab>}
          </View>
        </Container>
      );
    }
  }
}

export default detailKades;
