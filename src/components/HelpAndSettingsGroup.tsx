import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {Screens} from '../constants';
import {colors, defaultGap, styles} from '../styles/common-styles';
import {ButtonIcon} from './ButtonIcon';
import {NavigationButton} from './buttons';
import {LoadDeleteSaveGroup} from './LoadDeleteSaveGroup';

export const HelpAndSettingsGroup = ({
  navigation,
  isHome,
}: {
  navigation: any;
  isHome?: boolean;
}) => {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <HelpModal navigation={navigation} />
      {!isHome ? (
        <NavigationButton
          navigation={navigation}
          destinationScreen={Screens.home}
          style={styles.secondaryNavigationButton}
          textStyle={styles.uiPromptText}
        />
      ) : (
        <></>
      )}
      <SettingsPanel navigation={navigation} />
    </View>
  );
};

const HelpModal = ({navigation}: {navigation: any}) => {
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
        <Text
          style={{
            marginTop: 20,
            fontSize: 32,
            fontWeight: 'bold',
            color: colors.buttonBlue,
            alignSelf: 'center',
          }}>
          {t('helpModal:header')}
        </Text>
        <View
          style={{
            margin: defaultGap,
            flex: 1,
            justifyContent: 'center',
            alignContent: 'space-between',
            gap: defaultGap,
          }}>
          <LoadDeleteSaveGroup
            getSavedFileContents={() => 'test'}
            onDelete={() => {}}
            fileContentsHandler={(contents: Object) => {}}
          />
          <Text style={styles.explanationText}>
            {t('helpModal:loadExplanation')}
          </Text>
          <Text style={styles.explanationText}>
            {t('helpModal:deleteExplanation')}
          </Text>
          <Text style={styles.explanationText}>
            {t('helpModal:saveExplanation')}
          </Text>
          <Spacer />
          <HelpAndSettingsGroup navigation={null} />
          <Text style={styles.explanationText}>
            {t('helpModal:helpExplanation')}
          </Text>
          <Text style={styles.explanationText}>
            {t('helpModal:settingsExplanation')}
          </Text>
          <Spacer />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => {}}>
              <ButtonIcon materialIconName="arrow-left-circle" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => {}}>
              <ButtonIcon materialIconName="plus" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => {}}>
              <ButtonIcon materialIconName="arrow-right-circle" />
            </TouchableOpacity>
          </View>
          <Text style={styles.explanationText}>
            {t('helpModal:measurementPreviousExplanation')}
          </Text>
          <Text style={styles.explanationText}>
            {t('helpModal:measurementSaveExplanation')}
          </Text>
          <Text style={styles.explanationText}>
            {t('helpModal:measurementNextExplanation')}
          </Text>
        </View>
        <TouchableOpacity
          style={{...styles.secondaryNavigationButton, marginBottom: 20}}
          onPress={() => {
            setModalVisible(false);
          }}>
          <Text style={styles.actionButtonText}> OK </Text>
        </TouchableOpacity>
      </Modal>
      <TouchableOpacity
        style={styles.secondaryNavigationButton}
        onPress={() => setModalVisible(true)}>
        <ButtonIcon materialIconName="help" />
      </TouchableOpacity>
    </>
  );
};

const SettingsPanel = ({navigation}: {navigation: any}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (navigation) {
          navigation.navigate(Screens.language);
        }
      }}
      style={styles.secondaryNavigationButton}>
      <ButtonIcon materialIconName="cog" />
    </TouchableOpacity>
  );
};

const Spacer = () => {
  return <View style={{height: 20}} />;
};
