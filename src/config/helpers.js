import {
	Linking,
	Platform,
	Alert
} from 'react-native';
import SafariView from 'react-native-safari-view';

export const bulanShort = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
export const bulanFull = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export function openURL(url) {
	if (Platform.OS === 'ios') {
		SafariView.show({
			url: url,
			fromBottom: true,
		});
	}
	else {
		Linking.openURL(url);
	}
};

export function nominalFormat(number){ // 1000000 => 1.000.000
	if(number){
		number = number.toString();
		
		var min = '';
		if(number.indexOf('-') !== -1){
			number = number.substr(number.indexOf('-') + 1);
			min = '-';
		}
		
		var koma = '';
		if(number.indexOf('.') >= 0){
			koma = ',' + number.substr(number.indexOf('.') + 1);
			number = number.substr(0, number.indexOf('.'));
		}
		
		var	number_string = number.toString(),
			sisa 	= number_string.length % 3,
			nominal 	= number_string.substr(0, sisa),
			ribuan 	= number_string.substr(sisa).match(/\d{3}/g);

		if (ribuan) {
			separator = sisa ? '.' : '';
			nominal += separator + ribuan.join('.');
		}
		return min + nominal + koma;
	}
	
	return number;
}

export function tglIndo(date, type, isJam){
	if(date != 'null' && date != null && date != '' && date != '-'){
		var jam = '';
		if(type == 'short'){
			var bln = bulanShort;
		} else {
			var bln = bulanFull;
		}
		
		if(type == 'jam' || isJam == true){
			jam = date.split(' ')[1];
			date = date.split(' ')[0];
		}
	
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate().toString(),
			year = d.getFullYear();

		month = bln[month - 1];
		if (day.length < 2) day = '0' + day;

		return [day, month, year].join(' ') + " " + jam;
	} else {
		return date;
	}
}