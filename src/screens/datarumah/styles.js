import {
	Dimensions,
	StyleSheet
} from 'react-native';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default {
  container: {
    backgroundColor: "#FFF"
  },
  btnAct: {
    marginTop: 0,
    marginBottom: 5,
  },
  text: {
    alignSelf: "center",
    marginBottom: 7
  },
  mb: {
    marginBottom: 15
  },
  selfLabel: {
    marginLeft: 15, marginTop: 15, color: "#575757", fontSize: 15
  },
  pickerList: {
    marginLeft: 15, marginTop: 0, marginRight: 15, marginBottom: 0,
    paddingLeft: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 0
  },
  textDetail: {
    marginLeft: 15, marginTop: 5, marginRight: 15, marginBottom: 0,
    paddingLeft: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 5
  },
  pickerBorder: {
    width: "100%",
  },
  dateInput: {
    borderWidth: 0,
    alignItems: 'flex-start'
  },
  dateText: {
    color: '#000',
    fontSize: 15
  },
  datePlaceholder: {
    fontSize: 15
  },
  mapContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'flex-end',
		alignItems: 'center',
		height: viewportHeight
	},
	mapStyle: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	},
	footer: {
		justifyContent: 'flex-end',
		flex: 1,
		position: 'relative',
		left: 0, right: 0, bottom: 50,
		padding: 20,
		alignSelf: "stretch"
	},
};
