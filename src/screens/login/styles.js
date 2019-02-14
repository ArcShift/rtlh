import { Dimensions } from "react-native";

export default {
  container: {
    backgroundColor: "#FFF"
  },
  input: {
    marginRight: 15,
	width: Dimensions.get('window').width - 50
  },
  imageBG: {
		resizeMode: 'cover'
	},
	outsideBG: {
		marginHorizontal: 20,
		width: Dimensions.get('window').width,
		alignItems: 'center',
		alignSelf: 'center',
		flex: 1,
		position: 'absolute',
		top: 0,
	}
};
