import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';

import {useTranslation} from 'react-i18next';
import {NavigationButton} from '../components/buttons';
import {CommonDataSchema, Screens} from '../constants';
import {colors, styles} from '../styles/common-styles';
import {
  DateTimeSelectorGroup,
  NumberInputBar,
  SelectorBar,
  StaffListInputBar,
  TextInputBar,
} from '../components/input-bars';
import {
  CommonMeasurementData,
  PipeCrossSectionType,
  crossSectionTypeFrom,
} from '../model';
import {LoadDeleteSaveGroup} from '../components/LoadDeleteSaveGroup';
import {HelpAndSettingsGroup} from '../components/HelpAndSettingsGroup';
import FileSystemService from '../services/FileSystemService';

const INTERNAL_STORAGE_FILE_NAME = 'home.txt';

export const HomeScreen = ({navigation}: {navigation: any}) => {
  const fileSystemService = new FileSystemService();

  const empty_data: CommonMeasurementData = {
    date: new Date(),
    measurementRequestor: '',
    emissionSource: '',
    pipeCrossSectionType: PipeCrossSectionType.ROUND,
    staffResponsibleForMeasurement: [],
    temperature: '',
    pressure: '',
  };

  const [measurementData, setMeasurementData] = useState(empty_data);

  /* Logic for persisting state in the internal storage. */
  // See H20_14790_Screen for comments on how this works.
  const loadMeasurements = () => {
    fileSystemService
      .loadJSONFromInternalStorage(INTERNAL_STORAGE_FILE_NAME)
      .then(loadedMeasurements => {
        restoreStateFrom(loadedMeasurements);
      });
  };

  const restoreStateFrom = (loadedMeasurements: Object) => {
    var data = loadedMeasurements as CommonMeasurementData;

    if (!data) {
      return;
    }

    data.date = new Date(data.date);
    data.pipeCrossSectionType =
      data.pipeCrossSectionType === 'ROUND'
        ? PipeCrossSectionType.ROUND
        : PipeCrossSectionType.RECTANGULAR;

    setMeasurementData(data);
  };

  const resetState = () => {
    setMeasurementData({...empty_data})
  }

  useEffect(loadMeasurements, []);

  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        getSavedFileContents={() => 'test'}
        onDelete={resetState}
        fileContentsHandler={(contents: Object) => {}}
      />
      <ScrollView contentContainerStyle={styles.defaultScrollView}>
        <WelcomeHeader />
        <CommonDataInput data={measurementData} setter={setMeasurementData} />
        <UtilitiesNavigation navigation={navigation} />
      </ScrollView>
      <HelpAndSettingsGroup navigation={navigation} isHome />
    </View>
  );
};


const WelcomeHeader = () => {
  const {t} = useTranslation();
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 15,
      }}>
      <Text
        style={{fontSize: 22, fontWeight: 'bold', color: colors.buttonBlue}}>
        {t('userInterface:welcome')}
      </Text>
    </View>
  );
};

const CommonDataInput = ({
  data,
  setter,
}: {
  data: CommonMeasurementData;
  setter: React.Dispatch<React.SetStateAction<CommonMeasurementData>>;
}) => {
  const fileSystemService = new FileSystemService();
  const {t} = useTranslation();

  const persistStateInInternalStorage = (state: CommonMeasurementData) => {
    fileSystemService.saveObjectToInternalStorage(
      state,
      INTERNAL_STORAGE_FILE_NAME,
    );
  };


  const updateField = (field: any) => {
    const newData = {
      ...data,
      ...field,
    };
    setter(newData);
    persistStateInInternalStorage(newData);
  };
  return (
    <View>
      <ScrollView
        contentContainerStyle={{...styles.defaultScrollView, margin: 0}}>
        <DateTimeSelectorGroup
          date={data.date}
          setDate={date => updateField({date: date})}
          dateLabel={t(`commonDataForm:${CommonDataSchema.date}`) + ':'}
          timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
        />
        <TextInputBar
          value={data.measurementRequestor}
          placeholder={t(`commonDataForm:dummyName`)}
          onChangeText={requestor =>
            updateField({measurementRequestor: requestor})
          }
          label={
            t(`commonDataForm:${CommonDataSchema.measurementRequestor}`) + ':'
          }
        />
        <TextInputBar
          value={data.emissionSource}
          placeholder={t(`commonDataForm:${CommonDataSchema.emissionSource}`)}
          onChangeText={source => updateField({emissionSource: source})}
          label={t(`commonDataForm:${CommonDataSchema.emissionSource}`) + ':'}
        />
        <SelectorBar
          label={
            t(`commonDataForm:${CommonDataSchema.pipeCrossSectionType}`) + ':'
          }
          selections={Object.keys(PipeCrossSectionType).map(item =>
            item.toString(),
          )}
          onSelect={(selectedItem: string, _index: number) => {
            updateField({
              pipeCrossSectionType: crossSectionTypeFrom(selectedItem),
            });
          }}
          selectionToText={selection => t(`pipeCrossSectionTypes:${selection}`)}
        />
        <StaffListInputBar
          label={
            t(
              `commonDataForm:${CommonDataSchema.staffResponsibleForMeasurement}`,
            ) + ':'
          }
          staffList={data.staffResponsibleForMeasurement}
          setStaffList={staffList =>
            updateField({staffResponsibleForMeasurement: staffList})
          }
        />
        <NumberInputBar
          placeholder="20"
          valueUnit="℃"
          value={data.temperature}
          onChangeText={text => updateField({temperature: text})}
          label={t(`commonDataForm:${CommonDataSchema.temperature}`) + ':'}
        />
        <NumberInputBar
          placeholder="1100"
          valueUnit="hPa"
          value={data.pressure}
          onChangeText={text => updateField({pressure: text})}
          label={t(`commonDataForm:${CommonDataSchema.pressure}`) + ':'}
        />
      </ScrollView>
    </View>
  );
};

const UtilitiesNavigation = ({navigation}: {navigation: any}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 5,
      }}>
      <NavigationButton
        navigation={navigation}
        destinationScreen={Screens.utilities}
      />
    </View>
  );
};
