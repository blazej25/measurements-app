import React, {useState} from 'react';
import {Button, Text, TextInput, TouchableOpacity, View} from 'react-native';

import {useTranslation} from 'react-i18next';
import {NavigationButton} from '../components/buttons';
import {CommonDataSchema, Screens} from '../constants';
import {
  colors,
  defaultBorderRadius,
  defaultGap,
  defaultPadding,
  largeBorderRadius,
  styles,
} from '../styles/common-styles';
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {MenuBar} from '../components/MenuBar';

export const HomeScreen = ({navigation}: {navigation: any}) => {
  return (
    <>
      <View
        style={{
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          marginTop: 5,
        }}>
        <NavigationButton
          navigation={navigation}
          destinationScreen={Screens.settings}
        />
      </View>
      <WelcomeHeader />
      <CommonDataInput />
      <MenuBar navigation={navigation} />
    </>
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

const CommonDataInput = () => {
  const [date, setDate] = useState(new Date());
  const [arrivalTime, setArrivalTime] = useState('');
  const [measurementRequestor, setMeasurementRequestor] = useState('');
  const [emissionSource, setEmissionSource] = useState('');
  const [pipeCrossSectionType, setPipeCrossSectionType] = useState(null);
  const [staffResponsibleForMeasurement, setStaffResponsibleForMeasurement] =
    useState([]);
  const [temperature, setTemperature] = useState(0);
  const [pressure, setPressure] = useState(0);
  const {t} = useTranslation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        gap: defaultGap,
      }}>
      <DateTimeSelectorGroup
        date={date}
        setDate={setDate}
        label="Data"
        placeholder="Date3"
      />
      <InputRow
        placeholder="17:00"
        onChangeText={setArrivalTime}
        label={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
      />
      <InputRow
        placeholder="Jan Kowalski"
        onChangeText={setMeasurementRequestor}
        label={
          t(`commonDataForm:${CommonDataSchema.measurementRequestor}`) + ':'
        }
      />
      <InputRow
        placeholder="some source"
        onChangeText={setEmissionSource}
        label={t(`commonDataForm:${CommonDataSchema.emissionSource}`) + ':'}
      />
      <InputRow
        placeholder="20 ℃ "
        onChangeText={text => setTemperature(parseFloat(text))}
        label={t(`commonDataForm:${CommonDataSchema.temperature}`) + ':'}
      />
      <InputRow
        placeholder="1100 hPa"
        onChangeText={text => setPressure(parseFloat(text))}
        label={t(`commonDataForm:${CommonDataSchema.pressure}`) + ':'}
      />
    </View>
  );
};

const DateTimeSelectorGroup = ({
  label,
  placeholder,
  date,
  setDate,
}: {
  label: string;
  placeholder: string;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  return (
    <TouchableOpacity
      style={{
        borderRadius: largeBorderRadius,
        flexDirection: 'row',
        backgroundColor: colors.buttonBlue,
        alignSelf: 'stretch',
        marginHorizontal: defaultGap,
        justifyContent: 'space-between',
      }}>
      <Text
        style={{
          ...styles.buttonText1,
          alignSelf: 'center',
          margin: defaultGap,
          marginLeft: defaultPadding,
        }}>
        {label}
      </Text>
      <TouchableOpacity
        style={{
          borderRadius: defaultBorderRadius,
          flexDirection: 'row',
          margin: defaultGap,
          paddingHorizontal: defaultPadding,
          backgroundColor: colors.secondaryBlue,
        }}
        onPress={() => {
          DateTimePickerAndroid.open({value: date});
          console.log(date);
        }}>
        <Text>{date.toString()}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const InputRow = ({
  label,
  placeholder,
  onChangeText,
}: {
  label: string;
  placeholder: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <TouchableOpacity
      style={{
        borderRadius: largeBorderRadius,
        flexDirection: 'row',
        backgroundColor: colors.buttonBlue,
        alignSelf: 'stretch',
        marginHorizontal: defaultGap,
        justifyContent: 'space-between',
      }}>
      <Text
        style={{
          ...styles.buttonText1,
          alignSelf: 'center',
          margin: defaultGap,
          marginLeft: defaultPadding,
        }}>
        {label}
      </Text>
      <TouchableOpacity
        style={{
          borderRadius: defaultBorderRadius,
          flexDirection: 'row',
          margin: defaultGap,
          paddingHorizontal: defaultPadding,
          backgroundColor: colors.secondaryBlue,
        }}>
        <TextInput
          placeholderTextColor={'gray'}
          placeholder={placeholder}
          onChangeText={onChangeText}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
