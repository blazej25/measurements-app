import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {
  defaultGap,
  styles,
} from '../styles/common-styles';
import {ButtonIcon} from './ButtonIcon';
import {FilePicker} from './FilePicker';
import {SaveChangesButton} from './SaveChangesButton';

export const LoadDeleteSaveGroup = ({
  onDelete,
  reloadScreen,
}: {
  onDelete: () => void;
  reloadScreen: () => void;
}) => {
  const {t} = useTranslation();
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <FilePicker
        label={t('aspirationScreen:loadFromStorage')}
        reloadScreen={reloadScreen}
      />
      <DeleteDataModal onDelete={onDelete} />
      <SaveChangesButton
        label={t('aspirationScreen:saveChanges')}
      />
    </View>
  );
};

const DeleteDataModal = ({onDelete}: {onDelete: () => void}) => {
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
          <Text style={{...styles.uiPromptText, textAlign: 'center'}}>
            {' '}
            {t('deleteButton:areYouSure')}
          </Text>
          <TouchableOpacity
            style={styles.secondaryNavigationButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.actionButtonText}>
              {' '}
              {t('deleteButton:no')}{' '}
            </Text>
            <ButtonIcon materialIconName="close-circle" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryNavigationButton}
            onPress={() => {
              setModalVisible(false);
              onDelete();
            }}>
            <Text style={styles.actionButtonText}>
              {' '}
              {t('deleteButton:yes')}{' '}
            </Text>
            <ButtonIcon materialIconName="check-bold" />
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        style={{...styles.navigationButton, alignSelf: 'center'}}
        onPress={() => setModalVisible(true)}>
        <ButtonIcon materialIconName="delete" />
      </TouchableOpacity>
    </>
  );
};
