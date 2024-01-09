import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { colors, defaultBorderRadius, defaultGap, defaultPadding, styles } from "../styles/common-styles";
import FileSystemService from '../services/FileSystemService';
import DocumentPicker from 'react-native-document-picker';
import { ButtonIcon } from "./ButtonIcon";

export const FilePicker = ({fileContentsHandler, label}: {fileContentsHandler: (contents: Object) => void, label: string}) => {
  const fileSystemService = new FileSystemService();
   return (
      <TouchableOpacity
        activeOpacity={1.0}
        style={{
          flexDirection: 'row',
          backgroundColor: colors.secondaryBlue,
          marginHorizontal: defaultGap,
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: defaultBorderRadius,
          margin: defaultGap,
          paddingHorizontal: defaultPadding,
          height: 40,
        }}
        onPress={() => {
          DocumentPicker.pickSingle()
            .then((response: any) => {
              const result: Promise<Object> =
                fileSystemService.loadJSONFromPath(response['uri']);
              result.then(fileContentsHandler);
            })
            .catch((error: any) => {
              console.log(error);
            });
        }}>
        <Text style={{
            ...styles.buttonText1,
            alignSelf: 'center',
            margin: defaultGap,
            marginLeft: defaultPadding,
            color: colors.buttonBlue,
        }}>{label}</Text>
        <ButtonIcon materialIconName="folder-open" />
      </TouchableOpacity>
   );
}
