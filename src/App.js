import React from "react";
import {Root} from "native-base";
import {StackNavigator, DrawerNavigator} from "react-navigation";
import {Image, View, AsyncStorage} from "react-native";

import SideBar from "./screens/sidebar";
// RTLH ==================================================
import Login from "./screens/login/";
import Beranda from "./screens/beranda/";
import DataRumah from "./screens/datarumah/";
import DataRumahCE from "./screens/datarumah/createedit";
import DataRumahDetail from "./screens/datarumah/detail";
import DataRumahKadesCE from "./screens/datarumah/createEditKades";
import DataRumahKadesDetail from "./screens/datarumah/detailKades";
import Verifikasi from "./screens/verifikasi/";
import DetailVerifikasi from "./screens/verifikasi/detail";
import ProgressKondisi from "./screens/progressKondisi/";
import ListKondisi from "./screens/progressKondisi/list";
import DetailKondisi from "./screens/progressKondisi/detail";
import ProgressMaterial from "./screens/progressMaterial/";
import ListMaterial from "./screens/progressMaterial/list";
import DetailMaterial from "./screens/progressMaterial/detail";
import ProgressKeuangan from "./screens/progressKeuangan/";
import ListKeuangan from "./screens/progressKeuangan/list";
import DetailKeuangan from "./screens/progressKeuangan/detail";
import DetailMaterialUpdate from "./screens/progressMaterial/detailMaterialUpdate";
import DetailDokumenMaterial from "./screens/progressMaterial/detailDokumenMaterial";
import DetailFotoRumah from "./screens/verifikasi/detailFotoRumah";
//import Rekapitulasi from "./screens/rekapitulasi/";
//import Pengaturan from "./screens/pengaturan/";
// =======================================================

const LoginPage = StackNavigator(
  {
    // RTLH ==================================================
    Login: {screen: Login},
    Beranda: { screen: Beranda },
    DataRumah: { screen: DataRumah },
    // =======================================================
  },
  {
    initialRouteName: "Login",
    headerMode: "none"
  }
);

const Drawer = DrawerNavigator(
  {
    Beranda: {screen: Beranda},

  },
  {
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    contentComponent: props => <SideBar {...props} />
  }
);

const AppNavigator = StackNavigator(
  {
    Drawer: {screen: Drawer},

    // RTLH ==================================================
    //Rekapitulasi: { screen: Rekapitulasi },
    //Pengaturan: { screen: Pengaturan },
    DataRumahDetail: {screen: DataRumahDetail},
    DataRumahCE: {screen: DataRumahCE},
    DataRumahKadesDetail: {screen: DataRumahKadesDetail},
    DataRumahKadesCE: {screen: DataRumahKadesCE},
    DataRumah: {screen: DataRumah},
    Verifikasi: {screen: Verifikasi},
    DetailVerifikasi: {screen: DetailVerifikasi},
    ProgressKondisi: {screen: ProgressKondisi},
    ListKondisi: {screen: ListKondisi},
    DetailKondisi: {screen: DetailKondisi},
    ProgressMaterial: {screen: ProgressMaterial},
    ListMaterial: {screen: ListMaterial},
    DetailMaterial: {screen: DetailMaterial},
    ProgressKeuangan: {screen: ProgressKeuangan},
    ListKeuangan: {screen: ListKeuangan},
    DetailKeuangan: {screen: DetailKeuangan},
	DetailMaterialUpdate: {screen: DetailMaterialUpdate},
	DetailDokumenMaterial: {screen: DetailDokumenMaterial},
	DetailFotoRumah: {screen: DetailFotoRumah}
    // =======================================================


  },
  {
    headerMode: "none"
  }
);

export default class App extends React.Component {
  state = {
    isLoggedIn: false,
    loaded: true,
    isProcess: true
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    if (this.state.loaded == true) {
      try {
        AsyncStorage.getItem('iduser').then(
          (value) => {
            console.log(value);
            if (value != null) {
              this.setState({loggedInStatus: 'loggedIn', isProcess: false});
            } else {
              this.setState({loaded: false, isProcess: false});
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    }

  }

  checkPage() {
    if (this.state.loggedInStatus === 'loggedIn' && this.state.loaded == true) {
      return (
        <AppNavigator screenProps={{
          isLoggedIn: () => {
            console.log('LogOut');
            this.setState({loggedInStatus: 'loggedOut', loaded: false})
          }
        }}/>
      );
    } else if (this.state.loggedInStatus === 'loggedOut' || !this.state.isProcess) {
      return (
        <LoginPage screenProps={{
          isLoggedIn: () => {
            console.log('LogIn');
            this.setState({loggedInStatus: 'loggedIn', loaded: !this.state.loaded})
          }
        }}/>
      );
    }

    return (
      <View/>
    );

    /*return (
      <View style={{ justifyContent: 'center', alignItems: 'center',}}>
        <Image style={{ marginTop: 100, marginBottom: 20,width: 150, height: 150 }} source={require("../assets/logo-new.png")}/>
        </View>
    );*/
  }

  render() {
    let page = this.checkPage();

    return (
      <Root>
        {page}
      </Root>
    );
  }

}

Expo.registerRootComponent(App);

/*
export default () =>
  <Root>
    <AppNavigator
	/>
  </Root>;*/
