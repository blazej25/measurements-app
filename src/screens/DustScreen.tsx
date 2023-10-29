import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  NumberInputBar,
  SelectorBar,
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

  const [numberOfMeasurements, setNumberOfMeasurements] = useState(0);
  const [selectedEndType, setSelectedEndType] = useState('');
  const [measurementStartTime, setMeasurementStartTime] = useState(new Date());
  const [aspirationTime, setAspirationTime] = useState(0);
  const [aspiratedVolume, setAspiratedVolume] = useState(0);
  const [filterType, setFilterType] = useState('');
  const [water, setWater] = useState('');

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

  const savedMeasurements: DustMeasurementData[] = [];

  const [measurementIndex, setMeasurementIndex] = useState(-1);

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
        <DustSingleMeasurementComponent
          data={data}
          setters={setters}
          savedMeasurements={savedMeasurements}
          measurementIndex={measurementIndex}
        />
        <SelectorBar
          label={
            t(
              `dustMeasurementData:${DustMeasurementDataSchema.measurementNumber}`,
            ) + ':'
          }
          selections={savedMeasurements
            .map(element => savedMeasurements.indexOf(element) + 1)
            .map(index => index.toString())}
          onSelect={(selectedItem: string, _index: number) => {
            setMeasurementIndex(_index);
            restoreStateToSavedData(savedMeasurements[_index], setters);
          }}
          selectionToText={selection => selection}
        />
      </View>
    </>
  );
};

function restoreStateToSavedData(
  savedData: DustMeasurementData,
  setters: DustMeasurementsSetters,
) {
  setters.setSelectedEndType(savedData.selectedEndType);
  setters.setMeasurementStartTime(savedData.measurementStartTime);
  setters.setAspirationTime(savedData.aspirationTime);
  setters.setAspiratedVolume(savedData.aspiratedVolume);
  setters.setFilterType(savedData.filterType);
  setters.setWater(savedData.water);
}

const DustSingleMeasurementComponent = ({
  data,
  setters,
  savedMeasurements,
  measurementIndex,
}: {
  data: DustMeasurementData;
  setters: DustMeasurementsSetters;
  savedMeasurements: DustMeasurementData[];
  measurementIndex: number;
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
            if (measurementIndex == -1) {
              savedMeasurements.push({...data});
            } else {
              savedMeasurements[measurementIndex] = {...data};
            }
          }
        }>
        <Icon
          name={measurementIndex == -1 ? 'plus' : 'content-save-edit'}
          style={{marginTop: 10}}
          size={20}
          color={colors.buttonBlue}
        />
      </TouchableOpacity>
    </View>
  );
};
