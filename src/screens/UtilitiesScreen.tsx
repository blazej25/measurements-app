import React, { useState } from 'react';
import {Button, ScrollView, Text, View} from 'react-native';
import { NavigationButton } from '../components/buttons';
import { CommonDataSchema, Screens } from '../constants';
import { DateTimeSelectorGroup, NumberInputBar, TimeSelector, StartEndBar} from '../components/input-bars';
import { useTranslation } from 'react-i18next';
import { defaultGap } from '../styles/common-styles';

interface singleMeasurement {
  startingHour: Date;
  endingHour: Date;
}

export const UtilitiesScreen = ({navigation}: {navigation: any}) => {
  const [date, setDate] = useState(new Date());
  const [measurementDuration, setMeasurementDuration] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [startingHour, setStartingHour] = useState(new Date);
  
  const {t} = useTranslation();

  // const x = 5
  // const double = (x: number) => 2 * x
  // const triple = (x: number) => { return 3 * x; }
  // const add = (x: number, y: number) => { return x + y; }

  const toNewTime = (date: Date, time: number) => {
    const newTime = new Date
    newTime.setTime(date.getTime() + time * 60 * 1000)
    return newTime
  }

  const numbers = [1, 2, 3];

  return (
    <ScrollView
    contentContainerStyle={{
      flexGrow: 1,
      justifyContent: 'flex-start',
      gap: defaultGap,
    }}
    >
      <Text> {t('utilitiesScreen:utilities')} </Text>
      <DateTimeSelectorGroup
        date={date}
        setDate={date => {
          setDate(date)
        }}
        dateLabel={t(`commonDataForm:${CommonDataSchema.date}`) + ':'}
        timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
      />
      <NumberInputBar
        placeholder="60"
        valueUnit="min"
        value={measurementDuration.toString()}
        onChangeText={text => {text == '' ? setMeasurementDuration(0) : setMeasurementDuration(parseInt(text))}}
        label={t('utilitiesScreen:measurementDuration') + ':'}
      />
      <NumberInputBar
        placeholder="15"
        valueUnit="min"
        value={breakTime.toString()}
        onChangeText={text => {text == '' ? setBreakTime(0) : setBreakTime(parseInt(text))}}
        label={t('utilitiesScreen:breakTime') + ':'}
      />
      <TimeSelector
        timeLabel={t('utilitiesScreen:startingHour') + ':'}
        date={startingHour}
        setDate={date => {
          setStartingHour(date);
        }}
      />
      <StartEndBar
        start = {startingHour}
        end = {toNewTime(startingHour, measurementDuration)}
      />
    { numbers.map((x : number) => {
      return (
      <StartEndBar
        key = {x}
        start = {startingHour}
        end = {toNewTime(startingHour, measurementDuration)}
      />
      );
    })}
    </ScrollView>
  );
};