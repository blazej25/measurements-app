import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  NumberInputBar,
  TextInputBar,
  TimeSelector,
} from '../components/input-bars';
import {
  colors,
  defaultBorderRadius,
  defaultGap,
  defaultPadding,
} from '../styles/common-styles';
import {useTranslation} from 'react-i18next';
import {DustMeasurementDataSchema} from '../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type DustMeasurementData = {
  selectedEndType: string;
  measurementStartTime: Date;
  aspirationTime: number;
  aspiratedVolume: number;
  filterType: string;
  water: string;
};

type DustMeasurementsSetters = {
  setSelectedEndType: React.Dispatch<React.SetStateAction<string>>;
  setMeasurementStartTime: React.Dispatch<React.SetStateAction<Date>>;
  setAspirationTime: React.Dispatch<React.SetStateAction<number>>;
  setAspiratedVolume: React.Dispatch<React.SetStateAction<number>>;
  setFilterType: React.Dispatch<React.SetStateAction<string>>;
  setWater: React.Dispatch<React.SetStateAction<string>>;
};

export const DustScreen = ({navigation}: {navigation: any}) => {
  const {t} = useTranslation();

  const [numberOfMeasurements, setNumberOfMeasurements] = React.useState(0);
  const [selectedEndType, setSelectedEndType] = React.useState('');
  const [measurementStartTime, setMeasurementStartTime] = React.useState(
    new Date(),
  );
  const [aspirationTime, setAspirationTime] = React.useState(0);
  const [aspiratedVolume, setAspiratedVolume] = React.useState(0);
  const [filterType, setFilterType] = React.useState('');
  const [water, setWater] = React.useState('');

  const savedMeasurements: DustMeasurementData[] = [];

  const data: DustMeasurementData = {
    selectedEndType: selectedEndType,
    measurementStartTime: measurementStartTime,
    aspirationTime: aspirationTime,
    aspiratedVolume: aspiratedVolume,
    filterType: filterType,
    water: water,
  };

  const setters: DustMeasurementsSetters = {
    setSelectedEndType: setSelectedEndType,
    setMeasurementStartTime: setMeasurementStartTime,
    setAspirationTime: setAspirationTime,
    setAspiratedVolume: setAspiratedVolume,
    setFilterType: setFilterType,
    setWater: setWater,
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          gap: defaultGap,
        }}>
        <NumberInputBar
          placeholder="0"
          onChangeText={text => setNumberOfMeasurements(parseInt(text))}
          label={t(
            `dustMeasurementData:${DustMeasurementDataSchema.numberOfMeasurements}`,
          )}
        />
        <DustSingleMeasurementComponent data={data} setters={setters} savedMeasurements={savedMeasurements} />
      </View>
    </>
  );
};

const DustSingleMeasurementComponent = ({
  data,
  setters,
  savedMeasurements,
}: {
  data: DustMeasurementData;
  setters: DustMeasurementsSetters;
  savedMeasurements: DustMeasurementData[];
}) => {
  const {t} = useTranslation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        gap: defaultGap,
      }}>
      <TextInputBar
        label={t(
          `dustMeasurementData:${DustMeasurementDataSchema.selectedEndType}`,
        )}
        onChangeText={text => setters.setSelectedEndType(text)}
      />
      <TimeSelector
        timeLabel={t(
          `dustMeasurementData:${DustMeasurementDataSchema.measurementStartTime}`,
        )}
        date={data.measurementStartTime}
        setDate={date => setters.setMeasurementStartTime(date)}
      />
      <NumberInputBar
        placeholder="0"
        onChangeText={text => setters.setAspiratedVolume(parseInt(text))}
        label={t(
          `dustMeasurementData:${DustMeasurementDataSchema.aspiratedVolume}`,
        )}
      />
      <TextInputBar
        label={t(`dustMeasurementData:${DustMeasurementDataSchema.filterType}`)}
        onChangeText={text => setters.setFilterType(text)}
      />
      <TextInputBar
        label={t(`dustMeasurementData:${DustMeasurementDataSchema.water}`)}
        onChangeText={text => setters.setWater(text)}
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
          // Here we use the spread operator to have a copy of the data
          () => {
            savedMeasurements.push({...data})
          }
        }>
        <Icon
          name="plus"
          style={{marginTop: 10}}
          size={20}
          color={colors.buttonBlue}
        />
      </TouchableOpacity>
    </View>
  );
};
