import React, {useState} from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {
  defaultGap,
  styles,
} from '../styles/common-styles';
import FileSystemService from '../services/FileSystemService';
import DocumentPicker from 'react-native-document-picker';
import {ButtonIcon} from './ButtonIcon';
import {TextInputBar} from './input-bars';
import {useTranslation} from 'react-i18next';

export const SaveChangesButton = ({
  getSavedFileContents,
  label,
}: {
  getSavedFileContents: () => string;
  label: string;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {t} = useTranslation();

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
          <Text style={styles.uiPromptText}>{t('fileSaving:howToSave')}</Text>
          <CreateNewFileModal
            getSavedFileContents={getSavedFileContents}
            setOuterModalVisible={setModalVisible}
          />
          <OverwriteExistingFileButton
            getSavedFileContents={getSavedFileContents}
            setModalVisible={setModalVisible}
          />
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text style={styles.actionButtonText}>{label}</Text>
        <ButtonIcon materialIconName="content-save" />
      </TouchableOpacity>
    </>
  );
};

const OverwriteExistingFileButton = ({
  getSavedFileContents,
  setModalVisible,
}: {
  getSavedFileContents: () => string;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {t} = useTranslation();
  const fileSystemService = new FileSystemService();
  return (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={() => {
        setModalVisible(false);
        DocumentPicker.pickSingle({mode: 'import', copyTo: 'documentDirectory'})
          .then((response: any) => {
            console.log(response);
            const fileName = response['name'];
            fileSystemService.saveToExternalStorageAlert(
              getSavedFileContents(),
              fileName,
              t('fileSaving:fileSavedSuccessfully'),
              t('fileSaving:error'),
            );
          })
          .catch((error: any) => {
            console.log(error);
          });
      }}>
      <Text style={styles.actionButtonText}> {t('fileSaving:overwrite')}</Text>
      <ButtonIcon materialIconName="content-save" />
    </TouchableOpacity>
  );
};

const CreateNewFileModal = ({
  getSavedFileContents,
  setOuterModalVisible,
}: {
  getSavedFileContents: () => string;
  setOuterModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {t} = useTranslation();
  const fileSystemService = new FileSystemService();
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
            {t('fileSaving:enterNewName')}
          </Text>
          <TextInputBar
            label="File name:"
            onChangeText={text => setFileName(text)}
          />
          <Text style={styles.uiPromptText}>
            {t('fileSaving:yourFileWillBeSaved')}
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              fileSystemService.saveToExternalStorageAlert(
                getSavedFileContents(),
                fileName,
                t('fileSaving:fileSavedSuccessfully'),
                t('fileSaving:error'),
              );
              setModalVisible(false);
              setOuterModalVisible(false);
            }}>
            <Text style={styles.actionButtonText}>
              {t('fileSaving:createFile')}
            </Text>
            <ButtonIcon materialIconName="plus" />
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text style={styles.actionButtonText}>
          {t('fileSaving:createANewFile')}
        </Text>
        <ButtonIcon materialIconName="plus" />
      </TouchableOpacity>
    </View>
  );
};
