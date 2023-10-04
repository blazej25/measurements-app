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
  DateTimePickerEvent,
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
          marginRight: 5,
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
        dateLabel={t(`commonDataForm:${CommonDataSchema.date}`) + ':'}
        timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
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
  dateLabel,
  timeLabel,
  date,
  setDate,
}: {
  dateLabel: string;
  timeLabel: string;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  const [datePickerActive, setDatePickerActive] = useState(false);
  const [timePickerActive, setTimePickerActive] = useState(false);
  return (
    <>
      <DataRow label={dateLabel}>
        <TouchableOpacity
          onPress={() => {
            setDatePickerActive(true);
          }}>
          <Text
            style={{height: 40, textAlignVertical: 'center', color: 'black'}}>
            {`${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`}
          </Text>
          {datePickerActive && (
            <RNDateTimePicker
              mode="date"
              value={date}
              onChange={(
                event: DateTimePickerEvent,
                selectedDate?: Date | undefined,
              ) => {
                if (event.type === 'set' && selectedDate !== undefined) {
                  setDate(selectedDate);
                }
                setDatePickerActive(false);
              }}
            />
          )}
        </TouchableOpacity>
      </DataRow>
      <DataRow label={timeLabel}>
        <TouchableOpacity
          onPress={() => {
            setTimePickerActive(true);
          }}>
          <Text
            style={{height: 40, textAlignVertical: 'center', color: 'black'}}>
            {`${date.getHours()}:${date.getMinutes()}`}
          </Text>
          {timePickerActive && (
            <RNDateTimePicker
              mode="time"
              value={date}
              onChange={(
                event: DateTimePickerEvent,
                selectedDate?: Date | undefined,
              ) => {
                if (event.type === 'set' && selectedDate !== undefined) {
                  setDate(selectedDate);
                }
                setTimePickerActive(false);
              }}
            />
          )}
        </TouchableOpacity>
      </DataRow>
    </>
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
    <DataRow label={label}>
      <TextInput
        placeholderTextColor={'gray'}
        placeholder={placeholder}
        onChangeText={onChangeText}
        style={{height: 40}}
      />
    </DataRow>
  );
};

const DataRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
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
        {children}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
