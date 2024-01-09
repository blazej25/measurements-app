import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../styles/common-styles";

export const ButtonIcon = ({materialIconName}: {materialIconName: string}) => {
  return (
    <Icon
      name={materialIconName}
      size={20}
      color={colors.buttonBlue}
    />
  );
};
