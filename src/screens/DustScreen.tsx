import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import {
  NumberInputBar,
  SelectorBar,
  TextInputBar,
  TimeSelector,
} from '../components/input-bars';
import {
  colors,
  styles,
} from '../styles/common-styles';
import { useTranslation } from 'react-i18next';
import { DustMeasurementDataSchema } from '../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LoadDeleteSaveGroup } from '../components/LoadDeleteSaveGroup';

interface DustMeasurementData {
  selectedEndDiameter: string;
  measurementStartTime: Date;
  aspirationTime: string;
  aspiratedVolume: string;
  filterType: string;
  water: string;
}

const initialData: DustMeasurementData = {
  selectedEndDiameter: '',
  measurementStartTime: new Date(),
  aspirationTime: '',
  aspiratedVolume: '',
  filterType: '',
  water: '',
};

const NEW_MEASUREMENT = -1;

export const DustScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();

  const [data, setData] = useState(initialData);

  const [savedMeasurements, setSavedMeasurements]: [
    DustMeasurementData[],
    Dispatch<SetStateAction<DustMeasurementData[]>>,
  ] = useState([] as DustMeasurementData[]);

  const [measurementIndex, setMeasurementIndex] = useState(NEW_MEASUREMENT);
  const [numberOfMeasurements, setNumberOfMeasurements] = useState(0);


  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        getSavedFileContents={() => 'test'}
        onDelete={() => {}}
        fileContentsHandler={(contents: Object) => {}}
      />
      <ScrollView
        contentContainerStyle={styles.defaultScrollView}>
      <NumberInputBar
        placeholder="0"
        value={numberOfMeasurements.toString()}
        onChangeText={text =>
          setNumberOfMeasurements(text ? parseInt(text) : 0)
        }
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
      </ScrollView>
    </View>
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
  const { t } = useTranslation();

  const updateField = (field: any) => {
    setData({
      ...data,
      ...field,
    });
  };

  const addingNewMeasurement = () => measurementIndex == NEW_MEASUREMENT;

  // Here we need to have the derived state so that the measurement number selector
  // has the correct set of strings to display and select from.
  const selections: string[] = useMemo(
    () =>
      savedMeasurements
        .map(measurement => savedMeasurements.indexOf(measurement) + 1)
        .map(index => index.toString())
        .slice(0, numberOfMeasurements),
    [savedMeasurements, numberOfMeasurements],
  );


  return (
    <View style= {{...styles.mainContainer, margin: 0}}>
      <NumberInputBar
        placeholder='0'
        value={data.selectedEndDiameter}
        label={t(`dustScreen:${DustMeasurementDataSchema.selectedEndDiameter}`) + ':'}
        onChangeText={text => updateField({ selectedEndDiameter: text })}
      />
      <TimeSelector
        timeLabel={t(
          `dustScreen:${DustMeasurementDataSchema.measurementStartTime}`,
        ) + ':'}
        date={data.measurementStartTime}
        setDate={date => updateField({ measurementStartTime: date })}
      />
      <NumberInputBar
        placeholder="0"
        value={data.aspirationTime}
        valueUnit="min"
        onChangeText={text => updateField({ aspirationTime: text })}
        label={t(`dustScreen:${DustMeasurementDataSchema.aspiratedVolume}`) + ':'}
      />
      <NumberInputBar
        placeholder="0"
        value={data.aspiratedVolume}
        onChangeText={text => updateField({ aspiratedVolume: text })}
        label={t(`dustScreen:${DustMeasurementDataSchema.aspiratedVolume}`) + ':'}
      />
      <TextInputBar
        value={data.filterType}
        label={t(`dustScreen:${DustMeasurementDataSchema.filterType}`) + ':'}
        onChangeText={text => updateField({ filterType: text })}
      />
      <TextInputBar
        value={data.water}
        label={t(`dustScreen:${DustMeasurementDataSchema.water}`) + ':'}
        onChangeText={text => updateField({ water: text })}
      />
      <SelectorBar
        label={
          t(`dustScreen:${DustMeasurementDataSchema.measurementNumber}`) + ':'
        }
        selections={selections}
        onSelect={(_selectedItem: string, index: number) => {
          setMeasurementIndex(index);
          setData(savedMeasurements[index]);
        }}
        // If we are adding a new measurement, the selector should display its
        // number at the top.
        selectionToText={selection =>
          addingNewMeasurement()
            ? savedMeasurements.length.toString()
            : selection
        }
        rowTextForSelection={selection => selection}
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => {
          if (savedMeasurements.length == numberOfMeasurements) {
            return;
          }
          var newSavedMesurements = [...savedMeasurements];
          if (addingNewMeasurement()) {
            newSavedMesurements.push({ ...data });
          } else {
            newSavedMesurements[measurementIndex] = { ...data };
            setMeasurementIndex(NEW_MEASUREMENT);
          }
          setSavedMeasurements(newSavedMesurements);
          setData(initialData);
        }}>
        <Icon
          name={addingNewMeasurement() ? 'plus' : 'content-save-edit'}
          style={styles.saveIcon}
          size={20}
          color={colors.buttonBlue}
        />
      </TouchableOpacity>
    </View>
  );
};
