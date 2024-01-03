import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { NavigationButton } from '../components/buttons';
import { CommonDataSchema, Screens } from '../constants';
import { defaultGap } from '../styles/common-styles';
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

export const HomeScreen = ({ navigation }: { navigation: any }) => {
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

  return (
    <>
      <LanguagePanel navigation={navigation} />
      <WelcomeHeader />
      <CommonDataInput data={measurementData} setter={setMeasurementData} />
    </>
  );
};

const LanguagePanel = ({ navigation }: { navigation: any }) => {
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
  const { t } = useTranslation();
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 15,
      }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'black' }}>
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
  const { t } = useTranslation();

  const updateField = (field: any) => {
    setter({
      ...data,
      ...field,
    });
  };
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'flex-start',
        gap: defaultGap,
      }}>
      <DateTimeSelectorGroup
        date={data.date}
        setDate={date => updateField({ date: date })}
        dateLabel={t(`commonDataForm:${CommonDataSchema.date}`) + ':'}
        timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
      />
      <TextInputBar
        value={data.measurementRequestor}
        placeholder={t(`commonDataForm:dummyName`)}
        onChangeText={requestor =>
          updateField({ measurementRequestor: requestor })
        }
        label={
          t(`commonDataForm:${CommonDataSchema.measurementRequestor}`) + ':'
        }
      />
      <TextInputBar
        value={data.emissionSource}
        placeholder={
          t(`commonDataForm:${CommonDataSchema.emissionSource}`)
        }
        onChangeText={source => updateField({ emissionSource: source })}
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
          updateField({ staffResponsibleForMeasurement: staffList })
        }
      />
      <NumberInputBar
        placeholder="20"
        valueUnit="℃"
        value={data.temperature}
        onChangeText={text => updateField({ temperature: text })}
        label={t(`commonDataForm:${CommonDataSchema.temperature}`) + ':'}
      />
      <NumberInputBar
        placeholder="1100"
        valueUnit="hPa"
        value={data.pressure}
        onChangeText={text => updateField({ pressure: text })}
        label={t(`commonDataForm:${CommonDataSchema.pressure}`) + ':'}
      />
    </ScrollView>
  );
};
