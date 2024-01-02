import React, {Dispatch, SetStateAction, useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
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

interface DustMeasurementData {
  selectedEndDiameter: number;
  measurementStartTime: Date;
  aspirationTime: number;
  aspiratedVolume: number;
  filterType: string;
  water: string;
}

const initialData: DustMeasurementData = {
  selectedEndDiameter: 0,
  measurementStartTime: new Date(),
  aspirationTime: 0,
  aspiratedVolume: 0,
  filterType: '',
  water: '',
};

export const DustScreen = ({navigation}: {navigation: any}) => {
  const {t} = useTranslation();

  const [data, setData] = useState(initialData);

  const [savedMeasurements, setSavedMeasurements]: [
    DustMeasurementData[],
    Dispatch<SetStateAction<DustMeasurementData[]>>,
  ] = useState([] as DustMeasurementData[]);

  const [measurementIndex, setMeasurementIndex] = useState(-1);
  const [numberOfMeasurements, setNumberOfMeasurements] = useState(0);

  // Here we need to have the derived state so that the measurement number selector
  // has the correct set of strings to display and select from.
  const selections: string[] = useMemo(
    () =>
      savedMeasurements
        .map(measurement => savedMeasurements.indexOf(measurement) + 1)
        .map(index => index.toString()).slice(0, numberOfMeasurements),
    [savedMeasurements, numberOfMeasurements],
  );


  return (
    <>
      <View style={local_styles.mainContainer}>
        <NumberInputBar
          placeholder="0"
          value={numberOfMeasurements}
          onChangeText={text => setNumberOfMeasurements(parseInt(text))}
          label={t(
            `dustScreen:${DustMeasurementDataSchema.numberOfMeasurements}`,
          )}
        />
        <DustSingleMeasurementComponent
          data={data}
          setData={setData}
          savedMeasurements={savedMeasurements}
          setSavedMeasurements={setSavedMeasurements}
          measurementIndex={measurementIndex}
          setMeasurementIndex={setMeasurementIndex}
          numberOfMeasurements={numberOfMeasurements}
        />
        <SelectorBar
          label={
            t(`dustScreen:${DustMeasurementDataSchema.measurementNumber}`) + ':'
          }
          selections={selections}
          onSelect={(selectedItem: string, index: number) => {
            setMeasurementIndex(index);
            setData(savedMeasurements[index]);
          }}
          selectionToText={selection => selection}
        />
      </View>
    </>
  );
};

const DustSingleMeasurementComponent = ({
  data,
  setData,
  savedMeasurements,
  setSavedMeasurements,
  measurementIndex,
  setMeasurementIndex,
  numberOfMeasurements,
}: {
  data: DustMeasurementData;
  setData: React.Dispatch<React.SetStateAction<DustMeasurementData>>;
  savedMeasurements: DustMeasurementData[];
  setSavedMeasurements: React.Dispatch<
    React.SetStateAction<DustMeasurementData[]>
  >;
  measurementIndex: number;
  setMeasurementIndex: React.Dispatch<React.SetStateAction<number>>;
  numberOfMeasurements: number;
}) => {
  const {t} = useTranslation();

  const updateField = (field: any) => {
    setData({
      ...data,
      ...field,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        gap: defaultGap,
      }}>
      <TextInputBar
        label={t(`dustScreen:${DustMeasurementDataSchema.selectedEndDiameter}`)}
        onChangeText={text =>
          updateField({selectedEndDiameter: parseInt(text)})
        }
      />
      <TimeSelector
        timeLabel={t(
          `dustScreen:${DustMeasurementDataSchema.measurementStartTime}`,
        )}
        date={data.measurementStartTime}
        setDate={date => updateField({measurementStartTime: date})}
      />
      <NumberInputBar
        placeholder="0"
        value={data.aspiratedVolume}
        onChangeText={text => updateField({aspiratedVolume: parseInt(text)})}
        label={t(`dustScreen:${DustMeasurementDataSchema.aspiratedVolume}`)}
      />
      <TextInputBar
        label={t(`dustScreen:${DustMeasurementDataSchema.filterType}`)}
        onChangeText={text => updateField({filterType: text})}
      />
      <TextInputBar
        label={t(`dustScreen:${DustMeasurementDataSchema.water}`)}
        onChangeText={text => updateField({water: text})}
      />
      <TouchableOpacity
        style={local_styles.saveButton}
        onPress={
          // Here we use the spread operator to have a copy of the data
          () => {
            // TODO: test if this actually modifies the state correctly.
            // I suspect that we would need to modify the array by maintaining
            // an id with each entry and then filtering the array and
            // using the setter to finally update the state.
            if (savedMeasurements.length == numberOfMeasurements) {
              return
            }
            if (measurementIndex == -1) {
              const newSavedMesurements = [...savedMeasurements, {...data}]
              setSavedMeasurements(newSavedMesurements)
              console.log(savedMeasurements);
            } else {
              var newSavedMesurements = [...savedMeasurements];
              newSavedMesurements[measurementIndex] = {...data};
              setSavedMeasurements(newSavedMesurements)
              setMeasurementIndex(-1);
            }
            setData(initialData);
          }
        }>
        <Icon
          name={measurementIndex == -1 ? 'plus' : 'content-save-edit'}
          style={local_styles.saveIcon}
          size={20}
          color={colors.buttonBlue}
        />
      </TouchableOpacity>
    </View>
  );
};

const local_styles = StyleSheet.create({
  mainContainer: {
    margin: defaultGap,
    flex: 1,
    justifyContent: 'flex-start',
    gap: defaultGap,
  },
  saveIcon: {marginTop: 10},
  saveButton: {
    borderRadius: defaultBorderRadius,
    flexDirection: 'row',
    margin: defaultGap,
    paddingHorizontal: defaultPadding,
    backgroundColor: colors.secondaryBlue,
    height: 40,
  },
});
