import React, {useState} from 'react';
import {ScrollView, Text, View} from 'react-native';

import {useTranslation} from 'react-i18next';
import {NavigationButton} from '../components/buttons';
import {CommonDataSchema, Screens} from '../constants';
import {defaultGap, styles} from '../styles/common-styles';
import {
  DateTimeSelectorGroup,
  NumberInputBar,
  SelectorBar,
  StaffListInputBar,
  TextInputBar,
} from '../components/input-bars';
import {
  CommonMeasurementData,
  Person,
  PipeCrossSectionType,
  crossSectionTypeFrom,
} from '../model';
import {FilePicker} from '../components/FilePicker';

export const HomeScreen = ({navigation}: {navigation: any}) => {
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
  const {t} = useTranslation();

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.defaultScrollView}>
        <LanguagePanel navigation={navigation} />
        <WelcomeHeader />
        <CommonDataInput data={measurementData} setter={setMeasurementData} />
        <UtilitiesNavigation navigation={navigation} />
      </ScrollView>
      <FilePicker
        fileContentsHandler={(contents: Object) => {}}
        label={t('aspirationScreen:loadFromStorage')}
      />
    </View>
  );
};

const LanguagePanel = ({navigation}: {navigation: any}) => {
  return (
    <View
      style={{
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginTop: 5,
        marginRight: 5,
      }}>
      <NavigationButton
        navigation={navigation}
        destinationScreen={Screens.language}
      />
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
      <Text style={{fontSize: 22, fontWeight: 'bold', color: 'black'}}>
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
  const {t} = useTranslation();

  const updateField = (field: any) => {
    setter({
      ...data,
      ...field,
    });
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
