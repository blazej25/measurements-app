import React, {useState} from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {
  colors,
  defaultBorderRadius,
  defaultGap,
  defaultPadding,
  styles,
} from '../styles/common-styles';
import FileSystemService from '../services/FileSystemService';
import {ButtonIcon} from './ButtonIcon';

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
          <Text style={{fontSize: 16, fontWeight: 'bold', color: colors.buttonBlue, alignSelf: 'center'}}>
            Where do you want to save the file?
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setModalVisible(true);
            }}>
            <Text style={styles.actionButtonText}>Create a new file</Text>
            <ButtonIcon materialIconName="plus" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setModalVisible(true);
            }}>
            <Text style={styles.actionButtonText}>
              Overwrite an existing file
            </Text>
            <ButtonIcon materialIconName="content-save" />
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text
          style={{
            ...styles.buttonText1,
            alignSelf: 'center',
            margin: defaultGap,
            marginLeft: defaultPadding,
            color: colors.buttonBlue,
          }}>
          {label}
        </Text>
        <ButtonIcon materialIconName="content-save" />
      </TouchableOpacity>
    </>
  );
};
