import React, { useState } from 'react';
import {Button, ScrollView, Text, View} from 'react-native';
import { NavigationButton } from '../components/buttons';
import { CommonDataSchema, Screens } from '../constants';
import { DateTimeSelectorGroup, NumberInputBar, TimeSelector } from '../components/input-bars';
import { useTranslation } from 'react-i18next';
import { defaultGap } from '../styles/common-styles';

export const UtilitiesScreen = ({navigation}: {navigation: any}) => {
  const [date, setDate] = useState(new Date());
  const [measurementDuration, setMeasurementDuration] = useState('');
  const [breakTime, setBreakTime] = useState('');
  const [startingHour, setStartingHour] = useState(new Date);
  
  const {t} = useTranslation();

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
        placeholder="1"
        valueUnit="h"
        value={measurementDuration}
        onChangeText={(text) => setMeasurementDuration(text)}
        label={t('utilitiesScreen:measurementDuration') + ':'}
      />
      <NumberInputBar
        placeholder="15"
        valueUnit="min"
        value={breakTime}
        onChangeText={(text) => setBreakTime(text)}
        label={t('utilitiesScreen:breakTime') + ':'}
      />
      <TimeSelector
        timeLabel={t('utilitiesScreen:startingHour') + ':'}
        date={startingHour}
        setDate={date => {
          setStartingHour(date);
        }}
      />
    </ScrollView>
  );
};
