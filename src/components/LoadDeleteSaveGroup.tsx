import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {styles} from '../styles/common-styles';
import {ButtonIcon} from './ButtonIcon';
import {FilePicker} from './FilePicker';
import {SaveChangesButton} from './SaveChangesButton';

export const LoadDeleteSaveGroup = ({
  getSavedFileContents,
  fileContentsHandler,
  onDelete,
}: {
  getSavedFileContents: () => string;
  fileContentsHandler: (contents: string) => void;
  onDelete: () => void;
}) => {
  const {t} = useTranslation();
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <FilePicker
        fileContentsProcessor={fileContentsHandler}
        label={t('aspirationScreen:loadFromStorage')}
      />
      <TouchableOpacity
        style={{...styles.navigationButton, alignSelf: 'center'}}
        onPress={onDelete}>
        <ButtonIcon materialIconName="delete" />
      </TouchableOpacity>
      <SaveChangesButton
        getSavedFileContents={getSavedFileContents}
        label={t('aspirationScreen:saveChanges')}
      />
    </View>
  );
};
