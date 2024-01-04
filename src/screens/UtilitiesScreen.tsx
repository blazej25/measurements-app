import React, { useState } from 'react';
import {Button, ScrollView, Text, View} from 'react-native';
import { NavigationButton } from '../components/buttons';
import { CommonDataSchema, Screens } from '../constants';
import { DateTimeSelectorGroup, NumberInputBar, TimeSelector, StartEndBar} from '../components/input-bars';
import { useTranslation } from 'react-i18next';
import { defaultGap } from '../styles/common-styles';

export const UtilitiesScreen = ({navigation}: {navigation: any}) => {
  const [date, setDate] = useState(new Date());
  const [measurementDuration, setMeasurementDuration] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [startingHour, setStartingHour] = useState(new Date);
  const [endingHour, setEndingHour] = useState(new Date);
  
  const {t} = useTranslation();

  const endHour = startingHour.getTime() + measurementDuration * 60 * 1000

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
        onChangeText={(text) => setMeasurementDuration(parseInt(text))}
        label={t('utilitiesScreen:measurementDuration') + ':'}
      />
      <NumberInputBar
        placeholder="15"
        valueUnit="min"
        value={breakTime.toString()}
        onChangeText={(text) => setBreakTime(parseInt(text))}
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
        end = {startingHour}
      />
    </ScrollView>
  );
};
