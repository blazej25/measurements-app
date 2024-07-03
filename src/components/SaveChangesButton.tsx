import React, {useState} from 'react';
import {
  Modal,
  PermissionsAndroid,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {defaultGap, styles} from '../styles/common-styles';
import FileSystemService from '../services/FileSystemService';
import DocumentPicker from 'react-native-document-picker';
import {ButtonIcon} from './ButtonIcon';
import {TextInputBar} from './input-bars';
import {useTranslation} from 'react-i18next';
import GlobalSaveService from '../services/GlobalSaveService';

export const SaveChangesButton = ({label}: {label: string}) => {
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
          <CreateNewFileModal setOuterModalVisible={setModalVisible} />
          <OverwriteExistingFileButton setModalVisible={setModalVisible} />
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          requestExternalStoragePermission().then(() => {
            setModalVisible(true);
          });
        }}>
        <Text style={styles.actionButtonText}>{label}</Text>
        <ButtonIcon materialIconName="content-save" />
      </TouchableOpacity>
    </>
  );
};

const requestExternalStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Download Directory Access Request',
        message:
          'The measurements app needs access to the download directory to' +
          'save the measurements data.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the external storage');
    } else {
      console.log('External storage permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const OverwriteExistingFileButton = ({
  setModalVisible,
}: {
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
            const globalSaveService = new GlobalSaveService();
            globalSaveService.getGlobalSaveCSVContents().then(data => {
              fileSystemService.saveToExternalStorageAlert(
                data,
                fileName,
                t('fileSaving:fileSavedSuccessfully'),
                t('fileSaving:error'),
              );
            });
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
  setOuterModalVisible,
}: {
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
            label={t('fileSaving:fileName')}
            onChangeText={text => setFileName(text)}
          />
          <Text style={styles.uiPromptText}>
            {t('fileSaving:yourFileWillBeSaved')}
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              const globalSaveService = new GlobalSaveService();
              globalSaveService.getGlobalSaveCSVContents().then(data => {
                fileSystemService.saveToExternalStorageAlert(
                  data,
                  fileName,
                  t('fileSaving:fileSavedSuccessfully'),
                  t('fileSaving:error'),
                );
                console.log(data);
                setModalVisible(false);
                setOuterModalVisible(false);
              });
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
