import React, {useState} from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {
  colors,
  defaultGap,
  defaultPadding,
  styles,
} from '../styles/common-styles';
import FileSystemService from '../services/FileSystemService';
import DocumentPicker from 'react-native-document-picker';
import {ButtonIcon} from './ButtonIcon';
import {TextInputBar} from './input-bars';

export const SaveChangesButton = ({
  getSavedFileContents,
  label,
}: {
  getSavedFileContents: () => string;
  label: string;
}) => {
  const fileSystemService = new FileSystemService();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            margin: defaultGap,
            flex: 1,
            justifyContent: 'center',
            gap: defaultGap,
          }}>
          <Text style={styles.uiPromptText}>
            How do you want to save the file?
          </Text>
          <CreateNewFileModal />
          <OverwriteExistingFileButton
            getSavedFileContents={getSavedFileContents}
          />
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text style={styles.actionButton}>{label}</Text>
        <ButtonIcon materialIconName="content-save" />
      </TouchableOpacity>
    </>
  );
};

const OverwriteExistingFileButton = ({
  getSavedFileContents,
}: {
  getSavedFileContents: () => string;
}) => {
  const fileSystemService = new FileSystemService();
  return (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={() => {
        DocumentPicker.pickSingle()
          .then((response: any) => {
            const fileName = response['uri'];
            fileSystemService.saveToExternalStorage(
              getSavedFileContents(),
              fileName,
            );
          })
          .catch((error: any) => {
            console.log(error);
          });
      }}>
      <Text style={styles.actionButtonText}> Overwrite an existing file </Text>
      <ButtonIcon materialIconName="content-save" />
    </TouchableOpacity>
  );
};

const CreateNewFileModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fileName, setFileName] = useState('');
  return (
    <View>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            margin: defaultGap,
            flex: 1,
            justifyContent: 'center',
            gap: defaultGap,
          }}>
          <Text style={styles.uiPromptText}>
            Please enter the name of the file to create.
          </Text>
          <TextInputBar
            label="File name:"
            onChangeText={text => setFileName(text)}
          />
          <Text style={styles.uiPromptText}>
            Your file will be saved in the Downloads directory.
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setModalVisible(false);
            }}>
            <Text style={styles.actionButtonText}>Create the file</Text>
            <ButtonIcon materialIconName="plus" />
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text style={styles.actionButtonText}>Create a new file</Text>
        <ButtonIcon materialIconName="plus" />
      </TouchableOpacity>
    </View>
  );
};
