import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {useTranslation} from 'react-i18next';
import {NavigationButton} from '../components/buttons';
import {CommonDataSchema, Screens} from '../constants';
import {
  defaultGap,
} from '../styles/common-styles';
import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { DataBar, NumberInputBar, TextInputBar } from '../components/input-bars';
import { getDateString, getTimeString } from '../util/date-util';

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
      <TextInputBar
        placeholder="Jan Kowalski"
        onChangeText={setMeasurementRequestor}
        label={
          t(`commonDataForm:${CommonDataSchema.measurementRequestor}`) + ':'
        }
      />
      <TextInputBar
        placeholder="some source"
        onChangeText={setEmissionSource}
        label={t(`commonDataForm:${CommonDataSchema.emissionSource}`) + ':'}
      />
      <NumberInputBar
        placeholder="20"
        valueUnit="℃"
        onChangeText={text => setTemperature(parseFloat(text))}
        label={t(`commonDataForm:${CommonDataSchema.temperature}`) + ':'}
      />
      <NumberInputBar
        placeholder="1100"
        valueUnit="hPa"
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
      <DataBar label={dateLabel}>
        <TouchableOpacity
          onPress={() => {
            setDatePickerActive(true);
          }}>
          <Text
            style={{height: 40, textAlignVertical: 'center', color: 'black'}}>
            {getDateString(date)}
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
      </DataBar>
      <DataBar label={timeLabel}>
        <TouchableOpacity
          onPress={() => {
            setTimePickerActive(true);
          }}>
          <Text
            style={{height: 40, textAlignVertical: 'center', color: 'black'}}>
            {getTimeString(date)}
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
      </DataBar>
    </>
  );
};

