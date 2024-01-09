import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {FilePicker} from './FilePicker';
import {SaveChangesButton} from './SaveChangesButton';

export const SaveAndLoadGroup = ({
  getSavedFileContents,
  fileContentsHandler,
}: {
  getSavedFileContents: () => string;
  fileContentsHandler: (contents: string) => void;
}) => {
  const {t} = useTranslation();
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <SaveChangesButton
        getSavedFileContents={getSavedFileContents}
        label={t('aspirationScreen:saveChanges')}
      />
      <FilePicker
        fileContentsProcessor={fileContentsHandler}
        label={t('aspirationScreen:loadFromStorage')}
      />
    </View>
  );
};
