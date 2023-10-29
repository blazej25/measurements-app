import React, {useState} from 'react';
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
  const [initialMass1, setInitialMass1] = useState(0);
  const [afterMass1, setAfterMass1] = useState(0);
  const [initialMass2, setInitialMass2] = useState(0);
  const [afterMass2, setAfterMass2] = useState(0);
  const [initialMass3, setInitialMass3] = useState(0);
  const [afterMass3, setAfterMass3] = useState(0);
  const [leakTightnessTest, setLeakTightnessTest] = useState(0);
  const [aspiratorFlow, setAspiratorFlow] = useState(0);
  const [aspiratedGases, setAspiratedGases] = useState(0);
  const [n, setN] = useState(1);

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
        <NumberInputBar
          placeholder="20"
          valueUnit="℃"
          onChangeText={(text) => setInitialMass1(parseFloat(text))}
          label={'Masa początkowa płuczki:'}
        />
        <NumberInputBar
          placeholder="20"
          valueUnit="g"
          onChangeText={(text) => setAfterMass1(parseFloat(text))}
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
            console.log(afterMass1, initialMass1, date, leakTightnessTest, aspiratedGases, aspiratorFlow);
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
