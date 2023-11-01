import React, {Dispatch, SetStateAction, useMemo, useState} from 'react';
import {Button, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {NavigationButton} from '../components/buttons';
import {CommonDataSchema, Screens} from '../constants';
import {t} from 'i18next';
import {DateTimeSelectorGroup, NumberInputBar, SelectorBar, TimeSelector} from '../components/input-bars';
import {colors, defaultBorderRadius, defaultGap, defaultPadding} from '../styles/common-styles';
import { CommonMeasurementDataSetters, PipeCrossSectionType, crossSectionTypeFrom } from '../model';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const H2O_14790_Screen = ({navigation}: {navigation: any}) => {
  const [date, setDate] = useState(new Date());
  const [initialMass, setInitialMass]: [number[], Dispatch<SetStateAction<number[]>>] = useState([] as number[]);
  const [afterMass, setAfterMass]: [number[], Dispatch<SetStateAction<number[]>>] = useState([] as number[]);
  const [n, setN] = useState(1);
  const afterMassDisplayValue = useMemo(() => afterMass[n], [afterMass, n]);
  const initialMassShowingValue = useMemo(() => initialMass[n], [initialMass, n]);

  const [leakTightnessTest, setLeakTightnessTest] = useState(0);
  const [aspiratorFlow, setAspiratorFlow] = useState(0);
  const [aspiratedGases, setAspiratedGases] = useState(0);

  const [dataIndex, setDataIndex] = useState(0);

  return (
    <View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          gap: defaultGap,
        }}>
        <TimeSelector
          timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
          date={date}
          setDate={setDate}
        />
        <NumberInputBar
          placeholder="20"
          valueUnit="℃"
          onChangeText={(text) => setLeakTightnessTest(parseFloat(text))}
          label={'Próba szczelności:'}
        />
        <NumberInputBar
          placeholder="20"
          valueUnit="℃"
          onChangeText={(text) => setAspiratorFlow(parseFloat(text))}
          label={'Przepływ przez aspirator:'}
        />
        <NumberInputBar
          placeholder="20"
          valueUnit="℃"
          onChangeText={(text) => setAspiratedGases(parseFloat(text))}
          label={'Ilość zaaspirowanych gazów:'}
        />
        <SelectorBar
          label={
            'Numer płuczki: '
          }
          selections={['1', '2', '3']}
          onSelect={(selectedItem: string, _index: number) => {
            setN(parseFloat(selectedItem))
          }}
        />
        <NumberInputBar
          placeholder="20"
          valueUnit="℃"
          onChangeText={(text) => {
            setInitialMass(initialMass.map((mass, index) => (index == n) ? parseFloat(text): mass))
          }}
          value={initialMassShowingValue}
          label={'Masa początkowa płuczki:'}
        />
        <NumberInputBar
          placeholder="20"
          valueUnit="g"
          value={afterMassDisplayValue}
          onChangeText={(text) => {
            setAfterMass(afterMass.map((mass, index) => (index == n) ? parseFloat(text): mass))
          }}
          label={'Masa płuczki po pomiarze:'}
        />
      <TouchableOpacity
        style={{
          borderRadius: defaultBorderRadius,
          flexDirection: 'row',
          margin: defaultGap,
          paddingHorizontal: defaultPadding,
          backgroundColor: colors.secondaryBlue,
          height: 40,
        }}
        onPress={
          // Log all data that you want to see
          () => {
            console.log(afterMass, initialMass, date, leakTightnessTest, aspiratedGases, aspiratorFlow);
          }
        }>
        <Icon
          name="plus"
          style={{marginTop: 10}}
          size={20}
          color={colors.buttonBlue}
        />
      </TouchableOpacity>

      </ScrollView>
    </View>
  );
};
