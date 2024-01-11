import React, {Dispatch, SetStateAction, useMemo, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {
  NumberInputBar,
  SelectorBar,
  TextInputBar,
  TimeSelector,
} from '../components/input-bars';
import {colors, styles} from '../styles/common-styles';
import {useTranslation} from 'react-i18next';
import {DustMeasurementDataSchema} from '../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {LoadDeleteSaveGroup} from '../components/LoadDeleteSaveGroup';
import {HelpAndSettingsGroup} from '../components/HelpAndSettingsGroup';
import {ButtonIcon} from '../components/ButtonIcon';

interface DustMeasurementData {
  id: number;
  selectedEndDiameter: string;
  measurementStartTime: Date;
  aspirationTime: string;
  aspiratedVolume: string;
  filterType: string;
  water: string;
}

const initialData: DustMeasurementData = {
  id: 0,
  selectedEndDiameter: '',
  measurementStartTime: new Date(),
  aspirationTime: '',
  aspiratedVolume: '',
  filterType: '',
  water: '',
};

export const DustScreen = ({navigation}: {navigation: any}) => {
  const {t} = useTranslation();

  /* State variables */

  const [currentMeasurement, setCurrentMeasurement] = useState({
    ...initialData,
  });
  const [savedMeasurements, setSavedMeasurements] = useState([
    {...initialData},
  ]);
  const [measurementIndex, setMeasurementIndex] = useState(0);
  const [numberOfMeasurements, setNumberOfMeasurements] = useState(1);

  // Here we need to have the derived state so that the measurement number selector
  // has the correct set of strings to display and select from.
  const selections: string[] = useMemo(
    () =>
      savedMeasurements
        .map(measurement => savedMeasurements.indexOf(measurement) + 1)
        .map(index => index.toString()),
    [savedMeasurements],
  );

  /* Logic for UI state transitions */
  const updateField = (field: Partial<DustMeasurementData>) => {
    setCurrentMeasurement({...currentMeasurement, ...field});
  };

  const addNewMeasurement = () => {
    let newMeasurements = [...savedMeasurements];
    newMeasurements[measurementIndex] = {...currentMeasurement};
    if (newMeasurements.length == numberOfMeasurements) {
      // Don't allow adding measurements past the specified number
      setSavedMeasurements(newMeasurements);
      return;
    }

    const newMeasurement = {...initialData, id: currentMeasurement.id + 1};
    setSavedMeasurements(newMeasurements.concat([newMeasurement]));
    setMeasurementIndex(measurementIndex + 1);
    setCurrentMeasurement(newMeasurement);
  };

  const saveModifications = () => {
    let newSavedMesurements = [...savedMeasurements];
    newSavedMesurements[measurementIndex] = {...currentMeasurement};
    setSavedMeasurements(newSavedMesurements);
  };

  const showingLastMeasurement = () =>
    measurementIndex == savedMeasurements.length - 1;

  const isSpaceLeft = () => savedMeasurements.length < numberOfMeasurements;

  const flushState = () => {
    setSavedMeasurements([{...initialData}]);
    setCurrentMeasurement({...initialData});
    setMeasurementIndex(0);
    setNumberOfMeasurements(1);
  };

  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        getSavedFileContents={() => 'test'}
        onDelete={flushState}
        fileContentsHandler={(contents: Object) => {}}
      />
      <ScrollView contentContainerStyle={styles.defaultScrollView}>
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
        <View style={{...styles.mainContainer, margin: 0}}>
          <NumberInputBar
            placeholder="0"
            value={currentMeasurement.selectedEndDiameter}
            label={
              t(`dustScreen:${DustMeasurementDataSchema.selectedEndDiameter}`) +
              ':'
            }
            onChangeText={text => updateField({selectedEndDiameter: text})}
          />
          <TimeSelector
            timeLabel={
              t(
                `dustScreen:${DustMeasurementDataSchema.measurementStartTime}`,
              ) + ':'
            }
            date={currentMeasurement.measurementStartTime}
            setDate={date => updateField({measurementStartTime: date})}
          />
          <NumberInputBar
            placeholder="0"
            value={currentMeasurement.aspirationTime}
            valueUnit="min"
            onChangeText={text => updateField({aspirationTime: text})}
            label={
              t(`dustScreen:${DustMeasurementDataSchema.aspiratedVolume}`) + ':'
            }
          />
          <NumberInputBar
            placeholder="0"
            value={currentMeasurement.aspiratedVolume}
            onChangeText={text => updateField({aspiratedVolume: text})}
            label={
              t(`dustScreen:${DustMeasurementDataSchema.aspiratedVolume}`) + ':'
            }
          />
          <TextInputBar
            value={currentMeasurement.filterType}
            label={
              t(`dustScreen:${DustMeasurementDataSchema.filterType}`) + ':'
            }
            onChangeText={text => updateField({filterType: text})}
          />
          <TextInputBar
            value={currentMeasurement.water}
            label={t(`dustScreen:${DustMeasurementDataSchema.water}`) + ':'}
            onChangeText={text => updateField({water: text})}
          />
          <SelectorBar
            label={
              t(`dustScreen:${DustMeasurementDataSchema.measurementNumber}`) +
              ':'
            }
            selections={selections}
            onSelect={(_selectedItem: string, index: number) => {
              setMeasurementIndex(index);
              setCurrentMeasurement(savedMeasurements[index]);
            }}
            selectionToText={_selection => (measurementIndex + 1).toString()}
            rowTextForSelection={selection => selection}
          />
          {showingLastMeasurement() && isSpaceLeft() ? (
            <TouchableOpacity
              style={{...styles.actionButton, justifyContent: 'center'}}
              onPress={addNewMeasurement}>
              <Text style={styles.actionButtonText}>
              {t(`dustScreen:addMeasurement`)}

              </Text>
              <ButtonIcon materialIconName={'plus'} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{...styles.actionButton, justifyContent: 'center'}}
              onPress={saveModifications}>
              <Text style={styles.actionButtonText}> Zapisz pomiar </Text>
              <ButtonIcon materialIconName={'content-save-edit'} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <HelpAndSettingsGroup navigation={navigation} />
    </View>
  );
};
