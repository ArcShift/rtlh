import React, { Component } from "react";
import { api } from '../../config/config';
import { AsyncStorage } from "react-native";
import {
  Container,
  Header,
  Title,
  Button,
  Icon,
  Tabs,
  Tab,
  Right,
  Left,
  Body,
  Content,
  ScrollableTab,
  Toast,
  Spinner
} from "native-base";
import styles from "./styles";
import TabOne from "./tabOne";
import TabTwo from "./tabTwo";
import TabThree from "./tabThree";
import TabFour from "./tabFour";
import TabFive from "./tabFive";
import TabSix from "./tabSix";
import TabSeven from "./tabSeven";
import TabEight from "./tabEight";

class createEdit extends Component {
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
      catatan_jenis_kawasan_rumah: '',
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
      id_kesesuaian_ump: '',
      drainase: '',
      id_kondisi_drainase: '',
      tempat_sampah: '',
      proteksi_kebakaran: '',
      sarana_proteksi_kebakaran_lainnya: '',
      prasarana_proteksi_kebakaran_lainnya: '',
      
      data_source: '',
      last_modified_time: '',
      last_modified_username: '',
      
      file_ktp: [],
      file_kk: [],
      file_rumah: [],
      file_bukti_sk_rumah: [],
      file_removes: [],
      folder_temp: '',
      
      id_user: '',
      dataEdit: [],
      dataId: '',
      dataLoaded: false,
      edit: false
    };
  }

  update_tgl_survey = (text) => {this.setState({ tgl_survey: text })};
  update_kecamatan = (text) => {this.setState({ kecamatan: text })};
  update_desa = (text) => {this.setState({ desa: text })};
  update_nama_responden = (text) => {this.setState({ nama_responden: text })};
  update_nik_responden = (text) => {this.setState({ nik_responden: text })};
  update_nohp_responden = (text) => {this.setState({ nohp_responden: text })};
  update_nama_pb = (text) => {this.setState({ nama_pb: text })};
  update_nik_pb = (text) => {this.setState({ nik_pb: text })};
  update_jk = (text) => {this.setState({ jk: text })};
  update_umur = (text) => {this.setState({ umur: text })};
  update_status = (text) => {this.setState({ status: text })};
  update_apakah_krt = (text) => {this.setState({ apakah_krt: text })};
  update_alamat = (text) => {this.setState({ alamat: text })};
  update_lat = (text) => {this.setState({ lat: text })};
  update_long = (text) => {this.setState({ long: text })};
  update_luas_rmh = (text) => {this.setState({ luas_rmh: text })};
  update_jml_penghuni = (text) => {this.setState({ jml_penghuni: text })};
  update_jml_kk = (text) => {this.setState({ jml_kk: text })};
  update_pekerjaan = (text) => {this.setState({ pekerjaan: text })};
  update_penghasilan = (text) => {this.setState({ penghasilan: text })};
  update_nominal_penghasilan = (text) => {this.setState({ nominal_penghasilan: text })};
  update_pendidikan = (text) => {this.setState({ pendidikan: text })};
  update_status_fisik = (text) => {this.setState({ status_fisik: text })};
  update_sk_rumah = (text) => {this.setState({ sk_rumah: text })};
  update_aset_rumah_lain = (text) => {this.setState({ aset_rumah_lain: text })};
  update_sk_tanah = (text) => {this.setState({ sk_tanah: text })};
  update_aset_tanah_lain = (text) => {this.setState({ aset_tanah_lain: text })};
  update_status_bantuan_perum = (text) => {this.setState({ status_bantuan_perum: text })};
  update_nama_bantuan_perum = (text) => {this.setState({ nama_bantuan_perum: text })};
  update_catatan_jenis_kawasan_rumah = (text) => {this.setState({ catatan_jenis_kawasan_rumah: text })};
  update_material_pondasi = (text) => {this.setState({ material_pondasi: text })};
  update_kondisi_pondasi = (text) => {this.setState({ kondisi_pondasi: text })};
  update_catatan_pondasi = (text) => {this.setState({ catatan_pondasi: text })};
  update_material_kolom_balok = (text) => {this.setState({ material_kolom_balok: text })};
  update_kondisi_kolom_balok = (text) => {this.setState({ kondisi_kolom_balok: text })};
  update_catatan_kolom_balok = (text) => {this.setState({ catatan_kolom_balok: text })};
  update_material_konstruksi_atap = (text) => {this.setState({ material_konstruksi_atap: text })};
  update_kondisi_konstruksi_atap = (text) => {this.setState({ kondisi_konstruksi_atap: text })};
  update_catatan_konstruksi_atap = (text) => {this.setState({ catatan_konstruksi_atap: text })};
  update_material_atap = (text) => {this.setState({ material_atap: text })};
  update_kondisi_atap = (text) => {this.setState({ kondisi_atap: text })};
  update_catatan_atap = (text) => {this.setState({ catatan_atap: text })};
  update_material_dinding = (text) => {this.setState({ material_dinding: text })};
  update_kondisi_dinding = (text) => {this.setState({ kondisi_dinding: text })};
  update_catatan_dinding = (text) => {this.setState({ catatan_dinding: text })};
  update_material_lantai = (text) => {this.setState({ material_lantai: text })};
  update_kondisi_lantai = (text) => {this.setState({ kondisi_lantai: text })};
  update_catatan_lantai = (text) => {this.setState({ catatan_lantai: text })};
  update_pencahayaan = (text) => {this.setState({ pencahayaan: text })};
  update_ventilasi = (text) => {this.setState({ ventilasi: text })};
  update_catatan_pintu_jendela = (text) => {this.setState({ catatan_pintu_jendela: text })};
  update_kondisi_pintu_jendela = (text) => {this.setState({ kondisi_pintu_jendela: text })};
  update_catatan_kondisi_pintu_jendela = (text) => {this.setState({ catatan_kondisi_pintu_jendela: text })};
  update_kepemilikan_km_jamban = (text) => {this.setState({ kepemilikan_km_jamban: text })};
  update_kondisi_km_jamban = (text) => {this.setState({ kondisi_km_jamban: text })};
  update_catatan_km_jamban = (text) => {this.setState({ catatan_km_jamban: text })};
  update_penggunaan_fasilitas_bab = (text) => {this.setState({ penggunaan_fasilitas_bab: text })};
  update_pembuangan_akhir_tinja = (text) => {this.setState({ pembuangan_akhir_tinja: text })};
  update_sumber_air_minum = (text) => {this.setState({ sumber_air_minum: text })};
  update_jarak_sumber_air = (text) => {this.setState({ jarak_sumber_air: text })};
  update_sumber_listrik = (text) => {this.setState({ sumber_listrik: text })};
  update_jenis_pembangunan = (text) => {this.setState({ jenis_pembangunan: text })};
  update_lokasi = (lat, lng) => {this.setState({ lat: lat, long: lng })};
  update_no_urut = (text) => {this.setState({ no_urut_target: text })};
  update_keterangan = (text) => {this.setState({ keterangan: text })};
  update_id_kesesuaian_ump = (text) => {this.setState({ id_kesesuaian_ump: text })};
  update_drainase = (text) => {this.setState({ drainase: text })};
  update_id_kondisi_drainase = (text) => {this.setState({ id_kondisi_drainase: text })};
  update_tempat_sampah = (text) => {this.setState({ tempat_sampah: text })};
  update_proteksi_kebakaran = (text) => {this.setState({ proteksi_kebakaran: text })};
  update_sarana_proteksi_kebakaran_lainnya = (text) => {this.setState({ sarana_proteksi_kebakaran_lainnya: text })};
  update_prasarana_proteksi_kebakaran_lainnya = (text) => {this.setState({ prasarana_proteksi_kebakaran_lainnya: text })};

  update_data_source = (text) => {this.setState({ data_source: text })};
  update_last_modified_time = (text) => {this.setState({ last_modified_time: text ? text : '-' })};
  update_last_modified_username = (text) => {this.setState({ last_modified_username: text ? text : '-' })};
  
  update_file_removes = (fr) => {
    this.setState({ file_removes: fr })
    console.log("[1] this.state.file_removes=" + this.state.file_removes);
  };
  update_folder_temp = (text) => {
    this.setState({ folder_temp: text })
    console.log("[1] this.state.folder_temp=" + this.state.folder_temp);
  };
  update_file_ktp = (fr) => {
    this.setState({ file_ktp: fr })
    console.log("[1] this.state.file_ktp=" + this.state.file_kk);
  };
  update_file_kk = (fr) => {
    this.setState({ file_kk: fr })
    console.log("[1] this.state.file_kk=" + this.state.file_kk);
  };
  update_file_rumah = (fr) => {
    this.setState({ file_rumah: fr })
    console.log("[1] this.state.file_rumah=" + this.state.file_rumah);
  };
  update_file_bukti_sk_rumah = (fr) => {
    this.setState({ file_bukti_sk_rumah: fr })
    console.log("[1] this.state.file_bukti_sk_rumah=" + this.state.file_bukti_sk_rumah);
  };

  _getId() {
    let id = false;
    if(this.props.navigation.state.params.dataId) {
      id = this.props.navigation.state.params.dataId;
    }
    return id;
  }

  _getUserId() {
    let userId = false;
    if(this.props.navigation.state.params.id_user) {
      userId = this.props.navigation.state.params.id_user;
    }
    return userId;
  }

  _getTabIdx() {
    let tabIdx = 0;
    if(this.props.navigation.state.params.tabIdx) {
      tabIdx = this.props.navigation.state.params.tabIdx;
    }
    return tabIdx;
  }
  
  componentWillMount() {
    this.checkAccess();
    
    if(this._getId() !== false) {
      this.setState({dataId: this._getId()});
      this.setState({edit: true});
      this.dataEdit();
    }
  }

  checkAccess = async() => {
    try{
      let group_akses = await AsyncStorage.getItem("hak_akses");
      let update = group_akses.indexOf("data_rtlh.update");
      if (update != -1) {
        this.setState({allowUpdate: true});
      }
      //console.log("this.state.allowUpdate=" + this.state.allowUpdate);
      
      let iduser = await AsyncStorage.getItem("iduser");
      this.setState({id_user: iduser});
      //console.log("this.state.id_user=" + this.state.id_user);
    }
    catch(e){
      Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 3000 });
      this.props.navigation.goBack();
    }
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
    .then(response => response.text())
    .then(body => {
      console.log(body);
      var jsonResp = JSON.parse(body);
      console.log(jsonResp);
      if (jsonResp.message == 'success') {
	    this.setState({dataEdit: jsonResp.data});
        this.setData(jsonResp.data);
      } else {
        Toast.show({ text: jsonResp.message, buttonText: "Okay", duration: 3000 })
      }
    })
    .catch(error => {
      //console.warn(error)
      Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 3000 });
    })
    .done();
  }
  
  setData = (dt) => {
    if (!dt || dt.length <= 0){
      return;
    }
    
    this.update_tgl_survey(dt.tgl_survey);
    this.update_kecamatan(dt.id_skpd_kecamatan);
    this.update_desa(dt.id_skpd_desa);
    this.update_nama_responden(dt.nama_responden);
    this.update_nik_responden(dt.nik_responden);
    this.update_nohp_responden(dt.no_hp_responden);
    this.update_nama_pb(dt.nama_penerima_bantuan);
    this.update_nik_pb(dt.nik_penerima_bantuan);
    this.update_jk(dt.jenis_kelamin);
    this.update_umur(dt.umur);
    this.update_status(dt.status_perkawinan);
    this.update_apakah_krt(dt.apakah_kepala_keluarga);
    this.update_alamat(dt.alamat_rumah);
    this.update_lat(dt.latitude);
    this.update_long(dt.longitude);
    this.update_luas_rmh(dt.luas_rumah);
    this.update_jml_penghuni(dt.jumlah_penghuni);
    this.update_jml_kk(dt.jumlah_kk_dalam_rumah);
    this.update_pekerjaan(dt.id_pekerjaan);
    this.update_penghasilan(dt.id_penghasilan);
    this.update_nominal_penghasilan(dt.nominal_penghasilan);
    this.update_pendidikan(dt.id_pendidikan);
    this.update_status_fisik(dt.status_fisik);
    this.update_sk_rumah(dt.bukti_kepemilikan_rumah);
    this.update_aset_rumah_lain(dt.aset_rumah_lain);
    this.update_sk_tanah(dt.bukti_kepemilikan_tanah);
    this.update_aset_tanah_lain(dt.aset_tanah_lain);
    this.update_status_bantuan_perum(dt.id_status_bantuan_perumahan);
    this.update_nama_bantuan_perum(dt.nama_bantuan_perumahan);
    this.update_catatan_jenis_kawasan_rumah(dt.catatan_jenis_kawasan_rumah);
    this.update_material_pondasi(dt.id_material_pondasi);
    this.update_kondisi_pondasi(dt.id_kondisi_pondasi);
    this.update_catatan_pondasi(dt.catatan_kondisi_pondasi);
    this.update_material_kolom_balok(dt.id_material_kolom_balok);
    this.update_kondisi_kolom_balok(dt.id_kondisi_kolom_balok);
    this.update_catatan_kolom_balok(dt.catatan_kondisi_kolom_balok);
    this.update_material_konstruksi_atap(dt.id_material_konstruksi_atap);
    this.update_kondisi_konstruksi_atap(dt.id_kondisi_konstruksi_atap);
    this.update_catatan_konstruksi_atap(dt.catatan_kondisi_konstruksi_atap);
    this.update_material_atap(dt.id_material_atap);
    this.update_kondisi_atap(dt.id_kondisi_atap);
    this.update_catatan_atap(dt.catatan_kondisi_atap);
    this.update_material_dinding(dt.id_material_dinding);
    this.update_kondisi_dinding(dt.id_kondisi_dinding);
    this.update_catatan_dinding(dt.catatan_kondisi_dinding);
    this.update_material_lantai(dt.id_material_lantai);
    this.update_kondisi_lantai(dt.id_kondisi_lantai);
    this.update_catatan_lantai(dt.catatan_kondisi_lantai);
    this.update_pencahayaan(dt.pencahayaan);
    this.update_ventilasi(dt.ventilasi);
    this.update_catatan_pintu_jendela(dt.catatan_pintu_jendela);
    this.update_kondisi_pintu_jendela(dt.id_kondisi_pintu_jendela);
    this.update_catatan_kondisi_pintu_jendela(dt.catatan_kondisi_pintu_jendela);
    this.update_kepemilikan_km_jamban(dt.id_kepemilikan_km_jamban);
    this.update_kondisi_km_jamban(dt.id_kondisi_km_jamban);
    this.update_catatan_km_jamban(dt.catatan_kondisi_km_jamban);
    this.update_penggunaan_fasilitas_bab(dt.id_penggunaan_fasilitas_bab);
    this.update_pembuangan_akhir_tinja(dt.id_pembuangan_akhir_tinja);
    this.update_sumber_air_minum(dt.sumber_air_minum_lainnya);
    this.update_jarak_sumber_air(dt.jarak_sumber_air_minum);
    this.update_sumber_listrik(dt.id_sumber_listrik);
    this.update_jenis_pembangunan(dt.id_jenis_pembangunan);
    this.update_lokasi(dt.latitude, dt.longitude);
    this.update_no_urut(dt.no_urut_target);
    this.update_keterangan(dt.keterangan);
    this.update_id_kesesuaian_ump(dt.id_kesesuaian_ump);
    this.update_drainase(dt.drainase);
    this.update_id_kondisi_drainase(dt.id_kondisi_drainase);
    this.update_tempat_sampah(dt.tempat_sampah);
    this.update_proteksi_kebakaran(dt.proteksi_kebakaran);
    this.update_sarana_proteksi_kebakaran_lainnya(dt.sarana_proteksi_kebakaran_lainnya);
    this.update_prasarana_proteksi_kebakaran_lainnya(dt.prasarana_proteksi_kebakaran_lainnya);
    
    this.update_data_source(dt.data_source);
    this.update_last_modified_time(dt.last_modified_time);
    this.update_last_modified_username(dt.last_modified_username);
    
    this.update_file_ktp(dt.file_ktp);
    this.update_file_kk(dt.file_rumah);
    this.update_file_rumah(dt.file_rumah);
    this.update_file_bukti_sk_rumah(dt.file_rumah);
    
    this.setState({dataLoaded: true});
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
    
        url = api.url + "data_rumah/" + act;
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
                Toast.show({ text: jsonResp.message, buttonText: "Okay", duration: 5000 })
              }
            })
            .catch(error => {
              console.log(error);
              Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 5000 })
            })
            .then(() => {
              if(proceed) {
                Toast.show({ text: 'Data berhasil disimpan.', buttonText: "Okay" });
                this.props.navigation.state.params.refresh();
                this.props.navigation.goBack();
              }
            })
            .done();
        } catch (error) {
          Toast.show({ text: "Terjadi kesalahan. Mohon ulang kembali.", buttonText: "Okay", duration: 5000 });
        }
     }
  }

  render() {
    var de = this.state.dataEdit;
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
            <Title>Edit Data Rumah </Title>
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

          <Tabs initialPage={this._getTabIdx()} renderTabBar={() => <ScrollableTab/>}>
            <Tab heading="Data Responden">
              <TabOne
                data={de}
                updateTglSurvey={this.update_tgl_survey}
                updateKecamatan={this.update_kecamatan}
                updateDesa={this.update_desa}
                updateNikResponden={this.update_nik_responden}
                updateNamaResponden={this.update_nama_responden}
                updateNohpResponden={this.update_nohp_responden}
                updateKeterangan={this.update_keterangan}
              />
            </Tab>
            <Tab heading="Data Identitas Target">
              <TabTwo
                data={de}
                updateNoUrut={this.update_no_urut}
                updateNikPB={this.update_nik_pb}
                updateNamaPB={this.update_nama_pb}
                updateJK={this.update_jk}
                updateUmur={this.update_umur}
                updateStatusKawin={this.update_status}
                updateStatusFisik={this.update_status_fisik}
                updatePendidikan={this.update_pendidikan}
                updatePekerjaan={this.update_pekerjaan}
                updatePenghasilan={this.update_penghasilan}
                updateNominalPenghasilan={this.update_nominal_penghasilan}
                updateIdKesesuaianUMP={this.update_id_kesesuaian_ump}
                updateApakahKRT={this.update_apakah_krt}
                updateAlamat={this.update_alamat}
                updateLuasRumah={this.update_luas_rmh}
                updateJmlPenghuni={this.update_jml_penghuni}
                updateJmlKK={this.update_jml_kk}
              />
            </Tab>
            <Tab heading="Status Rumah">
              <TabThree
                data={de}
                updateSKRumah={this.update_sk_rumah}
                updateAsetRumahLain={this.update_aset_rumah_lain}
                updateSKTanah={this.update_sk_tanah}
                updateAsetTanahLain={this.update_aset_tanah_lain}
                updateStatusBantuanPerum={this.update_status_bantuan_perum}
                updateNamaBantuanPerum={this.update_nama_bantuan_perum}
                updateCatatanJenisKawasanRumah={this.update_catatan_jenis_kawasan_rumah}
              />
            </Tab>
            <Tab heading="Aspek Keselamatan & Komponen">
              <TabFour
                data={de}
                updateMaterialPondasi={this.update_material_pondasi}
                updateKondisiPondasi={this.update_kondisi_pondasi}
                updateCatatanPondasi={this.update_catatan_pondasi}
                updateMaterialKolomBalok={this.update_material_kolom_balok}
                updateKondisiKolomBalok={this.update_kondisi_kolom_balok}
                updateCatatanKolomBalok={this.update_catatan_kolom_balok}
                updateMaterialKonstruksiAtap={this.update_material_konstruksi_atap}
                updateKondisiKonstruksiAtap={this.update_kondisi_konstruksi_atap}
                updateCatatanKonstruksiAtap={this.update_catatan_konstruksi_atap}
                updateProteksiKebakaran={this.update_proteksi_kebakaran}
                updateSaranaProteksiKebakaranLainnya={this.update_sarana_proteksi_kebakaran_lainnya}
                updatePrasaranaProteksiKebakaranLainnya={this.update_prasarana_proteksi_kebakaran_lainnya}
                
                updateMaterialAtap={this.update_material_atap}
                updateKondisiAtap={this.update_kondisi_atap}
                updateCatatanAtap={this.update_catatan_atap}
                updateMaterialDinding={this.update_material_dinding}
                updateKondisiDinding={this.update_kondisi_dinding}
                updateCatatanDinding={this.update_catatan_dinding}
                updateMaterialLantai={this.update_material_lantai}
                updateKondisiLantai={this.update_kondisi_lantai}
                updateCatatanLantai={this.update_catatan_lantai}
              />
            </Tab>
            <Tab heading="Aspek Kesehatan">
              <TabFive
                data={de}
                updatePencahayaan={this.update_pencahayaan}
                updateVentilasi={this.update_ventilasi}
                updateCatatanPintuJendela={this.update_catatan_pintu_jendela}
                updateKondisiPintuJendela={this.update_kondisi_pintu_jendela}
                updateCatatanKondisiPintuJendela={this.update_catatan_kondisi_pintu_jendela}
                updateKepemilikanKMJamban={this.update_kepemilikan_km_jamban}
                updateKondisiKMJamban={this.update_kondisi_km_jamban}
                updateCatatanKMJamban={this.update_catatan_km_jamban}
                updatePenggunaanFasilitasBab={this.update_penggunaan_fasilitas_bab}
                updatePembuanganAkhirTinja={this.update_pembuangan_akhir_tinja}
                updateSumberAirMinum={this.update_sumber_air_minum}
                updateJarakSumberAir={this.update_jarak_sumber_air}
                updateSumberListrik={this.update_sumber_listrik}
                updateDrainase={this.update_drainase}
                updateIdKondisiDrainase={this.update_id_kondisi_drainase}
                updateTempatSampah={this.update_tempat_sampah}
              />
            </Tab>
            <Tab heading="Lokasi">
              <TabSeven
                updateLokasi={this.update_lokasi}
				lat={this.state.lat}
				lng={this.state.long}
              />
            </Tab>
            <Tab heading="Lampiran">
              <TabEight
                data={de}
                updateFolderTemp={this.update_folder_temp}
                updateFileRemoves={this.update_file_removes}
                updateFileKtp={this.update_file_ktp}
                updateFileKk={this.update_file_kk}
                updateFileRumah={this.update_file_rumah}
                updateFileBuktiSkRumah={this.update_file_bukti_sk_rumah}
              />
            </Tab>
            <Tab heading="Pembangunan">
              <TabSix
                updateJenisPembangunan={this.update_jenis_pembangunan}
                submitData={this._submit}
              />
            </Tab>
          </Tabs>
        </Container>
      );
    }
  }
}

export default createEdit;
