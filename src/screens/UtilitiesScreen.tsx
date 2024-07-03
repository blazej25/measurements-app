import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { CommonDataSchema, Screens } from '../constants';
import { jsonToCSV, readString } from 'react-native-csv';
import {
  DateTimeSelectorGroup,
  NumberInputBar,
  TimeSelector,
  StartEndBar,
} from '../components/input-bars';
import { useTranslation } from 'react-i18next';
import { styles } from '../styles/common-styles';
import { LoadDeleteSaveGroup } from '../components/LoadDeleteSaveGroup';
import { HelpAndSettingsGroup } from '../components/HelpAndSettingsGroup';
import { ButtonIcon } from '../components/ButtonIcon';
import FileSystemService from '../services/FileSystemService';

interface SingleMeasurement {
  startingHour: Date;
  endingHour: Date;
  key: number;
}

export interface UtilitiesInternalStorageState {
  date: string;
  measurementDuration: string;
  breakTime: string;
  startingHour: string;
  times: SingleMeasurement[];
}

export const utilitiesInitialState: UtilitiesInternalStorageState = {
  date: new Date().toString(),
  measurementDuration: '0',
  breakTime: '0',
  startingHour: new Date().toString(),
  times: []
}

interface UtilitiesScreenCSVHeading {
  Data: string;
  'Godzina przyjazdu': string;
  'Czas trwania pomiaru': string;
  'Przerwa między pomiarami': string;
  'Czas rozpoczęcia pomiarów': string;
}

interface MeasurementTimesCSVRow {
  'Numer pomiaru': string;
  Start: string;
  Koniec: string;
}

export const UTILITIES_INTERNAL_STORAGE_FILE_NAME = 'utilities.txt';
export const UTILITIES_SCREEN_CSV_HEADING = 'Pomocnicze\n';
const CSV_SECTION_SEPARATOR = '\nPomiary:';

export const UtilitiesScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();
  const fileSystemService = new FileSystemService();

  /* State variables */

  const [date, setDate] = useState(new Date());
  const [measurementDuration, setMeasurementDuration] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [startingHour, setStartingHour] = useState(new Date());
  const [times, setTimes] = useState([] as SingleMeasurement[]);

  /* State manipulation functions */

  const resetState = () => {
    setDate(new Date());
    setMeasurementDuration(0);
    setBreakTime(0);
    setStartingHour(new Date());
    setTimes([]);

    persistStateInInternalStorage(new Date(), 0, 0, new Date(), []);
  };

  const toNewTime = (date: Date, time: number) => {
    const newTime = new Date();
    newTime.setTime(date.getTime() + time * 60 * 1000);
    return newTime;
  };

  /* Logic for persisting state in the internal storage. */
  // See H20_14790_Screen for comments on how this works.
  const loadMeasurements = () => {
    fileSystemService
      .loadJSONFromInternalStorage(UTILITIES_INTERNAL_STORAGE_FILE_NAME)
      .then(loadedMeasurements => {
        if (loadedMeasurements) {
          restoreStateFrom(loadedMeasurements);
        }
      });
  };

  const restoreStateFrom = (loadedMeasurements: Object) => {
    var state = loadedMeasurements as UtilitiesInternalStorageState;
    console.log("Loading Utilities data from internal storage...")
    console.log(JSON.stringify(loadedMeasurements, undefined, 2))

    setDate(new Date(state.date));
    setMeasurementDuration(parseInt(state.measurementDuration));
    setBreakTime(parseInt(state.breakTime));
    setStartingHour(new Date(state.startingHour));

    const loadedTimes = state.times.map(time => {
      return {
        startingHour: new Date(time.startingHour),
        endingHour: new Date(time.endingHour),
        key: time.key,
      };
    });
    setTimes(loadedTimes);
  };

  const persistStateInInternalStorage = (
    date: Date,
    measurementDuration: number,
    breakTime: number,
    startingHour: Date,
    times: SingleMeasurement[],
  ) => {
    const state: UtilitiesInternalStorageState = {
      date: date.toString(),
      measurementDuration: measurementDuration.toString(),
      breakTime: breakTime.toString(),
      startingHour: startingHour.toString(),
      times: times,
    };

    fileSystemService.saveObjectToInternalStorage(
      state,
      UTILITIES_INTERNAL_STORAGE_FILE_NAME,
    );
  };

  /* Logic for saving and loading the file from external storage as CSV */

  useEffect(loadMeasurements, []);

  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        onDelete={resetState}
        reloadScreen={loadMeasurements}
      />
      <DateTimeSelectorGroup
        date={date}
        setDate={date => {
          setDate(date);
        }}
        dateLabel={t(`commonDataForm:${CommonDataSchema.date}`) + ':'}
        timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
      />
      <NumberInputBar
        placeholder="60"
        valueUnit="min"
        value={measurementDuration.toString()}
        onChangeText={text => {
          text == ''
            ? setMeasurementDuration(0)
            : setMeasurementDuration(parseInt(text));
        }}
        label={t('utilitiesScreen:measurementDuration') + ':'}
      />
      <NumberInputBar
        placeholder="15"
        valueUnit="min"
        value={breakTime.toString()}
        onChangeText={text => {
          const breakTime = text == '' ? 0 : parseInt(text);
          setBreakTime(breakTime);
          persistStateInInternalStorage(
            date,
            measurementDuration,
            breakTime,
            startingHour,
            times,
          );
        }}
        label={t('utilitiesScreen:breakTime') + ':'}
      />
      <TimeSelector
        timeLabel={t('utilitiesScreen:startingHour') + ':'}
        date={startingHour}
        setDate={startingHour => {
          setStartingHour(startingHour);
          /* If the user changes the starting hour, then we need to flush the list of measurement logs
           * because the new starting time makes all of the current measurement logs incorrect.
           * In case of other setters (break time, measurement duration), we don't flush the list
           * as those settings could have changed throu
           */
          setTimes([]);
          persistStateInInternalStorage(
            date,
            measurementDuration,
            breakTime,
            startingHour,
            times,
          );
        }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          onPress={() => {
            if (times.length !== 0) {
              // We need to use slice as mutating state constants in react is discouraged.
              // The reason we do this is that if we just mutate the state, the react
              // library has no idea that the object has changed and therefore
              // no rerender of the ui will get triggered and the screen won't update.
              const newTimes = times.slice(0, times.length - 1);
              setTimes(newTimes);
              persistStateInInternalStorage(
                date,
                measurementDuration,
                breakTime,
                startingHour,
                newTimes,
              );
            }
          }}
          style={styles.secondaryNavigationButton}>
          <ButtonIcon materialIconName="minus" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            var newTimes = times;
            if (times.length == 0) {
              const firstTime: SingleMeasurement = {
                startingHour: startingHour,
                endingHour: toNewTime(startingHour, measurementDuration),
                key: 0,
              };
              newTimes = [firstTime];
            } else {
              const mostRecent = times[times.length - 1];
              const newStartTime = toNewTime(mostRecent.endingHour, breakTime);
              const newEndTime = toNewTime(newStartTime, measurementDuration);
              const newKey = mostRecent.key + 1;
              newTimes = times.concat([
                {
                  startingHour: newStartTime,
                  endingHour: newEndTime,
                  key: newKey,
                },
              ]);
            }
            setTimes(newTimes);
            persistStateInInternalStorage(
              date,
              measurementDuration,
              breakTime,
              startingHour,
              newTimes,
            );
          }}
          style={styles.secondaryNavigationButton}>
          <ButtonIcon materialIconName="plus" />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{
          ...styles.defaultScrollView,
          margin: 5,
          marginHorizontal: 35,
        }}>
        {times.map((x: SingleMeasurement) => {
          return (
            <StartEndBar
              key={x.key}
              start={x.startingHour}
              end={x.endingHour}
            />
          );
        })}
      </ScrollView>
      <HelpAndSettingsGroup navigation={navigation} />
    </View>
  );
};

export const exportMeasurementsAsCSV = (data: UtilitiesInternalStorageState) => {
  // First we store the heading with all global information.
  console.log("Generating CSV contents for Utilities Screen...")
  console.log(JSON.stringify(data, undefined, 2));
  const csvHeading: UtilitiesScreenCSVHeading = {
    Data: data.date.toString(),
    'Godzina przyjazdu': data.startingHour ? data.startingHour.toString() : (new Date()).toString(),
    'Czas trwania pomiaru': data.measurementDuration ? data.measurementDuration.toString() : (new Date()).toString(),
    'Przerwa między pomiarami': data.breakTime ? data.breakTime.toString() : (new Date()).toString(),
    'Czas rozpoczęcia pomiarów': data.startingHour ? data.startingHour.toString() : (new Date()).toString(),
  };

  const csvHeaderPart = jsonToCSV([csvHeading]);
  const timesCSVRows: MeasurementTimesCSVRow[] = [];
  if (data.times.length == 0) {
    timesCSVRows.push({
      'Numer pomiaru': "0",
      Start: (new Date()).toString(),
      Koniec: (new Date()).toString(),
    });
  }
  for (var i = 0; i < data.times.length; i++) {
    timesCSVRows.push({
      'Numer pomiaru': (i + 1).toString(),
      Start: data.times[i].startingHour ? data.times[i].startingHour.toString() : (new Date).toString(),
      Koniec: data.times[i].endingHour ? data.times[i].endingHour.toString() : (new Date).toString(),
    });
  }
  const csvTimesPart = jsonToCSV(timesCSVRows);
  const csvFileContents =
    UTILITIES_SCREEN_CSV_HEADING +
    csvHeaderPart +
    CSV_SECTION_SEPARATOR +
    csvTimesPart;

  console.log(csvFileContents);
  console.log("CSV contents for Utilities Screen created successfully...")
  return csvFileContents;
};

/* Logic for saving and loading the file from external storage as CSV */

export const restoreStateFromCSV = (fileContents: string) => {
  console.log('Restoring state from a CSV file: ');
  console.log(fileContents);
  // First we remove the section header from the file.
  fileContents = fileContents.replace(UTILITIES_SCREEN_CSV_HEADING, '');
  const parts = fileContents.split(CSV_SECTION_SEPARATOR);
  const header = readString(parts[0], { header: true })[
    'data'
  ][0] as UtilitiesScreenCSVHeading;
  console.log("measurement times")
  console.log(parts[1])

  if (parts[1] == undefined) {
    return {
      date: header.Data,
      measurementDuration: header['Czas trwania pomiaru'],
      breakTime: header['Przerwa między pomiarami'],
      startingHour: header['Czas rozpoczęcia pomiarów'],
      times: [],
    }
  }
  const times = readString((parts[1].trim()), { header: true })[
    'data'
  ] as MeasurementTimesCSVRow[];

  const newTimes = times.map((time, index) => {
    return {
      startingHour: new Date(time.Start),
      endingHour: new Date(time.Koniec),
      key: index,
    };
  });

  const result: UtilitiesInternalStorageState = {
    date: header.Data,
    measurementDuration: header['Czas trwania pomiaru'],
    breakTime: header['Przerwa między pomiarami'],
    startingHour: header['Czas rozpoczęcia pomiarów'],
    times: newTimes,
  }

  return result;
};
