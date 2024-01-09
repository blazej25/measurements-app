import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/common-styles";
import FileSystemService from '../services/FileSystemService';
import DocumentPicker from 'react-native-document-picker';
import { ButtonIcon } from "./ButtonIcon";

export const FilePicker = ({fileContentsHandler, label}: {fileContentsHandler: (contents: Object) => void, label: string}) => {
  const fileSystemService = new FileSystemService();
   return (
      <TouchableOpacity
        style={styles.actionButton}
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
        <Text style={styles.actionButtonText}>{label}</Text>
        <ButtonIcon materialIconName="folder-open" />
      </TouchableOpacity>
   );
}
