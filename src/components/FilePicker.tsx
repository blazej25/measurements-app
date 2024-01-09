import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {styles} from '../styles/common-styles';
import FileSystemService from '../services/FileSystemService';
import DocumentPicker from 'react-native-document-picker';
import {ButtonIcon} from './ButtonIcon';

export const FilePicker = ({
  fileContentsProcessor,
  label,
}: {
  fileContentsProcessor: (contents: string) => void;
  label: string;
}) => {
  const fileSystemService = new FileSystemService();
  return (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={() => {
        DocumentPicker.pickSingle()
          .then((response: any) => {
            const result: Promise<string> =
              fileSystemService.loadStringFromPath(response['uri']);
            result.then(fileContentsProcessor);
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
