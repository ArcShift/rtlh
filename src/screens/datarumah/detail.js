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

import TabSeven from "./tabSeven"; // MAP

class detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tgl_survey: '',
      kecamatan: '',
      desa: '',
      nama_responden: '',
      nik_responden: '',
      nohp_responden: '',
      no_urut_target: '',
      keterangan: '',
      nama_pb: '',
      nik_pb: '',
      jk: '',
      umur: '',
      status: '',
      apakah_krt: '',
      alamat: '',
      lat: '',
      long: '',
      luas_rmh: '',
      jml_penghuni: '',
      jml_kk: '',
      pekerjaan: '',
      penghasilan: '',
      nominal_penghasilan: '',
      pendidikan: '',
      status_fisik: '',
      sk_rumah: '',
      aset_rumah_lain: '',
      sk_tanah: '',
      aset_tanah_lain: '',
      status_bantuan_perum: '',
      nama_bantuan_perum: '',
      jenis_kawasan_rumah: '',
      material_pondasi: '',
      kondisi_pondasi: '',
      catatan_pondasi: '',
      material_kolom_balok: '',
      kondisi_kolom_balok: '',
      catatan_kolom_balok: '',
      material_konstruksi_atap: '',
      kondisi_konstruksi_atap: '',
      catatan_konstruksi_atap: '',
      material_atap: '',
      kondisi_atap: '',
      catatan_atap: '',
      material_dinding: '',
      kondisi_dinding: '',
      catatan_dinding: '',
      material_lantai: '',
      kondisi_lantai: '',
      catatan_lantai: '',
      pencahayaan: '',
      ventilasi: '',
      catatan_pintu_jendela: '',
      kondisi_pintu_jendela: '',
      catatan_kondisi_pintu_jendela: '',
      kepemilikan_km_jamban: '',
      kondisi_km_jamban: '',
      catatan_km_jamban: '',
      penggunaan_fasilitas_bab: '',
      pembuangan_akhir_tinja: '',
      sumber_air_minum: '',
      jarak_sumber_air: '',
      sumber_listrik: '',
      jenis_pembangunan: '',
      kesesuaian_ump: '',
      drainase: '',
      kondisi_drainase: '',
      tempat_sampah: '',
      proteksi_kebakaran: '',
      sarana_proteksi_kebakaran: '',
      prasarana_proteksi_kebakaran: '',
      last_modified_time: '',
      last_modified_username: '',
      
      id_user: '',
      dataDetail: [],
      dataId: '',
      dataLoaded: false,
      edit: false,
      allowUpdate: false
    };
    this._refresh = this._refresh.bind(this);
  }

  update_tgl_survey = (text) => {this.setState({ tgl_survey: text ? text : '-' })};
  update_kecamatan = (text) => {this.setState({ kecamatan: text ? text : '-' })};
  update_desa = (text) => {this.setState({ desa: text ? text : '-' })};
  update_nama_responden = (text) => {this.setState({ nama_responden: text ? text : '-' })};
  update_nik_responden = (text) => {this.setState({ nik_responden: text ? text : '-' })};
  update_nohp_responden = (text) => {this.setState({ nohp_responden: text ? text : '-' })};
  update_nama_pb = (text) => {this.setState({ nama_pb: text ? text : '-' })};
  update_nik_pb = (text) => {this.setState({ nik_pb: text ? text : '-' })};
  update_jk = (text) => {this.setState({ jk: text ? text : '-' })};
  update_umur = (text) => {this.setState({ umur: text ? text : '-' })};
  update_status = (text) => {this.setState({ status: text ? text : '-' })};
  update_apakah_krt = (text) => {this.setState({ apakah_krt: text ? text : '-' })};
  update_alamat = (text) => {this.setState({ alamat: text ? text : '-' })};
  update_lat = (text) => {this.setState({ lat: text ? text : '-' })};
  update_long = (text) => {this.setState({ long: text ? text : '-' })};
  update_luas_rmh = (text) => {this.setState({ luas_rmh: text ? text : '-' })};
  update_jml_penghuni = (text) => {this.setState({ jml_penghuni: text ? text : '-' })};
  update_jml_kk = (text) => {this.setState({ jml_kk: text ? text : '-' })};
  update_pekerjaan = (text) => {this.setState({ pekerjaan: text ? text : '-' })};
  update_penghasilan = (text) => {this.setState({ penghasilan: text ? text : '-' })};
  update_nominal_penghasilan = (text) => {this.setState({ nominal_penghasilan: text ? text : '-' })};
  update_pendidikan = (text) => {this.setState({ pendidikan: text ? text : '-' })};
  update_status_fisik = (text) => {this.setState({ status_fisik: text ? text : '-' })};
  update_sk_rumah = (text) => {this.setState({ sk_rumah: text ? text : '-' })};
  update_aset_rumah_lain = (text) => {this.setState({ aset_rumah_lain: text ? text : '-' })};
  update_sk_tanah = (text) => {this.setState({ sk_tanah: text ? text : '-' })};
  update_aset_tanah_lain = (text) => {this.setState({ aset_tanah_lain: text ? text : '-' })};
  update_status_bantuan_perum = (text) => {this.setState({ status_bantuan_perum: text ? text : '-' })};
  update_nama_bantuan_perum = (text) => {this.setState({ nama_bantuan_perum: text ? text : '-' })};
  update_jenis_kawasan_rumah = (text) => {this.setState({ jenis_kawasan_rumah: text ? text : '-' })};
  update_material_pondasi = (text) => {this.setState({ material_pondasi: text ? text : '-' })};
  update_kondisi_pondasi = (text) => {this.setState({ kondisi_pondasi: text ? text : '-' })};
  update_catatan_pondasi = (text) => {this.setState({ catatan_pondasi: text ? text : '-' })};
  update_material_kolom_balok = (text) => {this.setState({ material_kolom_balok: text ? text : '-' })};
  update_kondisi_kolom_balok = (text) => {this.setState({ kondisi_kolom_balok: text ? text : '-' })};
  update_catatan_kolom_balok = (text) => {this.setState({ catatan_kolom_balok: text ? text : '-' })};
  update_material_konstruksi_atap = (text) => {this.setState({ material_konstruksi_atap: text ? text : '-' })};
  update_kondisi_konstruksi_atap = (text) => {this.setState({ kondisi_konstruksi_atap: text ? text : '-' })};
  update_catatan_konstruksi_atap = (text) => {this.setState({ catatan_konstruksi_atap: text ? text : '-' })};
  update_material_atap = (text) => {this.setState({ material_atap: text ? text : '-' })};
  update_kondisi_atap = (text) => {this.setState({ kondisi_atap: text ? text : '-' })};
  update_catatan_atap = (text) => {this.setState({ catatan_atap: text ? text : '-' })};
  update_material_dinding = (text) => {this.setState({ material_dinding: text ? text : '-' })};
  update_kondisi_dinding = (text) => {this.setState({ kondisi_dinding: text ? text : '-' })};
  update_catatan_dinding = (text) => {this.setState({ catatan_dinding: text ? text : '-' })};
  update_material_lantai = (text) => {this.setState({ material_lantai: text ? text : '-' })};
  update_kondisi_lantai = (text) => {this.setState({ kondisi_lantai: text ? text : '-' })};
  update_catatan_lantai = (text) => {this.setState({ catatan_lantai: text ? text : '-' })};
  update_pencahayaan = (text) => {this.setState({ pencahayaan: text ? text : '-' })};
  update_ventilasi = (text) => {this.setState({ ventilasi: text ? text : '-' })};
  update_catatan_pintu_jendela = (text) => {this.setState({ catatan_pintu_jendela: text ? text : '-' })};
  update_kondisi_pintu_jendela = (text) => {this.setState({ kondisi_pintu_jendela: text ? text : '-' })};
  update_catatan_kondisi_pintu_jendela = (text) => {this.setState({ catatan_kondisi_pintu_jendela: text ? text : '-' })};
  update_kepemilikan_km_jamban = (text) => {this.setState({ kepemilikan_km_jamban: text ? text : '-' })};
  update_kondisi_km_jamban = (text) => {this.setState({ kondisi_km_jamban: text ? text : '-' })};
  update_catatan_km_jamban = (text) => {this.setState({ catatan_km_jamban: text ? text : '-' })};
  update_penggunaan_fasilitas_bab = (text) => {this.setState({ penggunaan_fasilitas_bab: text ? text : '-' })};
  update_pembuangan_akhir_tinja = (text) => {this.setState({ pembuangan_akhir_tinja: text ? text : '-' })};
  update_sumber_air_minum = (text) => {this.setState({ sumber_air_minum: text ? text : '-' })};
  update_jarak_sumber_air = (text) => {this.setState({ jarak_sumber_air: text ? text : '-' })};
  update_sumber_listrik = (text) => {this.setState({ sumber_listrik: text ? text : '-' })};
  update_jenis_pembangunan = (text) => {this.setState({ jenis_pembangunan: text ? text : '-' })};
  update_lokasi = (lat, lng) => {this.setState({ lat: lat, long: lng })};
  update_no_urut = (text) => {this.setState({ no_urut_target: text ? text : '-' })};
  update_keterangan = (text) => {this.setState({ keterangan: text ? text : '-' })};
  update_kesesuaian_ump = (text) => {this.setState({ kesesuaian_ump: text ? text : '-' })};
  update_drainase = (text) => {this.setState({ drainase: text ? text : '-' })};
  update_kondisi_drainase = (text) => {this.setState({ kondisi_drainase: text ? text : '-' })};
  update_tempat_sampah = (text) => {this.setState({ tempat_sampah: text ? text : '-' })};
  update_proteksi_kebakaran = (text) => {this.setState({ proteksi_kebakaran: text ? text : '-' })};
  update_sarana_proteksi_kebakaran = (text) => {this.setState({ sarana_proteksi_kebakaran: text ? text : '-' })};
  update_prasarana_proteksi_kebakaran = (text) => {this.setState({ prasarana_proteksi_kebakaran: text ? text : '-' })};
  
  update_last_modified_time = (text) => {this.setState({ last_modified_time: text ? text : '-' })};
  update_last_modified_username = (text) => {this.setState({ last_modified_username: text ? text : '-' })};

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
    
    if (this._getId() !== false && this._getUserId() !== false) {
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
      //console.log("this.state.allowUpdate=" + this.state.allowUpdate);
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
        console.log(response);
        if (response.message == 'success') {
            this.setState({dataDetail: response.data});
            var item = response.data;
            this.update_tgl_survey(item.tgl_survey);
            this.update_kecamatan(item.kecamatan);
            this.update_desa(item.desa);
            this.update_nama_responden(item.nama_responden);
            this.update_nik_responden(item.nik_responden);
            this.update_nohp_responden(item.no_hp_responden);
            this.update_nama_pb(item.nama_penerima_bantuan);
            this.update_nik_pb(item.nik_penerima_bantuan);
            this.update_jk(item.jenis_kelamin);
            this.update_umur(item.umur);
            this.update_status(item.status_perkawinan);
            this.update_apakah_krt(item.apakah_kepala_keluarga);
            this.update_alamat(item.alamat_rumah);
            this.update_lat(item.latitude);
            this.update_long(item.longitude);
            this.update_luas_rmh(item.luas_rumah);
            this.update_jml_penghuni(item.jumlah_penghuni);
            this.update_jml_kk(item.jumlah_kk_dalam_rumah);
            this.update_pekerjaan(item.pekerjaan);
            this.update_penghasilan(item.penghasilan);
            this.update_nominal_penghasilan(item.nominal_penghasilan);
            this.update_pendidikan(item.pendidikan);
            this.update_status_fisik(item.status_fisik);
            this.update_sk_rumah(item.status_kepemilikan_rumah);
            this.update_aset_rumah_lain(item.aset_rumah_lain);
            this.update_sk_tanah(item.status_kepemilikan_tanah);
            this.update_aset_tanah_lain(item.aset_tanah_lain);
            this.update_status_bantuan_perum(item.status_bantuan_perumahan);
            this.update_nama_bantuan_perum(item.nama_bantuan_perumahan);
            this.update_jenis_kawasan_rumah(item.jenis_kawasan_rumah);
            this.update_material_pondasi(item.material_pondasi);
            this.update_kondisi_pondasi(item.kondisi_pondasi);
            this.update_catatan_pondasi(item.catatan_kondisi_pondasi);
            this.update_material_kolom_balok(item.material_kolom_balok);
            this.update_kondisi_kolom_balok(item.kondisi_kolom_balok);
            this.update_catatan_kolom_balok(item.catatan_kondisi_kolom_balok);
            this.update_material_konstruksi_atap(item.material_konstruksi_atap);
            this.update_kondisi_konstruksi_atap(item.kondisi_konstruksi_atap);
            this.update_catatan_konstruksi_atap(item.catatan_kondisi_konstruksi_atap);
            this.update_material_atap(item.material_atap);
            this.update_kondisi_atap(item.kondisi_atap);
            this.update_catatan_atap(item.catatan_kondisi_atap);
            this.update_material_dinding(item.material_dinding);
            this.update_kondisi_dinding(item.kondisi_dinding);
            this.update_catatan_dinding(item.catatan_kondisi_dinding);
            this.update_material_lantai(item.material_lantai);
            this.update_kondisi_lantai(item.kondisi_lantai);
            this.update_catatan_lantai(item.catatan_kondisi_lantai);
            this.update_pencahayaan(item.pencahayaan);
            this.update_ventilasi(item.ventilasi);
            this.update_catatan_pintu_jendela(item.catatan_pintu_jendela);
            this.update_kondisi_pintu_jendela(item.kondisi_pintu_jendela);
            this.update_catatan_kondisi_pintu_jendela(item.catatan_kondisi_pintu_jendela);
            this.update_kepemilikan_km_jamban(item.kepemilikan_km_jamban);
            this.update_kondisi_km_jamban(item.kondisi_km_jamban);
            this.update_catatan_km_jamban(item.catatan_kondisi_km_jamban);
            this.update_penggunaan_fasilitas_bab(item.penggunaan_fasilitas_bab);
            this.update_pembuangan_akhir_tinja(item.pembuangan_akhir_tinja);
            this.update_sumber_air_minum(item.sumber_air_minum);
            this.update_jarak_sumber_air(item.jarak_sumber_air_minum);
            this.update_sumber_listrik(item.sumber_listrik);
            this.update_jenis_pembangunan(item.jenis_pembangunan);
            this.update_no_urut(item.no_urut_target);
            this.update_keterangan(item.keterangan);
            this.update_kesesuaian_ump(item.kesesuaian_ump);
            this.update_drainase(item.drainase);
            this.update_kondisi_drainase(item.kondisi_drainase);
            this.update_tempat_sampah(item.tempat_sampah);
            this.update_proteksi_kebakaran(item.proteksi_kebakaran);
            this.update_sarana_proteksi_kebakaran(item.sarana_proteksi_kebakaran);
            this.update_prasarana_proteksi_kebakaran(item.prasarana_proteksi_kebakaran);
            this.update_last_modified_time(item.last_modified_time);
            this.update_last_modified_username(item.last_modified_username);

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
    var de = this.state.dataDetail;
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
            <Tab heading="Data Responden">
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

                  <Label style={styles.selfLabel}>Desa/Kelurahan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.desa}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>NIK Responden</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.nik_responden}</Text>
                  </ListItem>
                  
                  <Label style={styles.selfLabel}>Nama Responden</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.nama_responden}</Text>
                  </ListItem>
                  
                  <Label style={styles.selfLabel}>No HP Responden</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.nohp_responden}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Keterangan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.keterangan}</Text>
                  </ListItem>
                  
                  <Label style={styles.selfLabel}>Waktu Terakhir Diubah</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.last_modified_time}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Terakhir Diubah Oleh</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.last_modified_username}</Text>
                  </ListItem>

                </Form>
              </Content>
            </Tab>
            
            <Tab heading="Data Identitas Target">
              <Content style={styles.container}>
                <Form style={{marginBottom: 20}}>

                  <Label style={styles.selfLabel}>No Urut Target</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.no_urut_target}</Text>
                  </ListItem>
                  
                  <Label style={styles.selfLabel}>NIK Penerima Bantuan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.nik_pb}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Nama Penerima Bantuan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.nama_pb}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Jenis Kelamin</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.jk}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Umur</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.umur}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Status Perkawinan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.status}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Status Fisik</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.status_fisik}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Pendidikan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.pendidikan}</Text>
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

                  <Label style={styles.selfLabel}>Alamat</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.alamat}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Luas Rumah</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.luas_rmh}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Jumlah Penghuni</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.jml_penghuni}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Jumlah Kepala Keluarga</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.jml_kk}</Text>
                  </ListItem>
                </Form>
              </Content>
            </Tab>
            
            <Tab heading="Status Rumah">
              <Content style={styles.container}>
                <Form style={{marginBottom: 20}}>
                  <Label style={styles.selfLabel}>Status Kepemilikan Rumah</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.sk_rumah}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Aset Rumah Lain</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.aset_rumah_lain}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Status Kepemilikan Tanah</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.sk_tanah}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Aset Tanah Lain</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.aset_tanah_lain}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Status Bantuan Perumahan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.status_bantuan_perum}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Nama Bantuan Perumahan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.nama_bantuan_perum}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Jenis Kawasan Rumah</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.jenis_kawasan_rumah}</Text>
                  </ListItem>

                </Form>
              </Content>
            </Tab>
            
            <Tab heading="Aspek Keselamatan">
              <Content style={styles.container}>
                <Form style={{marginBottom: 20}}>
                  <Label style={styles.selfLabel}>Material Pondasi</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.material_pondasi}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Kondisi Pondasi</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.kondisi_pondasi}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Catatan Kondisi Pondasi</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.catatan_pondasi}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Material Kolom/Balok</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.material_kolom_balok}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Kondisi Kolom/Balok</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.kondisi_kolom_balok}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Catatan Kondisi Kolom/Balok</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.catatan_kolom_balok}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Material Konstruksi Atap</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.material_konstruksi_atap}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Kondisi Konstruksi Atap</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.kondisi_konstruksi_atap}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Catatan Kondisi Konstruksi Atap</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.catatan_konstruksi_atap}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Proteksi Kebakaran</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.proteksi_kebakaran}</Text>
                  </ListItem>
                  
                  <Label style={styles.selfLabel}>Sarana Proteksi Kebakaran</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.sarana_proteksi_kebakaran}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Prasarana Proteksi Kebakaran</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.prasarana_proteksi_kebakaran}</Text>
                  </ListItem>
                  
                </Form>
              </Content>
            </Tab>
            <Tab heading="Aspek Kesehatan">
              <Content style={styles.container}>
                <Form style={{marginBottom: 20}}>
                  <Label style={styles.selfLabel}>Pencahayaan</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.pencahayaan}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Ventilasi</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.ventilasi}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Catatan Pintu Jendela</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.catatan_pintu_jendela}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Kondisi Pintu Jendela</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.kondisi_pintu_jendela}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Catatan Kondisi Pintu Jendela</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.catatan_kondisi_pintu_jendela}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Kamar Mandi & Jamban</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.kepemilikan_km_jamban}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Kondisi Kamar Mandi & Jamban</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.kondisi_km_jamban}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Catatan Kondisi Kamar Mandi & Jamban</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.catatan_km_jamban}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Fasilitas Buang Air Besar</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.penggunaan_fasilitas_bab}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Pembuangan Akhir Tinja</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.pembuangan_akhir_tinja}</Text>
                  </ListItem>
                  <Label style={styles.selfLabel}>Sumber Air Minum</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.sumber_air_minum}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Jarak Sumber Air</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.jarak_sumber_air}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Sumber Listrik</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.sumber_listrik}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Drainase</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.drainase}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Kondisi Drainase</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.kondisi_drainase}</Text>
                  </ListItem>
                  
                  <Label style={styles.selfLabel}>Tempat Sampah</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.tempat_sampah}</Text>
                  </ListItem>
                  
                </Form>
              </Content>
            </Tab>
            
            <Tab heading="Aspek Komponen Rumah">
              <Content style={styles.container}>
                <Form style={{marginBottom: 20}}>
                  <Label style={styles.selfLabel}>Material Atap</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.material_atap}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Kondisi Atap</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.kondisi_atap}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Catatan Kondisi Atap</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.catatan_atap}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Material Dinding</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.material_dinding}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Kondisi Dinding</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.kondisi_dinding}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Catatan Kondisi Dinding</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.catatan_dinding}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Material Lantai</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.material_lantai}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Kondisi Lantai</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.kondisi_lantai}</Text>
                  </ListItem>

                  <Label style={styles.selfLabel}>Catatan Kondisi Lantai</Label>
                  <ListItem style={styles.textDetail}>
                    <Text>{this.state.catatan_lantai}</Text>
                  </ListItem>

                </Form>
              </Content>
            </Tab>
            
            <Tab heading="Pembangunan">
              <Content style={styles.container}>
                <Label style={styles.selfLabel}>Jenis Pembangunan</Label>
                <ListItem style={styles.textDetail}>
                  <Text>{this.state.jenis_pembangunan}</Text>
                </ListItem>
              </Content>
            </Tab>
            {this.state.lat != '' && this.state.long != '' &&
                <Tab heading="Lokasi">
                  <TabSeven
                    isDetail={true}
                    updateLokasi={this.update_lokasi}
                    lat={this.state.lat}
                    lng={this.state.long}
                  />
                </Tab>
            }
            
          </Tabs>
          {this.state.allowUpdate && 
            <Fab
              active={this.state.active}
              style={{ backgroundColor: '#5067FF' }}
              position="bottomRight"
              onPress={() => this.props.navigation.navigate("DataRumahCE", { dataId: this.state.dataId, refresh: this._refresh })}>
              <Icon name="create" />
            </Fab>}
          </View>
        </Container>
      );
    }
  }
}

export default detail;
