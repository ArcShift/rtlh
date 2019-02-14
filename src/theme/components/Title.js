import { Platform } from "react-native";

import variable from "./../variables/platform";

export default (variables = variable) => {
  const titleTheme = {
    fontSize: variables.titleFontSize,
    fontFamily: variables.titleFontfamily,
    color: variables.titleFontColor,
    fontWeight: Platform.OS === "ios" ? "600" : undefined,
    textAlign: "center",
    marginLeft: -32
  };

  return titleTheme;
};
