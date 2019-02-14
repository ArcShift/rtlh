const React = require("react-native");
const { Platform, Dimensions } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  drawerCover: {
    alignSelf: "stretch",
    width: 0.8 * deviceWidth,
    height: 0.55 * 0.8 * deviceWidth,
    position: "relative",
    marginBottom: 10
  },
  drawerImage: {
    position: "absolute",
    left: Platform.OS === "android" ? deviceWidth / 20 : deviceWidth / 18,
    top: Platform.OS === "android" ? (deviceHeight / 26) - 10 : (deviceHeight / 24) - 10,
    width: 60,
    height: 60,
    resizeMode: "cover"
  },
  drawerText: {
    position: "absolute",
    top: (deviceHeight / 7) - 10,
    left: 20,
    color: "white",
    fontSize: 14
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16,
    marginLeft: 20
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -3 : undefined
  }
};
