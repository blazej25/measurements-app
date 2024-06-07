import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {styles} from '../styles/common-styles';
import FileSystemService from '../services/FileSystemService';
import DocumentPicker from 'react-native-document-picker';
import {ButtonIcon} from './ButtonIcon';
import GlobalSaveService from '../services/GlobalSaveService';

export const FilePicker = ({
  label,
}: {
  label: string;
}) => {
  const fileSystemService = new FileSystemService();
  const globalSaveService = new GlobalSaveService();
  return (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={() => {
        DocumentPicker.pickSingle()
          .then((response: any) => {
            const result: Promise<string> =
              fileSystemService.loadStringFromPath(response['uri']);
            result.then(csvContents => {
              console.log("Loading state from CSV file inside FilePicker: ");
              console.log(csvContents);
              globalSaveService.restoreGlobalStateFromCSV(csvContents);
            });
          })
          .catch((error: any) => {
            console.log(error);
          });
      }}>
      <Text style={styles.actionButtonText}>{label}</Text>
      <ButtonIcon materialIconName="folder-open" />
    </TouchableOpacity>
  );
};
