import { AsyncStorage } from "react-native";

export const activeApp = "pemantauan"; // 'pendataan' atau 'pemantauan'   <== APP YANG SAAT INI AKTIF

export const appName = { // APP NAME
	"pendataan": "SIGAP RTLH",
	"pemantauan": "MORSE RTLH"
}

export const api = {
  //url : 'http://192.168.1.100/rtlh-api/' // MASUKKAN IP LOCAL PC KITA SAAT INI
  url : 'http://118.97.247.243:85/rtlh-api/index.php/' // ATAU SERVER API YG SUDAH LIVE
};

export default {
};